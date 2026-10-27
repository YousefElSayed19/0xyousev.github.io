(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- swallow benign view-transition rejections (a navigation interrupting another) ---- */
  ["pagereveal", "pageswap"].forEach(function (ev) {
    addEventListener(ev, function (e) {
      var vt = e.viewTransition;
      if (!vt) return;
      ["ready", "finished", "updateCallbackDone"].forEach(function (k) { if (vt[k] && vt[k].catch) vt[k].catch(function () {}); });
    });
  });

  /* ---- reveal on scroll ---- */
  var reveals = $$(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (e) { e.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    reveals.forEach(function (e) { io.observe(e); });
  }

  /* ---- terminal typing ---- */
  var body = $(".term-body");
  if (body && !reduce) {
    var nodes = $$(".tl, .to", body);
    var cmds = $$(".c", body).map(function (c) { return c.textContent; });
    body.classList.add("pending");
    nodes.forEach(function (n) { n.style.display = "none"; });
    $$(".c", body).forEach(function (c) { c.textContent = ""; });
    var cursor = document.createElement("span");
    cursor.className = "cursor";
    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    var run = async function () {
      body.classList.remove("pending");
      var ci = 0;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.style.display = "";
        if (n.classList.contains("tl")) {
          var span = $(".c", n);
          n.appendChild(cursor);
          var text = cmds[ci++];
          for (var k = 0; k < text.length; k++) { span.textContent += text[k]; await wait(28 + Math.random() * 40); }
          await wait(260);
        } else {
          await wait(120);
        }
      }
      body.appendChild(cursor);
    };
    var started = false;
    var start = function () { if (!started) { started = true; setTimeout(run, 500); } };
    if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { tio.disconnect(); start(); } });
      tio.observe(body);
    } else { start(); }
  }

  /* ---- card glow follows the pointer ---- */
  $$(".card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---- reading progress and back-to-top ---- */
  var bar = $("#progress"), top = $("#totop"), ticking = false;
  var onScroll = function () {
    ticking = false;
    var h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")";
    if (top) top.hidden = scrollY < 700;
  };
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (top) top.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---- copy buttons on code blocks ---- */
  $$(".content pre").forEach(function (pre) {
    var wrap = document.createElement("div");
    wrap.className = "codewrap";
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    var b = document.createElement("button");
    b.type = "button"; b.className = "copy"; b.textContent = "Copy";
    b.setAttribute("aria-label", "Copy code to clipboard");
    b.addEventListener("click", function () {
      var text = pre.innerText;
      var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { b.textContent = "Press Ctrl+C"; });
      } else {
        var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); done(); } catch (e) {} t.remove();
      }
    });
    wrap.appendChild(b);
  });

  /* ---- tag filter on list pages ---- */
  var filters = $(".filters");
  if (filters) {
    var items = $$(".posts li"), none = $("#no-match");
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip-btn");
      if (!btn) return;
      $$(".chip-btn", filters).forEach(function (x) { x.classList.toggle("on", x === btn); });
      var tag = btn.getAttribute("data-tag"), shown = 0;
      items.forEach(function (li) {
        var tags = (li.getAttribute("data-tags") || "").split(",");
        var ok = !tag || tags.indexOf(tag) > -1;
        li.hidden = !ok;
        if (ok) { shown++; li.classList.add("in"); }
      });
      if (none) none.hidden = shown > 0;
    });
  }
})();
