(() => {
  "use strict";

  const CONFIG = Object.freeze({
    repositoryUrl: "https://github.com/ui-layouts/uilayouts",
    idleCycleDuration: 10_000,
    hoverCycleDuration: 50_000,
    maximumFrameRate: 30,
    colors: Object.freeze({
      color1: "#FFFFFF",
      color2: "#1E10C5",
      color3: "#9089E2",
      color4: "#FCFCFE",
      color5: "#F9F9FD",
      color6: "#B2B8E7",
      color7: "#0E2DCB",
      color8: "#0017E9",
      color9: "#4743EF",
      color10: "#7D7BF4",
      color11: "#0B06FC",
      color12: "#C5C1EA",
      color13: "#1403DE",
      color14: "#B6BAF6",
      color15: "#C1BEEB",
      color16: "#290ECB",
      color17: "#3F4CC0",
    }),
  });

  const SVG_ORDER = Object.freeze([
    "svg1",
    "svg2",
    "svg3",
    "svg4",
    "svg3",
    "svg2",
    "svg1",
  ]);

  const createStop = (offset, colorKey) => ({
    offset,
    color: hexToRgb(CONFIG.colors[colorKey]),
  });

  const SVG_STATES = Object.freeze({
    svg1: {
      transform: [287.5, 280, -29.0546, 689.807, 1000],
      stops: [
        createStop(0, "color1"),
        createStop(0.188423, "color2"),
        createStop(0.260417, "color3"),
        createStop(0.328792, "color4"),
        createStop(0.328892, "color5"),
        createStop(0.328992, "color1"),
        createStop(0.442708, "color6"),
        createStop(0.537556, "color7"),
        createStop(0.631738, "color1"),
        createStop(0.725645, "color8"),
        createStop(0.817779, "color9"),
        createStop(0.84375, "color10"),
        createStop(0.90569, "color1"),
        createStop(1, "color11"),
      ],
    },
    svg2: {
      transform: [126.5, 418.5, -64.756, 533.444, 773.324],
      stops: [
        createStop(0, "color1"),
        createStop(0.104167, "color12"),
        createStop(0.182292, "color13"),
        createStop(0.28125, "color1"),
        createStop(0.328792, "color4"),
        createStop(0.328892, "color5"),
        createStop(0.453125, "color6"),
        createStop(0.515625, "color7"),
        createStop(0.631738, "color1"),
        createStop(0.692708, "color8"),
        createStop(0.75, "color14"),
        createStop(0.817708, "color9"),
        createStop(0.869792, "color10"),
        createStop(1, "color1"),
      ],
    },
    svg3: {
      transform: [264.5, 339.5, -42.3022, 946.451, 1372.05],
      stops: [
        createStop(0, "color1"),
        createStop(0.188423, "color2"),
        createStop(0.307292, "color1"),
        createStop(0.328792, "color4"),
        createStop(0.328892, "color5"),
        createStop(0.442708, "color15"),
        createStop(0.537556, "color16"),
        createStop(0.631738, "color1"),
        createStop(0.725645, "color17"),
        createStop(0.817779, "color9"),
        createStop(0.84375, "color10"),
        createStop(0.90569, "color1"),
        createStop(1, "color11"),
      ],
    },
    svg4: {
      transform: [860.5, 420, -153.984, 957.528, 1388.11],
      stops: [
        createStop(0.109375, "color11"),
        createStop(0.171875, "color2"),
        createStop(0.260417, "color13"),
        createStop(0.328792, "color4"),
        createStop(0.328892, "color5"),
        createStop(0.328992, "color1"),
        createStop(0.442708, "color6"),
        createStop(0.515625, "color7"),
        createStop(0.631738, "color1"),
        createStop(0.692708, "color8"),
        createStop(0.817708, "color9"),
        createStop(0.869792, "color10"),
        createStop(1, "color11"),
      ],
    },
  });

  const button = document.querySelector("#github-button");
  const gradient = document.querySelector("#liquid-gradient");

  if (!(button instanceof HTMLAnchorElement) || !gradient) {
    return;
  }

  const stopElements = Array.from(gradient.querySelectorAll("stop"));
  const maximumStopCount = Math.max(
    ...Object.values(SVG_STATES).map(({ stops }) => stops.length),
  );
  const normalizedStates = normalizeStates(SVG_STATES, maximumStopCount);
  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  const animation = {
    phase: 0,
    lastTimestamp: 0,
    lastPaintTimestamp: 0,
    frameRequest: 0,
    isHovered: false,
    isFocused: false,
    isReduced: reducedMotionQuery.matches,
  };

  button.href = CONFIG.repositoryUrl;

  button.addEventListener("pointerenter", () => {
    animation.isHovered = true;
  });

  button.addEventListener("pointerleave", () => {
    animation.isHovered = false;
  });

  button.addEventListener("focus", () => {
    animation.isFocused = true;
  });

  button.addEventListener("blur", () => {
    animation.isFocused = false;
  });

  document.addEventListener("visibilitychange", handleVisibilityChange);

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleMotionPreference);
  } else {
    reducedMotionQuery.addListener(handleMotionPreference);
  }

  paintFrame(0);
  startAnimation();

  function startAnimation() {
    if (animation.isReduced || animation.frameRequest) {
      return;
    }

    animation.lastTimestamp = performance.now();
    animation.lastPaintTimestamp = 0;
    animation.frameRequest = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (!animation.frameRequest) {
      return;
    }

    cancelAnimationFrame(animation.frameRequest);
    animation.frameRequest = 0;
  }

  function animate(timestamp) {
    const elapsed = Math.min(timestamp - animation.lastTimestamp, 100);
    const isEngaged = animation.isHovered || animation.isFocused;
    const cycleDuration = isEngaged
      ? CONFIG.hoverCycleDuration
      : CONFIG.idleCycleDuration;
    const frameInterval = 1000 / CONFIG.maximumFrameRate;

    animation.lastTimestamp = timestamp;
    animation.phase = (animation.phase + elapsed / cycleDuration) % 1;

    if (timestamp - animation.lastPaintTimestamp >= frameInterval) {
      paintFrame(animation.phase);
      animation.lastPaintTimestamp = timestamp;
    }

    animation.frameRequest = requestAnimationFrame(animate);
  }

  function paintFrame(phase) {
    const segmentCount = SVG_ORDER.length - 1;
    const exactSegment = phase * segmentCount;
    const currentIndex = Math.min(
      Math.floor(exactSegment),
      segmentCount - 1,
    );
    const progress = exactSegment - currentIndex;
    const currentState = normalizedStates[SVG_ORDER[currentIndex]];
    const nextState = normalizedStates[SVG_ORDER[currentIndex + 1]];
    const transform = currentState.transform.map((value, index) =>
      interpolate(value, nextState.transform[index], progress),
    );

    gradient.setAttribute(
      "gradientTransform",
      [
        `translate(${formatNumber(transform[0])} ${formatNumber(transform[1])})`,
        `rotate(${formatNumber(transform[2])})`,
        `scale(${formatNumber(transform[3])} ${formatNumber(transform[4])})`,
      ].join(" "),
    );

    stopElements.forEach((stopElement, index) => {
      const currentStop = currentState.stops[index];
      const nextStop = nextState.stops[index];
      const offset = interpolate(
        currentStop.offset,
        nextStop.offset,
        progress,
      );
      const color = currentStop.color.map((channel, channelIndex) =>
        Math.round(
          interpolate(channel, nextStop.color[channelIndex], progress),
        ),
      );

      stopElement.setAttribute("offset", offset.toFixed(6));
      stopElement.setAttribute(
        "stop-color",
        `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
      );
    });
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      stopAnimation();
      return;
    }

    startAnimation();
  }

  function handleMotionPreference(event) {
    animation.isReduced = event.matches;

    if (animation.isReduced) {
      stopAnimation();
      animation.phase = 0;
      paintFrame(0);
      return;
    }

    startAnimation();
  }

  function normalizeStates(states, stopCount) {
    return Object.fromEntries(
      Object.entries(states).map(([stateName, state]) => {
        const lastStop = state.stops[state.stops.length - 1];
        const stops = Array.from(
          { length: stopCount },
          (_, index) => state.stops[index] ?? lastStop,
        );

        return [stateName, { transform: state.transform, stops }];
      }),
    );
  }

  function interpolate(start, end, progress) {
    return start + (end - start) * progress;
  }

  function formatNumber(value) {
    return Number(value.toFixed(4));
  }

  function hexToRgb(hexColor) {
    const normalized = hexColor.replace("#", "");
    const value = Number.parseInt(normalized, 16);

    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  }
})();
