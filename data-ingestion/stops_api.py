from flask import Flask, jsonify
import pandas as pd
# --- Load GTFS Data ---
stops_df = pd.read_csv('stops.txt', usecols=['stop_id', 'stop_name', 'stop_lat', 'stop_lon'])
routes_df = pd.read_csv('routes.txt', usecols=['route_id', 'route_short_name', 'route_long_name', 'route_type'])
trips_df = pd.read_csv('trips.txt', usecols=['trip_id', 'route_id', 'trip_headsign'])
stop_times_df = pd.read_csv('stop_times.txt', usecols=['trip_id', 'arrival_time', 'departure_time', 'stop_id'])

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)
