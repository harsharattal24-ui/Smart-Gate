from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime
from math import radians, cos, sin, sqrt, atan2
import os

app = Flask(__name__)

DATA_FILE = "database/data.json"

# -----------------------------
# GATE LOCATIONS
# -----------------------------
GATES = {
    "Gate 1": {
        "lat": 12.9716,
        "lon": 77.5946
    },
    "Gate 2": {
        "lat": 12.9725,
        "lon": 77.5930
    }
}

# -----------------------------
# LOAD DATA
# -----------------------------
def load_data():

    if not os.path.exists(DATA_FILE):

        default_data = {
            "gates": {
                "Gate 1": {
                    "status": "NO DATA",
                    "waiting_users": 0,
                    "nearby_users": 0,
                    "distance": 0,
                    "last_updated": "Never"
                },
                "Gate 2": {
                    "status": "NO DATA",
                    "waiting_users": 0,
                    "nearby_users": 0,
                    "distance": 0,
                    "last_updated": "Never"
                }
            }
        }

        save_data(default_data)

        return default_data

    with open(DATA_FILE, "r") as file:
        return json.load(file)

# -----------------------------
# SAVE DATA
# -----------------------------
def save_data(data):

    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

# -----------------------------
# DISTANCE CALCULATOR
# -----------------------------
def calculate_distance(lat1, lon1, lat2, lon2):

    R = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c * 1000

# -----------------------------
# HOME PAGE
# -----------------------------
@app.route("/")
def home():

    data = load_data()

    return render_template(
        "index.html",
        gates=data["gates"]
    )

# -----------------------------
# RECEIVE LOCATION
# -----------------------------
@app.route("/location", methods=["POST"])
def location():

    data = load_data()

    user = request.json

    user_lat = user["latitude"]
    user_lon = user["longitude"]
    speed = user["speed"]

    for gate_name, gate in GATES.items():

        gate_lat = gate["lat"]
        gate_lon = gate["lon"]

        distance = calculate_distance(
            user_lat,
            user_lon,
            gate_lat,
            gate_lon
        )

        nearby_users = 0
        waiting_users = 0

        # User considered nearby only within 100m
        if distance <= 100:

            nearby_users = 1

            # Waiting if speed less than 2
            if speed < 2:
                waiting_users = 1

        # Gate status logic
        if nearby_users == 0:
            status = "NO DATA"

        elif waiting_users >= 1:
            status = "CLOSED"

        else:
            status = "OPEN"

        # Save gate data
        data["gates"][gate_name] = {
            "status": status,
            "waiting_users": waiting_users,
            "nearby_users": nearby_users,
            "distance": round(distance, 1),
            "last_updated": datetime.now().strftime("%I:%M:%S %p")
        }

    save_data(data)

    return jsonify({
        "message": "Location received"
    })

# -----------------------------
# RUN APP
# -----------------------------
if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )
