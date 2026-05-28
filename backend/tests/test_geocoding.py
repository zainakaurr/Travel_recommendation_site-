from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="travel_app")

location = geolocator.geocode("Toronto")

print(location.longitude)
print(type(location))