import googlemaps
import os
import json
from flask import Flask, render_template, request
from flask.ext.sqlalchemy import SQLAlchemy
from math import sin, cos, sqrt, atan2, radians
from polyline.codec import PolylineCodec
app = Flask(__name__)
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
gmaps = googlemaps.Client(key=GOOGLE_API_KEY)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
db = SQLAlchemy(app)


@app.route('/')
def index():
    db.create_all()
    return render_template('index.html')


@app.route('/route', methods=['POST'])
def get_routes():
    start = request.form['start']
    end = request.form['end']

    app.logger.warning('%s AND %s' % (start, end))

    routes = gmaps.directions(start, end, alternatives=True)
    best_route = _get_best_route(routes)
    return json.dumps(best_route)


def _get_best_route(routes):
    # GET THE COORDS FROM DATABASE
    light_source_coords = [(0, 0)]

    route_rank = []
    for route in routes:
        polyline = route['overview_polyline']['points']

        app.logger.warning(polyline)

        decoded_light_coords = _get_coords_from_polyline(polyline)

        app.logger.warning(decoded_light_coords)

        # Calculate number of lightsources on the route
        light_sources = 0
        for coord in decoded_light_coords:
            if _has_nearby_lightsource(coord, light_source_coords):
                light_sources += 1

        route_rank.append([route, light_sources, decoded_light_coords])

    # Get and return the best route based on total number of lightsources
    best_route = route_rank[0]
    # Make sure there's at least 2 possible routes
    if len(route_rank) > 1:
        # Start at second element since we set the best_route to the first for a base
        for possible_route in route_rank[1:]:
            if possible_route[1] > best_route[1]:
                best_route = possible_route
    return best_route[2]


def _get_coords_from_polyline(polyline):
    return PolylineCodec().decode(polyline)


def _has_nearby_lightsource(coord, light_source_coords):
    # Check if any lightsource in the light_source_coords is within five meters of the route coordinate
    for light_coord in light_source_coords:
        if _get_distance_between_points(coord, light_coord) <= 5:
            return True
    return False


def _get_distance_between_points(coord_tuple_a, coord_tuple_b):
    # Taken from http://bit.ly/21AAYXb
    R = 6373.0

    # Set lat and lon to compare
    lat1 = radians(coord_tuple_a[0])
    lon1 = radians(coord_tuple_a[1])
    lat2 = radians(coord_tuple_b[0])
    lon2 = radians(coord_tuple_b[1])

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    # Return distance in meters, as an integer
    return int((R * c) * 1000)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
