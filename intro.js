"use strict";

// The intro animation of the home page (docs/DESIGN-intro.md): an 80 s story of the distance ladder in a
// window over the page, opened only by the Vaata tutvustust button. The scenes follow each other as slides
// from right to left, each drawn in a panel of its own. The whole animation is draw(t), a function of the
// time, so seeking, pausing and still frames come for free: index.html#intro=12.8 opens the window paused at
// 12.8 s, and #intro=12.8&play plays on from there.
(() => {
  const playBtn = document.getElementById("introPlay");
  const figure = document.querySelector(".ladder-art");
  if (!playBtn) return;

  const W = 1280, H = 720;                 // the scene, in SVG units
  const NS = "http://www.w3.org/2000/svg";
  const L = (et, en) => (document.documentElement.lang === "en" ? en : et);
  const sp = (et, en) => `<span data-l="et">${et}</span><span data-l="en">${en}</span>`;

  // ---- timing: everything that happens when is here ----

  // the scenes: their start, the caption and when it shows, and the key frame that stands for the scene when
  // motion is reduced, both counted from the start of the scene, and the part. All the times of a scene below
  // are counted from its start too, so that a scene is moved or lengthened by changing its start alone.
  const DURATION = 80;
  const SCENES = [
    { start: 0, cap: [0.2, 3.1], key: 1.5, title: true, et: "Kui kaugel on galaktikad?", en: "How far away are the galaxies?" },
    { start: 3, cap: [0.5, 4.9], key: 3, et: "Maa orbiidi raadius on üks astronoomiline ühik", en: "The Earth's orbit has a radius of one astronomical unit" },
    { start: 8, cap: [0.2, 7.8], key: 7, part: 1, et: "Lähedaste tähtede kaugused saab määrata parallaksi abil", en: "The distances of nearby stars can be found from their parallax" },
    { start: 16, cap: [1.2, 6.9], key: 5.5, et: "Parve tähed liiguvad taevas koos", en: "The stars of a cluster move together" },
    { start: 23, cap: [0.9, 4.9], key: 4, et: "Parve liikmed moodustavad selge peajada", en: "The cluster members form a clear main sequence" },
    { start: 28, cap: [0.9, 5.8], key: 5, et: "Keskmine parallaks annab parve kauguse", en: "Their mean parallax gives the cluster's distance" },
    { start: 34, cap: [1.2, 6.8], key: 6, part: 2, et: "Gaia andmetest saame hajusparvede kaugused", en: "Gaia data give the distances of open clusters" },
    { start: 41, cap: [1.2, 7.8], key: 6.5, et: "Tsefeiid pulseerib – periood näitab tema heledust", en: "A Cepheid pulsates – its period reveals its luminosity" },
    { start: 49, cap: [1.2, 6.8], key: 6, part: 3, et: "Tsefeiidide heledustest saame lähedaste galaktikate kaugused", en: "The brightness of Cepheids gives the distances of nearby galaxies" },
    { start: 56, cap: [1.2, 7.8], key: 3.8, part: 4, et: "Valge kääbus kogub massi ja plahvatab", en: "A white dwarf gains mass and explodes" },
    { start: 64, cap: [1.2, 12.8], key: 12, et: "Supernoovad näitavad meile, kui kiiresti Universum paisub", en: "Supernovae show us how fast the Universe expands" },
    { start: 77, cap: [0.6, 99], key: 2.9, et: "Kosmiliste kauguste redel", en: "The cosmic distance ladder" },
  ];
  SCENES.forEach((s, i) => (s.end = i + 1 < SCENES.length ? SCENES[i + 1].start : DURATION));
  const T = (i) => SCENES[i].start;
  // the panels, each holding the scenes from its first to its last: every panel but the first slides in from
  // the right over SLIDE seconds from the start of its first scene, as the one before it slides out to the left
  const PANELS = [[0, 2], [3, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 11]];
  const SLIDE = 1;

  // distances as log10(d / pc)
  const AU = Math.log10(1 / 206265), PLE = Math.log10(135), NGC = Math.log10(940);
  const M101 = Math.log10(6.9e6), FAR = Math.log10(5e8);
  // the near field of galaxies and the Milky Way that the camera passes on its way out in scene 10
  const GAL = Math.log10(4e7), MWL = 6.5;
  // the marker on the distance scale, [time, value], eased between the keys
  const MARKER = [[0, AU], [T(2) + 1, AU], [T(2) + 2, 1], [T(3), 1], [T(3) + 1, PLE], [T(6) + 4.3, PLE], [T(6) + 5, NGC],
    [T(8), NGC], [T(8) + 1, M101], [T(10) + 3, M101], [T(10) + 5.5, FAR]];
  // the rungs: their range on the distance scale (log pc) and when their bar grows; the bar of the
  // supernovae runs past the end of the scale
  const RUNGS = [
    { cls: "r1", from: Math.log10(50), to: Math.log10(5e3), grow: [T(5) + 3.5, T(5) + 4.5] },
    { cls: "r2", from: Math.log10(300), to: Math.log10(4e7), grow: [T(8) + 3.8, T(8) + 4.8] },
    { cls: "r3", from: Math.log10(7e6), to: 9.25, grow: [T(10) + 3, T(10) + 5.5] },
  ];
  // landmarks on the scale, shown once the marker has reached them; hi puts the label on the upper line
  const LANDMARKS = [
    { d: PLE, et: "Plejaadid", en: "Pleiades", anchor: "end" },
    { d: NGC, et: "NGC 6087", en: "NGC 6087", hi: true },
    { d: Math.log10(7.65e5), et: "Andromeeda galaktika", en: "Andromeda galaxy", anchor: "end" },
    { d: M101, et: "M101", en: "M101", hi: true },
    { d: Math.log10(1.65e7), et: "Neitsi parv", en: "Virgo cluster", anchor: "start" },
  ];
  // the objects of the insets in the images: S Nor in NGC 6087 and SN 2011fe in M101
  const S_NOR_PX = [634.6, 308.3], SN_PX = [668.0, 488.6];
  // the ladder of scene 11, placed in the scene at this scale and corner (the page figure is 393 × 274)
  const LADDER = { k: 1.85, x: (W - 393 * 1.85) / 2, y: 118 };
  // scene 1: the Sun and the Earth's orbit, seen from straight above at TOP px per au, fade in over show, the
  // Earth goes round once over year, and the line of 1 au from the Sun to the Earth is drawn out over line
  const ORB = { show: [0, 0.5], year: [0.5, 4], line: [1, 1.5], TOP: 200 };
  // scene 2, after the parallax page in its oblique view: in units of the Earth's orbit, a star at distance d
  // and ecliptic latitude beta with a proper motion of mu a year towards phi, and the distant quasars on a plane
  // at distance D, ±HP wide. From the start of scene 2 the view tilts from straight above over tilt, as the line
  // of 1 au fades, the star and the quasars come in over show, the Earth goes round YEARS times over run, and
  // the camera turns from AZ[0] to AZ[1] over the scene.
  const PAR = { d: 4, beta: 50, mu: 1.5, phi: 60, D: 10, HP: 3.8, YEARS: 3, tilt: [0, 1], show: [0.8, 1.5], run: [1.5, 7.5], AZ: [62, 40] };
  // scenes 3–5, each from its own start. Scene 3: the image dims and its stars get dots and arrows for their
  // proper motions, the proper-motion plot comes into the right panel and the dots fly into it, and the clump
  // of the cluster is lassoed and selected. Scene 4: the row of plots shifts one panel to the left over ROW,
  // bringing in the colour–magnitude diagram with all the stars in grey; the selected stars turn blue in it
  // one after another from the brightest over sel, and the main sequence is labelled at name. Scene 5: it
  // shifts again, bringing in the parallax histogram; the selected stars drop into it, and the readout gives
  // the distance.
  const PM = { dots: [1.3, 2], in: [2, 2.6], move: [2.6, 3.4], lasso: [3.6, 4.8], sel: [4.8, 5.1] };
  const ROW = [0, 0.8];
  const CMD = { sel: [1, 2], name: 2.2 };
  const PLX = { drop: [1, 2.8], read: [3, 3.3] };
  // scene 7: S Nor pulsates with a cycle of CYCLE seconds from t0 on, and its light curve is traced over trace
  const CEPH = { P: 9.75, t0: 0.1, CYCLE: 1.8, trace: [1.6, 5.8] };
  // scene 8: Cepheids blink in M101 one after another, step apart, and the readout gives its distance
  const M101C = { blink: 1.4, step: 0.3, read: [3.3, 3.6] };
  // scene 9: the white dwarf grows from 1.30 to 1.38 M☉ over gain, ignites and explodes over boom, the cloud
  // still growing as it slides out
  const SNIA = { gain: [1.3, 4], ignite: 4, boom: [4.5, 9] };
  // scene 10: SN 2011fe shines in M101, its Cepheids blink again next to it from again on, and it fades; the
  // camera pulls out over cam, supernovae flash in the distant galaxies, the Hubble plot comes in over hub,
  // widens to 500 Mpc, the supernovae add their points, and the readout gives H0
  const SNE = { again: 1.2, fade: [2.8, 3.6], cam: [3, 5.5], flash: 5.5, flashStep: 0.15, hub: [7.5, 8],
    widen: [9, 10], sne: 10, sneStep: 0.08, read: [11, 11.3] };
  const CAMERA = [[SNE.cam[0], M101], [SNE.cam[1], FAR]];

  // ---- helpers ----

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = (x) => (x = clamp(x), x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
  // 0 before a, 1 after b, eased in between
  const ramp = (t, a, b) => ease((t - a) / (b - a));
  // a fade in at a and out at b, each over f seconds
  const inOut = (t, a, b, f = 0.3) => Math.min(ramp(t, a, a + f), 1 - ramp(t, b - f, b));
  function track(keys, t) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [t0, v0] = keys[i - 1], [t1, v1] = keys[i];
      if (t <= t1) return v0 + (v1 - v0) * ease((t - t0) / (t1 - t0));
    }
    return keys.at(-1)[1];
  }
  // a fixed random sequence, so that the star field is the same every time
  function rng(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function el(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  }
  const set = (e, attrs) => { for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); };
  const show = (e, op) => { e.style.display = op > 0.001 ? "" : "none"; e.style.opacity = op; };

  // ---- the window ----

  const modal = document.createElement("div");
  modal.className = "intro-modal";
  modal.hidden = true;
  const partMarks = SCENES.filter((s) => s.part).map((s) => {
    const label = { 1: sp("1. osa: parallaks", "Part 1: parallax"), 2: sp("2. osa: perioodi-heleduse seos", "Part 2: period–luminosity relation"),
      3: sp("3. osa: Hubble'i seadus", "Part 3: the Hubble law"), 4: sp("4. osa: supernoovad", "Part 4: supernovae") }[s.part];
    return `<button type="button" class="intro-mark p${s.part}" data-t="${s.start}" style="left: ${(s.start / DURATION) * 100}%">
      <span aria-hidden="true">${s.part}</span><span class="intro-sr">${label}</span></button>`;
  }).join("");
  modal.innerHTML = `
    <div class="intro-window" role="dialog" aria-modal="true" tabindex="-1">
      <div class="intro-scene">
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="introTitle introDesc"><title id="introTitle"></title><desc id="introDesc"></desc></svg>
        <p class="intro-caption" aria-live="polite"></p>
      </div>
      <div class="intro-progress">
        <div class="intro-track"><div class="intro-fill"></div></div>
        ${partMarks}
      </div>
      <div class="intro-controls">
        <button type="button" class="primary" data-act="pause"></button>
        <button type="button" data-act="restart">${sp("Algusest", "From the start")}</button>
        <button type="button" data-act="skip">${sp("Jäta vahele", "Skip")}</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  const win = modal.querySelector(".intro-window");
  const svg = modal.querySelector("svg");
  const caption = modal.querySelector(".intro-caption");
  const fill = modal.querySelector(".intro-fill");
  const pauseBtn = modal.querySelector("[data-act=pause]");
  // the whole story in a few sentences for screen readers, which read the captions as they change
  const STORY = {
    et: "Maa tiirleb ümber Päikese ühe astronoomilise ühiku kaugusel, ja see paneb lähedase tähe kaugete kvasarite " +
      "taustal ellipsit joonistama: see on parallaks. Plejaadide tähed liiguvad taevas koos ja moodustavad selge " +
      "peajada, ja nende keskmine Gaia parallaks annab parve kauguse, umbes 135 pc. Gaia andmed annavad ka Päikese " +
      "ümbruse hajusparvede kaugused, ja parves NGC 6087 pulseerib tsefeiid S Nor, mille periood näitab tema " +
      "heledust. Tsefeiidide heledustest saame galaktika M101 kauguse, umbes 7 Mpc. Valge kääbus kogub kaaslaselt " +
      "massi ja plahvatab Ia tüüpi supernoovana. Supernoovad annavad kaugused sadade megaparsekiteni ja Hubble'i " +
      "konstandi, umbes 73 km/s/Mpc. Lõpuks saavad kolmest meetodist kauguste redeli pulgad.",
    en: "The Earth goes round the Sun at one astronomical unit, and this makes a nearby star trace an ellipse " +
      "against distant quasars: its parallax. The stars of the Pleiades move together across the sky and form a " +
      "clear main sequence, and their mean Gaia parallax gives the cluster's distance, about 135 pc. Gaia data also " +
      "give the distances of the open clusters around the Sun, and in NGC 6087 the Cepheid S Nor pulsates, its " +
      "period revealing its luminosity. The brightness of Cepheids gives the distance of the galaxy M101, about " +
      "7 Mpc. A white dwarf gains mass from its companion and explodes as a type Ia supernova. Supernovae give " +
      "distances out to hundreds of megaparsecs and the Hubble constant, about 73 km/s/Mpc. Finally the three " +
      "methods become the rungs of the distance ladder.",
  };
  // with reduced motion, each scene is shown as its key frame, still, for as long as the scene lasts
  const still = matchMedia("(prefers-reduced-motion: reduce)");

  // ---- the scene ----

  const defs = el("defs", {}, svg);
  const shade = (id, y1, y2) => {
    const g = el("linearGradient", { id, x1: 0, y1, x2: 0, y2 }, defs);
    el("stop", { offset: 0, class: "intro-sky-stop", "stop-opacity": 0.85 }, g);
    el("stop", { offset: 1, class: "intro-sky-stop", "stop-opacity": 0 }, g);
  };
  shade("introShadeTop", 0, 1);
  shade("introShadeBottom", 1, 0);

  // the sky stays in place, and its stars drift with the slides at a fifth of their speed, in two tiles side
  // by side so that the field never runs out
  const sky = el("rect", { class: "intro-sky", width: W, height: H }, svg);
  const stars = el("g", { class: "intro-stars" }, svg);
  {
    const tile = el("g", {}, stars), rand = rng(20111024);
    for (let i = 0; i < 260; i++) {
      const r = 0.45 + 1.3 * rand() ** 4;
      el("circle", { cx: (rand() * W).toFixed(1), cy: (rand() * H).toFixed(1), r: r.toFixed(2), opacity: (0.3 + 0.6 * rand()).toFixed(2) }, tile);
    }
    stars.appendChild(tile.cloneNode(true)).setAttribute("transform", `translate(${W} 0)`);
  }

  // glows of the close-ups: the red giant, the white dwarf and the explosion, after the supernova page
  const glow = (id, stops) => {
    const g = el("radialGradient", { id }, defs);
    for (const [o, c, a] of stops) el("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g);
  };
  glow("introGiant", [[0, "#ffc08a", 1], [0.7, "#e2703a", 1], [1, "#a8401e", 1]]);
  glow("introWd", [[0, "#ffffff", 0.9], [1, "#9fb8ff", 0]]);
  glow("introDisc", [[0, "#fff4dc", 0.35], [0.25, "#c9cfe6", 0.12], [1, "#9fb8ff", 0]]);
  glow("introBulge", [[0, "#fff1d6", 0.95], [0.6, "#ffd9a0", 0.5], [1, "#ffcf8a", 0]]);
  glow("introBoom", [[0, "#ffffff", 1], [0.35, "#fff1c4", 0.95], [0.7, "#ffa45c", 0.5], [1, "#ff6a2a", 0]]);
  glow("introGal", [[0, "#fff6e6", 0.95], [0.35, "#e9dfcc", 0.5], [1, "#c8d4ff", 0]]);

  const pts = (a) => a.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const label = (g, [x, y], et, en, attrs = {}) => {
    el("text", { x: x.toFixed(1), y: y.toFixed(1), ...attrs }, g).innerHTML = `<tspan data-l="et">${et}</tspan><tspan data-l="en">${en}</tspan>`;
  };
  // an image filling the scene, fading out towards its corners; the images are loaded only when the window
  // opens, from data-src
  const vignette = (id, inner) => {
    const grad = el("radialGradient", { id: `${id}Grad`, cx: 0.5, cy: 0.5, r: 0.71 }, defs);
    const stops = [el("stop", { offset: inner, "stop-color": "#fff" }, grad), el("stop", { offset: 1, "stop-color": "#000" }, grad)];
    el("rect", { width: W, height: H, fill: `url(#${id}Grad)` }, el("mask", { id }, defs));
    return stops;
  };
  vignette("introVignette", 0.72);
  const photo = (g, src, mask = "introVignette") =>
    el("image", { width: W, height: H, preserveAspectRatio: "xMidYMid slice", mask: `url(#${mask})`, "data-src": src }, g);
  // a small copy of an image in the lower left corner, with a ring at the object a close-up comes from;
  // returns where the ring is
  const INSET = { x: 32, y: 440, w: 224, h: 126 };
  el("rect", { x: INSET.x, y: INSET.y, width: INSET.w, height: INSET.h, rx: 6 }, el("clipPath", { id: "introInsetClip" }, defs));
  function inset(g, src, name, [fx, fy], cls) {
    const box = el("g", { class: "intro-inset" }, g);
    el("image", { x: INSET.x, y: INSET.y, width: INSET.w, height: INSET.h, preserveAspectRatio: "xMidYMid slice", "clip-path": "url(#introInsetClip)", "data-src": src }, box);
    el("rect", { class: "frame", x: INSET.x, y: INSET.y, width: INSET.w, height: INSET.h, rx: 6 }, box);
    label(box, [INSET.x, INSET.y - 10], name, name);
    const p = [INSET.x + (fx / W) * INSET.w, INSET.y + (fy / H) * INSET.h];
    el("circle", { class: `intro-ring ${cls}`, cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 9 }, box);
    return p;
  }

  // the panels, one group each, between the sky and the distance scale
  const panels = PANELS.map(() => ({ g: el("g", {}, svg) }));

  // ---- scenes 1–2: the Sun, the Earth and the parallax of a nearby star ----

  // the 3D view of the parallax page at the scale of 1 au, drawn anew in every frame
  const par = el("g", { class: "intro-par" }, panels[0].g);
  const rad = Math.PI / 180;
  const add = (a, b) => a.map((x, i) => x + b[i]);
  const sub = (a, b) => a.map((x, i) => x - b[i]);
  const mul = (a, k) => a.map((x) => x * k);
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  // ecliptic coordinates: the Earth orbits in the x-y plane; n points to the star, u to the east and N to the north
  const PB = { n: [Math.cos(PAR.beta * rad), 0, Math.sin(PAR.beta * rad)], u: [0, 1, 0], N: [-Math.sin(PAR.beta * rad), 0, Math.cos(PAR.beta * rad)] };
  const earthAt = (y) => [Math.cos(2 * Math.PI * y), Math.sin(2 * Math.PI * y), 0];
  function starAt(y) {
    const k = PAR.mu * (y - PAR.YEARS / 2) * PAR.d / PAR.D, p = PAR.phi * rad;
    return add(mul(PB.n, PAR.d), add(mul(PB.u, k * Math.sin(p)), mul(PB.N, k * Math.cos(p))));
  }
  // where the line from the Earth through the star meets the plane of the quasars
  function hitAt(y) {
    const E = earthAt(y), dir = sub(starAt(y), E);
    return add(E, mul(dir, (PAR.D - dot(PB.n, E)) / dot(PB.n, dir)));
  }
  const onPlane = (a, b) => add(mul(PB.n, PAR.D), add(mul(PB.u, a), mul(PB.N, b)));
  const prand = rng(7);
  const quasars = Array.from({ length: 34 }, () => [(prand() * 2 - 1) * (PAR.HP - 0.25), (prand() * 2 - 1) * (PAR.HP - 0.25), 0.6 + prand() * 0.8]);
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => onPlane(a * PAR.HP, b * PAR.HP));
  const loops = Array.from({ length: 200 * PAR.YEARS + 1 }, (_, i) => hitAt(i / 200));
  // the camera turned by az from behind the Sun towards the east, with the plane, the orbit and the star
  // fitted between the caption and the distance scale; tilted by k from straight above (0), where the orbit
  // is a circle round the Sun of ORB.TOP px, to that oblique view (1)
  const unit = (a) => mul(a, 1 / Math.hypot(...a));
  function parBasis(az, k) {
    const a = az * rad, f = unit(add(mul([0, 0, -1], 1 - k), mul(add(mul(PB.n, -Math.cos(a)), mul(PB.u, -Math.sin(a))), k)));
    const r = unit(cross(PB.N, f));
    return [r, cross(f, r)];
  }
  function parCamera(az, k) {
    const [r1, up1] = parBasis(az, 1);
    const box = [...corners, ...Array.from({ length: 24 }, (_, i) => earthAt(i / 24)), starAt(0), starAt(PAR.YEARS)];
    const xs = box.map((P) => dot(P, r1)), ys = box.map((P) => dot(P, up1));
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const sc1 = Math.min(1060 / (x1 - x0), 420 / (y1 - y0));
    const [r, up] = parBasis(az, k), sc = ORB.TOP + (sc1 - ORB.TOP) * k, cx = k * (x0 + x1) / 2, cy = k * (y0 + y1) / 2;
    return (P) => [W / 2 + sc * (dot(P, r) - cx), 362 - sc * (dot(P, up) - cy)];
  }

  // scene 1 from straight above, and scene 2 in the oblique view: u1 and u are counted from their starts
  function drawParallax(u1, u) {
    par.textContent = "";
    const y = PAR.YEARS * clamp((u - PAR.run[0]) / (PAR.run[1] - PAR.run[0]));
    const proj = parCamera(PAR.AZ[0] + (PAR.AZ[1] - PAR.AZ[0]) * ease(u / (SCENES[2].end - T(2))), ramp(u, ...PAR.tilt));
    const sun = proj([0, 0, 0]);
    const back = el("g", { opacity: ramp(u, ...PAR.show) }, par);
    el("polygon", { class: "plane", points: pts(corners.map(proj)) }, back);
    for (const [a, b, k] of quasars) {
      const [x, yy] = proj(onPlane(a, b)), r = 4 * k;
      el("path", { class: "quasar", d: `M${x - r} ${yy}H${x + r}M${x} ${yy - r}V${yy + r}` }, back);
    }
    const low = proj(onPlane(0, -PAR.HP));
    label(back, [low[0], low[1] + 26], "kauged kvasarid", "distant quasars", { class: "dim", "text-anchor": "middle" });
    // in scene 1 the Earth goes round once, ending where scene 2 starts it
    const E = earthAt(u < 0 ? clamp((u1 - ORB.year[0]) / (ORB.year[1] - ORB.year[0])) : y), S = starAt(y), hit = proj(hitAt(y));
    el("polyline", { class: "loops", points: pts(loops.slice(0, Math.round(y * 200) + 1).map(proj)) }, back);
    el("polyline", { class: "orbit", points: pts(Array.from({ length: 97 }, (_, i) => proj(earthAt(i / 96)))) }, par);
    const pE = proj(E), pS = proj(S);
    el("line", { class: "sight", x1: pE[0], y1: pE[1], x2: hit[0], y2: hit[1] }, back);
    el("circle", { class: "hit", cx: hit[0], cy: hit[1], r: 5 }, back);
    el("circle", { class: "sun", cx: sun[0], cy: sun[1], r: 11 }, par);
    el("circle", { class: "earth", cx: pE[0], cy: pE[1], r: 7 }, par);
    const star = [];
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 6, rr = i % 2 ? 11 / Math.sqrt(3) : 11;
      star.push([pS[0] + rr * Math.cos(a), pS[1] + rr * Math.sin(a)]);
    }
    el("polygon", { class: "star", points: pts(star) }, back);
    // the Earth is labelled away from the Sun, and the Sun away from the Earth
    const dx = pE[0] - sun[0], dy = pE[1] - sun[1], dl = Math.hypot(dx, dy) || 1;
    // the line of 1 au, drawn out from the Sun and turning with the Earth, labelled behind it, with the label
    // kept clear of the line however the line turns
    const l = ramp(u1, ...ORB.line), lo = l * (1 - ramp(u, PAR.tilt[0], PAR.tilt[0] + 0.6));
    if (lo > 0) {
      const au = el("g", { opacity: lo.toFixed(3) }, par);
      el("line", { class: "au", x1: sun[0], y1: sun[1], x2: sun[0] + dx * l, y2: sun[1] + dy * l }, au);
      const nx = dy / dl, ny = -dx / dl, off = 14 + 125 * Math.abs(nx) + 12 * Math.abs(ny);
      label(au, [sun[0] + dx / 2 + nx * off, sun[1] + dy / 2 + ny * off + 7], "1 au ≈ 150 miljonit km", "1 au ≈ 150 million km", { class: "au", "text-anchor": "middle" });
    }
    label(par, [pE[0] + (dx / dl) * 24, pE[1] + (dy / dl) * 24 + 6], "Maa", "Earth", { "text-anchor": "middle" });
    label(par, [sun[0] - (dx / dl) * 32, sun[1] - (dy / dl) * 32 + 6], "Päike", "Sun", { "text-anchor": "middle" });
    label(back, [pS[0] + 16, pS[1] - 12], "lähedane täht", "nearby star");
  }
  panels[0].draw = (t) => {
    show(par, ramp(t - T(1), ...ORB.show));
    drawParallax(t - T(1), t - T(2));
  };

  // ---- scenes 3–5: the Pleiades with Gaia ----

  // The image stays in place, and the plots move over it as a row of two panels: each plot is built in the
  // left panel and moved by SLOT.dx for each panel to the right. The bright Pleiades are dotted where they are
  // in the image (north up, east left, 2.6° wide, from tools/intro-images.sh); the fainter members and the
  // field stars are schematic, with the proper motion and the parallax of the cluster (μα* ≈ 20,
  // μδ ≈ −45 mas/a, ϖ ≈ 7.4 mas) and a spread of field stars.
  const ple = el("g", { class: "intro-plot intro-pm" }, panels[1].g);
  photo(ple, "img/intro/plejaadid.jpg");
  const pmDim = el("rect", { class: "intro-dim", width: W, height: H }, ple);
  const skyPx = (ra, dec) => {
    const [a, d, a0, d0] = [ra, dec, 56.75, 24.117].map((v) => v * rad), c = Math.cos(a - a0);
    const cosc = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * c, k = 1280 / 2.6 / rad / cosc;
    return [W / 2 - k * Math.cos(d) * Math.sin(a - a0), H / 2 - k * (Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * c)];
  };
  const SLOT = { x0: 150, x1: 570, y0: 140, y1: 500, dx: 560 };
  const PMB = { ma: -30, md: 6, k: 5 };          // 5 px per mas/a
  const HB = { p0: 5.5, p1: 9.5, bin: 0.25, h: 15 };
  const pmX = (ma) => SLOT.x0 + (ma - PMB.ma) * PMB.k, pmY = (md) => SLOT.y0 + (PMB.md - md) * PMB.k;
  const hX = (p) => SLOT.x0 + ((p - HB.p0) / (HB.p1 - HB.p0)) * (SLOT.x1 - SLOT.x0);
  const binW = hX(HB.p0 + HB.bin) - hX(HB.p0);
  const CLUMP = [pmX(20), pmY(-45)];
  const pmStars = [], cmdExtra = [];
  // the colour–magnitude diagram, G against G_BP − G_RP: the sequence of the Pleiades in G as [colour, G],
  // after the Gaia DR2 HR diagrams (Babusiaux et al. 2018), and the axes
  const PLE_SEQ = [[-0.06, 2.9], [-0.04, 4.3], [-0.01, 5.5], [0.05, 6.4], [0.2, 7.4], [0.4, 8.4], [0.6, 9.3], [0.82, 10.3],
    [1, 11.3], [1.4, 12.9], [1.85, 14], [2.3, 15], [2.8, 16.6], [3.1, 17.8], [3.25, 18.6]];
  const CMDB = { c0: -0.5, c1: 3.5, G0: 2, G1: 19 };
  const cmdXY = (c, G) => [SLOT.x0 + ((c - CMDB.c0) / (CMDB.c1 - CMDB.c0)) * (SLOT.x1 - SLOT.x0), SLOT.y0 + ((G - CMDB.G0) / (CMDB.G1 - CMDB.G0)) * (SLOT.y1 - SLOT.y0)];
  function pleC(G) {
    const i = Math.max(1, PLE_SEQ.findIndex(([, g]) => g >= G));
    const [c0, g0] = PLE_SEQ[i - 1], [c1, g1] = PLE_SEQ[i];
    return c0 + ((c1 - c0) * (G - g0)) / (g1 - g0);
  }
  // a field star: a main-sequence star 0.8–5 mag fainter than the cluster's at its colour, reddened with
  // distance, or a giant of the red clump and branch; kept inside the plot
  function fieldCG(r, gauss) {
    for (;;) {
      let c, G;
      if (r() < 0.07) { c = 1.15 + 0.05 * gauss(); G = 10.5 + 4 * r(); }
      else if (r() < 0.05) { c = 1.2 + 0.6 * r(); G = 12.5 - 4 * (c - 1.2) + 2 * r(); }
      else {
        const g = 4 + 13 * r() ** 0.6, dm = 0.8 + 4.2 * r() ** 0.8, e = (0.03 + 0.07 * r()) * dm;
        c = pleC(g) + e + 0.05 * gauss(); G = g + dm + 2 * e;
      }
      if (G < CMDB.G1 - 0.2 && c < CMDB.c1 - 0.05) return [c, G];
    }
  }
  {
    const r = rng(445), gauss = () => (r() + r() + r() + r() - 2) * 1.22;
    const bright = [[56.8712, 24.1051], [57.2906, 24.0534], [56.2189, 24.1133], [56.4566, 24.3678], [56.5816, 23.9483],
      [56.3021, 24.4672], [57.2968, 24.1367], [56.2007, 24.2894], [56.4769, 24.5545], [56.4513, 24.8372]];
    // the members lie on the sequence of the cluster in the colour–magnitude diagram, the bright ones of the
    // image at the top, and the field stars are main-sequence stars behind the cluster, fainter and redder for
    // their distance and reddening, and some giants
    for (let i = 0; i < 28; i++) {
      const sky = i < bright.length ? skyPx(...bright[i]) : [W / 2 + gauss() * 150, H / 2 + gauss() * 110];
      const G = i < bright.length ? 2.9 + 2.8 * (i / 9) ** 1.3 : 6.2 + 10.8 * ((i - 10) / 17) ** 1.1;
      pmStars.push({ sky, v: [20 + 1.6 * gauss(), -45 + 1.6 * gauss()], plx: 7.36 + 0.3 * gauss(), member: true, r: i < bright.length ? 6 : 4.5,
        G, cmd: cmdXY(pleC(G) + 0.02 * gauss(), G) });
    }
    while (pmStars.length < 92) {
      const v = [2 + 17 * gauss(), -18 + 15 * gauss()], p = [pmX(v[0]), pmY(v[1])];
      if (p[0] < SLOT.x0 + 8 || p[0] > SLOT.x1 - 8 || p[1] < SLOT.y0 + 8 || p[1] > SLOT.y1 - 8 || Math.hypot(p[0] - CLUMP[0], p[1] - CLUMP[1]) < 55) continue;
      const [c, G] = fieldCG(r, gauss);
      pmStars.push({ sky: [40 + r() * (W - 80), 150 + r() * 420], v, member: false, r: 3.5, G, cmd: cmdXY(c, G) });
    }
    // the diagram has many more stars than the image shows: the faint members, a fifth of them binaries of two
    // similar stars up to 0.75 mag brighter, and the field
    for (let i = 0; i < 150; i++) {
      const G = 6 + 12.2 * r() ** 0.7, c = pleC(G) + 0.025 * gauss();
      cmdExtra.push({ member: true, G, cmd: cmdXY(c, G - (r() < 0.2 ? 0.4 + 0.35 * r() : 0)) });
    }
    for (let i = 0; i < 260; i++) {
      const [c, G] = fieldCG(r, gauss);
      cmdExtra.push({ member: false, G, cmd: cmdXY(c, G) });
    }
    const members = [...pmStars, ...cmdExtra].filter((s) => s.member).sort((a, b) => a.G - b.G);
    members.forEach((s, i) => (s.rank = i / (members.length - 1)));
    // the members stack in the bins of the histogram by their parallax
    const stack = {};
    for (const s of pmStars.filter((s) => s.member).sort((a, b) => a.plx - b.plx)) {
      const b = Math.floor((s.plx - HB.p0) / HB.bin);
      stack[b] = (stack[b] || 0) + 1;
      s.block = [hX(HB.p0 + b * HB.bin), SLOT.y1 - stack[b] * HB.h];
    }
    // they drop in layer by layer from the bottom, so that no block floats
    pmStars.filter((s) => s.member).sort((a, b) => b.block[1] - a.block[1] || a.block[0] - b.block[0]).forEach((s, i, a) => (s.order = i / a.length));
  }
  const plotBox = (g) => el("rect", { class: "panel", x: SLOT.x0 - 70, y: SLOT.y0 - 30, width: SLOT.x1 - SLOT.x0 + 100, height: SLOT.y1 - SLOT.y0 + 108, rx: 10 }, g);
  const corner = (g) => el("path", { class: "axis", d: `M${SLOT.x0} ${SLOT.y0} V${SLOT.y1} H${SLOT.x1}` }, g);
  // the proper motions, with the lasso round the clump of the cluster
  const pmPlot = el("g", {}, ple);
  plotBox(pmPlot);
  corner(pmPlot);
  label(pmPlot, [(SLOT.x0 + SLOT.x1) / 2, SLOT.y1 + 34], "omaliikumine μα*", "proper motion μα*", { "text-anchor": "middle", class: "dim" });
  label(pmPlot, [SLOT.x0 - 22, (SLOT.y0 + SLOT.y1) / 2], "μδ", "μδ", { "text-anchor": "middle", class: "dim" });
  const lassoPath = (() => {
    const p = [];
    for (let i = 0; i <= 60; i++) {
      const a = (i / 60) * 2 * Math.PI, k = 1 + 0.1 * Math.sin(3 * a + 1) + 0.05 * Math.sin(5 * a);
      p.push([CLUMP[0] + 38 * k * Math.cos(a), CLUMP[1] + 33 * k * Math.sin(a)]);
    }
    return "M" + pts(p).replaceAll(" ", " L") + "Z";
  })();
  const lasso = el("path", { class: "lasso", d: lassoPath, pathLength: 1 }, pmPlot);
  // the colour–magnitude diagram, G against G_BP − G_RP, brighter up
  const cmdPlot = el("g", {}, ple);
  plotBox(cmdPlot);
  corner(cmdPlot);
  el("text", { x: (SLOT.x0 + SLOT.x1) / 2, y: SLOT.y1 + 34, "text-anchor": "middle", class: "dim" }, cmdPlot).innerHTML =
    `G<tspan class="sub" dy="5">BP</tspan><tspan dy="-5"> − G</tspan><tspan class="sub" dy="5">RP</tspan>`;
  label(cmdPlot, [SLOT.x0, SLOT.y0 - 10], "G", "G", { "text-anchor": "middle", class: "dim" });
  for (const c of [0, 1, 2, 3]) {
    const [x] = cmdXY(c, 0);
    el("line", { class: "axis", x1: x, y1: SLOT.y1, x2: x, y2: SLOT.y1 + 6 }, cmdPlot);
    label(cmdPlot, [x, SLOT.y1 + 24], String(c), String(c), { "text-anchor": "middle", class: "dim tick" });
  }
  for (const G of [5, 10, 15]) {
    const [, y] = cmdXY(0, G);
    el("line", { class: "axis", x1: SLOT.x0 - 6, y1: y, x2: SLOT.x0, y2: y }, cmdPlot);
    label(cmdPlot, [SLOT.x0 - 10, y + 6], String(G), String(G), { "text-anchor": "end", class: "dim tick" });
  }
  // the parallax histogram, with the blocks of the selected stars and the readout
  const hPlot = el("g", {}, ple);
  plotBox(hPlot);
  corner(hPlot);
  for (const p of [6, 7, 8, 9]) {
    el("line", { class: "axis", x1: hX(p), y1: SLOT.y1, x2: hX(p), y2: SLOT.y1 + 7 }, hPlot);
    label(hPlot, [hX(p), SLOT.y1 + 30], String(p), String(p), { "text-anchor": "middle", class: "dim" });
  }
  label(hPlot, [(SLOT.x0 + SLOT.x1) / 2, SLOT.y1 + 62], "parallaks ϖ (mas)", "parallax ϖ (mas)", { "text-anchor": "middle" });
  const pmRead = el("g", {}, hPlot);
  const PLX_MEAN = 7.4;
  el("line", { class: "fit", x1: hX(PLX_MEAN), y1: SLOT.y1, x2: hX(PLX_MEAN), y2: SLOT.y0 + 70, "stroke-dasharray": "6 6" }, pmRead);
  label(pmRead, [hX(PLX_MEAN) + 14, SLOT.y0 + 20], "ϖ ≈ 7,4 mas", "ϖ ≈ 7.4 mas", { class: "dim" });
  label(pmRead, [hX(PLX_MEAN) + 14, SLOT.y0 + 58], "d ≈ 135 pc", "d ≈ 135 pc", { class: "read" });
  const arrows = el("path", { class: "arrows" }, ple);
  // the dots of the diagram are larger for the brighter stars; the extra ones go below the others
  const cmdR = (G) => (1.5 + 2.6 * clamp((CMDB.G1 - G) / (CMDB.G1 - CMDB.G0)) ** 1.5).toFixed(2);
  for (const s of cmdExtra) s.cmdDot = el("circle", { class: "star", cx: s.cmd[0].toFixed(1), cy: s.cmd[1].toFixed(1), r: cmdR(s.G) }, cmdPlot);
  for (const s of pmStars) {
    if (s.member) s.rect = el("rect", { class: "block", x: s.block[0], y: s.block[1], width: binW, height: HB.h }, hPlot);
    s.cmdDot = el("circle", { class: "star", cx: s.cmd[0].toFixed(1), cy: s.cmd[1].toFixed(1), r: cmdR(s.G) }, cmdPlot);
    s.dot = el("circle", { class: "star", r: s.r }, ple);
    if (s.member) s.copy = el("circle", { class: "star sel", r: s.r * 0.7 }, ple);
  }
  // the label of the main sequence, over the stars of the diagram
  const cmdName = el("g", {}, cmdPlot);
  label(cmdName, [cmdXY(1.9, 0)[0], cmdXY(0, 11.6)[1]], "peajada", "main sequence", { class: "halo" });

  function drawGaia(t) {
    const u3 = t - T(3), u4 = t - T(4), u5 = t - T(5);
    // where each plot is in the row: 0 the left panel, 1 the right one; it comes in from beyond the right edge
    // and leaves past the left one
    const r4 = ramp(u4, ...ROW), r5 = ramp(u5, ...ROW);
    const pos = { pm: 2.2 - 1.2 * ramp(u3, ...PM.in) - r4 - 1.1 * r5, cmd: 2.2 - 1.2 * r4 - r5, h: 2.2 - 1.2 * r5 };
    const ox = {};
    for (const [k, g] of [["pm", pmPlot], ["cmd", cmdPlot], ["h", hPlot]]) {
      ox[k] = pos[k] * SLOT.dx;
      g.setAttribute("transform", `translate(${ox[k].toFixed(1)} 0)`);
      show(g, pos[k] < 2.19 && pos[k] > -1.09 ? 1 : 0);
    }
    const a = ramp(u3, ...PM.dots), m = ramp(u3, ...PM.move), sel = ramp(u3, ...PM.sel);
    show(pmDim, 0.45 * a);
    // the arrows grow with the proper motion, east to the left and north up, and shrink into the dots as
    // they fly into the plot
    let d = "";
    for (const s of pmStars) {
      const p = [s.sky[0] + (pmX(s.v[0]) + ox.pm - s.sky[0]) * m, s.sky[1] + (pmY(s.v[1]) - s.sky[1]) * m];
      const len = a * (1 - m) * 1.1, e = [p[0] - s.v[0] * len, p[1] - s.v[1] * len];
      if (len > 0.05) {
        const ux = (e[0] - p[0]) / Math.hypot(...s.v) / len, uy = (e[1] - p[1]) / Math.hypot(...s.v) / len, h = 7 * a * (1 - m);
        d += `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${e[0].toFixed(1)} ${e[1].toFixed(1)}` +
          `M${(e[0] - h * ux - h * 0.5 * uy).toFixed(1)} ${(e[1] - h * uy + h * 0.5 * ux).toFixed(1)}L${e[0].toFixed(1)} ${e[1].toFixed(1)}` +
          `L${(e[0] - h * ux + h * 0.5 * uy).toFixed(1)} ${(e[1] - h * uy - h * 0.5 * ux).toFixed(1)}`;
      }
      // copies of the selected stars drop one after another from the colour–magnitude diagram into their
      // bins, where they become blocks
      if (s.member) {
        const u = clamp((u5 - PLX.drop[0] - s.order * (PLX.drop[1] - PLX.drop[0] - 0.35)) / 0.35);
        const from = [s.cmd[0] + ox.cmd, s.cmd[1]], to = [s.block[0] + binW / 2 + ox.h, s.block[1] + HB.h / 2], k = ease(u);
        set(s.copy, { cx: (from[0] + (to[0] - from[0]) * k).toFixed(1), cy: (from[1] + (to[1] - from[1]) * k - 60 * Math.sin(Math.PI * k)).toFixed(1) });
        show(s.copy, u > 0 && u < 1 ? 1 : 0);
        show(s.rect, u >= 1 ? 1 : 0);
        s.dot.setAttribute("class", sel > 0.5 ? "star sel" : "star");
        s.cmdDot.setAttribute("class", u4 >= CMD.sel[0] + s.rank * (CMD.sel[1] - CMD.sel[0]) ? "star sel" : "star");
      }
      set(s.dot, { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: s.r * (0.6 + 0.4 * a) * (1 - 0.3 * m) });
      show(s.dot, a);
    }
    for (const s of cmdExtra) if (s.member) s.cmdDot.setAttribute("class", u4 >= CMD.sel[0] + s.rank * (CMD.sel[1] - CMD.sel[0]) ? "star sel" : "star");
    arrows.setAttribute("d", d);
    const l = clamp((u3 - PM.lasso[0]) / (PM.lasso[1] - PM.lasso[0]));
    show(lasso, l > 0 ? 1 : 0);
    set(lasso, { "stroke-dasharray": `${l} 1`, "fill-opacity": 0.14 * ramp(u3, PM.lasso[1] - 0.1, PM.sel[1]) });
    show(cmdName, ramp(u4, CMD.name, CMD.name + 0.3));
    show(pmRead, ramp(u5, ...PLX.read));
  }
  panels[1].draw = drawGaia;

  // ---- scene 6: the clusters around the Sun ----

  // The Milky Way around the Sun seen from the north, MAP.k px per kpc, the Sun at MAP.sun and the Galactic
  // centre R0 kpc straight up. The arms are logarithmic spirals after Reid et al. (2019), each a band of seeded
  // stars: dots of a fixed size, zero-length strokes. The clusters are those of part 2 that fit in the map, at
  // their galactic longitude and the distance of their Cepheid from the period–luminosity relation, with the
  // Pleiades first; the faint grey dots are schematic clusters along the arms.
  const MAP = { k: 120, sun: [640, 372], R0: 8.15, lines: 1.4, step: 0.2, draw: 0.3, ring: [4, 4.3] };
  // heliocentric kpc, x towards the Galactic centre and y towards l = 90°, to the screen
  const mapXY = ([x, y]) => [MAP.sun[0] - MAP.k * y, MAP.sun[1] - MAP.k * x];
  const inMap = ([X, Y]) => X > 8 && X < W - 8 && Y > 8 && Y < H - 8;
  // a point at galactocentric radius R and azimuth b (degrees from the Sun towards l = 90°)
  const gcXY = (R, b) => mapXY([MAP.R0 - R * Math.cos(b * rad), R * Math.sin(b * rad)]);
  const ARMS = [
    { R: 6.04, b: 24, pitch: 17.1, w: 0.2, n: 1300 },     // Sagittarius–Carina
    { R: 8.26, b: 8.9, pitch: 11.4, w: 0.15, n: 800 },    // Orion spur, the local arm
    { R: 8.87, b: 40, pitch: 10.3, w: 0.2, n: 1300 },     // Perseus
  ];
  const armR = (a, b) => a.R * Math.exp(-((b - a.b) * rad) * Math.tan(a.pitch * rad));
  // l (degrees), d (kpc), the label's offset and anchor; the line of NGC 6087 gets its distance
  const CLUSTERS = [
    { et: "Plejaadid", en: "Pleiades", l: 166.6, d: 0.135, at: [14, 22], read: ["135 pc", "135 pc"] },
    { et: "NGC 6087", en: "NGC 6087", l: 327.8, d: 0.94, at: [14, 6] },
    { et: "UBC 129", en: "UBC 129", l: 63.7, d: 1.08, at: [-10, 22], anchor: "end" },
    { et: "FSR 0951", en: "FSR 0951", l: 196.6, d: 1.7, at: [-12, 6], anchor: "end" },
    { et: "vdBergh 1", en: "vdBergh 1", l: 208.6, d: 1.8, at: [12, 6] },
    { et: "NGC 129", en: "NGC 129", l: 120.3, d: 1.8, at: [-12, 6], anchor: "end" },
    { et: "NGC 6067", en: "NGC 6067", l: 329.7, d: 1.94, at: [14, 6] },
    { et: "UBC 130", en: "UBC 130", l: 64.0, d: 2.15, at: [0, -14], anchor: "middle" },
    { et: "Lynga 6", en: "Lynga 6", l: 330.4, d: 2.41, at: [14, 6] },
    { et: "Berkeley 84", en: "Berkeley 84", l: 71.0, d: 2.48, at: [-12, 6], anchor: "end" },
    { et: "NGC 7790", en: "NGC 7790", l: 116.6, d: 3.27, at: [-12, 6], anchor: "end" },
    { et: "Ruprecht 79", en: "Ruprecht 79", l: 277.1, d: 3.75, at: [12, 6] },
  ].map((c) => ({ ...c, p: mapXY([c.d * Math.cos(c.l * rad), c.d * Math.sin(c.l * rad)]) }));
  const map = el("g", { class: "intro-map" }, panels[2].g);
  {
    const r = rng(6087), gauss = () => (r() + r() + r() - 1.5) * 1.15;
    const cls = [[], [], []], field = [];
    for (const a of ARMS) {
      for (let i = 0; i < a.n; i++) {
        const b = -70 + 140 * r(), P = gcXY(armR(a, b) + a.w * gauss(), b + 0.6 * gauss());
        if (inMap(P)) cls[Math.floor(r() * 2.99)].push(`M${P[0].toFixed(1)} ${P[1].toFixed(1)}h0`);
      }
    }
    cls.forEach((c, i) => el("path", { class: `arms s${i}`, d: c.join("") }, map));
    // the grey clusters, mostly along the arms, kept clear of the named ones
    while (field.length < 130) {
      const a = ARMS[Math.floor(r() * 3)], b = -40 + 80 * r();
      const P = r() < 0.75 ? gcXY(armR(a, b) + 1.4 * a.w * gauss(), b) : [40 + r() * (W - 80), 40 + r() * (H - 80)];
      if (inMap(P) && CLUSTERS.every((c) => Math.hypot(c.p[0] - P[0], c.p[1] - P[1]) > 26)) field.push(P);
    }
    for (const P of field) el("circle", { class: "field", cx: P[0].toFixed(1), cy: P[1].toFixed(1), r: 3.5 }, map);
  }
  // the direction to the Galactic centre, at the left edge
  el("path", { class: "gc", d: "M92 330 V210 M84 222 L92 208 L100 222" }, map);
  label(map, [108, 222], "Linnutee keskme suunas", "towards the Galactic centre", { class: "dim" });
  const mapLines = el("g", {}, map);
  for (const c of CLUSTERS) {
    c.line = el("line", { class: "line", x1: MAP.sun[0], y1: MAP.sun[1] }, mapLines);
    c.g = el("g", {}, map);
    el("circle", { class: "cl", cx: c.p[0].toFixed(1), cy: c.p[1].toFixed(1), r: 5 }, c.g);
    label(c.g, [c.p[0] + c.at[0], c.p[1] + c.at[1]], c.et, c.en, { "text-anchor": c.anchor || "start" });
    if (c.read) label(c.g, [c.p[0] + c.at[0], c.p[1] + c.at[1] + 22], ...c.read, { class: "dist" });
  }
  el("circle", { class: "sun", cx: MAP.sun[0], cy: MAP.sun[1], r: 9 }, map);
  label(map, [MAP.sun[0] - 16, MAP.sun[1] - 10], "Päike", "Sun", { "text-anchor": "end" });
  // NGC 6087 with its Cepheid, and the distance on its line
  const sNor = el("g", {}, map), c6087 = CLUSTERS[1];
  el("circle", { class: "intro-ring", cx: c6087.p[0].toFixed(1), cy: c6087.p[1].toFixed(1), r: 14 }, sNor);
  label(sNor, [c6087.p[0] + 14, c6087.p[1] + 28], "S Nor", "S Nor", { class: "cep" });
  const mid = [(MAP.sun[0] + c6087.p[0]) / 2, (MAP.sun[1] + c6087.p[1]) / 2];
  label(sNor, [mid[0] - 12, mid[1] + 8], "0,94 kpc", "0.94 kpc", { class: "dist", "text-anchor": "end" });
  panels[2].draw = (t) => {
    const u = t - T(6);
    CLUSTERS.forEach((c, i) => {
      const k = ramp(u, MAP.lines + MAP.step * i, MAP.lines + MAP.step * i + MAP.draw);
      show(c.line, k);
      set(c.line, { x2: (MAP.sun[0] + (c.p[0] - MAP.sun[0]) * k).toFixed(1), y2: (MAP.sun[1] + (c.p[1] - MAP.sun[1]) * k).toFixed(1) });
      show(c.g, clamp((k - 0.8) / 0.2));
    });
    show(sNor, ramp(u, ...MAP.ring));
  };

  // ---- scene 7: a Cepheid pulsates ----

  // S Nor close up, after the Cepheid page: the light curve has a slow decline and a fast rise (−0.5 at
  // maximum light, phase 0), and the radius is the integral of the outward velocity, which mirrors the light
  // curve. In the corner is the image of NGC 6087 it comes from.
  const cep = el("g", { class: "intro-cep" }, panels[3].g);
  const cepStar = el("g", {}, cep);
  const cepRing = inset(cep, "img/intro/ngc6087.jpg", "NGC 6087", S_NOR_PX, "");
  function dmT(phi) {
    phi = ((phi % 1) + 1) % 1;
    const u = phi < 0.8 ? (0.5 * phi) / 0.8 : 0.5 + (0.5 * (phi - 0.8)) / 0.2;
    return -Math.cos(2 * Math.PI * u) / 2;
  }
  const RTAB = [];
  for (let i = 0, r = 0; i <= 200; i++) { RTAB.push(r); r -= dmT((i + 0.5) / 200) / 200; }
  {
    const m = RTAB.reduce((a, v) => a + v, 0) / RTAB.length, k = Math.max(...RTAB.map((v) => Math.abs(v - m)));
    RTAB.forEach((v, i) => (RTAB[i] = (v - m) / k));
  }
  const rShape = (phi) => RTAB[Math.round((((phi % 1) + 1) % 1) * 200)];
  // the colour of a star of temperature T
  function tColour(T) {
    const stops = [[4000, [255, 160, 80]], [5000, [255, 200, 130]], [6000, [255, 230, 195]], [7000, [250, 246, 255]]];
    let i = 1;
    while (i < stops.length - 1 && T > stops[i][0]) i++;
    const [T0, c0] = stops[i - 1], [T1, c1] = stops[i], f = clamp((T - T0) / (T1 - T0));
    return `rgb(${c0.map((c, k) => Math.round(c + f * (c1[k] - c))).join(",")})`;
  }
  function drawCepheid(t) {
    const u = t - T(7), g = cepStar;
    g.textContent = "";
    const phase = (u - CEPH.t0) / CEPH.CYCLE, dm = dmT(phase);
    const R = 120 * (1 + 0.12 * rShape(phase)), col = tColour(5600 * (1 - 0.2 * dm));
    // a thin line from the ring in the image to the star
    const lx = W / 2 - cepRing[0], ly = H / 2 - cepRing[1], ll = Math.hypot(lx, ly);
    el("line", { class: "lead", x1: cepRing[0] + (lx * 10) / ll, y1: cepRing[1] + (ly * 10) / ll, x2: W / 2 - (lx * R * 1.05) / ll, y2: H / 2 - (ly * R * 1.05) / ll }, g);
    for (const [k, a] of [[1.35, 0.08], [1.15, 0.16]]) el("circle", { cx: W / 2, cy: H / 2, r: R * k, fill: col, opacity: (a * (1 - dm)).toFixed(3) }, g);
    el("circle", { cx: W / 2, cy: H / 2, r: R, fill: col }, g);
    label(g, [W / 2, H / 2 + 175], "S Nor", "S Nor", { "text-anchor": "middle", class: "name" });
    // the light curve, brighter up, traced from trace[0] on; the period is marked between two maxima
    const X0 = 850, X1 = 1190, Y0 = 360, A = 150, N = 2.4;
    const p0 = (CEPH.trace[0] - CEPH.t0) / CEPH.CYCLE, pNow = Math.min(phase, (CEPH.trace[1] - CEPH.t0) / CEPH.CYCLE);
    const x = (p) => X0 + ((p - p0) / N) * (X1 - X0), y = (p) => Y0 + A * dmT(p);
    const axes = el("g", { opacity: ramp(u, CEPH.trace[0] - 0.4, CEPH.trace[0]) }, g);
    el("path", { class: "axis", d: `M${X0 - 14} ${Y0 + 110} V${Y0 - 120} M${X0 - 20} ${Y0 - 110} L${X0 - 14} ${Y0 - 122} L${X0 - 8} ${Y0 - 110}` }, axes);
    el("path", { class: "axis", d: `M${X0 - 14} ${Y0 + 110} H${X1 + 10}` }, axes);
    label(axes, [X0 - 22, Y0 - 128], "heledus", "brightness", { "text-anchor": "start", class: "dim" });
    label(axes, [X1 + 10, Y0 + 136], "aeg", "time", { "text-anchor": "end", class: "dim" });
    if (pNow > p0) {
      const curve = [];
      for (let p = p0; p < pNow; p += 0.01) curve.push([x(p), y(p)]);
      curve.push([x(pNow), y(pNow)]);
      el("polyline", { class: "curve", points: pts(curve) }, g);
      el("circle", { class: "dot", cx: x(pNow), cy: y(pNow), r: 7 }, g);
    }
    const m1 = Math.ceil(p0), m2 = m1 + 1, br = el("g", { opacity: ramp(u, CEPH.t0 + m2 * CEPH.CYCLE, CEPH.t0 + m2 * CEPH.CYCLE + 0.4) }, g);
    const yb = Y0 - A / 2 - 22;
    el("path", { class: "bracket", d: `M${x(m1)} ${yb + 10} V${yb} H${x(m2)} V${yb + 10}` }, br);
    label(br, [(x(m1) + x(m2)) / 2, yb - 12], `P = ${String(CEPH.P).replace(".", ",")} p`, `P = ${CEPH.P} d`, { "text-anchor": "middle" });
  }
  panels[3].draw = drawCepheid;

  // ---- scene 8: Cepheids in M101 ----

  // the Cepheids in its arms, each a ring and a pulsing dot; scene 10 has a copy of them next to SN 2011fe
  const M101_CEPS = [[465, 330], [582, 238], [842, 312], [762, 522], [548, 470]];
  const cepheids = (g) => M101_CEPS.map(([x, y]) => {
    const c = el("g", {}, g);
    return { g: c, ring: el("circle", { class: "intro-ring", cx: x, cy: y, r: 15 }, c), dot: el("circle", { class: "pt", cx: x, cy: y }, c) };
  });
  const pulse = (v) => (4 + (v > 0 ? 3.5 * Math.max(0, Math.sin((2 * Math.PI * v) / 1.2)) : 0)).toFixed(2);
  const m101 = el("g", { class: "intro-plot intro-m101" }, panels[4].g);
  photo(m101, "img/intro/m101.jpg");
  const m101Ceps = cepheids(m101);
  const cepName = el("g", {}, m101);
  label(cepName, [M101_CEPS[0][0], M101_CEPS[0][1] - 34], "tsefeiid", "Cepheid", { "text-anchor": "middle" });
  const m101Read = el("g", {}, m101);
  label(m101Read, [150, 200], "M101", "M101", { class: "dim" });
  label(m101Read, [150, 236], "periood → heledus → kaugus", "period → luminosity → distance", { class: "dim" });
  label(m101Read, [150, 280], "d ≈ 7 Mpc", "d ≈ 7 Mpc", { class: "read" });
  panels[4].draw = (t) => {
    const u = t - T(8);
    m101Ceps.forEach((c, i) => {
      const s = M101C.blink + M101C.step * i;
      show(c.g, ramp(u, s, s + 0.15));
      c.dot.setAttribute("r", pulse(u - s));
    });
    show(cepName, ramp(u, M101C.blink, M101C.blink + 0.3));
    show(m101Read, ramp(u, ...M101C.read));
  };

  // ---- scene 9: a white dwarf explodes ----

  // SN 2011fe close up, after the supernova page: a red giant fills its Roche lobe and loses gas through the
  // inner Lagrange point onto a white dwarf, which grows, ignites and explodes. In the corner is the image of
  // M101, with the place of the supernova.
  const sn = el("g", { class: "intro-sn" }, panels[5].g);
  const snBinary = el("g", {}, sn);
  inset(sn, "img/intro/m101.jpg", "M101", SN_PX, "sn");
  const debris = (() => { const r = rng(5); return Array.from({ length: 50 }, () => [r() * 2 * Math.PI, 0.5 + 0.5 * r(), r() < 0.5]); })();
  function drawSupernova(t) {
    const u = t - T(9), g = snBinary, cx = W / 2, cy = H / 2;
    g.textContent = "";
    const e = clamp((u - SNIA.boom[0]) / (SNIA.boom[1] - SNIA.boom[0]));
    el("ellipse", { cx: cx - 250, cy, rx: 150, ry: 140, fill: "url(#introGiant)" }, g);
    if (e < 0.15) {
      const before = el("g", { opacity: 1 - e / 0.15 }, g);
      // the disc seen at a slant, and the stream in its plane from L1 round to the near rim
      el("ellipse", { class: "disc", cx, cy, rx: 62, ry: 15 }, before);
      const P0 = [-150, 0], P1 = [-70, 110], P2 = [62 * Math.cos(1.75), 62 * Math.sin(1.75)], kv = 15 / 62;
      const bez = (v) => [cx + (1 - v) ** 2 * P0[0] + 2 * v * (1 - v) * P1[0] + v * v * P2[0], cy + kv * ((1 - v) ** 2 * P0[1] + 2 * v * (1 - v) * P1[1] + v * v * P2[1])];
      el("polyline", { class: "stream", points: pts(Array.from({ length: 25 }, (_, i) => bez(i / 24))) }, before);
      for (let k = 0; k < 9; k++) {
        const p = bez((k / 9 + Math.max(0, u) * 0.35) % 1);
        el("circle", { class: "blob", cx: p[0], cy: p[1], r: 2.6 }, before);
      }
      el("circle", { cx, cy, r: 26, fill: "url(#introWd)" }, before);
      el("circle", { class: u >= SNIA.ignite ? "wd lit" : "wd", cx, cy, r: 7 }, before);
      const names = el("g", { opacity: 1 - ramp(u, SNIA.ignite, SNIA.boom[0]) }, before);
      label(names, [cx - 250, cy + 180], "punane hiid", "red giant", { "text-anchor": "middle" });
      label(names, [cx + 20, cy + 52], "valge kääbus", "white dwarf");
      const M = 1.3 + 0.08 * ramp(u, ...SNIA.gain);
      label(names, [cx + 20, cy + 76], `${M.toFixed(2).replace(".", ",")} M☉`, `${M.toFixed(2)} M☉`, { class: "dim" });
    }
    if (e > 0) {
      const r = 12 + 560 * Math.sqrt(e);
      el("circle", { cx, cy, r, fill: "url(#introBoom)", opacity: clamp(1.4 - e, 0.3, 1) }, g);
      for (const [a, k, warm] of debris) el("circle", { class: warm ? "spark warm" : "spark", cx: cx + r * k * Math.cos(a), cy: cy + r * k * Math.sin(a), r: 2.4 }, g);
    }
  }
  panels[5].draw = drawSupernova;

  // ---- scene 10: supernovae, and the camera's one move ----

  // The camera's world: the M101 image, which fills the scene at the distance of M101, the near field of
  // galaxies around it, where the Milky Way is a small spiral to the lower left of M101, and the far field
  // where the supernovae flash, each scaled by the camera as it pulls out. Each galaxy is a soft ellipse.
  const world = el("g", {}, panels[6].g);
  const far = { d: FAR, g: el("g", { class: "intro-gal" }, world) };
  // the near field fades out before the camera reaches the far one
  const gal = { d: GAL, fade: [0.7, -1.2], g: el("g", { class: "intro-gal" }, world) };
  const G_MW = [W / 2, H / 2], G_M101 = [985, 245];
  const mw = { d: MWL, home: G_MW, g: el("g", { class: "intro-mw" }, world) };
  // the M101 image fades out towards its edges: at full size only in the corners, and the more it shrinks,
  // the more, so that a small image is a soft round patch rather than a rectangle
  const [snInner, snOuter] = vignette("introVignetteSn", 0.72);
  const snImg = { d: M101, home: G_M101, g: el("g", {}, world), inner: snInner, outer: snOuter };
  photo(snImg.g, "img/intro/m101.jpg", "introVignetteSn");
  // the Milky Way seen from above, 12 px per kpc at MWL; its arms are four logarithmic spirals of seeded
  // stars, dots of a fixed size on the screen (zero-length strokes that do not scale), in three classes of size
  {
    const KPC = 12;
    el("circle", { r: 16 * KPC, fill: "url(#introDisc)" }, mw.g);
    const r = rng(1931), cls = [[], [], []];
    for (let k = 0; k < 4; k++) {
      for (let i = 0; i < 380; i++) {
        const R = 3 + 12 * r() ** 0.8, th = (k * Math.PI) / 2 + 0.6 + Math.log(R / 3) / Math.tan(0.33);
        const g = () => (r() + r() + r() - 1.5) * 0.9;
        cls[Math.floor(r() * 2.99)].push(`M${((R * Math.cos(th) + g()) * KPC).toFixed(1)} ${((R * Math.sin(th) + g()) * KPC).toFixed(1)}h0`);
      }
    }
    cls.forEach((c, i) => el("path", { class: `arms s${i}`, d: c.join("") }, mw.g));
    el("ellipse", { rx: 3.2 * KPC, ry: 1.6 * KPC, transform: "rotate(-30)", fill: "url(#introBulge)" }, mw.g);
  }
  const galaxy = (g, x, y, rx, ry, a) => el("ellipse", { cx: x.toFixed(1), cy: y.toFixed(1), rx: rx.toFixed(1), ry: ry.toFixed(1),
    transform: `rotate(${a.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})`, fill: "url(#introGal)" }, g);
  {
    const r = rng(101);
    for (let n = 0; n < 24;) {
      const x = 40 + r() * (W - 80), y = 150 + r() * 420, rx = 7 + 18 * r() ** 2;
      if (Math.hypot(x - G_MW[0], y - G_MW[1]) < 80 || Math.hypot(x - G_M101[0], y - G_M101[1]) < 150) continue;
      galaxy(gal.g, x, y, rx, rx * (0.3 + 0.7 * r()), r() * 180);
      n++;
    }
  }
  // the far field covers the scene and a margin; the hosts of the supernovae are among its larger galaxies
  // inside the scene, in a random order
  const hosts = [];
  {
    const r = rng(1987);
    for (let i = 0; i < 320; i++) {
      const x = -40 + r() * (W + 80), y = -40 + r() * (H + 80), rx = 1.6 + 4.4 * r() ** 3;
      galaxy(far.g, x, y, rx, rx * (0.35 + 0.65 * r()), r() * 180).setAttribute("opacity", (0.45 + 0.55 * r()).toFixed(2));
      if (rx > 2.6 && Math.abs(x - W / 2) < 440 && y > 170 && y < 540 && hosts.every((h) => Math.hypot(h[0] - x, h[1] - y) > 110)) hosts.push([x, y]);
    }
    hosts.splice(12);
    hosts.sort(() => r() - 0.5);
  }
  const flashes = hosts.map(([x, y]) => {
    const g = el("g", { class: "flash" }, far.g);
    return { g, x, y, halo: el("circle", { class: "halo", cx: x, cy: y }, g), core: el("circle", { class: "core", cx: x, cy: y }, g) };
  });
  // the supernovae flash one after another, with a fast rise and a slow decline, at a fixed size on the screen
  function drawFlashes(u, k) {
    flashes.forEach((f, i) => {
      const v = (u - SNE.flash - i * SNE.flashStep) / 0.7;
      const b = v < 0 || v > 1 ? 0 : v < 0.15 ? v / 0.15 : (1 - v) / 0.85;
      show(f.g, b);
      if (b > 0) { f.halo.setAttribute("r", ((6 + 12 * b) / k).toFixed(2)); f.core.setAttribute("r", ((2 + 2.5 * b) / k).toFixed(2)); }
    });
  }
  // SN 2011fe shining in M101, with its Cepheids blinking again next to it
  const flare = el("circle", { cx: SN_PX[0], cy: SN_PX[1], r: 16, fill: "url(#introBoom)" }, snImg.g);
  const snMarks = el("g", { class: "intro-plot intro-m101" }, snImg.g);
  const againCeps = cepheids(snMarks);
  const snName = el("g", {}, snMarks);
  label(snName, [SN_PX[0] + 30, SN_PX[1] + 46], "SN 2011fe", "SN 2011fe");

  function drawWorld(u, fade) {
    const cam = track(CAMERA, u), kGal = 10 ** (GAL - cam);
    for (const layer of [far, gal, mw, snImg]) {
      const ls = layer.d - cam;           // log of the layer's scale
      // an image is never shown much more than twice its size, where it turns blocky; the Milky Way is
      // drawn, so it can come in from much larger
      const [hi, lo] = layer.fade || [layer === mw ? 3.5 : 0.75, -2.4];
      const op = Math.min(clamp((hi - ls) / 0.45), clamp((ls - lo) / 1.2)) * fade;
      show(layer.g, op);
      if (op <= 0) continue;
      // the near field is centred on M101, and the layers at home in it are moved with it
      const [fx, fy] = layer === gal ? G_M101 : layer === mw ? [0, 0] : [W / 2, H / 2];
      const [ox, oy] = layer.home ? [kGal * (layer.home[0] - G_M101[0]), kGal * (layer.home[1] - G_M101[1])] : [0, 0];
      set(layer.g, { transform: `translate(${(W / 2 + ox).toFixed(1)} ${(H / 2 + oy).toFixed(1)}) scale(${10 ** ls}) translate(${-fx} ${-fy})` });
      if (layer.inner) {
        // at a third of its size or less, the image is gone already at the middle of its sides (0.5 / 0.71)
        const k = clamp(-ls / 0.45);
        layer.inner.setAttribute("offset", (0.72 - 0.5 * k).toFixed(3));
        layer.outer.setAttribute("offset", (1 - 0.3 * k).toFixed(3));
      }
      if (layer === far) drawFlashes(u, 10 ** ls);
    }
    show(flare, 1 - ramp(u, ...SNE.fade));
    againCeps.forEach((c, i) => {
      const s = SNE.again + M101C.step * i;
      show(c.g, inOut(u, s, SNE.fade[0] + 0.2, 0.15));
      c.dot.setAttribute("r", pulse(u - s));
    });
    show(snName, inOut(u, 0.8, SNE.fade[1]));
  }

  // the Hubble plot, velocity against distance, with the same slope on the screen at every width (80 km/s
  // per Mpc of the axis). The points are schematic: the galaxies of part 3 with their Cepheid distances, and
  // supernovae far out along the same line.
  const hDim = el("rect", { class: "intro-dim", width: W, height: H }, panels[6].g);
  const hub = el("g", { class: "intro-plot intro-hub" }, panels[6].g);
  const HPB = { x0: 480, x1: 1000, y0: 170, y1: 500 };
  const H0 = 73;
  const HUB_GAL = [[4.2, 360], [9.5, 640], [12.8, 1010], [15.6, 1080], [18.3, 1420], [20.9, 1460], [23.4, 1760]];
  const HUB_M101 = [6.9, 430];
  const HUB_SN = [70, 110, 150, 190, 230, 270, 320, 370, 420, 470].map((d, i) => [d, H0 * d * (1 + [0.05, -0.06, 0.03, -0.04, 0.06, -0.02, 0.04, -0.05, 0.02, -0.03][i])]);
  el("rect", { class: "panel", x: HPB.x0 - 90, y: HPB.y0 - 40, width: HPB.x1 - HPB.x0 + 130, height: HPB.y1 - HPB.y0 + 110, rx: 10 }, hub);
  el("path", { class: "axis", d: `M${HPB.x0} ${HPB.y0 - 14} V${HPB.y1} H${HPB.x1 + 14}` }, hub);
  el("path", { class: "axis", d: `M${HPB.x0 - 6} ${HPB.y0 - 2} L${HPB.x0} ${HPB.y0 - 14} L${HPB.x0 + 6} ${HPB.y0 - 2}` }, hub);
  label(hub, [(HPB.x0 + HPB.x1) / 2, HPB.y1 + 60], "kaugus (Mpc)", "distance (Mpc)", { "text-anchor": "middle" });
  label(hub, [HPB.x0 - 22, (HPB.y0 + HPB.y1) / 2], "kiirus", "velocity", { "text-anchor": "middle", transform: `rotate(-90 ${HPB.x0 - 22} ${(HPB.y0 + HPB.y1) / 2})` });
  // ticks every 10 Mpc, which crowd and fade as the plot widens, and every 100 Mpc, which come in
  const hTicks = [10, 20, 100, 200, 300, 400, 500].map((v) => {
    const g = el("g", {}, hub);
    el("line", { class: "axis", y1: HPB.y1, y2: HPB.y1 + 7 }, g);
    label(g, [0, HPB.y1 + 30], String(v), String(v), { "text-anchor": "middle", class: "dim" });
    return { v, g };
  });
  const hLine = el("line", { class: "fit" }, hub);
  const hSlope = el("g", {}, hub);
  const hSlopeText = el("text", {}, hSlope);
  hSlopeText.innerHTML = `<tspan data-l="et">tõus H₀</tspan><tspan data-l="en">slope H₀</tspan>`;
  const hGal = HUB_GAL.map(() => el("circle", { class: "pt" }, hub));
  const hM101 = el("circle", { class: "pt" }, hub);
  const hSn = HUB_SN.map(() => el("circle", { class: "pt sn" }, hub));
  const hM101Name = el("text", {}, hub);
  hM101Name.textContent = "M101";
  const hRead = el("g", {}, hub);
  label(hRead, [HPB.x0 + 24, HPB.y0 + 14], "H₀ ≈ 73 km/s/Mpc", "H₀ ≈ 73 km/s/Mpc", { class: "read" });
  label(hRead, [HPB.x0 + 24, HPB.y0 + 48], "– selle mõõdad ise 3. ja 4. osas", "– you will measure it in parts 3 and 4", { class: "dim" });
  function drawHubble(u, out) {
    const fade = ramp(u, ...SNE.hub) * out;
    show(hub, fade);
    show(hDim, 0.6 * fade);
    if (!(fade > 0)) return;
    const w = ramp(u, ...SNE.widen), xmax = 25 * 20 ** w, vmax = 80 * xmax;
    const hx = (d) => HPB.x0 + (d / xmax) * (HPB.x1 - HPB.x0), hy = (v) => HPB.y1 - (v / vmax) * (HPB.y1 - HPB.y0);
    for (const k of hTicks) {
      const gap = ((k.v < 100 ? 10 : 100) / xmax) * (HPB.x1 - HPB.x0);
      show(k.g, clamp((gap - 26) / 22) * clamp((xmax - 0.9 * k.v) / (0.1 * k.v)));
      k.g.setAttribute("transform", `translate(${hx(k.v).toFixed(1)} 0)`);
    }
    const shrink = 1 - 0.3 * w;
    hGal.forEach((c, i) => set(c, { cx: hx(HUB_GAL[i][0]), cy: hy(HUB_GAL[i][1]), r: (7 * shrink).toFixed(2) }));
    hSn.forEach((c, i) => {
      const a = SNE.sne + i * SNE.sneStep;
      set(c, { cx: hx(HUB_SN[i][0]), cy: hy(HUB_SN[i][1]), r: (7 * ramp(u, a, a + 0.2)).toFixed(2) });
    });
    const m = [hx(HUB_M101[0]), hy(HUB_M101[1])];
    set(hM101, { cx: m[0], cy: m[1], r: 8 * shrink });
    set(hM101Name, { x: m[0] + 14, y: m[1] + 26 });
    show(hM101Name, 1 - w);
    // the line through the origin
    const e = 0.97 * xmax;
    set(hLine, { x1: hx(0), y1: hy(0), x2: hx(e), y2: hy(H0 * e) });
    set(hSlopeText, { x: hx(0.8 * xmax) + 14, y: hy(H0 * 0.8 * xmax) + 30 });
    show(hRead, ramp(u, ...SNE.read));
  }
  panels[6].draw = (t) => {
    const u = t - T(10), end = ramp(t, T(11), T(11) + 0.8);
    drawWorld(u, 1 - end);
    drawHubble(u, 1 - ramp(t, T(11), T(11) + 0.5));
  };

  // ---- the distance scale, the bars and the ladder ----

  // the distance scale along the bottom: a log axis from 1 au to 1 Gpc
  const AX0 = 80, AX1 = 1200, AXY = 684, AMIN = AU, AMAX = 9;
  const ax = (d) => AX0 + ((d - AMIN) / (AMAX - AMIN)) * (AX1 - AX0);
  const shadeTop = el("rect", { width: W, height: 120, fill: "url(#introShadeTop)" }, svg);
  const scale = el("g", { class: "intro-scale" }, svg);
  el("rect", { y: 590, width: W, height: H - 590, fill: "url(#introShadeBottom)" }, scale);
  el("line", { class: "axis", x1: AX0, y1: AXY, x2: AX1, y2: AXY }, scale);
  for (const [d, label] of [[AU, "au"], [0, "pc"], [3, "kpc"], [6, "Mpc"], [9, "Gpc"]]) {
    el("line", { class: "axis", x1: ax(d), y1: AXY, x2: ax(d), y2: AXY + 7 }, scale);
    el("text", { class: "unit", x: ax(d), y: AXY + 26 }, scale).textContent = label;
  }
  const marks = LANDMARKS.map((m) => {
    const g = el("g", { class: "landmark" }, scale);
    const y = m.hi ? 618 : 636;
    el("line", { x1: ax(m.d), y1: y + 5, x2: ax(m.d), y2: AXY }, g);
    const text = el("text", { x: ax(m.d) + (m.anchor === "end" ? 4 : m.anchor === "start" ? -4 : 0), y, "text-anchor": m.anchor || "middle" }, g);
    text.innerHTML = `<tspan data-l="et">${m.et}</tspan><tspan data-l="en">${m.en}</tspan>`;
    return { ...m, g };
  });
  const marker = el("g", { class: "marker" }, scale);
  el("path", { d: "M-7 -14 L7 -14 L0 -3 Z" }, marker);
  el("circle", { cy: 0, r: 4.5 }, marker);

  // the bars of the rungs above the axis, which become the rungs of the ladder in scene 11
  const LANE = [672, 664, 656];
  const halos = el("g", {}, svg);
  const bars = RUNGS.map((r, i) => {
    const halo = el("line", { class: `intro-halo ${r.cls}` }, halos);
    const line = el("line", { class: `intro-bar ${r.cls}` });
    return { ...r, line, halo, y: LANE[i] };
  });

  // scene 11: a copy of the ladder figure of the page, with its links made plain groups
  const ladder = el("g", { class: "ladder-art intro-ladder", transform: `translate(${LADDER.x} ${LADDER.y}) scale(${LADDER.k})` }, svg);
  for (const child of figure.querySelector("svg").children) {
    if (["title", "desc", "defs"].includes(child.tagName)) continue;
    const c = child.cloneNode(true);
    if (c.tagName !== "a") { ladder.appendChild(c); continue; }
    const g = el("g", { class: c.getAttribute("class") }, ladder);
    g.append(...c.childNodes);
  }
  const ladderParts = [...ladder.children].filter((g) => !g.querySelector(".rung"));
  const ladderRungs = RUNGS.map((r) => {
    const g = ladder.querySelector(`.rung.${r.cls}`).parentNode;
    const rung = g.querySelector(".rung");
    rung.style.visibility = "hidden";   // drawn by its bar instead
    return { g, x1: +rung.getAttribute("x1"), x2: +rung.getAttribute("x2"), y: +rung.getAttribute("y1") };
  });
  for (const b of bars) svg.appendChild(b.line);
  const T5 = T(11);                       // the ladder scene, whose times below are counted from its start

  function drawScale(t, fade) {
    show(scale, ramp(t, 0.4, 1.4) * fade);
    const m = track(MARKER, t);
    set(marker, { transform: `translate(${ax(m)} ${AXY})` });
    for (const lm of marks) show(lm.g, clamp((m - lm.d) / 0.15 + 1));
  }

  // the bars on the scale, and in scene 11 their way to the rungs of the ladder, which light up in turn
  function drawBars(t) {
    bars.forEach((b, i) => {
      const x1 = ax(b.from), x2 = x1 + (Math.min(ax(b.to), AX1 + 18) - x1) * ramp(t, ...b.grow);
      const r = ladderRungs[i];
      const p = ramp(t, T5 + 0.4 + 0.25 * i, T5 + 1.2 + 0.25 * i);
      const mix = (a, c) => a + (c - a) * p;
      const lx = (x) => LADDER.x + LADDER.k * x, ly = LADDER.y + LADDER.k * r.y;
      const pos = { x1: mix(x1, lx(r.x1)), x2: mix(x2, lx(r.x2)), y1: mix(b.y, ly), y2: mix(b.y, ly) };
      set(b.line, pos);
      b.line.style.strokeWidth = mix(5, 7 * LADDER.k);
      show(b.line, t >= b.grow[0] ? 1 : 0);
      // the rung lights up with its name and part number
      const on = T5 + 1.9 + 0.35 * i;
      const pulse = Math.sin(Math.PI * clamp((t - on) / 0.6));
      set(b.halo, pos);
      b.halo.style.strokeWidth = 7 * LADDER.k + 22 * pulse;
      show(b.halo, 0.35 * pulse);
      show(r.g, ramp(t, on, on + 0.3));
    });
  }

  function drawLadder(t) {
    const op = ramp(t, T5 + 1.2, T5 + 1.8);
    show(ladder, t >= T5 + 1.2 ? 1 : 0);
    for (const g of ladderParts) show(g, op);
  }

  // ---- draw(t) ----

  // how many slides have been made by time t, in panels; a panel is offset by the slides into it and out of it
  const slides = PANELS.slice(1).map(([a]) => T(a));
  const slid = (t) => slides.reduce((n, s) => n + ramp(t, s, s + SLIDE), 0);
  function drawPanels(t) {
    panels.forEach((p, i) => {
      const a = T(PANELS[i][0]), next = PANELS[i + 1] && T(PANELS[i + 1][0]);
      const on = (!i || t >= a) && (next === undefined || t < next + SLIDE);
      show(p.g, on ? 1 : 0);
      if (!on) return;
      const x = (i ? W * (1 - ramp(t, a, a + SLIDE)) : 0) - (next === undefined ? 0 : W * ramp(t, next, next + SLIDE));
      p.g.setAttribute("transform", `translate(${x.toFixed(1)} 0)`);
      p.draw(t);
    });
  }

  let sceneIdx = -1;
  function draw(t) {
    t = clamp(t, 0, DURATION);
    const end = ramp(t, T5, T5 + 0.8);    // scene 11: the sky gives way to the page
    sky.style.fill = `color-mix(in srgb, var(--bg) ${end * 100}%, var(--intro-sky))`;
    show(stars, 1 - end);
    stars.setAttribute("transform", `translate(${(-((slid(t) * W) / 5) % W).toFixed(1)} 0)`);
    show(shadeTop, 1 - end);
    drawPanels(t);
    drawScale(t, 1 - ramp(t, T5, T5 + 0.5));
    drawBars(t);
    drawLadder(t);

    const i = SCENES.findIndex((s) => t < s.end);
    const s = SCENES[i < 0 ? SCENES.length - 1 : i];
    if (s !== SCENES[sceneIdx]) {
      sceneIdx = SCENES.indexOf(s);
      caption.innerHTML = sp(s.et, s.en);
      caption.classList.toggle("title", !!s.title);
    }
    caption.style.opacity = inOut(t - s.start, ...s.cap);
    caption.style.color = `color-mix(in srgb, var(--text-1) ${end * 100}%, var(--intro-sky-text))`;
  }
  // the frame at time t, or the key frame of its scene when motion is reduced
  function render(t) {
    const s = SCENES.find((s) => t < s.end) || SCENES.at(-1);
    draw(still.matches ? s.start + s.key : t);
    fill.style.width = `${(clamp(t, 0, DURATION) / DURATION) * 100}%`;
  }

  // ---- playing ----

  let time = 0, playing = false, last = 0, raf = 0, opener = null;
  function frame(now) {
    raf = 0;
    if (!playing) return;
    time += (now - last) / 1000;
    last = now;
    render(time);
    if (time >= DURATION) { finish(); return; }
    raf = requestAnimationFrame(frame);
  }
  function setPlaying(on) {
    playing = on && time < DURATION;
    pauseBtn.innerHTML = playing ? sp("Peata", "Pause") : sp("Jätka", "Resume");
    if (playing && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }
  function seek(t) {
    time = clamp(t, 0, DURATION - 0.001);
    render(time);
  }

  function open(t = 0, play = true) {
    for (const img of svg.querySelectorAll("image[data-src]")) if (!img.getAttribute("href")) img.setAttribute("href", img.dataset.src);
    win.setAttribute("aria-label", L("Kauguste redeli tutvustus", "Introduction to the distance ladder"));
    modal.querySelector("#introTitle").textContent = L("Kauguste redeli tutvustus", "Introduction to the distance ladder");
    modal.querySelector("#introDesc").textContent = L(STORY.et, STORY.en);
    opener = document.activeElement === document.body ? playBtn : document.activeElement;
    modal.hidden = false;
    modal.classList.remove("closing");
    document.documentElement.classList.add("intro-open");
    win.focus();
    seek(t);
    setPlaying(play);
  }
  function close() {
    setPlaying(false);
    modal.hidden = true;
    document.documentElement.classList.remove("intro-open");
    if (/^#intro=/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
    (opener && opener.isConnected ? opener : playBtn).focus();
  }
  // at the end the ladder of the last frame shrinks and flies to the figure on the page, and the window closes;
  // with reduced motion it just closes
  function finish() {
    setPlaying(false);
    if (still.matches) { close(); return; }
    const art = figure.querySelector("svg");
    const box = art.getBoundingClientRect();
    if (box.top < 0 || box.bottom > innerHeight) art.scrollIntoView({ block: "center" });
    const to = art.getBoundingClientRect();
    const ctm = svg.getScreenCTM();
    const from = { left: ctm.e + LADDER.x * ctm.a, top: ctm.f + LADDER.y * ctm.d, width: 393 * LADDER.k * ctm.a };
    const fly = art.cloneNode(true);
    for (const e of fly.querySelectorAll("[id]")) e.removeAttribute("id");
    fly.setAttribute("aria-hidden", "true");
    fly.classList.add("intro-fly");
    Object.assign(fly.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px` });
    const wrap = document.createElement("div");
    wrap.className = "ladder-art intro-fly-wrap";
    wrap.appendChild(fly);
    document.body.appendChild(wrap);
    art.style.visibility = "hidden";
    modal.classList.add("closing");
    fly.getBoundingClientRect();          // start the transition from here
    const k = to.width / from.width;
    fly.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${k})`;
    setTimeout(() => {
      wrap.remove();
      art.style.visibility = "";
      close();
    }, 750);
  }

  playBtn.addEventListener("click", () => open());
  pauseBtn.addEventListener("click", () => {
    if (time >= DURATION - 0.01) seek(0);
    setPlaying(!playing);
  });
  modal.querySelector("[data-act=restart]").addEventListener("click", () => { seek(0); setPlaying(true); });
  modal.querySelector("[data-act=skip]").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  for (const b of modal.querySelectorAll(".intro-mark")) b.addEventListener("click", () => seek(+b.dataset.t));
  modal.querySelector(".intro-track").addEventListener("click", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - r.left) / r.width) * DURATION);
  });
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === " " && !e.target.closest("button, a")) { e.preventDefault(); setPlaying(!playing); }
    else if (e.key === "Tab") {           // keep the focus in the window
      const f = [...win.querySelectorAll("button")];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && playing) setPlaying(false); });

  // a still frame from the address: #intro=12.8, or #intro=12.8&play to play on from there
  function fromHash() {
    const m = /^#intro=([\d.]+)(&play)?$/.exec(location.hash);
    if (m) open(+m[1], !!m[2]);
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
