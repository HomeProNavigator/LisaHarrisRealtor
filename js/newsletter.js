/**
 * Lisa Harris — The Insider magazine reader
 * Add a month: push another object onto ISSUES with a pages[] of hosted JPGs.
 */
(function () {
  var ISSUES = [
    {
      label: "August 2026",
      date: "2026-07-25",
      pages: [
        "/images/newsletter/2026-08/page-01.jpg",
        "/images/newsletter/2026-08/page-02.jpg",
        "/images/newsletter/2026-08/page-03.jpg",
        "/images/newsletter/2026-08/page-04.jpg",
        "/images/newsletter/2026-08/page-05.jpg",
        "/images/newsletter/2026-08/page-06.jpg",
        "/images/newsletter/2026-08/page-07.jpg",
        "/images/newsletter/2026-08/page-08.jpg",
        "/images/newsletter/2026-08/page-09.jpg",
        "/images/newsletter/2026-08/page-10.jpg",
        "/images/newsletter/2026-08/page-11.jpg",
        "/images/newsletter/2026-08/page-12.jpg"
      ]
    }
  ];

  var issue = ISSUES[0];
  var pages = issue.pages;
  var index = 0;
  var twoPage = window.matchMedia("(min-width: 901px)");

  var stage = document.getElementById("mag-stage");
  var count = document.getElementById("mag-count");
  var title = document.getElementById("issue-title");
  var prevBtns = document.querySelectorAll("[data-mag='prev']");
  var nextBtns = document.querySelectorAll("[data-mag='next']");
  var fsBtn = document.getElementById("fs-btn");
  var shell = document.getElementById("mag-shell");
  if (!stage) return;

  function isSpread() {
    return twoPage.matches;
  }

  function currentPages() {
    if (!isSpread()) return [index];
    if (index === 0) return [0];
    if (index + 1 < pages.length) return [index, index + 1];
    return [index];
  }

  function preload(i) {
    if (i < 0 || i >= pages.length) return;
    var img = new Image();
    img.src = pages[i];
  }

  function render() {
    var shown = currentPages();
    var wrap = document.createElement("div");
    wrap.className = "mag-spread" + (shown.length === 2 ? " pair" : "");
    shown.forEach(function (i) {
      var img = document.createElement("img");
      img.src = pages[i];
      img.alt = issue.label + " — page " + (i + 1);
      img.draggable = false;
      wrap.appendChild(img);
    });
    stage.innerHTML = "";
    stage.appendChild(wrap);

    var lastShown = shown[shown.length - 1];
    if (count) {
      count.textContent = shown.length === 2
        ? (shown[0] + 1) + "–" + (shown[1] + 1) + " / " + pages.length
        : (shown[0] + 1) + " / " + pages.length;
    }

    var atStart = index <= 0;
    var atEnd = lastShown >= pages.length - 1;
    prevBtns.forEach(function (b) { b.disabled = atStart; });
    nextBtns.forEach(function (b) { b.disabled = atEnd; });

    preload(lastShown + 1);
    preload(lastShown + 2);
    if (title) title.textContent = issue.label;
  }

  function go(dir) {
    if (dir < 0) {
      if (index <= 0) return;
      if (isSpread()) {
        index = index === 1 ? 0 : Math.max(1, index - 2);
      } else {
        index -= 1;
      }
    } else {
      var last = currentPages()[currentPages().length - 1];
      if (last >= pages.length - 1) return;
      index = last + 1;
    }
    render();
  }

  prevBtns.forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      go(-1);
    });
  });
  nextBtns.forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      go(1);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      go(1);
    }
    if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      go(-1);
    }
    if (e.key === "f" || e.key === "F") toggleFs();
  });

  var touchX = null;
  stage.addEventListener("touchstart", function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 30) go(dx < 0 ? 1 : -1);
    touchX = null;
  });

  stage.addEventListener("click", function (e) {
    var rect = stage.getBoundingClientRect();
    var x = e.clientX - rect.left;
    go(x < rect.width / 2 ? -1 : 1);
  });

  function isFs() {
    return document.fullscreenElement === shell || document.webkitFullscreenElement === shell;
  }
  function setFsLabel() {
    if (fsBtn) fsBtn.textContent = isFs() ? "Exit" : "Fullscreen";
  }
  function toggleFs() {
    if (!shell) return;
    if (isFs()) {
      var exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) exit.call(document);
    } else {
      var req = shell.requestFullscreen || shell.webkitRequestFullscreen;
      if (req) req.call(shell);
    }
  }
  if (fsBtn) {
    fsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleFs();
    });
  }
  document.addEventListener("fullscreenchange", setFsLabel);
  document.addEventListener("webkitfullscreenchange", setFsLabel);

  function onMq() {
    if (isSpread() && index > 0 && index % 2 === 0) index -= 1;
    render();
  }
  if (twoPage.addEventListener) twoPage.addEventListener("change", onMq);
  else if (twoPage.addListener) twoPage.addListener(onMq);

  render();
})();
