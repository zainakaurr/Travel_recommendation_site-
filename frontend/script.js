const body = document.body;
const accountOpen = document.querySelector("#accountOpen");
const accountModal = document.querySelector("#accountModal");
const modalClose = document.querySelector("#modalClose");
const themeToggle = document.querySelector("#themeToggle");
const contrastToggle = document.querySelector("#contrastToggle");
const privateMode = document.querySelector("#privateMode");
const routeForm = document.querySelector(".route-form");
const routeStatus = document.querySelector("#routeStatus");
const mapApp = document.querySelector(".map-app");
const mapScene = document.querySelector("#mapScene");
const zoomIn = document.querySelector("#zoomIn");
const zoomOut = document.querySelector("#zoomOut");
const zoomLevel = document.querySelector("#zoomLevel");
const panelToggle = document.querySelector("#panelToggle");
const loginTab = document.querySelector("#loginTab");
const signupTab = document.querySelector("#signupTab");
const authTitle = document.querySelector("#authTitle");
const authCopy = document.querySelector("#authCopy");
const authButton = document.querySelector("#authButton");
const authForm = document.querySelector(".auth-form");
const authPanel = document.querySelector("#account");
const password = document.querySelector("#password");
const tripTitle = document.querySelector("#tripTitle");
const tripMeta = document.querySelector("#tripMeta");
const gatedTripButtons = document.querySelectorAll("[data-requires-auth]");
const saveTrip = document.querySelector("#saveTrip");
const downloadTrip = document.querySelector("#downloadTrip");

let isSignedIn = false;
let lastAccountTrigger = accountOpen;
let mapZoom = 1;
let mapPanX = 0;
let mapPanY = 0;
let isDraggingMap = false;
let dragStartX = 0;
let dragStartY = 0;
let dragOriginX = 0;
let dragOriginY = 0;
let pinchStartDistance = 0;
let pinchStartZoom = 1;
let currentTrip = {
  source: "Toronto",
  destination: "Niagara Falls",
  limit: 6,
  interests: ["nature", "food"],
};

function setPressed(button, isPressed) {
  button.setAttribute("aria-pressed", String(isPressed));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateMapTransform() {
  mapApp.style.setProperty("--map-zoom", mapZoom.toFixed(2));
  mapApp.style.setProperty("--map-pan-x", `${mapPanX}px`);
  mapApp.style.setProperty("--map-pan-y", `${mapPanY}px`);
  zoomLevel.textContent = `${Math.round(mapZoom * 100)}%`;
}

function setMapZoom(nextZoom) {
  mapZoom = clamp(nextZoom, 0.75, 2.5);
  updateMapTransform();
}

function getTouchDistance(touches) {
  const first = touches[0];
  const second = touches[1];
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
}

function togglePlanner() {
  const isCollapsed = body.classList.toggle("planner-collapsed");
  panelToggle.setAttribute("aria-expanded", String(!isCollapsed));
  panelToggle.setAttribute("aria-label", isCollapsed ? "Open planner panel" : "Hide planner panel");
}

function formatInterests(interests) {
  return interests.length ? interests.join(", ") : "general sightseeing";
}

function getSelectedInterests() {
  const typedInterests = document
    .querySelector("#interestText")
    .value.split(",")
    .map((interest) => interest.trim().toLowerCase())
    .filter(Boolean);

  const quickInterests = [...document.querySelectorAll("input[name='interest']:checked")]
    .map((input) => input.value.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set([...quickInterests, ...typedInterests])];
}

function updateTripSummary() {
  tripTitle.textContent = `${currentTrip.source} to ${currentTrip.destination}`;
  tripMeta.textContent = `${currentTrip.limit} attractions. ${formatInterests(currentTrip.interests)}.`;
}

function updateAccountState() {
  accountOpen.textContent = isSignedIn ? "Signed in" : "Sign in";

  gatedTripButtons.forEach((button) => {
    const shouldDisable = !isSignedIn && button.id !== "viewTrip";
    button.disabled = shouldDisable;
    button.setAttribute("aria-disabled", String(!isSignedIn));
  });
}

function openAccountModal(mode = "login", trigger = accountOpen) {
  lastAccountTrigger = trigger;
  setAuthMode(mode);
  accountModal.hidden = false;
  body.classList.add("modal-open");
  authPanel.focus({ preventScroll: true });
}

function closeAccountModal() {
  accountModal.hidden = true;
  body.classList.remove("modal-open");
  lastAccountTrigger.focus({ preventScroll: true });
}

function setAuthMode(mode) {
  const isSignup = mode === "signup";

  loginTab.classList.toggle("active", !isSignup);
  signupTab.classList.toggle("active", isSignup);
  loginTab.setAttribute("aria-selected", String(!isSignup));
  signupTab.setAttribute("aria-selected", String(isSignup));

  authTitle.textContent = isSignup ? "Create your account" : "Welcome back";
  authCopy.textContent = isSignup
    ? "Sign up to view, save, and download your trips."
    : "Log in to view, save, and download your trips.";
  authButton.textContent = isSignup ? "Create account" : "Log in";
  password.setAttribute("autocomplete", isSignup ? "new-password" : "current-password");
}

function handleGatedTripAction(button) {
  if (!isSignedIn) {
    routeStatus.textContent = "Sign in to view, save, and download this trip.";
    openAccountModal("login", button);
    return false;
  }

  return true;
}

function downloadCurrentTrip() {
  const tripText = [
    "Travel Site trip",
    `${currentTrip.source} to ${currentTrip.destination}`,
    `${currentTrip.limit} attractions`,
    `Interests: ${formatInterests(currentTrip.interests)}`,
  ].join("\n");

  const blob = new Blob([tripText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const fileSlug = `${currentTrip.source}-to-${currentTrip.destination}-trip`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  link.download = `${fileSlug}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

accountOpen.addEventListener("click", () => {
  openAccountModal("login", accountOpen);
});

panelToggle.addEventListener("click", togglePlanner);

zoomIn.addEventListener("click", () => setMapZoom(mapZoom + 0.2));
zoomOut.addEventListener("click", () => setMapZoom(mapZoom - 0.2));

mapScene.addEventListener("wheel", (event) => {
  event.preventDefault();
  const direction = event.deltaY > 0 ? -0.12 : 0.12;
  setMapZoom(mapZoom + direction);
}, { passive: false });

mapScene.addEventListener("dblclick", () => {
  setMapZoom(mapZoom + 0.25);
});

mapScene.addEventListener("pointerdown", (event) => {
  isDraggingMap = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragOriginX = mapPanX;
  dragOriginY = mapPanY;
  mapScene.classList.add("dragging");
  mapScene.setPointerCapture(event.pointerId);
});

mapScene.addEventListener("pointermove", (event) => {
  if (!isDraggingMap || pinchStartDistance) {
    return;
  }

  mapPanX = dragOriginX + event.clientX - dragStartX;
  mapPanY = dragOriginY + event.clientY - dragStartY;
  updateMapTransform();
});

mapScene.addEventListener("pointerup", (event) => {
  isDraggingMap = false;
  mapScene.classList.remove("dragging");

  if (mapScene.hasPointerCapture(event.pointerId)) {
    mapScene.releasePointerCapture(event.pointerId);
  }
});

mapScene.addEventListener("pointercancel", () => {
  isDraggingMap = false;
  mapScene.classList.remove("dragging");
});

mapScene.addEventListener("touchstart", (event) => {
  if (event.touches.length !== 2) {
    return;
  }

  isDraggingMap = false;
  mapScene.classList.remove("dragging");
  pinchStartDistance = getTouchDistance(event.touches);
  pinchStartZoom = mapZoom;
}, { passive: true });

mapScene.addEventListener("touchmove", (event) => {
  if (event.touches.length !== 2 || !pinchStartDistance) {
    return;
  }

  event.preventDefault();
  const nextDistance = getTouchDistance(event.touches);
  setMapZoom(pinchStartZoom * (nextDistance / pinchStartDistance));
}, { passive: false });

mapScene.addEventListener("touchend", () => {
  pinchStartDistance = 0;
});

modalClose.addEventListener("click", closeAccountModal);

accountModal.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close-modal")) {
    closeAccountModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !accountModal.hidden) {
    closeAccountModal();
  }
});

themeToggle.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark-theme");
  setPressed(themeToggle, isDark);
  themeToggle.querySelector(".button-label").textContent = isDark ? "Light" : "Dark";
  themeToggle.querySelector("[aria-hidden='true']").textContent = isDark ? "L" : "D";
});

contrastToggle.addEventListener("click", () => {
  const isHighContrast = body.classList.toggle("high-contrast");
  setPressed(contrastToggle, isHighContrast);
});

privateMode.addEventListener("change", () => {
  routeStatus.textContent = privateMode.checked
    ? "Private mode is on for this trip preview."
    : "Private mode is off for this trip preview.";
});

routeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const source = document.querySelector("#source").value.trim() || "Toronto";
  const destination = document.querySelector("#destination").value.trim() || "Niagara Falls";
  const limit = Number(document.querySelector("#attractionLimit").value) || 6;
  const boundedLimit = Math.min(25, Math.max(1, limit));
  const interests = getSelectedInterests();

  currentTrip = {
    source,
    destination,
    limit: boundedLimit,
    interests,
  };

  document.querySelector("#attractionLimit").value = boundedLimit;
  updateTripSummary();
  routeStatus.textContent = isSignedIn
    ? `Route updated with ${boundedLimit} attractions.`
    : `Route updated with ${boundedLimit} attractions. Sign in to view, save, or download it.`;
});

loginTab.addEventListener("click", () => setAuthMode("login"));
signupTab.addEventListener("click", () => setAuthMode("signup"));

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  isSignedIn = true;
  updateAccountState();
  closeAccountModal();
  routeStatus.textContent = "Signed in. Trip view, save, and download are available.";
});

gatedTripButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!handleGatedTripAction(button)) {
      return;
    }

    if (button.id === "viewTrip") {
      routeStatus.textContent = `${tripTitle.textContent} is open on the map.`;
    }
  });
});

saveTrip.addEventListener("click", () => {
  if (!handleGatedTripAction(saveTrip)) {
    return;
  }

  routeStatus.textContent = `${tripTitle.textContent} saved.`;
});

downloadTrip.addEventListener("click", () => {
  if (!handleGatedTripAction(downloadTrip)) {
    return;
  }

  downloadCurrentTrip();
  routeStatus.textContent = `${tripTitle.textContent} downloaded.`;
});

updateTripSummary();
updateAccountState();
updateMapTransform();
