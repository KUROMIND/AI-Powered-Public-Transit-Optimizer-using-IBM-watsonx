from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS
# --- Load GTFS Data ---

stops_df = pd.read_csv('stops.txt', usecols=['stop_id', 'stop_name', 'stop_lat', 'stop_lon'])
routes_df = pd.read_csv('routes.txt', usecols=['route_id', 'route_short_name', 'route_long_name', 'route_type'])
trips_df = pd.read_csv('trips.txt', usecols=['trip_id', 'route_id', 'trip_headsign'])
stop_times_df = pd.read_csv('stop_times.txt', usecols=['trip_id', 'arrival_time', 'departure_time', 'stop_id'])

app = Flask(__name__)
CORS(app)

@app.route('/stops', methods=['GET'])
def get_stops():
    return jsonify(stops_df.to_dict(orient='records'))

@app.route('/stops/<int:stop_id>', methods=['GET'])
def get_stop(stop_id):
    stop = stops_df[stops_df['stop_id'] == stop_id]
    if stop.empty:
        return jsonify({'error': f'Stop {stop_id} not found'}), 404
    return jsonify(stop.iloc[0].to_dict())

@app.route('/routes', methods=['GET'])
def get_routes():
    return jsonify(routes_df.to_dict(orient='records'))

@app.route('/routes/<route_id>', methods=['GET'])
def get_route(route_id):
    route = routes_df[routes_df['route_id'] == str(route_id)]
    if route.empty:
        return jsonify({'error': f'Route {route_id} not found'}), 404
    return jsonify(route.iloc[0].to_dict())

@app.route('/routes/<route_id>/stops', methods=['GET'])
def get_route_stops(route_id):
    trips_on_route = trips_df[trips_df['route_id'] == str(route_id)]
    if trips_on_route.empty:
        return jsonify({'error': f'Route {route_id} not found or has no trips.'}), 404

    trip_ids = set(trips_on_route['trip_id'])
    stops_for_trips = stop_times_df[stop_times_df['trip_id'].isin(trip_ids)]
    stop_ids = sorted(set(stops_for_trips['stop_id']))
    stops = stops_df[stops_df['stop_id'].isin(stop_ids)]
    return jsonify(stops.to_dict(orient='records'))

@app.route('/arrivals/<int:stop_id>', methods=['GET'])
def get_arrivals(stop_id):
    arrivals = stop_times_df[stop_times_df['stop_id'] == stop_id]
    if arrivals.empty:
        return jsonify({"error": f"No arrivals found for stop {stop_id}"}), 404
    arrivals = arrivals.merge(trips_df, on='trip_id', how='left')
    arrivals = arrivals.merge(routes_df, on='route_id', how='left')
    results = arrivals[['arrival_time', 'departure_time', 'route_id',
                        'route_short_name', 'route_long_name', 'trip_headsign']]
    results = results.sort_values('arrival_time').to_dict(orient='records')
    return jsonify(results)

import os
import requests
from google.transit import gtfs_realtime_pb2
import time

# -------- Simple cache for alerts, to respect API limits --------
ALERTS_CACHE = {}
ALERTS_CACHE_TTL = 30  # seconds

def fetch_realtime_alerts():
    global ALERTS_CACHE
    now = time.time()
    # Return cache if available and recent
    if ALERTS_CACHE.get("ts", 0) + ALERTS_CACHE_TTL > now:
        return ALERTS_CACHE.get("alerts", [])
    
    API_KEY = os.environ.get('MUNI_511_API_KEY')
    if not API_KEY:
        return {"error": "API Key not set as environment variable MUNI_511_API_KEY."}
    
    FEED_URL = f"https://api.511.org/transit/servicealerts?api_key={API_KEY}&agency=SF"


    try:
        response = requests.get(FEED_URL)
        response.raise_for_status()
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(response.content)
        alerts = []
        for entity in feed.entity:
            if entity.HasField('alert'):
                alert = entity.alert
                alerts.append({
                    'id': entity.id,
                    'header_text': alert.header_text.translation[0].text if alert.header_text.translation else '',
                    'description_text': alert.description_text.translation[0].text if alert.description_text.translation else '',
                    'active_periods': [
                        {'start': period.start, 'end': period.end}
                        for period in alert.active_period
                    ],
                    'informed_entities': [
                        {
                            'agency_id': e.agency_id,
                            'route_id': e.route_id,
                            'stop_id': e.stop_id
                        } for e in alert.informed_entity
                    ],
                    'severity': alert.severity_level
                })
        ALERTS_CACHE = {"ts": now, "alerts": alerts}
        return alerts
    except Exception as e:
        return {"error": str(e)}

@app.route('/alerts', methods=['GET'])
def get_alerts():
    data = fetch_realtime_alerts()
    if isinstance(data, dict) and data.get("error"):
        return jsonify({'alerts': [], 'error': data['error']}), 503
    return jsonify({'alerts': data})

if __name__ == '__main__':
    app.run(debug=True)
