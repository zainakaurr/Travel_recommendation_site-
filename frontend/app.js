const map = L.map('map').setView([44.5, -77.5], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let routeLine = null;
// an example for Java script: calling the Backend, getting the answers
// and changing the way the site is build to reflact the changes, without changing its address.
async function search() {
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const errorDiv = document.getElementById('error');

  errorDiv.innerText = '';

  // call your FastAPI backend
  const response = await fetch(`/route?origin=${origin}&destination=${destination}`);
  const data = await response.json();

  if (data.error) {
    errorDiv.innerText = data.error;
    return;
  }

  // OSRM returns [lng, lat] — Leaflet needs [lat, lng] so we flip
  const latLngs = data.routes.map(coord => [coord[1], coord[0]]);

  // remove old route if exists
  if (routeLine) map.removeLayer(routeLine);

  // draw the new route
  routeLine = L.polyline(latLngs, { color: 'blue', weight: 20 }).addTo(map);
  map.fitBounds(routeLine.getBounds());
}