🚍 Backend API Quickstart
1. Requirements
Install Python packages (preferably in a terminal inside your project directory):

text
pip install flask pandas
If you want to test CORS or advanced features:

text
pip install flask-cors
2. How to Run the API
From the folder containing your GTFS data (stops.txt, etc.) and the API code (stops_api.py):

text
python stops_api.py
By default, this runs the server on http://127.0.0.1:5000/ (localhost, port 5000).

3. Available Endpoints
GET /stops
Returns a list of all stops with their ID, name, latitude, and longitude.

Example response:

json
[
  {
    "stop_id": 3794,
    "stop_name": "Buchanan St & Bay St",
    "stop_lat": 37.80343,
    "stop_lon": -122.43334
  },
  ...
]
GET /stops/<stop_id>
Returns info for a specific stop (replace <stop_id> with a number).

Example:
/stops/3794

json
{
  "stop_id": 3794,
  "stop_name": "Buchanan St & Bay St",
  "stop_lat": 37.80343,
  "stop_lon": -122.43334
}
GET /routes
Returns a list of all transit routes.

Example response:

json
[
  {
    "route_id": "1",
    "route_short_name": "1",
    "route_long_name": "CALIFORNIA",
    "route_type": 3
  },
  ...
]
GET /routes/<route_id>
Returns details about a specific route.

Example:
/routes/1

json
{
  "route_id": "1",
  "route_short_name": "1",
  "route_long_name": "CALIFORNIA",
  "route_type": 3
}
GET /routes/<route_id>/stops
Returns all stops served by a specific route.

Example:
/routes/1/stops

json
[
  {
    "stop_id": 3794,
    "stop_name": "Buchanan St & Bay St",
    "stop_lat": 37.80343,
    "stop_lon": -122.43334
  },
  ...
]
GET /arrivals/<stop_id>
Returns all scheduled arrivals at a particular stop, with route and trip info.

Example:
/arrivals/3794

json
[
  {
    "arrival_time": "04:32:00",
    "departure_time": "04:32:00",
    "route_id": "1",
    "route_short_name": "1",
    "route_long_name": "CALIFORNIA",
    "trip_headsign": "Geary + 33rd Avenue"
  },
  ...
]
4. Notes
Make sure all GTFS files (stops.txt, routes.txt, trips.txt, stop_times.txt) are in the same folder as stops_api.py.

To stop the server, press Ctrl+C in the terminal.

If your frontend is on a different port/server, install and import flask-cors and add CORS(app) after creating the Flask app.

5. Example URLs to Test
http://127.0.0.1:5000/stops

http://127.0.0.1:5000/stops/3794

http://127.0.0.1:5000/routes

http://127.0.0.1:5000/routes/1

http://127.0.0.1:5000/routes/1/stops

http://127.0.0.1:5000/arrivals/3794

TL;DR — What’s Implemented
Stable API for:

All stops and single stop info

All routes and single route info

All stops on a route

All arrivals at a stop (with route & headsign)