from geopy.geocoders import Nominatim
import requests
# Imports the requests library so Python can send HTTP requests to OSRM

import requests
from geopy.geocoders import Nominatim


def get_location_coordinates(origin, destination):
    geolocator = Nominatim(user_agent="travel_app")

    org_location = geolocator.geocode(origin)
    dest_location = geolocator.geocode(destination)

    if not org_location:
        raise ValueError(f"Could not find location: {origin}")
    if not dest_location:
        raise ValueError(f"Could not find location: {destination}")

    # OSRM needs "longitude,latitude" (no spaces)
    org_coords = f"{org_location.longitude},{org_location.latitude}"
    dest_coords = f"{dest_location.longitude},{dest_location.latitude}"

    return org_coords, dest_coords


def get_route(origin_coor, destination_coor):
    try:
        origin, destination = get_location_coordinates(origin_coor, destination_coor)
    except ValueError as e:
        return {"error": str(e)}

    url = f"https://router.project-osrm.org/route/v1/driving/{origin};{destination}?overview=full&geometries=geojson"

    response = requests.get(url)
    data = response.json()

    if not data.get("routes"):
        return {"error": "No route found"}

    return {
        "routes": data["routes"][0]["geometry"]["coordinates"]
    }