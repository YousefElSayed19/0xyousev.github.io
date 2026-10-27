(function () {
  "use strict";
  var modal = document.getElementById("search");
  var input = document.getElementById("q");
  var list = document.getElementById("results");
  var openBtn = document.getElementById("search-open");
  if (!modal || !input || !list) return;

  var index = null, loading = null, sel = -1, shown = [], lastFocus = null;
  var labels = { writeups: "write-up", blogs: "blog", cheatsheets: "cheatsheet", challenges: "challenge", page: "page" };

  function load() {
    if (index) return Promise.resolve(index);
    if (loading) return loading;
    loading = fetch(document.body.getAttribute("data-index"))
      .then(function (r) { return r.json(); })
      .then(function (d) { index = d.map(function (p) {
        p._t = (p.title || "").toLowerCase();
        p._g = (p.tags || []).join(" ").toLowerCase();
        p._d = (p.desc || "").toLowerCase();
        p._b = (p.body || "").toLowerCase();
        return p;
      }); return index; })
      .catch(function () { index = []; return index; });
    return loading;
  }

  function open() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    input.value = "";
    render("");
    input.focus();
    load().then(function () { render(input.value); });
  }
  function close() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function score(p, terms) {
    var s = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i], hit = 0;
      if (p._t.indexOf(t) > -1) hit += 10;
      if (p._g.indexOf(t) > -1) hit += 6;
      if (p._d.indexOf(t) > -1) hit += 3;
      if (p._b.indexOf(t) > -1) hit += 1;
      if (!hit) return 0;
      s += hit;
    }
    return s;
  }

  function snippet(p, terms) {
    if (p.desc) return p.desc;
    var b = p.body || "", low = p._b, at = low.indexOf(terms[0] || "");
    if (at < 0) at = 0;
    return (at > 40 ? "…" : "") + b.slice(Math.max(0, at - 40), at + 120).replace(/\s+/g, " ");
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function render(q) {
    q = q.trim().toLowerCase();
    var terms = q.split(/\s+/).filter(Boolean);
    var pool = index || [];
    if (!terms.length) {
      shown = pool.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 6);
    } else {
      shown = pool.map(function (p) { return { p: p, s: score(p, terms) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 8).map(function (x) { return x.p; });
    }
    sel = shown.length ? 0 : -1;
    if (!shown.length) {
      list.innerHTML = '<li class="none">' + (index ? "Nothing found for “" + esc(q) + "”." : "Loading…") + "</li>";
      return;
    }
    list.innerHTML = shown.map(function (p, i) {
      return '<li role="option" aria-selected="' + (i === sel) + '"><a href="' + esc(p.url) + '"><b><span class="k">' +
        esc(labels[p.section] || p.section) + "</span>" + esc(p.title) + "</b><small>" + esc(snippet(p, terms)) + "</small></a></li>";
    }).join("");
  }

  function move(d) {
    if (!shown.length) return;
    sel = (sel + d + shown.length) % shown.length;
    var lis = list.children;
    for (var i = 0; i < lis.length; i++) lis[i].setAttribute("aria-selected", i === sel);
    if (lis[sel].scrollIntoView) lis[sel].scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("input", function () { render(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter" && shown[sel]) { location.href = shown[sel].url; }
  });
  modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
  if (openBtn) openBtn.addEventListener("click", open);

  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || "");
    if (e.key === "Escape" && !modal.hidden) { close(); return; }
    if ((e.key === "/" && !typing && modal.hidden) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
      e.preventDefault();
      modal.hidden ? open() : close();
    }
  });
  if (openBtn) openBtn.addEventListener("pointerenter", load, { once: true });
})();
