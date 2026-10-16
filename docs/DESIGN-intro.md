# Design: intro animation

A short animation on the home page of `index.html` that shows the idea of
the cosmic distance ladder and what the user does in the four parts of the
exercise. It runs for 48 s, under a limit of 60 s, with room for the
captions to be read. It opens with the 3D view of the parallax page,
because parallax is where every distance on the ladder starts, and it
zooms in on the two standard candles to show what they are: a Cepheid
pulsating and a white dwarf exploding as a type Ia supernova.

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

- On the home page, a **Vaata tutvustust (48 s)** button sits below the
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
| 2 | Pleiades | first example in part 1 | ≈ 135 pc |
| 3–4 | NGC 6087 with the Cepheid S Nor (P = 9.75 d) | cluster in part 2 | ≈ 1 kpc |
| 5 | M101 | galaxy in part 3 | ≈ 7 Mpc |
| 6–7 | SN 2011fe in M101 | supernova in part 4 | ≈ 7 Mpc |

S Nor has a period close to 10 d, the pivot of the period–luminosity
relation (log P = 1), and it is one of the brightest Cepheids in a cluster.
M101 is a large, face-on spiral that looks good in an image, and SN 2011fe
lets scenes 6 and 7 show both candles in the same galaxy.

The objects are shown in DSS2 colour images from CDS hips2fits, the same
service as the sky images in part 1. The Pleiades with their blue
reflection nebula are the first image. Scene 1, before them, is drawn: the
Sun, the Earth's orbit and a nearby star in 3D, as on the parallaks page.
The close-ups of S Nor (scene 3) and of the white dwarf of SN 2011fe
(scene 6) are drawn too, after the tsefeiidid and supernoovad pages, and
the camera zooms into the images to reach them: S Nor is at (635, 308) in
the NGC 6087 image and SN 2011fe at (668, 489) in the M101 image, from
their coordinates. The M101 image is from before 2011, so the supernova
appears in it only as drawn.

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
| 1 | 2–9 | Parallaks · 1. osa | Parallaks annab tähtede kaugused | Parallax gives the distances of stars |
| 2 | 9–15.2 | Parallaks · 1. osa | Gaia parallaksid annavad täheparvede kaugused | Gaia parallaxes give the distances of star clusters |
| 3 | 15.2–23 | Tsefeiidid · 2. osa | Tsefeiid pulseerib – periood näitab tema heledust | A Cepheid pulsates – its period reveals its luminosity |
| 4 | 23–28 | Tsefeiidid · 2. osa | Parvede tsefeiidid kalibreerivad seose | Cluster Cepheids calibrate the relation |
| 5 | 28–33 | Tsefeiidid · 3. osa | Tsefeiidid annavad galaktikate kaugused | Cepheids give the distances of galaxies |
| 6 | 33–40 | Supernoovad · 4. osa | Valge kääbus kogub massi ja plahvatab | A white dwarf gains mass and explodes |
| 7 | 40–45 | Supernoovad · 4. osa | Supernoovad ulatuvad sadade megaparsekiteni | Supernovae reach hundreds of megaparsecs |
| 8 | 45–48 | – | Redel – ronime pulkhaaval | The ladder – one rung at a time |

### 0. Title (0–2 s)

A dark sky with a few stars. The caption fades in. The distance scale fades
in at the bottom, empty, with the marker at 1 au.

### 1. Parallax of a star (2–9 s) — part 1

- 2–2.6 s: the 3D view of the parallaks page in its oblique view fades in:
  the Sun, the Earth's orbit, a nearby star and, behind it, a plane of
  distant quasars, labelled **Päike, Maa, lähedane täht, kauged
  kvasarid**. The marker on the scale slides from 1 au to ~10 pc.
- 2.8–8.3 s: the Earth goes round its orbit three times. The sight line
  from the Earth through the star meets the quasar plane, and the point
  where it meets it traces the star's apparent path in `--sel` blue: with
  its proper motion, three loops. The camera turns slowly round the scene,
  so that it reads as 3D.
- 8.2–9 s: the quasar plane, the path and the labels fade, and the Sun with
  the orbit moves to the centre of the scene.

The geometry is that of the parallaks page (a star at ecliptic latitude
50°, the quasars on a plane behind it), in schematic units, with the star
nearer and its proper motion larger than there, so that the loops are
large and apart.

### 2. Gaia parallaxes of a star cluster (9–15.2 s) — part 1

- 9–10.5 s: the camera pulls out. The orbit shrinks to a dot, which the Sun
  keeps as a dot of fixed size until the DSS2 image of the Pleiades fades in
  around it. The marker on the scale slides to the Plejaadid landmark.
- 10.5–12 s: the image dims, and the stars in it get dots and short arrows
  for their proper motions. The scene
  becomes the proper-motion plot: the field stars spread out, the cluster
  stars bunch together. A lasso is drawn round the clump, and the selected
  stars turn `--sel` blue, as in the Joonised tab.
- 12–13 s: the selected stars drop into a parallax histogram that peaks, and
  a readout shows the cluster distance, **d ≈ 135 pc**. The `--sel` bar
  grows on the scale up to ~5 kpc.

- 13–14.4 s: the Pleiades have no Cepheids, so the camera moves on to
  NGC 6087 by way of the Milky Way. It pulls out, centred on the Sun,
  about 10⁴ times: the Pleiades shrink to a soft patch, and the stars of
  the Milky Way stream in from the edges until it is seen whole from
  above, about 30 kpc across, the centre up and the Sun 8.2 kpc below it.
  The caption stays: the Milky Way is full of star clusters.
- 14.1–15.4 s: labels **Linnutee**, **Päike**, **Plejaadid** and
  **NGC 6087** show, the clusters as `--sel` blue dots placed from their
  galactic longitude and distance (Pleiades l = 166.6°, 135 pc; NGC 6087
  l = 327.7°, 0.94 kpc, towards the inner Galaxy). At 14.5–15.15 s the view
  pans the few pixels from the Sun to NGC 6087.
- 15.2–16.2 s: the camera zooms into NGC 6087: the stars stream out past
  the edges, and the DSS2 image grows out of the blue dot. The marker
  slides to NGC 6087, still inside the `--sel` bar: Gaia gives its
  distance in the same way.

This is the one scene that shows the user's own action (the lasso), because
it is the step in the exercise that most needs explaining.

The Milky Way is drawn: four logarithmic spiral arms of seeded stars, a
disc glow and a bar. Its stars are dots of a fixed size on the screen, so
that the camera flies between them instead of blowing them up. It is
behind the images, which fade towards their edges more the smaller they
are, so that a shrinking image is a soft round patch, not a rectangle, and
an incoming image is shown at most about twice its size, where it would
turn blocky. Scene 5 can pull out of the same Milky Way.

### 3. A Cepheid pulsates (15.2–23 s) — part 2

- 16.3–17 s: the image pans to put S Nor in the centre.
- 17–18.2 s: the camera zooms into S Nor, about 300 times. The image fades
  as it grows, and S Nor becomes a drawn star, pulsating as on the
  tsefeiidid page: its radius changes by ±12 % (more than the real ±8 %,
  to be seen) and its colour between about 5000 and 6200 K, with a fast
  rise to maximum light and a slow decline. A cycle takes 1.5 s.
- 18.3–21.8 s: beside the star its light curve is traced in `--cep` red,
  brightness against time, a little over two cycles. When the second
  maximum is reached, a bracket marks the period between the two maxima,
  **P = 9,75 p** / **P = 9.75 d**.
- 21.8–23 s: the camera zooms back out to NGC 6087, and the image pans
  back to its centre.

### 4. Period–luminosity relation (23–28 s) — part 2

- 23.2–23.8 s: the NGC 6087 image dims, S Nor gets a red ring, and a plot
  fades in over the image: **heledus M** (brighter up, no numbers) against
  **log P (P päevades)**, with ticks at 0,5, 1 and 1,5.
- 23.8–24.6 s: S Nor leaves the cluster as a labelled point that flies
  along an arc onto the plot, at log P ≈ 1.
- 24.7–26 s: points for the other clusters of part 2 pop in one after
  another, 0.15 s apart, all `--cep` red.
- 26–27 s: a line is fitted through the points, drawn from left to right,
  and labelled **sobitatud sirge** / **fitted line**.
- 27.6–28.4 s: the plot shrinks into the lower left corner of the scene,
  above the start of the distance scale, and stays there through scene 5
  for its Cepheids to use, until it fades at 32.6–33 s.

The points are schematic: they scatter about a line with the slope of the
V-band relation, and the M axis has no numbers, so that the plot does not
give away the answers of part 2.

### 5. Galaxies and the Hubble law (28–33 s) — part 3

- 28–29.5 s: the camera pulls out of the Milky Way, which shrinks to a small
  spiral among other galaxies. The marker slides to ~20 Mpc.
- 29.5–31 s: one of them becomes the DSS2 image of M101, with a few
  Cepheids blinking in it. Their periods go through the line from scene 4,
  and M101 gets its distance label at the M101 landmark. The `--cep` bar
  grows to ~40 Mpc.
- 31–33 s: the galaxies become points on a plot of velocity against
  distance. A line through the origin is fitted, with its slope labelled
  **H₀**.

### 6. A white dwarf explodes (33–40 s) — part 4

- 33–33.8 s: the M101 image pans to put the place of SN 2011fe in the
  centre.
- 33.8–35 s: the camera zooms in on it, about 1000 times, to a drawn
  binary star as on the supernoovad page: a red giant fills its Roche
  lobe and loses gas through the inner Lagrange point, in a stream that
  flows onto the accretion disc of a white dwarf. Labels **punane hiid**
  and **valge kääbus**, with the white dwarf's mass.
- 35–37.3 s: gas flows along the stream, and the mass grows from 1,30 to
  1,38 M☉. At 37.2 s the white dwarf turns yellow: carbon ignites.
- 37.6–39.6 s: the white dwarf explodes: a white-hot cloud with sparks
  grows over the scene and engulfs the red giant.
- 38.6–39.8 s: the camera zooms back out while the cloud is still growing,
  and the explosion becomes a bright point at the place of SN 2011fe in
  M101; the image pans back to its centre.

### 7. Supernovae (40–45 s) — part 4

- 40–41.5 s: SN 2011fe shines in M101 next to its Cepheids, and fades as
  the camera starts to pull out. The two candles in one galaxy show how
  the supernova is calibrated: its peak brightness is found from the
  Cepheid distance.
- 41.5–43.5 s: the camera pulls out to hundreds of Mpc. Many faint galaxies,
  and supernovae flash in them one after another, `--accent` orange. The
  marker slides to ~500 Mpc, and the `--accent` bar grows past 1 Gpc.
- 43.5–45 s: the Hubble plot from scene 5 widens, its points crowd into the
  lower left, and the supernovae add points far out along the same line.
  The readout shows **H₀ ≈ 73 km/s/Mpc**. The text says that this is what
  the user will measure, not a given answer.

### 8. The ladder (45–48 s)

The scene fades, and the three bars of the distance scale turn and stack
into the three rungs of the ladder figure, with the icons and labels of the
home page. Each rung briefly lights up in turn from the bottom with its
part number. In the last frame the animation is replaced by the ladder
figure itself, and the focus returns to the **Vaata tutvustust** button.

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
  except for the dark sky and the colours of the stars, the gas and the
  explosion in the close-ups, which are those of the supernoovad page.
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
  scenes 1–7 are hidden, leaving only the captions.
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
| 2 | `intro.js` and `intro.css` with the window, the controls, the progress bar, the timeline, the distance scale, scenes 0, 1, 3, 4, 6 and 8 and placeholders for scenes 2, 5 and 7; the button in `index.html` | 1, 3.5, 6.5, 8.6, 9.8, 13.4, 14.8, 15.6, 15.9, 17.5, 20.5, 23.6, 24.2, 25.6, 27.4, 30.8, 34.3, 36.5, 38.3, 40.5 and 47.5 s and the end |
| 3 | Scene 2 up to the Milky Way, in place of its placeholder | 11.5 and 12.8 s |
| 4 | Scenes 5 and 7, in place of their placeholders | 30.5, 32.8, 41, 43 and 44.8 s |
| 5 | Reduced motion, the phone layout, screen readers, the README | the nine key frames once in the dark theme and once in the light theme, and one at phone width |

The placeholders of stage 2 already tell the story. Each shows its
scene's caption over its stored image (Pleiades for scene 2, M101 for
scenes 5 and 7), at the scene's times, with the camera
moves between them and the marker of the distance scale moving to the
scene's distance. After stage 2 the whole animation can be watched with its
real pacing, and the timing and captions can be changed before the detailed
scenes are built. Stages 3 and 4 then draw the plots and the motion over
the same images.

Frames are checked from still frames, not by watching the animation:
`index.html#intro=12.8` opens the window paused at 12.8 s, and
`#intro=12.8&play` plays on from there. As the
animation is a function `draw(t)`, a still frame shows exactly what the
animation shows at that moment. Only the frames listed above are
screenshot, and a frame is checked again only after a change to it.

Headless Chrome on macOS hardly runs `requestAnimationFrame`, so still
frames screenshot well but `&play` does not move. To see the end, the page
is loaded in an iframe of a scratch page that replaces the iframe's
`requestAnimationFrame` with a 16 ms `setTimeout` before setting the hash.

