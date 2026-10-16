"use strict";

// The intro animation of the home page (docs/DESIGN-intro.md): a 54 s story of the distance ladder in a
// window over the page, opened only by the Vaata tutvustust button. The whole animation is draw(t), a
// function of the time, so seeking, pausing and still frames come for free: index.html#intro=12.8 opens
// the window paused at 12.8 s, and #intro=12.8&play plays on from there.
(() => {
  const playBtn = document.getElementById("introPlay");
  const figure = document.querySelector(".ladder-art");
  if (!playBtn) return;

  const DURATION = 54;
  const W = 1280, H = 720;                 // the scene, in SVG units
  const NS = "http://www.w3.org/2000/svg";
  const L = (et, en) => (document.documentElement.lang === "en" ? en : et);
  const sp = (et, en) => `<span data-l="et">${et}</span><span data-l="en">${en}</span>`;

  // ---- timing: everything that happens when is here ----

  // distances as log10(d / pc)
  const AU = Math.log10(1 / 206265), PLE = Math.log10(135), NGC = Math.log10(940);
  const M101 = Math.log10(6.9e6), FAR = Math.log10(5e8);
  // the galaxies around the Milky Way in scene 5, which the camera passes again on its way out in scene 7
  const GAL = Math.log10(4e7);
  // the top view of the Milky Way between the Pleiades and NGC 6087, and the close-ups of S Nor and of
  // SN 2011fe, zoomed in from their images
  const MWL = 6.5, CEP = NGC - 2.5, SNZ = M101 - 3;
  // the camera, as the log distance whose objects fill the scene, and the marker on the distance scale;
  // [time, value], eased between the keys
  const CAMERA = [[0, AU], [9, AU], [10.5, PLE], [15, PLE], [16.4, MWL], [17.2, MWL], [18.2, NGC], [19, NGC], [20.2, CEP], [23.8, CEP],
    [25, NGC], [30, NGC], [31.3, GAL], [31.8, GAL], [32.7, M101], [37.8, M101], [39, SNZ], [42.6, SNZ], [43.8, M101], [45.5, M101], [47.5, FAR]];
  const MARKER = [[0, AU], [2.6, AU], [3.6, 1], [9, 1], [10.5, PLE], [15, PLE], [17.2, PLE], [18.2, NGC], [30, NGC], [31.3, Math.log10(2e7)],
    [33.3, Math.log10(2e7)], [33.8, M101], [45.5, M101], [47.5, FAR]];
  // how far an image is panned to put its object (S Nor, SN 2011fe) in the centre: before the camera zooms
  // in on it, and back after it has zoomed out
  const FOCUS = [[0, 0], [18.3, 0], [19, 1], [25, 1], [25.8, 0], [37, 0], [37.8, 1], [43.8, 1], [44.6, 0]];
  // how far the field of galaxies is panned from the Milky Way to M101, before the camera zooms in on M101
  const GALPAN = [[0, 0], [31.3, 0], [31.8, 1]];
  // the Milky Way: in the hold between the zooms it pans from the Sun, where the Pleiades shrank to, to
  // NGC 6087, which the camera then zooms into; its labels show over show. In scene 5 it pans back to its
  // centre while the camera pulls out of it
  const MW = { pan: [16.5, 17.15], show: [16.1, 17.4], back: [30, 31.3] };
  // the scenes: their times, the caption and when it shows (after the camera has stopped), the key frame that
  // stands for the scene when motion is reduced, and the part
  const SCENES = [
    { start: 0, end: 2, cap: [0.3, 1.8], key: 1, et: "Kui kaugel on galaktikad?", en: "How far away are the galaxies?" },
    { start: 2, end: 9, cap: [2.4, 8.6], key: 8, part: 1, et: "Parallaks annab tähtede kaugused", en: "Parallax gives the distances of stars" },
    { start: 9, end: 17.2, cap: [10.6, 17], key: 14.5, et: "Gaia parallaksid annavad täheparvede kaugused", en: "Gaia parallaxes give the distances of star clusters" },
    { start: 17.2, end: 25, cap: [20.3, 24.8], key: 23.6, part: 2, et: "Tsefeiid pulseerib – periood näitab tema heledust", en: "A Cepheid pulsates – its period reveals its luminosity" },
    { start: 25, end: 30, cap: [25.2, 29.8], key: 29, et: "Parvede tsefeiidid kalibreerivad seose", en: "Cluster Cepheids calibrate the relation" },
    { start: 30, end: 37, cap: [32.8, 36.8], key: 36.4, part: 3, et: "Tsefeiidid annavad galaktikate kaugused", en: "Cepheids give the distances of galaxies" },
    { start: 37, end: 44, cap: [39.1, 43.8], key: 42.4, part: 4, et: "Valge kääbus kogub massi ja plahvatab", en: "A white dwarf gains mass and explodes" },
    { start: 44, end: 51, cap: [44.2, 50.8], key: 50.3, et: "Supernoovad ulatuvad sadade megaparsekiteni", en: "Supernovae reach hundreds of megaparsecs" },
    { start: 51, end: 54, cap: [51.6, 99], key: 53.8, et: "Redel – ronime pulkhaaval", en: "The ladder – one rung at a time" },
  ];
  // the rungs: their range on the distance scale (log pc) and when their bar grows; the bar of the
  // supernovae runs past the end of the scale
  const RUNGS = [
    { cls: "r1", from: Math.log10(50), to: Math.log10(5e3), grow: [14, 15] },
    { cls: "r2", from: Math.log10(300), to: Math.log10(4e7), grow: [33.5, 34.5] },
    { cls: "r3", from: Math.log10(7e6), to: 9.25, grow: [45.5, 47.5] },
  ];
  // landmarks on the scale, shown once the marker has reached them and not before after; hi puts the label
  // on the upper line
  const LANDMARKS = [
    { d: PLE, et: "Plejaadid", en: "Pleiades", anchor: "end" },
    { d: NGC, et: "NGC 6087", en: "NGC 6087", hi: true },
    { d: Math.log10(7.65e5), et: "Andromeeda galaktika", en: "Andromeda galaxy", anchor: "end" },
    { d: M101, et: "M101", en: "M101", hi: true, after: 33.8 },
    { d: Math.log10(1.65e7), et: "Neitsi parv", en: "Virgo cluster", anchor: "start" },
  ];
  // the stored images, each filling the scene when the camera is at its distance, and shown only in the
  // scenes of its time span (the close-ups would otherwise meet other images on their way in)
  const IMAGES = [
    { src: "img/intro/plejaadid.jpg", d: PLE, span: [9, 17] },
    { src: "img/intro/ngc6087.jpg", d: NGC, span: [16.5, 32], focus: [634.6, 308.3] },   // S Nor
    { src: "img/intro/m101.jpg", d: M101, span: [30, 54], focus: [668.0, 488.6] },     // SN 2011fe
  ];
  // the ladder of scene 8, placed in the scene at this scale and corner (the page figure is 393 × 274)
  const LADDER = { k: 1.85, x: (W - 393 * 1.85) / 2, y: 118 };
  const T5 = SCENES.at(-1).start;          // the ladder scene, whose times below are counted from its start
  // scene 1, after the parallax page in its oblique view: in units of the Earth's orbit, a star at distance d
  // and ecliptic latitude beta with a proper motion of mu a year towards phi, and the distant quasars on a plane
  // at distance D, ±HP wide; the Earth goes round YEARS times while the camera turns from AZ[0] to AZ[1]
  const PAR = { d: 4, beta: 50, mu: 1.5, phi: 60, D: 10, HP: 3.8, YEARS: 3, run: [2.8, 8.3], AZ: [62, 40], out: [8.2, 9] };
  // scene 2: the stars of the Pleiades image get dots and arrows for their proper motions, which then fly into
  // the proper-motion plot; the clump of the cluster is lassoed and its stars drop into a parallax histogram,
  // which gives the distance; all of it fades as the camera pulls out to the Milky Way
  const GAIA = { dots: [10.5, 10.9], move: [10.9, 11.5], lasso: [11.4, 12.1], sel: [12.1, 12.3], drop: [12.4, 13.9], read: [13.9, 14.2], out: [15, 15.3] };
  // scene 3: S Nor pulsates with a cycle of CYCLE seconds from t0 on, and its light curve is traced over trace
  const CEPH = { P: 9.75, t0: 19, CYCLE: 1.5, trace: [20.3, 23.8] };
  // scene 6: the white dwarf grows from 1.30 to 1.38 M☉ over gain, ignites and explodes over boom; the
  // supernova then shines in M101 until it fades over fade
  const SNIA = { gain: [39, 41.3], ignite: 41.2, boom: [41.6, 43.6], fade: [45.3, 46.2] };
  // scene 4: the image dims and the plot comes in, S Nor flies onto it and the other cluster Cepheids follow
  // one by one, the line is fitted, and the plot moves to a corner for scene 5, where it fades out
  const PLT = { dim: [25.2, 25.8], fly: [25.8, 26.6], others: 26.7, step: 0.15, fit: [28, 29], corner: [29.6, 30.4], out: [36.8, 37.1], undim: [30, 30.6] };
  // scene 5: Cepheids blink in M101 one after another, each putting a point on the line of the plot in the
  // corner, and M101 gets its distance; in scene 7 they blink again next to SN 2011fe
  const M101C = { blink: [32.7, 33.7], read: [33.8, 34.1], again: [44.2, 45.2] };
  // scenes 5 and 7: the Hubble plot comes in, M101 flies onto it and the other galaxies follow, and the line
  // is fitted; in scene 7 it comes back, widens to 500 Mpc and the supernovae add their points, and the
  // readout gives H0; supernovae flash in the distant galaxies before that
  const HUB = { in: [34.2, 34.6], fly: [34.6, 35.1], others: 35.1, step: 0.08, fit: [35.6, 36], out: [36.8, 37.1],
    flash: 46.8, flashStep: 0.11, back: [48.1, 48.5], widen: [48.5, 49.2], sne: 49, sneStep: 0.05, read: [49.5, 49.8] };

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
    et: "Maa tiirlemine ümber Päikese paneb lähedase tähe kaugete kvasarite taustal ellipsit joonistama, ja Gaia " +
      "parallaksid annavad Plejaadide kauguse. Tsefeiid S Nor täheparves NGC 6087 pulseerib, ja parvede tsefeiidid " +
      "kalibreerivad perioodi-heleduse seose. Selle abil annavad tsefeiidid galaktika M101 kauguse, umbes 7 Mpc, ning " +
      "galaktikate kaugused ja kiirused annavad Hubble'i seaduse. Valge kääbus kogub kaaslaselt massi ja plahvatab " +
      "Ia tüüpi supernoovana. Supernoovad annavad kaugused sadade megaparsekiteni ja Hubble'i konstandi, umbes " +
      "73 km/s/Mpc. Lõpuks saavad kolmest meetodist kauguste redeli pulgad.",
    en: "As the Earth goes round the Sun, a nearby star traces an ellipse against distant quasars, and Gaia parallaxes " +
      "give the distance of the Pleiades. The Cepheid S Nor in the star cluster NGC 6087 pulsates, and cluster " +
      "Cepheids calibrate the period–luminosity relation. With it, Cepheids give the distance of the galaxy M101, " +
      "about 7 Mpc, and the distances and velocities of galaxies give the Hubble law. A white dwarf gains mass from " +
      "its companion and explodes as a type Ia supernova. Supernovae give distances out to hundreds of megaparsecs " +
      "and the Hubble constant, about 73 km/s/Mpc. Finally the three methods become the rungs of the distance ladder.",
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

  const sky = el("rect", { class: "intro-sky", width: W, height: H }, svg);
  const stars = el("g", { class: "intro-stars" }, svg);
  const rand = rng(20111024);
  for (let i = 0; i < 260; i++) {
    const r = 0.45 + 1.3 * rand() ** 4;
    el("circle", { cx: (rand() * W).toFixed(1), cy: (rand() * H).toFixed(1), r: r.toFixed(2), opacity: (0.3 + 0.6 * rand()).toFixed(2) }, stars);
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

  const pts = (a) => a.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const label = (g, [x, y], et, en, attrs = {}) => {
    el("text", { x: x.toFixed(1), y: y.toFixed(1), ...attrs }, g).innerHTML = `<tspan data-l="et">${et}</tspan><tspan data-l="en">${en}</tspan>`;
  };
  // the camera's world: the images and the drawn close-ups, each scaled by the camera
  const world = el("g", {}, svg);
  // each image fades out towards its edges: at full size only in the corners, and the more it shrinks,
  // the more, so that a small image is a soft round patch rather than a rectangle
  const layers = IMAGES.map((im, i) => {
    const g = el("g", {}, world);
    const fadeGrad = el("radialGradient", { id: `introFade${i}`, cx: 0.5, cy: 0.5, r: 0.71 }, defs);
    const inner = el("stop", { offset: 0.72, "stop-color": "#fff" }, fadeGrad);
    const outer = el("stop", { offset: 1, "stop-color": "#000" }, fadeGrad);
    el("rect", { width: W, height: H, fill: `url(#introFade${i})` }, el("mask", { id: `introVignette${i}` }, defs));
    const img = el("image", { width: W, height: H, preserveAspectRatio: "xMidYMid slice", mask: `url(#introVignette${i})` }, g);
    return { ...im, g, img, inner, outer };
  });
  // the Milky Way seen from above, behind the images, at 12 px per kpc when the camera is at MWL: the
  // centre is up and the Sun 8.2 kpc below it; the clusters are placed from their galactic longitude l and
  // distance, with l = 90° to the right. The arms are four logarithmic spirals of seeded stars.
  const mw = { d: MWL, spans: [[12.5, 19], [29.9, 33], [45.4, 51]], g: el("g", { class: "intro-mw" }) };
  world.insertBefore(mw.g, world.firstChild);
  const KPC = 12, SUN = [0, 8.2 * KPC];
  const galactic = (l, d) => [SUN[0] + d * KPC * Math.sin(l * Math.PI / 180), SUN[1] - d * KPC * Math.cos(l * Math.PI / 180)];
  const MW_PLE = galactic(166.6, 0.135), MW_NGC = galactic(327.7, 0.94);
  {
    el("circle", { r: 16 * KPC, fill: "url(#introDisc)" }, mw.g);
    // the stars are dots of a fixed size on the screen (zero-length strokes that do not scale), in three
    // classes of size, so that the camera flies between them instead of blowing them up
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
  const mwMarks = el("g", { class: "marks" }, mw.g);
  el("path", { class: "sun", d: `M${SUN[0]} ${SUN[1]}h0` }, mwMarks);
  for (const p of [MW_PLE, MW_NGC]) el("path", { class: "cluster", d: `M${p[0]} ${p[1]}h0` }, mwMarks);
  const mwNames = el("g", { class: "names" }, mw.g);
  const callout = (p, dx, dy, et, en, anchor) => {
    el("line", { x1: p[0], y1: p[1], x2: p[0] + dx, y2: p[1] + dy }, mwNames);
    label(mwNames, [p[0] + dx + (anchor === "start" ? 4 : -4), p[1] + dy + 6], et, en, { "text-anchor": anchor });
  };
  callout(SUN, 46, -6, "Päike", "Sun", "start");
  callout(MW_PLE, 40, 34, "Plejaadid", "Pleiades", "start");
  callout(MW_NGC, -50, -26, "NGC 6087", "NGC 6087", "end");
  label(mwNames, [-11 * KPC, -12.5 * KPC], "Linnutee", "Milky Way", { "text-anchor": "middle", class: "big" });

  // the fields of galaxies, behind the Milky Way: the near one of scene 5, where the Milky Way is a small spiral
  // in the centre and M101 a larger one up to the right, and the far one of scene 7, where the supernovae
  // flash; each galaxy is a soft ellipse. The Milky Way and the M101 image are placed at home in the near
  // field, which pans from the one to the other.
  glow("introGal", [[0, "#fff6e6", 0.95], [0.35, "#e9dfcc", 0.5], [1, "#c8d4ff", 0]]);
  const G_MW = [W / 2, H / 2], G_M101 = [985, 245];
  mw.home = G_MW;
  layers[2].home = G_M101;
  const galaxy = (g, x, y, rx, ry, a) => el("ellipse", { cx: x.toFixed(1), cy: y.toFixed(1), rx: rx.toFixed(1), ry: ry.toFixed(1),
    transform: `rotate(${a.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})`, fill: "url(#introGal)" }, g);
  // the near field fades out before the camera reaches the far one, and is gone when zoomed into M101
  const gal = { d: GAL, spans: [[29.9, 33], [45.4, 51]], fade: [0.7, -1.2], g: el("g", { class: "intro-gal" }) };
  const far = { d: FAR, spans: [[45.4, 51]], g: el("g", { class: "intro-gal" }) };
  world.insertBefore(gal.g, world.firstChild);
  world.insertBefore(far.g, world.firstChild);
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
  function drawFlashes(t, k) {
    flashes.forEach((f, i) => {
      const u = (t - HUB.flash - i * HUB.flashStep) / 0.7;
      const b = u < 0 || u > 1 ? 0 : u < 0.15 ? u / 0.15 : (1 - u) / 0.85;
      show(f.g, b);
      if (b > 0) { f.halo.setAttribute("r", ((6 + 12 * b) / k).toFixed(2)); f.core.setAttribute("r", ((2 + 2.5 * b) / k).toFixed(2)); }
    });
  }

  // SN 2011fe shining in M101 after the explosion
  const flare = el("circle", { cx: IMAGES[2].focus[0], cy: IMAGES[2].focus[1], fill: "url(#introBoom)" }, layers[2].g);
  // the Cepheids of M101, in its arms, with their log P for the plot in the corner, and the labels of M101
  // and of SN 2011fe
  const m101 = el("g", { class: "intro-plot intro-m101" }, layers[2].g);
  const M101_CEPS = [[465, 330, 1.18], [582, 238, 1.5], [842, 312, 1.32], [762, 522, 1.62]].map(([x, y, lp]) => {
    const g = el("g", {}, m101);
    return { lp, g, ring: el("circle", { class: "intro-ring", cx: x, cy: y, r: 15 }, g), dot: el("circle", { class: "pt", cx: x, cy: y }, g) };
  });
  const cepName = el("g", {}, m101);
  label(cepName, [465, 296], "tsefeiid", "Cepheid", { "text-anchor": "middle" });
  const m101Read = el("g", {}, m101);
  label(m101Read, [190, 212], "M101", "M101", { class: "dim" });
  label(m101Read, [190, 250], "d ≈ 7 Mpc", "d ≈ 7 Mpc", { class: "read" });
  const snName = el("g", {}, m101);
  label(snName, [IMAGES[2].focus[0] + 30, IMAGES[2].focus[1] + 46], "SN 2011fe", "SN 2011fe");
  // scene 1: the 3D view of the parallax page at the scale of 1 au, drawn anew in every frame
  const par = { d: AU, g: el("g", { class: "intro-par" }, world) };
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
  // fitted between the caption and the distance scale
  function parCamera(az) {
    const a = az * rad, f = add(mul(PB.n, -Math.cos(a)), mul(PB.u, -Math.sin(a)));
    const r0 = cross(PB.N, f), r = mul(r0, 1 / Math.hypot(...r0)), up = cross(f, r);
    const box = [...corners, ...Array.from({ length: 24 }, (_, i) => earthAt(i / 24)), starAt(0), starAt(PAR.YEARS)];
    const xs = box.map((P) => dot(P, r)), ys = box.map((P) => dot(P, up));
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const sc = Math.min(1060 / (x1 - x0), 420 / (y1 - y0));
    return (P) => [W / 2 + sc * (dot(P, r) - (x0 + x1) / 2), 362 - sc * (dot(P, up) - (y0 + y1) / 2)];
  }

  function drawParallax(t, zoom) {
    par.g.textContent = "";
    const y = PAR.YEARS * clamp((t - PAR.run[0]) / (PAR.run[1] - PAR.run[0]));
    const proj = parCamera(PAR.AZ[0] + (PAR.AZ[1] - PAR.AZ[0]) * ease((t - 2) / (PAR.out[0] - 2)));
    // at the end the sky plane fades, and the Sun moves to the centre, to be pulled out of
    const out = ramp(t, ...PAR.out), sun = proj([0, 0, 0]);
    const g = el("g", { transform: `translate(${((W / 2 - sun[0]) * out).toFixed(1)} ${((H / 2 - sun[1]) * out).toFixed(1)})` }, par.g);
    const back = el("g", { opacity: 1 - out }, g);
    el("polygon", { class: "plane", points: pts(corners.map(proj)) }, back);
    for (const [a, b, k] of quasars) {
      const [x, yy] = proj(onPlane(a, b)), r = 4 * k;
      el("path", { class: "quasar", d: `M${x - r} ${yy}H${x + r}M${x} ${yy - r}V${yy + r}` }, back);
    }
    const low = proj(onPlane(0, -PAR.HP));
    label(back, [low[0], low[1] + 26], "kauged kvasarid", "distant quasars", { class: "dim", "text-anchor": "middle" });
    const E = earthAt(y), S = starAt(y), hit = proj(hitAt(y));
    el("polyline", { class: "loops", points: pts(loops.slice(0, Math.round(y * 200) + 1).map(proj)) }, back);
    el("polyline", { class: "orbit", points: pts(Array.from({ length: 97 }, (_, i) => proj(earthAt(i / 96)))) }, g);
    const pE = proj(E), pS = proj(S);
    el("line", { class: "sight", x1: pE[0], y1: pE[1], x2: hit[0], y2: hit[1] }, back);
    el("circle", { class: "hit", cx: hit[0], cy: hit[1], r: 5 }, back);
    el("circle", { class: "sun", cx: sun[0], cy: sun[1], r: Math.max(11, 4 / zoom) }, g);
    el("circle", { class: "earth", cx: pE[0], cy: pE[1], r: 7 }, g);
    const star = [];
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 6, rr = i % 2 ? 11 / Math.sqrt(3) : 11;
      star.push([pS[0] + rr * Math.cos(a), pS[1] + rr * Math.sin(a)]);
    }
    el("polygon", { class: "star", points: pts(star) }, g);
    const names = el("g", { opacity: 1 - out }, g);
    // the Earth is labelled away from the Sun, and the Sun away from the Earth
    const dx = pE[0] - sun[0], dy = pE[1] - sun[1], dl = Math.hypot(dx, dy) || 1;
    label(names, [pE[0] + (dx / dl) * 24, pE[1] + (dy / dl) * 24 + 6], "Maa", "Earth", { "text-anchor": "middle" });
    label(names, [sun[0] - (dx / dl) * 32, sun[1] - (dy / dl) * 32 + 6], "Päike", "Sun", { "text-anchor": "middle" });
    label(names, [pS[0] + 16, pS[1] - 12], "lähedane täht", "nearby star");
  }

  // scene 3: S Nor close up, after the Cepheid page: the light curve has a slow decline and a fast rise
  // (−0.5 at maximum light, phase 0), and the radius is the integral of the outward velocity, which
  // mirrors the light curve
  const cep = { d: CEP, span: [18, 26], g: el("g", { class: "intro-cep" }, world) };
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
    const g = cep.g;
    g.textContent = "";
    const phase = (t - CEPH.t0) / CEPH.CYCLE, dm = dmT(phase);
    const R = 120 * (1 + 0.12 * rShape(phase)), col = tColour(5600 * (1 - 0.2 * dm));
    for (const [k, a] of [[1.35, 0.08], [1.15, 0.16]]) el("circle", { cx: W / 2, cy: H / 2, r: R * k, fill: col, opacity: (a * (1 - dm)).toFixed(3) }, g);
    el("circle", { cx: W / 2, cy: H / 2, r: R, fill: col }, g);
    label(g, [W / 2, H / 2 + 175], "S Nor", "S Nor", { "text-anchor": "middle", class: "name" });
    // the light curve, brighter up, traced from trace[0] on; the period is marked between two maxima
    const X0 = 850, X1 = 1190, Y0 = 360, A = 150, N = 2.4;
    const p0 = (CEPH.trace[0] - CEPH.t0) / CEPH.CYCLE, pNow = Math.min(phase, (CEPH.trace[1] - CEPH.t0) / CEPH.CYCLE);
    const x = (p) => X0 + ((p - p0) / N) * (X1 - X0), y = (p) => Y0 + A * dmT(p);
    const axes = el("g", { opacity: ramp(t, CEPH.trace[0] - 0.4, CEPH.trace[0]) }, g);
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
    const m1 = Math.ceil(p0), m2 = m1 + 1, br = el("g", { opacity: ramp(t, CEPH.t0 + m2 * CEPH.CYCLE, CEPH.t0 + m2 * CEPH.CYCLE + 0.4) }, g);
    const yb = Y0 - A / 2 - 22;
    el("path", { class: "bracket", d: `M${x(m1)} ${yb + 10} V${yb} H${x(m2)} V${yb + 10}` }, br);
    label(br, [(x(m1) + x(m2)) / 2, yb - 12], `P = ${String(CEPH.P).replace(".", ",")} p`, `P = ${CEPH.P} d`, { "text-anchor": "middle" });
  }

  // scene 6: SN 2011fe close up, after the supernova page: a red giant fills its Roche lobe and loses gas
  // through the inner Lagrange point onto a white dwarf, which grows, ignites and explodes
  const sn = { d: SNZ, span: [37, 45], g: el("g", { class: "intro-sn" }, world) };
  const debris = (() => { const r = rng(5); return Array.from({ length: 50 }, () => [r() * 2 * Math.PI, 0.5 + 0.5 * r(), r() < 0.5]); })();
  function drawSupernova(t) {
    const g = sn.g, cx = W / 2, cy = H / 2;
    g.textContent = "";
    const e = clamp((t - SNIA.boom[0]) / (SNIA.boom[1] - SNIA.boom[0]));
    el("ellipse", { cx: cx - 250, cy, rx: 150, ry: 140, fill: "url(#introGiant)" }, g);
    if (e < 0.15) {
      const before = el("g", { opacity: 1 - e / 0.15 }, g);
      // the disc seen at a slant, and the stream in its plane from L1 round to the near rim
      el("ellipse", { class: "disc", cx, cy, rx: 62, ry: 15 }, before);
      const P0 = [-150, 0], P1 = [-70, 110], P2 = [62 * Math.cos(1.75), 62 * Math.sin(1.75)], kv = 15 / 62;
      const bez = (u) => [cx + (1 - u) ** 2 * P0[0] + 2 * u * (1 - u) * P1[0] + u * u * P2[0], cy + kv * ((1 - u) ** 2 * P0[1] + 2 * u * (1 - u) * P1[1] + u * u * P2[1])];
      el("polyline", { class: "stream", points: pts(Array.from({ length: 25 }, (_, i) => bez(i / 24))) }, before);
      for (let k = 0; k < 9; k++) {
        const p = bez((k / 9 + t * 0.35) % 1);
        el("circle", { class: "blob", cx: p[0], cy: p[1], r: 2.6 }, before);
      }
      el("circle", { cx, cy, r: 26, fill: "url(#introWd)" }, before);
      el("circle", { class: t >= SNIA.ignite ? "wd lit" : "wd", cx, cy, r: 7 }, before);
      const names = el("g", { opacity: 1 - ramp(t, SNIA.ignite, SNIA.boom[0]) }, before);
      label(names, [cx - 250, cy + 180], "punane hiid", "red giant", { "text-anchor": "middle" });
      label(names, [cx + 20, cy + 52], "valge kääbus", "white dwarf");
      const M = 1.3 + 0.08 * ramp(t, ...SNIA.gain);
      label(names, [cx + 20, cy + 76], `${M.toFixed(2).replace(".", ",")} M☉`, `${M.toFixed(2)} M☉`, { class: "dim" });
    }
    if (e > 0) {
      const r = 12 + 560 * Math.sqrt(e);
      el("circle", { cx, cy, r, fill: "url(#introBoom)", opacity: clamp(1.4 - e, 0.3, 1) }, g);
      for (const [a, k, warm] of debris) el("circle", { class: warm ? "spark warm" : "spark", cx: cx + r * k * Math.cos(a), cy: cy + r * k * Math.sin(a), r: 2.4 }, g);
    }
  }

  // scene 2: the bright Pleiades are dotted where they are in the image (north up, east left, 2.6° wide, from
  // tools/intro-images.sh); the fainter members and the field stars are schematic, with the proper motion
  // and the parallax of the cluster (μα* ≈ 20, μδ ≈ −45 mas/a, ϖ ≈ 7.4 mas) and a spread of field stars
  const pm = el("g", { class: "intro-plot intro-pm" }, svg);
  const pmDim = el("rect", { class: "intro-dim", width: W, height: H }, pm);
  const skyPx = (ra, dec) => {
    const [a, d, a0, d0] = [ra, dec, 56.75, 24.117].map((v) => v * rad), c = Math.cos(a - a0);
    const cosc = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * c, k = 1280 / 2.6 / rad / cosc;
    return [W / 2 - k * Math.cos(d) * Math.sin(a - a0), H / 2 - k * (Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * c)];
  };
  const PMB = { x0: 150, x1: 570, y0: 140, y1: 500, ma: -30, md: 6, k: 5 };          // 5 px per mas/a
  const HB = { x0: 710, x1: 1130, y1: 500, p0: 5.5, p1: 9.5, bin: 0.25, h: 15 };
  const pmX = (ma) => PMB.x0 + (ma - PMB.ma) * PMB.k, pmY = (md) => PMB.y0 + (PMB.md - md) * PMB.k;
  const hX = (p) => HB.x0 + ((p - HB.p0) / (HB.p1 - HB.p0)) * (HB.x1 - HB.x0);
  const CLUMP = [pmX(20), pmY(-45)];
  const pmStars = [];
  {
    const r = rng(445), gauss = () => (r() + r() + r() + r() - 2) * 1.22;
    const bright = [[56.8712, 24.1051], [57.2906, 24.0534], [56.2189, 24.1133], [56.4566, 24.3678], [56.5816, 23.9483],
      [56.3021, 24.4672], [57.2968, 24.1367], [56.2007, 24.2894], [56.4769, 24.5545], [56.4513, 24.8372]];
    for (let i = 0; i < 28; i++) {
      const sky = i < bright.length ? skyPx(...bright[i]) : [W / 2 + gauss() * 150, H / 2 + gauss() * 110];
      pmStars.push({ sky, v: [20 + 1.6 * gauss(), -45 + 1.6 * gauss()], plx: 7.36 + 0.3 * gauss(), member: true, r: i < bright.length ? 6 : 4.5 });
    }
    while (pmStars.length < 92) {
      const v = [2 + 17 * gauss(), -18 + 15 * gauss()], p = [pmX(v[0]), pmY(v[1])];
      if (p[0] < PMB.x0 + 8 || p[0] > PMB.x1 - 8 || p[1] < PMB.y0 + 8 || p[1] > PMB.y1 - 8 || Math.hypot(p[0] - CLUMP[0], p[1] - CLUMP[1]) < 55) continue;
      pmStars.push({ sky: [40 + r() * (W - 80), 150 + r() * 420], v, member: false, r: 3.5 });
    }
    // the members stack in the bins of the histogram by their parallax
    const stack = {};
    for (const s of pmStars.filter((s) => s.member).sort((a, b) => a.plx - b.plx)) {
      const b = Math.floor((s.plx - HB.p0) / HB.bin);
      stack[b] = (stack[b] || 0) + 1;
      s.block = [hX(HB.p0 + b * HB.bin), HB.y1 - stack[b] * HB.h];
    }
    pmStars.filter((s) => s.member).forEach((s, i, a) => (s.order = i / a.length));
  }
  const pmPanels = el("g", {}, pm);
  const panel = (x0, x1) => el("rect", { class: "panel", x: x0 - 70, y: PMB.y0 - 30, width: x1 - x0 + 100, height: PMB.y1 - PMB.y0 + 108, rx: 10 }, pmPanels);
  panel(PMB.x0, PMB.x1);
  panel(HB.x0, HB.x1);
  el("path", { class: "axis", d: `M${PMB.x0} ${PMB.y0} V${PMB.y1} H${PMB.x1}` }, pmPanels);
  label(pmPanels, [(PMB.x0 + PMB.x1) / 2, PMB.y1 + 34], "omaliikumine μα*", "proper motion μα*", { "text-anchor": "middle", class: "dim" });
  label(pmPanels, [PMB.x0 - 22, (PMB.y0 + PMB.y1) / 2], "μδ", "μδ", { "text-anchor": "middle", class: "dim" });
  el("path", { class: "axis", d: `M${HB.x0} ${PMB.y0} V${HB.y1} H${HB.x1}` }, pmPanels);
  for (const p of [6, 7, 8, 9]) {
    el("line", { class: "axis", x1: hX(p), y1: HB.y1, x2: hX(p), y2: HB.y1 + 7 }, pmPanels);
    label(pmPanels, [hX(p), HB.y1 + 30], String(p), String(p), { "text-anchor": "middle", class: "dim" });
  }
  label(pmPanels, [(HB.x0 + HB.x1) / 2, HB.y1 + 62], "parallaks ϖ (mas)", "parallax ϖ (mas)", { "text-anchor": "middle" });
  const lassoPath = (() => {
    const p = [];
    for (let i = 0; i <= 60; i++) {
      const a = (i / 60) * 2 * Math.PI, k = 1 + 0.1 * Math.sin(3 * a + 1) + 0.05 * Math.sin(5 * a);
      p.push([CLUMP[0] + 38 * k * Math.cos(a), CLUMP[1] + 33 * k * Math.sin(a)]);
    }
    return "M" + pts(p).replaceAll(" ", " L") + "Z";
  })();
  const lasso = el("path", { class: "lasso", d: lassoPath, pathLength: 1 }, pm);
  const arrows = el("path", { class: "arrows" }, pm);
  const blocks = el("g", {}, pm);
  for (const s of pmStars) {
    s.dot = el("circle", { class: "star", r: s.r }, pm);
    if (s.member) s.copy = el("circle", { class: "star sel", r: s.r * 0.7 }, pm);
    if (s.member) s.rect = el("rect", { class: "block", x: s.block[0], y: s.block[1], width: hX(HB.p0 + HB.bin) - hX(HB.p0), height: HB.h }, blocks);
  }
  const pmRead = el("g", {}, pm);
  const PLX = 7.4;
  el("line", { class: "fit", x1: hX(PLX), y1: HB.y1, x2: hX(PLX), y2: PMB.y0 + 70, "stroke-dasharray": "6 6" }, pmRead);
  label(pmRead, [hX(PLX) + 14, PMB.y0 + 20], "ϖ ≈ 7,4 mas", "ϖ ≈ 7.4 mas", { class: "dim" });
  label(pmRead, [hX(PLX) + 14, PMB.y0 + 58], "d ≈ 135 pc", "d ≈ 135 pc", { class: "read" });
  function drawGaia(t) {
    const op = ramp(t, GAIA.dots[0] - 0.1, GAIA.dots[0] + 0.1) * (1 - ramp(t, ...GAIA.out));
    show(pm, t > GAIA.dots[0] - 0.1 && t < GAIA.out[1] ? op : 0);
    if (!(op > 0)) return;
    const a = ramp(t, ...GAIA.dots), m = ramp(t, ...GAIA.move), sel = ramp(t, ...GAIA.sel);
    show(pmDim, 0.45 * a);
    show(pmPanels, m);
    // the arrows grow with the proper motion, east to the left and north up, and shrink into the
    // dots as they fly into the plot
    let d = "";
    for (const s of pmStars) {
      const p = [s.sky[0] + (pmX(s.v[0]) - s.sky[0]) * m, s.sky[1] + (pmY(s.v[1]) - s.sky[1]) * m];
      const len = a * (1 - m) * 1.1, e = [p[0] - s.v[0] * len, p[1] - s.v[1] * len];
      if (len > 0.05) {
        const ux = (e[0] - p[0]) / Math.hypot(...s.v) / len, uy = (e[1] - p[1]) / Math.hypot(...s.v) / len, h = 7 * a * (1 - m);
        d += `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${e[0].toFixed(1)} ${e[1].toFixed(1)}` +
          `M${(e[0] - h * ux - h * 0.5 * uy).toFixed(1)} ${(e[1] - h * uy + h * 0.5 * ux).toFixed(1)}L${e[0].toFixed(1)} ${e[1].toFixed(1)}` +
          `L${(e[0] - h * ux + h * 0.5 * uy).toFixed(1)} ${(e[1] - h * uy - h * 0.5 * ux).toFixed(1)}`;
      }
      // copies of the selected stars drop one after another into their bins, where they become blocks
      if (s.member) {
        const u = clamp((t - GAIA.drop[0] - s.order * (GAIA.drop[1] - GAIA.drop[0] - 0.35)) / 0.35);
        const to = [s.block[0] + (hX(HB.p0 + HB.bin) - hX(HB.p0)) / 2, s.block[1] + HB.h / 2], k = ease(u);
        set(s.copy, { cx: (p[0] + (to[0] - p[0]) * k).toFixed(1), cy: (p[1] + (to[1] - p[1]) * k - 60 * Math.sin(Math.PI * k)).toFixed(1) });
        show(s.copy, u > 0 && u < 1 ? 1 : 0);
        show(s.rect, u >= 1 ? 1 : 0);
        s.dot.setAttribute("class", sel > 0.5 ? "star sel" : "star");
      }
      set(s.dot, { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: s.r * (0.6 + 0.4 * a) * (1 - 0.3 * m) });
      show(s.dot, a);
    }
    arrows.setAttribute("d", d);
    const l = clamp((t - GAIA.lasso[0]) / (GAIA.lasso[1] - GAIA.lasso[0]));
    show(lasso, l > 0 ? 1 : 0);
    set(lasso, { "stroke-dasharray": `${l} 1`, "fill-opacity": 0.14 * ramp(t, GAIA.lasso[1] - 0.1, GAIA.sel[1]) });
    show(pmRead, ramp(t, ...GAIA.read));
  }

  // scene 4: the period–luminosity plot, brighter up. The points are schematic, scattered about a line
  // of the slope of the V-band relation, so that the plot does not give away the answers of part 2
  const dim = el("rect", { class: "intro-dim", width: W, height: H }, svg);
  const plot = el("g", { class: "intro-plot" }, svg);
  const PB0 = { x0: 400, x1: 900, y0: 150, y1: 530, lp: [0.3, 1.7], M: [-1.6, -6.6] };
  const px = (lp) => PB0.x0 + ((lp - PB0.lp[0]) / (PB0.lp[1] - PB0.lp[0])) * (PB0.x1 - PB0.x0);
  const py = (M) => PB0.y1 + ((M - PB0.M[0]) / (PB0.M[1] - PB0.M[0])) * (PB0.y0 - PB0.y1);
  const plM = (lp) => -2.43 * (lp - 1) - 4.05;
  const CLUSTERS = [[0.6, 0.12], [1.38, -0.1], [0.72, -0.16], [1.12, 0.14], [0.84, 0.05], [1.52, 0.08], [0.95, -0.12], [1.25, -0.05]];
  const S_NOR = [Math.log10(CEPH.P), 0.06];
  el("rect", { class: "panel", x: PB0.x0 - 80, y: PB0.y0 - 40, width: PB0.x1 - PB0.x0 + 120, height: PB0.y1 - PB0.y0 + 110, rx: 10 }, plot);
  el("path", { class: "axis", d: `M${PB0.x0} ${PB0.y0 - 14} V${PB0.y1} H${PB0.x1 + 14}` }, plot);
  el("path", { class: "axis", d: `M${PB0.x0 - 6} ${PB0.y0 - 2} L${PB0.x0} ${PB0.y0 - 14} L${PB0.x0 + 6} ${PB0.y0 - 2}` }, plot);
  for (const lp of [0.5, 1, 1.5]) {
    el("line", { class: "axis", x1: px(lp), y1: PB0.y1, x2: px(lp), y2: PB0.y1 + 7 }, plot);
    label(plot, [px(lp), PB0.y1 + 30], String(lp).replace(".", ","), String(lp), { "text-anchor": "middle", class: "dim" });
  }
  label(plot, [(PB0.x0 + PB0.x1) / 2, PB0.y1 + 60], "log P (P päevades)", "log P (P in days)", { "text-anchor": "middle" });
  label(plot, [PB0.x0 - 22, (PB0.y0 + PB0.y1) / 2], "heledus M", "luminosity M", { "text-anchor": "middle", transform: `rotate(-90 ${PB0.x0 - 22} ${(PB0.y0 + PB0.y1) / 2})` });
  const fitLine = el("line", { class: "fit" }, plot);
  const fitName = el("g", {}, plot);
  label(fitName, [px(1.62), py(plM(1.62)) - 22], "sobitatud sirge", "fitted line", { "text-anchor": "end" });
  const dots = CLUSTERS.map(([lp, dM]) => el("circle", { class: "pt", cx: px(lp), cy: py(plM(lp) + dM) }, plot));
  const snorDot = el("circle", { class: "pt", r: 8 }, svg);
  const snorRing = el("circle", { class: "intro-ring", r: 24 }, svg);
  const snorName = el("g", { class: "intro-plot" }, svg);
  const snorText = el("text", { "text-anchor": "start" }, snorName);
  snorText.textContent = "S Nor";
  function drawPlot(t) {
    show(dim, 0.6 * ramp(t, ...PLT.dim) * (1 - ramp(t, ...PLT.undim)));
    show(plot, ramp(t, PLT.dim[0], PLT.dim[1]) * (1 - ramp(t, ...PLT.out)));
    // into the corner above the left end of the distance scale
    const c = ramp(t, ...PLT.corner), k = 1 - 0.68 * c;
    const ox = (PB0.x0 - 80) * (1 - k) + (24 - (PB0.x0 - 80)) * c, oy = (PB0.y0 - 40) * (1 - k) + (378 - (PB0.y0 - 40)) * c;
    set(plot, { transform: `translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${k.toFixed(3)})` });
    dots.forEach((d, i) => {
      const a = PLT.others + i * PLT.step;
      d.setAttribute("r", (7 * ramp(t, a, a + 0.25)).toFixed(2));
    });
    const f = ramp(t, ...PLT.fit);
    set(fitLine, { x1: px(0.35), y1: py(plM(0.35)), x2: px(0.35 + 1.3 * f), y2: py(plM(0.35 + 1.3 * f)) });
    show(fitLine, f > 0 ? 1 : 0);
    show(fitName, ramp(t, PLT.fit[1], PLT.fit[1] + 0.4));
    // S Nor, ringed in the image, flies onto the plot along an arc and then stays there as one of its points
    const w = track(FOCUS, t), from = [IMAGES[1].focus[0] * (1 - w) + (W / 2) * w, IMAGES[1].focus[1] * (1 - w) + (H / 2) * w];
    const to = [px(S_NOR[0]), py(plM(S_NOR[0]) + S_NOR[1])], u = ramp(t, ...PLT.fly);
    const mid = [(from[0] + to[0]) / 2, Math.min(from[1], to[1]) - 120];
    const pos = [0, 1].map((i) => (1 - u) ** 2 * from[i] + 2 * u * (1 - u) * mid[i] + u * u * to[i]);
    const ring = inOut(t, PLT.dim[0], PLT.fly[0] + 0.2);
    show(snorRing, ring);
    set(snorRing, { cx: from[0], cy: from[1] });
    const flying = t >= PLT.dim[0] && t < PLT.fly[1];
    show(snorDot, flying ? 1 : 0);
    set(snorDot, { cx: pos[0], cy: pos[1] });
    show(snorName, flying ? 1 : 0);
    set(snorText, { x: pos[0] + 16, y: pos[1] - 12 });
  }
  // after the flight S Nor is drawn in the plot, so that it moves to the corner with it
  const snorInPlot = el("circle", { class: "pt", cx: px(S_NOR[0]), cy: py(plM(S_NOR[0]) + S_NOR[1]), r: 8 }, plot);
  // the Cepheids of M101 on the line of the plot, hollow, as their luminosity is read from it
  const m101Pts = M101_CEPS.map((c) => el("circle", { class: "pt m101", cx: px(c.lp), cy: py(plM(c.lp)), r: 9 }, plot));

  // the Cepheids of M101 blink one after another in scene 5, and again next to SN 2011fe in scene 7
  const cepStart = (t, i) => (t < M101C.again[0] - 1 ? M101C.blink[0] : M101C.again[0]) + 0.25 * i;
  function drawM101(t) {
    const scene5 = t < M101C.again[0] - 1;
    const end = scene5 ? HUB.in[0] : M101C.again[1] + 0.4;
    M101_CEPS.forEach((c, i) => {
      const s = cepStart(t, i), u = (t - s) / 0.6;
      show(c.g, inOut(t, s, end, 0.15));
      c.dot.setAttribute("r", (4 + (u > 0 && u < 1 ? 4 * Math.max(0, Math.sin(2 * Math.PI * u * 2)) : 0)).toFixed(2));
      if (scene5) show(m101Pts[i], ramp(t, s + 0.3, s + 0.5) * (1 - ramp(t, ...PLT.out)));
      else show(m101Pts[i], 0);
    });
    show(cepName, inOut(t, cepStart(t, 0), end - 0.3));
    show(m101Read, inOut(t, M101C.read[0], HUB.out[0] + 0.2));
    show(snName, inOut(t, M101C.again[0], SNIA.fade[0] + 0.3));
  }

  // scenes 5 and 7: the Hubble plot, velocity against distance, with the same slope on the screen at every
  // width (80 km/s per Mpc of the axis). The points are schematic: the galaxies of part 3 with their Cepheid
  // distances, and in scene 7 supernovae far out along the same line.
  const hDim = el("rect", { class: "intro-dim", width: W, height: H }, svg);
  const hub = el("g", { class: "intro-plot intro-hub" }, svg);
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
  function drawHubble(t) {
    const fade = ramp(t, ...HUB.in) * (1 - ramp(t, ...HUB.out)) + ramp(t, ...HUB.back) * (1 - ramp(t, T5, T5 + 0.5));
    show(hub, fade);
    show(hDim, 0.6 * fade);
    if (!(fade > 0)) { show(hM101Name, 0); return; }
    const w = ramp(t, ...HUB.widen), xmax = 25 * 20 ** w, vmax = 80 * xmax;
    const hx = (d) => HPB.x0 + (d / xmax) * (HPB.x1 - HPB.x0), hy = (v) => HPB.y1 - (v / vmax) * (HPB.y1 - HPB.y0);
    for (const k of hTicks) {
      const gap = ((k.v < 100 ? 10 : 100) / xmax) * (HPB.x1 - HPB.x0);
      show(k.g, clamp((gap - 26) / 22) * clamp((xmax - 0.9 * k.v) / (0.1 * k.v)));
      k.g.setAttribute("transform", `translate(${hx(k.v).toFixed(1)} 0)`);
    }
    const shrink = 1 - 0.3 * w;
    hGal.forEach((c, i) => {
      const a = HUB.others + i * HUB.step;
      set(c, { cx: hx(HUB_GAL[i][0]), cy: hy(HUB_GAL[i][1]), r: (7 * shrink * ramp(t, a, a + 0.25)).toFixed(2) });
    });
    hSn.forEach((c, i) => {
      const a = HUB.sne + i * HUB.sneStep;
      set(c, { cx: hx(HUB_SN[i][0]), cy: hy(HUB_SN[i][1]), r: (7 * ramp(t, a, a + 0.2)).toFixed(2) });
    });
    // M101 flies from its image onto the plot along an arc, with its name
    const to = [hx(HUB_M101[0]), hy(HUB_M101[1])], u = ramp(t, ...HUB.fly), from = [W / 2, H / 2];
    const mid = [(from[0] + to[0]) / 2, Math.min(from[1], to[1]) - 120];
    const pos = [0, 1].map((i) => (1 - u) ** 2 * from[i] + 2 * u * (1 - u) * mid[i] + u * u * to[i]);
    set(hM101, { cx: pos[0], cy: pos[1], r: 8 * shrink });
    set(hM101Name, { x: pos[0] + 14, y: pos[1] + 26 });
    show(hM101Name, 1 - w);
    // the line through the origin is drawn outwards
    const f = ramp(t, ...HUB.fit), e = 0.97 * xmax * f;
    set(hLine, { x1: hx(0), y1: hy(0), x2: hx(e), y2: hy(H0 * e) });
    show(hLine, f > 0 ? 1 : 0);
    set(hSlopeText, { x: hx(0.8 * xmax) + 14, y: hy(H0 * 0.8 * xmax) + 30 });
    show(hSlope, ramp(t, HUB.fit[1], HUB.fit[1] + 0.3));
    show(hRead, ramp(t, ...HUB.read));
  }

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

  // the bars of the rungs above the axis, which become the rungs of the ladder in scene 8
  const LANE = [672, 664, 656];
  const halos = el("g", {}, svg);
  const bars = RUNGS.map((r, i) => {
    const halo = el("line", { class: `intro-halo ${r.cls}` }, halos);
    const line = el("line", { class: `intro-bar ${r.cls}` });
    return { ...r, line, halo, y: LANE[i] };
  });

  // scene 8: a copy of the ladder figure of the page, with its links made plain groups
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

  // ---- draw(t) ----

  function drawWorld(t, fade) {
    const cam = track(CAMERA, t), w = track(FOCUS, t);
    // the near field of galaxies is panned to F, and the layers at home in it are moved with it
    const gp = track(GALPAN, t), F = [G_MW[0] + (G_M101[0] - G_MW[0]) * gp, G_MW[1] + (G_M101[1] - G_MW[1]) * gp];
    const kGal = 10 ** (GAL - cam);
    for (const layer of [far, gal, mw, ...layers, par, cep, sn]) {
      const ls = layer.d - cam;           // log of the layer's scale
      // an image is never shown much more than twice its size, where it turns blocky; the Milky Way is
      // drawn, so it can come in from much larger
      const [hi, lo] = layer.fade || [layer === mw ? 3.5 : 0.75, -2.4];
      let op = Math.min(clamp((hi - ls) / 0.45), clamp((ls - lo) / 1.2)) * fade;
      const spans = layer.spans || (layer.span && [layer.span]);
      if (spans && !spans.some(([a, b]) => t >= a && t <= b)) op = 0;
      // the Sun stays a dot while the camera pulls out, until the Pleiades come in around it
      if (layer === par) op = ramp(t, 2, 2.6) * (1 - ramp(t, 10.1, 10.5)) * fade;
      show(layer.g, op);
      if (op <= 0) continue;
      // a zoom into an image centres on its object, so that the close-up drawn there grows out of it
      let [fx, fy] = layer.focus ? [W / 2 + (layer.focus[0] - W / 2) * w, H / 2 + (layer.focus[1] - H / 2) * w] : [W / 2, H / 2];
      if (layer === gal) [fx, fy] = F;
      if (layer === mw) {
        const p = ramp(t, ...MW.pan) * (1 - ramp(t, ...MW.back));
        [fx, fy] = [SUN[0] + (MW_NGC[0] - SUN[0]) * p, SUN[1] + (MW_NGC[1] - SUN[1]) * p];
        show(mwNames, inOut(t, ...MW.show));
        show(mwMarks, t < MW.back[0] ? 1 : 0);
      }
      const [ox, oy] = layer.home ? [kGal * (layer.home[0] - F[0]), kGal * (layer.home[1] - F[1])] : [0, 0];
      set(layer.g, { transform: `translate(${(W / 2 + ox).toFixed(1)} ${(H / 2 + oy).toFixed(1)}) scale(${10 ** ls}) translate(${-fx} ${-fy})` });
      if (layer.inner) {
        // at a third of its size or less, the image is gone already at the middle of its sides (0.5 / 0.71)
        const k = clamp(-ls / 0.45);
        layer.inner.setAttribute("offset", (0.72 - 0.5 * k).toFixed(3));
        layer.outer.setAttribute("offset", (1 - 0.3 * k).toFixed(3));
      }
      if (layer === par) drawParallax(t, 10 ** ls);
      if (layer === cep) drawCepheid(t);
      if (layer === sn) drawSupernova(t);
      if (layer === far) drawFlashes(t, 10 ** ls);
    }
    const f = ramp(t, SNIA.boom[0] + 0.6, SNIA.boom[0] + 1) * (1 - ramp(t, ...SNIA.fade));
    show(flare, f);
    flare.setAttribute("r", 14 + 10 * (1 - ramp(t, SNIA.boom[1], SNIA.fade[0])));
  }

  function drawScale(t, fade) {
    show(scale, ramp(t, 0.4, 1.4) * fade);
    const m = track(MARKER, t);
    set(marker, { transform: `translate(${ax(m)} ${AXY})` });
    for (const lm of marks) show(lm.g, lm.after && t < lm.after ? 0 : clamp((m - lm.d) / 0.15 + 1));
  }

  // the bars on the scale, and in scene 8 their way to the rungs of the ladder, which light up in turn
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

  let sceneIdx = -1;
  function draw(t) {
    t = clamp(t, 0, DURATION);
    const end = ramp(t, T5, T5 + 0.8);    // scene 8: the sky gives way to the page
    sky.style.fill = `color-mix(in srgb, var(--bg) ${end * 100}%, var(--intro-sky))`;
    show(stars, 1 - end);
    show(shadeTop, 1 - end);
    drawWorld(t, 1 - end);
    drawGaia(t);
    drawPlot(t);
    show(snorInPlot, t >= PLT.fly[1] ? 1 : 0);
    drawM101(t);
    drawHubble(t);
    drawScale(t, 1 - ramp(t, T5, T5 + 0.5));
    drawBars(t);
    drawLadder(t);

    const i = SCENES.findIndex((s) => t < s.end);
    const s = SCENES[i < 0 ? SCENES.length - 1 : i];
    if (s !== SCENES[sceneIdx]) {
      sceneIdx = SCENES.indexOf(s);
      caption.innerHTML = sp(s.et, s.en);
    }
    caption.style.opacity = inOut(t, s.cap[0], s.cap[1]);
    caption.style.color = `color-mix(in srgb, var(--text-1) ${end * 100}%, var(--intro-sky-text))`;
  }
  // the frame at time t, or the key frame of its scene when motion is reduced
  function render(t) {
    const s = SCENES.find((s) => t < s.end) || SCENES.at(-1);
    draw(still.matches ? s.key : t);
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
    for (const layer of layers) if (!layer.img.getAttribute("href")) layer.img.setAttribute("href", layer.src);
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
