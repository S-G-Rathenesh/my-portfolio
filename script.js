// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle (light/dark) persisted in localStorage
const toggle = document.getElementById("theme-toggle");
const root = document.documentElement;

function setTheme(t) {
  if (t === "dark") {
    root.setAttribute("data-theme", "dark");
    toggle.textContent = "☀️";
  } else {
    root.removeAttribute("data-theme");
    toggle.textContent = "🌙";
  }
  localStorage.setItem("theme", t);
}

const saved = localStorage.getItem("theme");
setTheme(saved === "dark" ? "dark" : "light");

toggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  setTheme(current === "dark" ? "light" : "dark");
});
