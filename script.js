const widget = document.getElementById("horoscopeWidget");
const previewWidget = document.getElementById("previewWidget");

const signDisplay = document.getElementById("signDisplay");
const previewSignDisplay = document.getElementById("previewSignDisplay");

const text = document.getElementById("text");
const previewText = document.getElementById("previewText");

const date = document.getElementById("date");
const previewDate = document.getElementById("previewDate");

const signBtn = document.getElementById("signBtn");
const signPopup = document.getElementById("signPopup");

const themeBtn = document.getElementById("themeBtn");
const themeOptions = document.getElementById("themeOptions");

const appearanceToggle = document.getElementById("appearanceToggle");
const appearanceOptions = document.getElementById("appearanceOptions");
const appearanceChoices = document.querySelectorAll(".appearance-option");

const fontBtn = document.getElementById("fontToggle");
const fontOptions = document.getElementById("fontOptions");

const copyBtn = document.getElementById("copyLinkBtn");
const copyMessage = document.getElementById("copyMessage");

const params = new URLSearchParams(window.location.search);
const isEmbed = params.get("embed") === "true";

if (isEmbed) {
  document.documentElement.classList.add("embed-mode");
}

let state = {
  sign: params.get("sign") || localStorage.getItem("horoscopeSign") || "aries",
  theme: params.get("theme") || localStorage.getItem("horoscopeTheme") || "pink",
  font: params.get("font") || localStorage.getItem("horoscopeFont") || "default",
  appearance:
    params.get("appearance") ||
    localStorage.getItem("horoscopeAppearance") ||
    "system"
};

const themeColors = {
  pink: "#f4dfeb",
  beige: "#faebdd",
  blue: "#ddebf1",
  green: "#ddedea",
  black: "#17171a",
  white: "#f8f6f3"
};

function saveState() {
  localStorage.setItem("horoscopeSign", state.sign);
  localStorage.setItem("horoscopeTheme", state.theme);
  localStorage.setItem("horoscopeFont", state.font);
  localStorage.setItem("horoscopeAppearance", state.appearance);
}

function updateBothWidgets(callback) {
  [widget, previewWidget].forEach((item) => {
    if (item) callback(item);
  });
}

function setTheme(theme) {
  state.theme = theme || "pink";

  updateBothWidgets((item) => {
    item.classList.remove("pink", "beige", "blue", "green", "black", "white");
    item.classList.add(state.theme);
  });

  if (themeBtn) {
    themeBtn.style.setProperty("--theme-color", themeColors[state.theme]);
    themeBtn.style.backgroundColor = themeColors[state.theme];
  }

  saveState();
}

function setFont(font) {
  state.font = font || "default";

  updateBothWidgets((item) => {
    item.classList.remove("font-default", "font-serif", "font-mono");
    item.classList.add(`font-${state.font}`);
  });

  saveState();
}

function setAppearance(appearance) {
  state.appearance = appearance || "system";

  document.body.classList.remove(
    "appearance-light",
    "appearance-dark",
    "appearance-system"
  );

  document.body.classList.add(`appearance-${state.appearance}`);

  saveState();
}

function updateSignText() {
  if (signDisplay) signDisplay.textContent = state.sign;
  if (previewSignDisplay) previewSignDisplay.textContent = state.sign;

  signPopup?.querySelectorAll("button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.sign === state.sign);
  });
}

async function loadHoroscope(sign) {
  if (text) text.textContent = "checking stars…";
  if (previewText) previewText.textContent = "checking stars…";

  try {
    const res = await fetch(
      `https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=${encodeURIComponent(sign)}`
    );

    const data = await res.json();
    console.log("free horoscope api:", data);

    const horoscope =
      data?.data?.horoscope ||
      "stars unavailable ✨";

    const apiDate =
      data?.data?.date ||
      new Date().toISOString().slice(0, 10);

    if (text) text.textContent = horoscope;
    if (previewText) previewText.textContent = horoscope;

    if (date) date.textContent = apiDate.toLowerCase();
    if (previewDate) previewDate.textContent = apiDate.toLowerCase();

  } catch (err) {
    console.error("horoscope fetch failed:", err);

    if (text) text.textContent = "stars unavailable ✨";
    if (previewText) previewText.textContent = "stars unavailable ✨";
  }
}

    const data = await res.json();

    const horoscope = data.horoscope || "stars unavailable ✨";
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    if (text) text.textContent = horoscope;
    if (previewText) previewText.textContent = horoscope;

    if (date) date.textContent = today.toLowerCase();
    if (previewDate) previewDate.textContent = today.toLowerCase();

  } catch {
    if (text) text.textContent = "stars unavailable ✨";
    if (previewText) previewText.textContent = "stars unavailable ✨";
  }
}

function closeMenus() {
  signPopup?.classList.add("hidden");
  themeOptions?.classList.add("hidden");
  fontOptions?.classList.add("hidden");
  appearanceOptions?.classList.add("hidden");
}

if (!isEmbed) {
  signBtn?.addEventListener("click", (e) => {
    e.stopPropagation();

    signPopup?.classList.toggle("hidden");
    themeOptions?.classList.add("hidden");
    fontOptions?.classList.add("hidden");
    appearanceOptions?.classList.add("hidden");
  });

  signPopup?.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      state.sign = btn.dataset.sign;

      updateSignText();
      loadHoroscope(state.sign);
      saveState();

      signPopup?.classList.add("hidden");
    });
  });

  themeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();

    themeOptions?.classList.toggle("hidden");
    signPopup?.classList.add("hidden");
    fontOptions?.classList.add("hidden");
    appearanceOptions?.classList.add("hidden");
  });

  themeOptions?.querySelectorAll(".theme-circle").forEach((circle) => {
    circle.addEventListener("click", (e) => {
      e.stopPropagation();

      setTheme(circle.dataset.theme);
      themeOptions?.classList.add("hidden");
    });
  });

  appearanceToggle?.addEventListener("click", (e) => {
    e.stopPropagation();

    appearanceOptions?.classList.toggle("hidden");
    signPopup?.classList.add("hidden");
    themeOptions?.classList.add("hidden");
    fontOptions?.classList.add("hidden");
  });

  appearanceChoices.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();

      setAppearance(option.dataset.appearance);
      appearanceOptions?.classList.add("hidden");
    });
  });

  fontBtn?.addEventListener("click", (e) => {
    e.stopPropagation();

    fontOptions?.classList.toggle("hidden");
    signPopup?.classList.add("hidden");
    themeOptions?.classList.add("hidden");
    appearanceOptions?.classList.add("hidden");
  });

  fontOptions?.querySelectorAll(".font-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();

      setFont(option.dataset.font);
      fontOptions?.classList.add("hidden");
    });
  });

  copyBtn?.addEventListener("click", async (e) => {
    e.stopPropagation();

    const base = window.location.origin + window.location.pathname;

    const url =
      `${base}` +
      `?sign=${encodeURIComponent(state.sign)}` +
      `&theme=${encodeURIComponent(state.theme)}` +
      `&font=${encodeURIComponent(state.font)}` +
      `&appearance=${encodeURIComponent(state.appearance)}` +
      `&embed=true`;

    await navigator.clipboard.writeText(url);

    copyMessage?.classList.remove("hidden");
    copyMessage?.classList.add("show");

    clearTimeout(window.__copyTimer);
    window.__copyTimer = setTimeout(() => {
      copyMessage?.classList.add("hidden");
      copyMessage?.classList.remove("show");
    }, 1500);
  });

  document.addEventListener("click", (e) => {
    if (
      signPopup?.contains(e.target) ||
      themeOptions?.contains(e.target) ||
      fontOptions?.contains(e.target) ||
      appearanceOptions?.contains(e.target) ||
      signBtn?.contains(e.target) ||
      themeBtn?.contains(e.target) ||
      fontBtn?.contains(e.target) ||
      appearanceToggle?.contains(e.target)
    ) {
      return;
    }

    closeMenus();
  });
}

function init() {
  setTheme(state.theme);
  setFont(state.font);
  setAppearance(state.appearance);
  updateSignText();
  loadHoroscope(state.sign);
}

init();
