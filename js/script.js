(() => {
  "use strict";

  const dock = document.querySelector("#dock");
  const status = document.querySelector("#dock-status");

  if (!(dock instanceof HTMLElement)) {
    return;
  }

  const CONFIG = Object.freeze({
    maximumSize: 80,
    influenceRadius: 150,
    springStrength: 0.14,
    springFriction: 0.72,
    restThreshold: 0.02,
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const itemElements = [...dock.querySelectorAll(".dock-item")];

  const items = itemElements.map((element) => {
    const button = element.querySelector(".dock-button");
    const baseSize = Number.parseFloat(getComputedStyle(element).width);

    return {
      element,
      button,
      baseSize,
      currentSize: baseSize,
      targetSize: baseSize,
      velocity: 0,
      launchTimer: 0,
    };
  });

  const pointer = {
    clientX: 0,
    inside: false,
  };

  let animationFrame = 0;

  dock.addEventListener("pointermove", handlePointerMove, { passive: true });
  dock.addEventListener("pointerleave", handlePointerLeave);
  window.addEventListener("resize", handleResize, { passive: true });
  finePointer.addEventListener("change", resetMagnification);
  reducedMotion.addEventListener("change", resetMagnification);

  items.forEach((item) => {
    if (!(item.button instanceof HTMLButtonElement)) {
      return;
    }

    item.button.addEventListener("pointerdown", () => setPressed(item, true));
    item.button.addEventListener("pointerup", () => setPressed(item, false));
    item.button.addEventListener("pointercancel", () => setPressed(item, false));
    item.button.addEventListener("lostpointercapture", () => setPressed(item, false));
    item.button.addEventListener("keydown", (event) => handleKeyDown(event, item));
    item.button.addEventListener("keyup", (event) => handleKeyUp(event, item));
    item.button.addEventListener("blur", () => setPressed(item, false));
    item.button.addEventListener("click", () => announceSelection(item));
  });

  function handlePointerMove(event) {
    if (!finePointer.matches || event.pointerType === "touch") {
      return;
    }

    pointer.clientX = event.clientX;
    pointer.inside = true;
    startAnimation();
  }

  function handlePointerLeave() {
    pointer.inside = false;
    setBaseTargets();
    startAnimation();
  }

  function handleResize() {
    items.forEach((item) => {
      const cssSize = Number.parseFloat(
        getComputedStyle(item.element).getPropertyValue("--item-base-size"),
      );

      if (Number.isFinite(cssSize) && cssSize > 0) {
        item.baseSize = cssSize;
      }
    });

    resetMagnification();
  }

  function handleKeyDown(event, item) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    setPressed(item, true);
  }

  function handleKeyUp(event, item) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    setPressed(item, false);
  }

  function setPressed(item, isPressed) {
    item.element.classList.toggle("is-pressed", isPressed);
  }

  function announceSelection(item) {
    const appName = item.element.dataset.app ?? "Aplicativo";

    window.clearTimeout(item.launchTimer);
    item.element.classList.remove("is-launched");

    requestAnimationFrame(() => {
      item.element.classList.add("is-launched");
    });

    item.launchTimer = window.setTimeout(() => {
      item.element.classList.remove("is-launched");
    }, 400);

    if (status instanceof HTMLElement) {
      status.textContent = `${appName} selecionado.`;
    }
  }

  function updateTargetsFromPointer() {
    if (!pointer.inside || !finePointer.matches) {
      setBaseTargets();
      return;
    }

    const centers = items.map((item) => {
      const bounds = item.element.getBoundingClientRect();
      return bounds.left + bounds.width / 2;
    });

    items.forEach((item, index) => {
      const distance = Math.abs(pointer.clientX - centers[index]);
      const influence = clamp(1 - distance / CONFIG.influenceRadius, 0, 1);
      item.targetSize =
        item.baseSize + (CONFIG.maximumSize - item.baseSize) * influence;
    });
  }

  function setBaseTargets() {
    items.forEach((item) => {
      item.targetSize = item.baseSize;
    });
  }

  function startAnimation() {
    if (animationFrame || reducedMotion.matches) {
      if (reducedMotion.matches) {
        renderReducedMotionState();
      }
      return;
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function animate() {
    animationFrame = 0;
    updateTargetsFromPointer();

    let shouldContinue = false;

    items.forEach((item) => {
      const displacement = item.targetSize - item.currentSize;
      item.velocity =
        (item.velocity + displacement * CONFIG.springStrength) *
        CONFIG.springFriction;
      item.currentSize += item.velocity;

      if (
        Math.abs(displacement) < CONFIG.restThreshold &&
        Math.abs(item.velocity) < CONFIG.restThreshold
      ) {
        item.currentSize = item.targetSize;
        item.velocity = 0;
      } else {
        shouldContinue = true;
      }
    });

    items.forEach((item) => {
      item.element.style.setProperty("--item-size", `${item.currentSize.toFixed(2)}px`);
    });

    if (shouldContinue) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  function resetMagnification() {
    pointer.inside = false;
    setBaseTargets();

    if (reducedMotion.matches) {
      renderReducedMotionState();
      return;
    }

    startAnimation();
  }

  function renderReducedMotionState() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    items.forEach((item) => {
      item.currentSize = item.baseSize;
      item.targetSize = item.baseSize;
      item.velocity = 0;
      item.element.style.setProperty("--item-size", `${item.baseSize}px`);
    });
  }

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }
})();
