const body = document.body;
const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");
const accountOpenButtons = document.querySelectorAll(".account-button");
const desktopAccountOpen = document.querySelector("#accountOpen");
const accountModal = document.querySelector("#accountModal");
const modalClose = document.querySelector("#modalClose");
const themeToggle = document.querySelector("#themeToggle");
const contrastToggle = document.querySelector("#contrastToggle");
const mapPreview = document.querySelector("#mapPreview");
const mapViewport = document.querySelector("#mapViewport");
const mapCanvas = document.querySelector("#mapCanvas");
const zoomIn = document.querySelector("#zoomIn");
const zoomOut = document.querySelector("#zoomOut");
const closeMap = document.querySelector("#closeMap");
const mapZoomLevel = document.querySelector("#mapZoomLevel");
const privateMode = document.querySelector("#privateMode");
const routeForm = document.querySelector(".route-form");
const routeStatus = document.querySelector("#routeStatus");
const loginTab = document.querySelector("#loginTab");
const signupTab = document.querySelector("#signupTab");
const authTitle = document.querySelector("#authTitle");
const authCopy = document.querySelector("#authCopy");
const authButton = document.querySelector("#authButton");
const authForm = document.querySelector(".auth-form");
const authPanel = document.querySelector("#account");
const password = document.querySelector("#password");
let mapZoom = 1;
let lastAccountTrigger = desktopAccountOpen;
let pinchStartDistance = 0;
let pinchStartZoom = 1;

function setPressed(button, isPressed) {
  button.setAttribute("aria-pressed", String(isPressed));
}

function openAccountModal(mode = "login", trigger = desktopAccountOpen) {
  lastAccountTrigger = trigger;
  setAuthMode(mode);
  accountModal.hidden = false;
  body.classList.add("modal-open");
  authPanel.classList.remove("prompted");
  authPanel.focus({ preventScroll: true });
}

function closeAccountModal() {
  accountModal.hidden = true;
  body.classList.remove("modal-open");
  authPanel.classList.remove("prompted");
  lastAccountTrigger.focus({ preventScroll: true });
}

function updateMapZoom() {
  mapCanvas.style.setProperty("--map-zoom", mapZoom.toFixed(2));
  mapZoomLevel.textContent = `${Math.round(mapZoom * 100)}%`;
}

function getTouchDistance(touches) {
  const first = touches[0];
  const second = touches[1];
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
}

function setMapExpanded(isExpanded) {
  mapPreview.classList.toggle("expanded", isExpanded);
  body.classList.toggle("map-open", isExpanded);
  mapViewport.setAttribute("aria-label", isExpanded ? "Full screen map preview" : "Open map full screen");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "Close" : "Menu";
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menu";
  });
});

accountOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menu";
    openAccountModal("login", button);
  });
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

  if (event.key === "Escape" && mapPreview.classList.contains("expanded")) {
    setMapExpanded(false);
    mapViewport.focus({ preventScroll: true });
  }
});

zoomIn.addEventListener("click", () => {
  mapZoom = Math.min(1.8, mapZoom + 0.2);
  updateMapZoom();
});

zoomOut.addEventListener("click", () => {
  mapZoom = Math.max(0.8, mapZoom - 0.2);
  updateMapZoom();
});

mapViewport.addEventListener("click", () => {
  if (!mapPreview.classList.contains("expanded")) {
    setMapExpanded(true);
  }
});

mapViewport.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && !mapPreview.classList.contains("expanded")) {
    event.preventDefault();
    setMapExpanded(true);
  }
});

mapViewport.addEventListener("touchstart", (event) => {
  if (!mapPreview.classList.contains("expanded") || event.touches.length !== 2) {
    return;
  }

  pinchStartDistance = getTouchDistance(event.touches);
  pinchStartZoom = mapZoom;
}, { passive: true });

mapViewport.addEventListener("touchmove", (event) => {
  if (!mapPreview.classList.contains("expanded") || event.touches.length !== 2 || !pinchStartDistance) {
    return;
  }

  event.preventDefault();
  const nextDistance = getTouchDistance(event.touches);
  const scale = nextDistance / pinchStartDistance;
  mapZoom = Math.max(0.8, Math.min(1.8, pinchStartZoom * scale));
  updateMapZoom();
}, { passive: false });

closeMap.addEventListener("click", () => {
  setMapExpanded(false);
  mapViewport.focus({ preventScroll: true });
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
    ? "Private mode is on: this preview will not store trip history."
    : "Test it: enter two places, choose interests, then try the service.";
});

routeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const source = document.querySelector("#source").value.trim() || "your source";
  const destination = document.querySelector("#destination").value.trim() || "your destination";
  const selectedInterests = [...document.querySelectorAll("input[name='interest']:checked")]
    .map((input) => input.value)
    .join(", ");

  openAccountModal("signup", event.submitter || desktopAccountOpen);
  authPanel.classList.add("prompted");
  authTitle.textContent = "Sign up to view your route";
  authCopy.textContent = `Your ${source} to ${destination} test route is ready${
    selectedInterests ? ` with ${selectedInterests} stops` : ""
  }. Create an account or log in to continue.`;
  routeStatus.textContent = "Nice. Your test route is ready, but viewing the route requires login or signup.";
  authPanel.focus({ preventScroll: true });
});

function setAuthMode(mode) {
  const isSignup = mode === "signup";

  loginTab.classList.toggle("active", !isSignup);
  signupTab.classList.toggle("active", isSignup);
  loginTab.setAttribute("aria-selected", String(!isSignup));
  signupTab.setAttribute("aria-selected", String(isSignup));

  authTitle.textContent = isSignup ? "Create your account" : "Welcome back";
  authCopy.textContent = isSignup
    ? "Sign up to save favorite routes, download trips, and return later."
    : "Log in to save trip ideas and return to your routes later.";
  authButton.textContent = isSignup ? "Create account" : "Log in";
  password.setAttribute("autocomplete", isSignup ? "new-password" : "current-password");
  authPanel.classList.remove("prompted");
}

loginTab.addEventListener("click", () => setAuthMode("login"));
signupTab.addEventListener("click", () => setAuthMode("signup"));

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  authCopy.textContent = "Account features are a frontend preview until login is connected.";
});
