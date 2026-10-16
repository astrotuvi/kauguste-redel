# Design: intro animation

A short animation on the home page of `index.html` that shows the idea of
the cosmic distance ladder and what the user does in the four parts of the
exercise. It runs for 26 s, under the 30 s limit, with room for the
captions to be read.

Like the other pages, it is built from SVG and a script, with no external
dependencies. Unlike them, its code is in files of its own (see
Implementation). It uses the colours of the ladder figure on the
home page: `--sel` for parallax (part 1), `--cep` for Cepheids (parts 2–3),
`--accent` for supernovae (part 4) and `--text-3` for the Hubble law. Each
rung looks the same in the animation as on the home page and in the table
of contents.

## Where it lives

The animation plays in a window over the home page, like the **Suurenda**
view of the plots in part 1: the page dims behind it, and the scene is
16 : 9, as wide as the page allows (at most 1100 px, about 620 px high).
The ladder figure is too small for it: it is 350 px wide, about 245 px
high, which leaves no room for an image, a plot, a caption and the
distance scale at once. A full-width scene in the page itself would push
the table of contents down and change the layout of the home page for
everyone, also when the animation is not playing.

When it ends, the ladder of the last frame shrinks and flies to the ladder
figure on the page, and the window closes, so the user ends up on the home
page as it is now, with the figure they have just seen built.

- On the home page, a **Vaata tutvustust (26 s)** button sits below the
  ladder figure. The animation never plays by itself: users come back to
  this page many times, and a teacher may open it in front of a class.
- **Peata / Jätka**, **Algusest** and **Jäta vahele** buttons under the
  scene, and a progress bar with a mark for each part. Clicking a mark jumps
  to the start of that scene. Space pauses and Esc skips.
- **Jäta vahele**, Esc and a click outside the scene close the window.
- On a phone the window fills the screen, and the scene keeps 16 : 9.
- With `prefers-reduced-motion`, the button shows the six key frames as
  still images in a row, with the same captions, instead of the animation.

## One thread through the scenes: the distance scale

Along the bottom of the scene runs a log distance scale from 1 au to
1 Gpc, with tick labels **au, pc, kpc, Mpc, Gpc**. A marker on it shows how
far away the current scene is. Each rung adds a coloured bar to the scale
for its range, as in the ladder figure: parallax up to ~5 kpc, Cepheids up
to ~40 Mpc, supernovae beyond 1 Gpc. The scale is what ties the scenes
together: the user sees the reach grow by powers of ten, and each bar starts
where the one below it already overlaps.

The scale is drawn new for the animation: a single thin axis, not the
boxed bars of the removed schematic (commit `e0a358d`). Only its numbers
are taken from there: the ranges of the rungs (Gaia ~50 pc – 5 kpc,
Cepheids 300 pc – 40 Mpc, supernovae 7 Mpc – beyond 1 Gpc) and some of its
landmarks. The landmarks are small labelled ticks that appear only as the
marker passes them: the objects of the scenes (Plejaadid, NGC 6087, M101),
plus Andromeeda galaktika and Neitsi parv for a sense of scale.

## Real objects

Each scene is built around a real object from the exercise, so the user
meets them again in the parts:

| Scene | Object | In the exercise | Distance |
|---|---|---|---|
| 1 | Pleiades | first example in part 1 | ≈ 135 pc |
| 2 | NGC 6087 with the Cepheid S Nor (P = 9.75 d) | cluster in part 2 | ≈ 1 kpc |
| 3 | M101 | galaxy in part 3 | ≈ 7 Mpc |
| 4 | SN 2011fe in M101 | supernova in part 4 | ≈ 7 Mpc |

S Nor has a period close to 10 d, the pivot of the period–luminosity
relation (log P = 1), and it is one of the brightest Cepheids in a cluster.
M101 is a large, face-on spiral that looks good in an image, and SN 2011fe
lets scene 4 show both candles in the same galaxy.

The objects are shown in DSS2 colour images from CDS hips2fits, the same
service as the sky images in part 1. The Pleiades with their blue
reflection nebula open the animation.

The images are stored with the page, so the animation starts at once:

- `img/intro/plejaadid.jpg`, `img/intro/ngc6087.jpg`, `img/intro/m101.jpg`,
  each 1280 × 720 px (the size of the scene at its largest), JPEG at about
  100–200 kB each.
- A small script `tools/intro-images.sh` fetches them from hips2fits with
  the centre, field of view and projection of each, so that they can be
  made again, and records the parameters in a comment.
- The credit (DSS2 colour, CDS hips2fits) goes in the footer of the home
  page, next to the existing credit for the sky images.

The camera pulls out between the scenes, so that each rung leaves the
previous scene behind as a small object in the next one: Earth's orbit
becomes a dot in the cluster, the cluster a dot in the Milky Way, the Milky
Way a dot among galaxies.

## Storyboard

Times are in seconds. Each scene has one caption of at most eight words
at the top of the scene, in Estonian or English according to the language
of the page (`data-l`). The captions below are drafts.

| # | Time | Rung | Caption (et) | Caption (en) |
|---|---|---|---|---|
| 0 | 0–2 | – | Kui kaugel on galaktikad? | How far away are the galaxies? |
| 1 | 2–8 | Parallaks · 1. osa | Parallaks annab Plejaadide kauguse | Parallax gives the distance of the Pleiades |
| 2 | 8–13 | Tsefeiidid · 2. osa | Parvede tsefeiidid kalibreerivad seose | Cluster Cepheids calibrate the relation |
| 3 | 13–18 | Tsefeiidid · 3. osa | Tsefeiidid annavad galaktikate kaugused | Cepheids give the distances of galaxies |
| 4 | 18–23 | Supernoovad · 4. osa | Supernoovad ulatuvad sadade megaparsekiteni | Supernovae reach hundreds of megaparsecs |
| 5 | 23–26 | – | Redel – ronime pulkhaaval | The ladder – one rung at a time |

### 0. Title (0–2 s)

A dark sky with a few stars. The caption fades in. The distance scale fades
in at the bottom, empty, with the marker at 1 au.

### 1. Parallax and the cluster (2–8 s) — part 1

- 2–4 s: the Sun with Earth on its orbit seen at an angle, as on the
  parallaks page. Earth moves half way round. A nearby star shifts against
  the distant background stars, and two sight lines show the parallax angle.
- 4–5.5 s: the camera pulls out. The orbit shrinks to a dot, and the DSS2
  image of the Pleiades fades in around it. The marker on the scale slides
  to the Plejaadid landmark.
- 5.5–7 s: the image dims, and the stars in it get dots and short arrows
  for their proper motions. The scene
  becomes the proper-motion plot: the field stars spread out, the cluster
  stars bunch together. A lasso is drawn round the clump, and the selected
  stars turn `--sel` blue, as in the Joonised tab.
- 7–8 s: the selected stars drop into a parallax histogram that peaks, and
  a readout shows the cluster distance, **d ≈ 135 pc**. The `--sel` bar
  grows on the scale up to ~5 kpc.

This is the one scene that shows the user's own action (the lasso), because
it is the step in the exercise that most needs explaining.

### 2. Period–luminosity relation (8–13 s) — part 2

- 8–10 s: the Pleiades have no Cepheids, so the camera moves on to
  NGC 6087, about 1 kpc away. The marker slides there, still inside the
  `--sel` bar: Gaia gives its distance in the same way. In the DSS2 image,
  S Nor brightens and fades, and its light curve is traced beside it with
  the period of 9.75 d marked by a bracket.
- 10–12 s: S Nor leaves the cluster as a point that flies onto a plot of
  M against log P, at log P ≈ 1. Points for the other clusters of part 2
  follow, all `--cep` red.
- 12–13 s: a line is fitted through the points. It stays in a corner of the
  scene for the next scene to use.

### 3. Galaxies and the Hubble law (13–18 s) — part 3

- 13–14.5 s: the camera pulls out of the Milky Way, which shrinks to a small
  spiral among other galaxies. The marker slides to ~20 Mpc.
- 14.5–16 s: one of them becomes the DSS2 image of M101, with a few
  Cepheids blinking in it. Their periods go through the line from scene 2,
  and M101 gets its distance label at the M101 landmark. The `--cep` bar
  grows to ~40 Mpc.
- 16–18 s: the galaxies become points on a plot of velocity against
  distance. A line through the origin is fitted, with its slope labelled
  **H₀**.

### 4. Supernovae (18–23 s) — part 4

- 18–19.5 s: back in M101, SN 2011fe flares next to its Cepheids. The two
  candles in one galaxy show how the supernova is calibrated: its peak
  brightness is found from the Cepheid distance.
- 19.5–21.5 s: the camera pulls out to hundreds of Mpc. Many faint galaxies,
  and supernovae flash in them one after another, `--accent` orange. The
  marker slides to ~500 Mpc, and the `--accent` bar grows past 1 Gpc.
- 21.5–23 s: the Hubble plot from scene 3 widens, its points crowd into the
  lower left, and the supernovae add points far out along the same line.
  The readout shows **H₀ ≈ 73 km/s/Mpc**. The text says that this is what
  the user will measure, not a given answer.

### 5. The ladder (23–26 s)

The scene fades, and the three bars of the distance scale turn and stack
into the three rungs of the ladder figure, with the icons and labels of the
home page. Each rung briefly lights up in turn from the bottom with its
part number. In the last frame the animation is replaced by the ladder
figure itself, and a **Alusta 1. osast** button appears beside it that goes
to `#osa-1`.

## Motion

- Scene changes are camera moves (a zoom of the SVG viewBox on a log scale)
  rather than cuts, 1–1.5 s each, eased in and out. Cuts would break the
  feeling of going outward.
- Nothing moves faster than the eye can follow while a caption changes: a
  caption fades in only after the camera has stopped.
- At most two things move at once. Points that fly into a plot do so one
  after another, 0.1–0.2 s apart.
- No sound. The captions carry the story, so it also works in a quiet
  classroom or with the sound off.

## Implementation

- The code is in its own files, `intro.js` and `intro.css`, next to
  `index.html`. The script builds the window and the SVG scene itself, so
  `index.html` only gets the **Vaata tutvustust** button, a `<link>` to the
  stylesheet and a `<script defer src="intro.js">`. Both files are loaded
  with the page, but the script does nothing until the button is pressed.
- `intro.css` uses the colour tokens defined in `index.html` (`--sel`,
  `--cep`, `--accent`, `--text-3`, …) and defines no colours of its own,
  except for the dark sky.
- The captions in both languages are in `intro.js`, and the script picks
  them by `document.documentElement.lang`, which the language buttons set. When the
  language changes during the animation, the caption changes with it.
- The page opens from a file as well as from a server (`file://` works
  for scripts and images loaded this way), so nothing needs to be built or
  installed, as before.
- The Code section of `README.md`, which says that everything is in
  `index.html`, gets a line about `intro.js`, `intro.css`, `img/intro/` and
  `tools/intro-images.sh`.
- The whole animation is a function `draw(t)` of the time, built from a
  list of scenes with their start and end times and a function for each.
  Seeking, pausing and the scene marks then come for free, and the timing
  can be changed in one place.
- `requestAnimationFrame` drives it, as in the other pages, and stops when
  the animation is paused, hidden or ends.
- The star and galaxy fields use a fixed random seed, so the animation
  looks the same every time.
- The objects are real, but the plotted points are schematic and drawn
  for clarity, not the real data of the exercise, so that the answers are
  not given away. The caption of the final readout says the value is
  approximate.
- The images are loaded when the button is pressed, so they cost nothing
  for users who do not watch.
- Dark and light themes both work, as the colours are the page tokens. The
  sky stays dark in both.
- When the scene is less than about 600 px wide, the plot labels in
  scenes 1–4 are hidden, leaving only the captions.
- The SVG has a `<title>` and a `<desc>` that tell the whole story in a few
  sentences for screen readers, and each caption is in an `aria-live`
  region.

## Build stages

The animation is built in five stages, each in a fresh session that starts
from this document, so that no session carries the history of the ones
before. Each stage ends in a working state that can be committed.

| Stage | Contents | Frames checked |
|---|---|---|
| 1 | `tools/intro-images.sh` and the three images in `img/intro/` | the three images |
| 2 | `intro.js` and `intro.css` with the window, the controls, the progress bar, the timeline, the distance scale, scene 0, scene 5 and placeholders for scenes 1–4; the button in `index.html` | 1, 10 and 25.5 s and the end |
| 3 | Scenes 1 and 2, in place of their placeholders | 3, 6.5, 7.8, 9.5 and 12.8 s |
| 4 | Scenes 3 and 4, in place of their placeholders | 15.5, 17.8, 19, 21 and 22.8 s |
| 5 | Reduced motion, the phone layout, screen readers, the README | the six key frames once in the dark theme and once in the light theme, and one at phone width |

The placeholders of stage 2 already tell the story. Each shows its
scene's caption over its stored image (Pleiades for scene 1, NGC 6087 for
scene 2, M101 for scenes 3 and 4), at the scene's times, with the camera
moves between them and the marker of the distance scale moving to the
scene's distance. After stage 2 the whole animation can be watched with its
real pacing, and the timing and captions can be changed before the detailed
scenes are built. Stages 3 and 4 then draw the plots and the motion over
the same images.

Frames are checked from still frames, not by watching the animation:
`index.html#intro=12.8` opens the window paused at 12.8 s. As the
animation is a function `draw(t)`, a still frame shows exactly what the
animation shows at that moment. Only the frames listed above are
screenshot, and a frame is checked again only after a change to it.

