from fastapi import FastAPI
import requests
from fastapi.staticfiles import StaticFiles
import route
import uvicorn


# url = "https://router.project-osrm.org/route/v1/driving/-79.3,43.6;-75.7,45.4?overview=full&geometries=geojson"

# response = requests.get(url).json()


app = FastAPI()


@app.get("/api/test")
def test():
    return {"message": "SiteSeeker backend running"}

@app.get("/route")
def get_route_api(origin: str, destination: str):
    return route.get_route(origin, destination)


# The line below makes all the files in frontend to belong to this path "localhost/travel"
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)