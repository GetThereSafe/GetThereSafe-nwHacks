from main import db


class Coord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lng = db.Column(db.Float)
    lat = db.Column(db.Float)

    def __init__(self, lng, lat):
        self.lng = lng
        self.lat = lan
