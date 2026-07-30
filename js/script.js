(() => {
  "use strict";

  const CONFIG = Object.freeze({
    repositoryUrl: "https://github.com/ui-layouts/uilayouts",
    defaultLightPosition: Object.freeze({ x: 76, y: 18 }),
  });

  const button = document.querySelector("#github-button");
  const liquidCanvas = document.querySelector(".liquid-canvas");

  if (!(button instanceof HTMLAnchorElement)) {
    return;
  }

  const pointerState = {
    bounds: null,
    frameRequest: 0,
    x: CONFIG.defaultLightPosition.x,
    y: CONFIG.defaultLightPosition.y,
  };

  button.href = CONFIG.repositoryUrl;

  button.addEventListener("pointerenter", cacheButtonBounds);
  button.addEventListener("pointermove", handlePointerMove);
  button.addEventListener("pointerleave", resetPointerLight);
  button.addEventListener("focus", handleFocus);
  button.addEventListener("blur", resetPointerLight);
  window.addEventListener("resize", clearButtonBounds, { passive: true });
  document.addEventListener("visibilitychange", syncAnimationPlayback);
  window.addEventListener("pageshow", syncAnimationPlayback);

  syncAnimationPlayback();

  function cacheButtonBounds() {
    pointerState.bounds = button.getBoundingClientRect();
  }

  function clearButtonBounds() {
    pointerState.bounds = null;
  }

  function handlePointerMove(event) {
    if (!pointerState.bounds) {
      cacheButtonBounds();
    }

    const { left, top, width, height } = pointerState.bounds;
    pointerState.x = clamp(((event.clientX - left) / width) * 100, 0, 100);
    pointerState.y = clamp(((event.clientY - top) / height) * 100, 0, 100);
    requestLightUpdate();
  }

  function handleFocus() {
    pointerState.x = 62;
    pointerState.y = 22;
    requestLightUpdate();
  }

  function resetPointerLight() {
    pointerState.x = CONFIG.defaultLightPosition.x;
    pointerState.y = CONFIG.defaultLightPosition.y;
    requestLightUpdate();
  }

  function requestLightUpdate() {
    if (pointerState.frameRequest) {
      return;
    }

    pointerState.frameRequest = requestAnimationFrame(() => {
      button.style.setProperty("--pointer-x", `${pointerState.x.toFixed(2)}%`);
      button.style.setProperty("--pointer-y", `${pointerState.y.toFixed(2)}%`);
      pointerState.frameRequest = 0;
    });
  }

  function syncAnimationPlayback() {
    const shouldPause = document.hidden;
    button.classList.toggle("is-paused", shouldPause);

    if (!(liquidCanvas instanceof SVGSVGElement)) {
      return;
    }

    const method = shouldPause ? "pauseAnimations" : "unpauseAnimations";

    if (typeof liquidCanvas[method] === "function") {
      liquidCanvas[method]();
    }
  }

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }
})();
