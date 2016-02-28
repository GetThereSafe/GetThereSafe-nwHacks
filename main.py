import googlemaps
import os
from flask import Flask, render_template, request
app = Flask(__name__)
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
gmaps = googlemaps.Client(key=GOOGLE_API_KEY)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/route', methods=['POST'])
def get_routes():
    reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))
    return reverse_geocode_result


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
