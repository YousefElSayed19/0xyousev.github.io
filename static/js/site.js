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

  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var root = document.documentElement;

  /* ---- card glow follows the pointer, and cards tilt slightly toward it ---- */
  $$(".card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
      if (fine && !reduce) {
        c.style.setProperty("--rx", ((0.5 - py) * 7).toFixed(2) + "deg");
        c.style.setProperty("--ry", ((px - 0.5) * 9).toFixed(2) + "deg");
      }
    });
    c.addEventListener("pointerleave", function () {
      c.style.setProperty("--rx", "0deg");
      c.style.setProperty("--ry", "0deg");
    });
  });

  /* ---- soft green glow that trails the mouse ---- */
  var glow = $("#glow");
  if (glow && fine && !reduce) {
    var tx = 0, ty = 0, gx = 0, gy = 0, raf = 0, shown = false;
    var tick = function () {
      gx += (tx - gx) * 0.14; gy += (ty - gy) * 0.14;
      glow.style.transform = "translate3d(" + gx.toFixed(1) + "px," + gy.toFixed(1) + "px,0)";
      glow.style.setProperty("--bx", ((((380 - gx) % 28) + 28) % 28).toFixed(1) + "px");
      glow.style.setProperty("--by", ((((380 - gy) % 28) + 28) % 28).toFixed(1) + "px");
      raf = (Math.abs(tx - gx) > 0.3 || Math.abs(ty - gy) > 0.3) ? requestAnimationFrame(tick) : 0;
    };
    addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; gx = tx; gy = ty; root.classList.add("has-glow"); }
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    root.addEventListener("mouseleave", function () { shown = false; root.classList.remove("has-glow"); });
  }

  /* ---- click ripple ---- */
  if (fine && !reduce) {
    addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || e.pointerType === "touch") return;
      var r = document.createElement("span");
      r.className = "ripple";
      r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
      document.body.appendChild(r);
      setTimeout(function () { r.remove(); }, 750);
    }, { passive: true });
  }

  /* ---- brand name scrambles into place on hover ---- */
  var brand = $(".brand");
  if (brand && fine && !reduce && brand.lastChild && brand.lastChild.nodeType === 3) {
    var node = brand.lastChild, finalText = node.nodeValue, pool = "!<>-_\\/[]{}=+*^?#0123456789abcdef", busy = false;
    brand.addEventListener("pointerenter", function () {
      if (busy) return;
      busy = true;
      var f = 0, total = 16;
      var t = setInterval(function () {
        f++;
        var out = "";
        for (var i = 0; i < finalText.length; i++) out += (i < (f * finalText.length) / total) ? finalText[i] : pool[Math.floor(Math.random() * pool.length)];
        node.nodeValue = out;
        if (f >= total) { clearInterval(t); node.nodeValue = finalText; busy = false; }
      }, 32);
    });
  }

  /* ---- numbers in the badges count up when they appear ---- */
  if (!reduce && "IntersectionObserver" in window) {
    $$(".badges li").forEach(function (li) {
      var txt = [].slice.call(li.childNodes).filter(function (n) { return n.nodeType === 3; }).pop();
      var m = txt && txt.nodeValue.match(/\d+/);
      if (!m || +m[0] < 3) return;
      var to = +m[0], span = document.createElement("span");
      span.className = "count"; span.textContent = "0";
      li.insertBefore(document.createTextNode(txt.nodeValue.slice(0, m.index)), txt);
      li.insertBefore(span, txt);
      txt.nodeValue = txt.nodeValue.slice(m.index + m[0].length);
      var cio = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        cio.disconnect();
        var t0 = performance.now();
        (function step(now) {
          var p = Math.min(1, (now - t0) / 900);
          span.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      }, { threshold: 0.4 });
      cio.observe(li);
    });
  }

  /* ---- reading progress and back-to-top ---- */
  var bar = $("#progress"), top = $("#totop"), ticking = false;
  var onScroll = function () {
    ticking = false;
    var h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")";
    if (top) top.hidden = scrollY < 700;
    var hd = $(".site-header");
    if (hd) hd.classList.toggle("scrolled", scrollY > 8);
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
