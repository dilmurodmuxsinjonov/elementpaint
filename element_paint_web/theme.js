try {
  document.documentElement.dataset.theme =
    localStorage.getItem("ep_theme") === "light" ? "light" : "dark";
} catch {
  /* Keep the default theme when storage is unavailable. */
}
