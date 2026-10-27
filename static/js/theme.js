document.getElementById("theme-toggle").addEventListener("click", function () {
  var root = document.documentElement;
  var next = root.dataset.theme === "dark" ? "light" : "dark";
  root.classList.add("theming");
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
  setTimeout(function () { root.classList.remove("theming"); }, 450);
});
