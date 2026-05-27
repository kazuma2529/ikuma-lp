(function () {
  "use strict";

  var STEPS = [
    {
      blocks: [
        {
          lines: [
            "みんなは、",
            "「ちゃんとした大人」に",
            "なれているだろうか。",
          ],
        },
      ],
    },
    {
      blocks: [
        {
          lines: [
            "ミスをしない。",
            "約束を忘れない。",
            "空気を読める。",
          ],
        },
        { divider: true },
        {
          lines: ["そういう人間だけが、", "“まとも”なんだろうか。"],
        },
      ],
    },
    {
      blocks: [
        {
          lines: ["この男は、", "パチンコ屋でミスをする。"],
        },
        {
          lines: ["大事なテニスの大会の日程を間違える。"],
        },
        {
          lines: ["そして、", "食べたらすぐ腹を壊す。"],
        },
      ],
    },
    {
      blocks: [
        {
          lines: [
            "彼女が勇気を出して金髪にしたとき、",
            "この男はこう言った。",
          ],
        },
        {
          lines: ["「…いや、似合わないと思う」"],
          emphasis: true,
        },
        {
          lines: ["嘘がつけなかった。"],
        },
      ],
    },
    {
      blocks: [
        {
          lines: [
            "不器用で、",
            "笑える失敗が多く、",
            "生きるのがちょっと下手な男。",
          ],
        },
        { divider: true },
        {
          lines: ["でも、", "彼は生き続けるのだ。"],
          closing: true,
        },
      ],
    },
  ];

  var EXIT_MS = 480;
  var MIN_READ_MS = 900;
  var REVEAL_MS = 1100;

  var overlay = document.getElementById("intro-overlay");
  var contentEl = document.getElementById("intro-content");
  var hintEl = document.getElementById("intro-hint");
  var lpMain = document.querySelector(".lp");
  var lpImage = document.querySelector(".lp-image");
  var footer = document.querySelector(".lp-footer");

  if (!overlay || !contentEl) return;

  var stepIndex = 0;
  var isAnimating = false;
  var canAdvance = false;
  var readTimer = null;

  function preloadLpImage() {
    if (!lpImage || !lpImage.src) return;
    var img = new Image();
    img.src = lpImage.src;
  }

  function renderBlock(block) {
    if (block.divider) {
      return '<div class="intro-divider" aria-hidden="true"><span>⸻</span></div>';
    }

    var className = "intro-paragraph";
    if (block.emphasis) className += " intro-paragraph--quote";
    if (block.closing) className += " intro-paragraph--closing";

    var html = block.lines
      .map(function (line) {
        return '<span class="intro-line">' + escapeHtml(line) + "</span>";
      })
      .join("");

    return '<p class="' + className + '">' + html + "</p>";
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildStepHtml(step) {
    return step.blocks.map(renderBlock).join("");
  }

  function setHintForStep(index) {
    if (!hintEl) return;
    if (index >= STEPS.length - 1) {
      hintEl.textContent = "タップして本編へ";
      hintEl.classList.add("intro-hint--final");
    } else {
      hintEl.textContent = "タップして続ける";
      hintEl.classList.remove("intro-hint--final");
    }
  }

  function armReadDelay() {
    canAdvance = false;
    if (readTimer) clearTimeout(readTimer);
    readTimer = setTimeout(function () {
      canAdvance = true;
      if (hintEl) hintEl.classList.add("intro-hint--ready");
    }, MIN_READ_MS);
  }

  function playEnter() {
    contentEl.classList.remove("is-exiting");
    contentEl.classList.add("is-entering");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        contentEl.classList.remove("is-entering");
        contentEl.classList.add("is-visible");
        isAnimating = false;
        armReadDelay();
      });
    });
  }

  function showStep(index, skipExit) {
    setHintForStep(index);
    if (hintEl) hintEl.classList.remove("intro-hint--ready");

    if (skipExit) {
      contentEl.innerHTML = buildStepHtml(STEPS[index]);
      contentEl.classList.add("is-visible");
      isAnimating = false;
      armReadDelay();
      return;
    }

    isAnimating = true;
    contentEl.classList.remove("is-visible", "is-entering");
    contentEl.classList.add("is-exiting");

    setTimeout(function () {
      contentEl.innerHTML = buildStepHtml(STEPS[index]);
      contentEl.classList.remove("is-exiting");
      playEnter();
    }, EXIT_MS);
  }

  function revealLp() {
    isAnimating = true;
    canAdvance = false;
    if (hintEl) hintEl.classList.remove("intro-hint--ready");

    contentEl.classList.remove("is-visible", "is-entering");
    contentEl.classList.add("is-exiting");

    setTimeout(function () {
      overlay.classList.add("is-revealing");
      document.body.classList.remove("intro-active");
      document.body.classList.add("lp-revealed");

      if (lpMain) lpMain.classList.add("is-visible");
      if (footer) footer.classList.add("is-visible");

      setTimeout(function () {
        overlay.classList.add("is-hidden");
        overlay.setAttribute("aria-hidden", "true");
        isAnimating = false;
      }, REVEAL_MS);
    }, EXIT_MS);
  }

  function advance() {
    if (isAnimating || !canAdvance) return;

    if (stepIndex >= STEPS.length - 1) {
      revealLp();
      return;
    }

    stepIndex += 1;
    showStep(stepIndex, false);
  }

  function onTap() {
    advance();
  }

  document.body.classList.add("intro-active");
  preloadLpImage();
  contentEl.innerHTML = buildStepHtml(STEPS[0]);
  setHintForStep(0);

  requestAnimationFrame(function () {
    playEnter();
  });

  overlay.addEventListener("click", onTap);
  overlay.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTap();
    }
  });

  var yearEl = document.getElementById("lp-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
