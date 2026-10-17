# Design: intro animation

A short animation on the home page of `index.html` that shows the idea of
the cosmic distance ladder and what the user does in the four parts of the
exercise. It runs for 80 s, set by what the viewer has to read and follow rather
than by a limit (see Pacing). It starts from the Earth's orbit, the astronomical
unit, because parallax measures every distance on the ladder in it, and
it follows the steps of the exercise: the parallax of a star, the Gaia
measurement of a cluster in the order of part 1, the clusters that hold
Cepheids, a Cepheid pulsating, the Cepheids of M101, a white dwarf
exploding as a type Ia supernova, and the supernovae far out in the
Universe.

The scenes follow each other as slides: the old scene moves out to the
left while the new one comes in from the right. There is only one camera
move, the pull-out to hundreds of megaparsecs near the end. The first
version (commit `8a083c3`) zoomed between all scenes, ten times in 54 s
and back and forth, which was too much and too often.

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

- On the home page, a **Vaata tutvustust (1 min 20 s)** button sits below the
  ladder figure. The animation never plays by itself: users come back to
  this page many times, and a teacher may open it in front of a class.
- **Peata / Jätka**, **Algusest** and **Jäta vahele** buttons under the
  scene, and a progress bar with a mark for each part. Clicking a mark jumps
  to the start of that scene. Space pauses and Esc skips.
- **Jäta vahele**, Esc and a click outside the scene close the window.
- On a phone the window fills the screen, and the scene keeps 16 : 9.
- With `prefers-reduced-motion`, each scene is shown as one still key
  frame with its caption, for as long as the scene lasts, so the twelve key
  frames follow each other as cuts instead of the animation. The controls
  and the progress bar work as before, and at the end the window closes
  without the ladder flying to the page.

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
| 1–2 | the Sun and the Earth | the unit of parallax, part 1 | 1 au |
| 3–5 | Pleiades | first example in part 1 | ≈ 135 pc |
| 6 | the clusters with Cepheids around the Sun | clusters of part 2 | 0.1–3 kpc |
| 7 | the Cepheid S Nor (P = 9.75 d) in NGC 6087 | cluster in part 2 | ≈ 1 kpc |
| 8 | M101 | galaxy in part 3 | ≈ 7 Mpc |
| 9–10 | SN 2011fe in M101 | supernova in part 4 | ≈ 7 Mpc |

S Nor has a period close to 10 d, the pivot of the period–luminosity
relation (log P = 1), and it is one of the brightest Cepheids in a cluster.
M101 is a large, face-on spiral that looks good in an image, and SN 2011fe
lets scenes 9 and 10 show both candles in the same galaxy.

The objects are shown in DSS2 colour images from CDS hips2fits, the same
service as the sky images in part 1: the Pleiades with their blue
reflection nebula fill scenes 3–5, and M101 scenes 8 and 10. The close-ups
of S Nor (scene 7) and of the white dwarf of SN 2011fe (scene 9) are
drawn, after the tsefeiidid and supernoovad pages. Each has a small copy
of the image it comes from in its lower left corner, with a ring at the
object: S Nor at (635, 308) in the NGC 6087 image and SN 2011fe at
(668, 489) in the M101 image, from their coordinates. The M101 image is
from before 2011, so the supernova appears in it only as drawn. Scenes 1,
2 and 6 are drawn too.

The images are stored with the page, so the animation starts at once:

- `img/intro/plejaadid.jpg`, `img/intro/ngc6087.jpg`, `img/intro/m101.jpg`,
  each 1280 × 720 px (the size of the scene at its largest), JPEG at about
  100–200 kB each.
- A small script `tools/intro-images.sh` fetches them from hips2fits with
  the centre, field of view and projection of each, so that they can be
  made again, and records the parameters in a comment.
- The credit (DSS2 colour, CDS hips2fits) goes in the footer of the home
  page, next to the existing credit for the sky images.

## Storyboard

Times are in seconds. Each scene has one caption of at most eight words
at the top of the scene, in Estonian or English according to the language
of the page (`data-l`). A slide takes 1 s and belongs to the scene it
leads into. The part marks of the progress bar are at scenes 2, 6, 8 and 9.

| # | Time | Rung | Caption (et) | Caption (en) |
|---|---|---|---|---|
| 0 | 0–3 | – | Kui kaugel on galaktikad? | How far away are the galaxies? |
| 1 | 3–8 | – | Maa orbiidi raadius on üks astronoomiline ühik | The Earth's orbit has a radius of one astronomical unit |
| 2 | 8–16 | Parallaks · 1. osa | Lähedaste tähtede kaugused saab määrata parallaksi abil | The distances of nearby stars can be found from their parallax |
| 3 | 16–23 | Parallaks · 1. osa | Parve tähed liiguvad taevas koos | The stars of a cluster move together |
| 4 | 23–28 | Parallaks · 1. osa | Parve liikmed moodustavad selge peajada | The cluster members form a clear main sequence |
| 5 | 28–34 | Parallaks · 1. osa | Keskmine parallaks annab parve kauguse | Their mean parallax gives the cluster's distance |
| 6 | 34–41 | Tsefeiidid · 2. osa | Gaia andmetest saame hajusparvede kaugused | Gaia data give the distances of open clusters |
| 7 | 41–49 | Tsefeiidid · 2. osa | Tsefeiid pulseerib – periood näitab tema heledust | A Cepheid pulsates – its period reveals its luminosity |
| 8 | 49–56 | Tsefeiidid · 3. osa | Tsefeiidid annavad galaktikate kaugused | Cepheids give the distances of galaxies |
| 9 | 56–64 | Supernoovad · 4. osa | Valge kääbus kogub massi ja plahvatab | A white dwarf gains mass and explodes |
| 10 | 64–77 | Supernoovad · 4. osa | Supernoovad näitavad meile, kui kiiresti Universum paisub | Supernovae show us how fast the Universe expands |
| 11 | 77–80 | – | Kosmiliste kauguste redel | The cosmic distance ladder |

### 0. Title (0–3 s)

A dark sky with a few stars. The title is shown larger than the captions,
about twice their size, and in the middle of the scene rather than at the
top: it fades in at 0.2 s, stays for about 2.5 s and fades out at
2.7–3.1 s, as the Sun and the Earth come in. The distance scale fades in
at the bottom, empty, with the marker at 1 au.

### 1. The Sun and the Earth (3–8 s)

- 3–3.5 s: the Sun and the Earth's orbit fade in, seen from straight
  above, the orbit a circle round the Sun, labelled **Päike** and **Maa**.
- 3.5–7 s: the Earth goes once round its orbit, a year.
- 4–4.5 s: a line from the Sun to the Earth is drawn out and labelled
  **1 au ≈ 150 miljonit km** / **1 au ≈ 150 million km**, and it turns
  with the Earth. The marker on the scale stays at its first tick, **au**.

### 2. Parallax of a nearby star (8–16 s) — part 1

The same panel goes on, with no slide: the parallax uses the orbit of
scene 1.

- 8–9 s: the view tilts from straight above to the oblique view of the 3D
  view of the parallaks page, the orbit becoming an ellipse, and the line
  of 1 au fades.
- 8.8–9.5 s: a nearby star and, behind it, a plane of distant quasars fade
  in, labelled **lähedane täht, kauged kvasarid**. The marker on the scale
  slides from 1 au to ~10 pc at 9–10 s.
- 9.5–15.5 s: the Earth goes round its orbit three times, 2 s a year. The
  sight line from the Earth through the star meets the quasar plane, and
  the point where it meets it traces the star's apparent path in `--sel`
  blue: with its proper motion, three loops. The camera turns slowly round
  the scene, so that it reads as 3D.

The geometry is that of the parallaks page (a star at ecliptic latitude
50°, the quasars on a plane behind it), in schematic units, with the star
nearer and its proper motion larger than there, so that the loops are
large and apart.

### 3–5. The Pleiades with Gaia (16–34 s) — part 1

Scenes 3–5 show the three steps of part 1 in its order: the lasso on the
proper motions, the check on the colour–magnitude diagram and the mean
parallax. The image of the Pleiades stays in place through all three, and
the plots move over it as a row of two panels, a left and a right one, in
the same way as the slides: a new plot comes in from the right edge into
the right panel, and the row shifts one panel to the left, the plot in the
left panel leaving past the left edge.

The ten brightest Pleiades are dotted where they are in the image, from
their coordinates; the fainter members and the field stars are schematic.
The same stars, with the same colours, are in all three plots.

#### 3. Proper motions (16–23 s)

- 16–17 s: the slide brings in the DSS2 image of the Pleiades. The marker
  on the scale slides to the Plejaadid landmark.
- 17.3–18 s: the image dims, and the stars in it get dots and arrows for
  their proper motions: the arrows of the cluster stars all point the same
  way, those of the field stars every way.
- 18–18.6 s: the proper-motion plot (**omaliikumine μα\***, **μδ**, no
  numbers) comes into the right panel.
- 18.6–19.4 s: the dots fly into it, and the arrows shrink into them: the
  field stars spread out, the cluster stars bunch together.
- 19.6–20.8 s: a lasso is drawn round the clump, and at 20.8–21.1 s the
  selected stars turn `--sel` blue, as in the Joonised tab. They stay for
  2 s to be seen.

#### 4. Colour–magnitude diagram (23–28 s)

- 23–23.8 s: the proper motions shift to the left panel, and the
  colour–magnitude diagram comes into the right one: **G** (brighter up)
  against **G_BP − G_RP**, no numbers, as in the Joonised tab. All the
  stars are in it in grey: the field stars are scattered over it, as they
  are at all distances.
- 24–25 s: the selected stars turn `--sel` blue in it, one after another
  from the brightest, and they lie on a narrow band.
- 25.2 s: the band is labelled **peajada** / **main sequence**: the
  selected stars are at one distance, so they are members.

#### 5. Mean parallax (28–34 s)

- 28–28.8 s: the proper motions leave on the left, the colour–magnitude
  diagram shifts to the left panel, and the parallax histogram
  (**parallaks ϖ (mas)**, ticks 6–9) comes into the right one.
- 29–30.8 s: copies of the selected stars drop one after another from the
  colour–magnitude diagram into the histogram, where they stack as blocks
  in their bins and make a peak, slowly enough to be followed.
- 31–31.3 s: a dashed line marks the peak, with **ϖ ≈ 7,4 mas** and
  **d ≈ 135 pc**, which stay up to the end of the scene.
- 31.5–32.5 s: the `--sel` bar grows on the scale up to ~5 kpc.

This is the part that shows the user's own actions (the lasso and the
check), because it is the step in the exercise that most needs explaining.

### 6. Clusters around the Sun (34–41 s) — part 2

- 34–35 s: the slide brings in a map of the Milky Way around the Sun,
  seen from above, about 6 kpc across and 3.4 kpc high, the Sun in the
  centre and the direction to the centre of the Galaxy up, marked
  **Linnutee keskme suunas** / **towards the Galactic centre**. Behind it
  the nearby spiral arms are faint bands of stars (the Orion spur round
  the Sun, the Sagittarius–Carina arm towards the centre and the Perseus
  arm away from it), and faint grey dots are star clusters, many of them.
- 35.4–37.8 s: lines are drawn out from the Sun to the clusters, one after
  another, 0.3 s apart, each ending in a `--sel` blue dot with the name of
  the cluster: first the Pleiades, labelled **135 pc**, then the clusters
  of part 2 that fit in the map (NGC 6087, NGC 6067, Lynga 6, NGC 129,
  vdBergh 1, UBC 129, UBC 130, Berkeley 84, FSR 0951 and the others),
  placed from their galactic longitude and distance. The lines say what
  Gaia gives: the distance to each.
- 38 s: NGC 6087 gets a `--cep` red ring and **S Nor** next to it, and its
  line the label **0,94 kpc**.
- 38.3–39 s: the marker slides from the Plejaadid landmark to NGC 6087.

The Milky Way is drawn: its stars are dots of a fixed size on the screen
and the clusters are dots of a fixed size, so the map is sharp at any
width. Clusters outside the map are left out.

### 7. A Cepheid pulsates (41–49 s) — part 2

- 41–42 s: the slide brings in S Nor, a drawn star in the centre, already
  pulsating as on the tsefeiidid page: its radius changes by ±12 % (more
  than the real ±8 %, to be seen) and its colour between about 5000 and
  6200 K, with a fast rise to maximum light and a slow decline. A cycle
  takes 1.8 s. In the lower left corner is the NGC 6087 image, small, with
  a red ring at S Nor and a thin line from the ring to the star.
- 42.6–46.8 s: beside the star its light curve is traced in `--cep` red,
  brightness against time, a little over two cycles. When the second
  maximum is reached, a bracket marks the period between the two maxima,
  **P = 9,75 p** / **P = 9.75 d**, which stays up to the end of the scene.

Scene 4 of the first version, the period–luminosity plot, is dropped: the
caption says what the period gives, and part 2 is where the user fits the
relation.

### 8. Cepheids in M101 (49–56 s) — part 3

- 49–50 s: the slide brings in the DSS2 image of M101. The marker slides
  from NGC 6087 to M101, past the Andromeeda galaktika landmark, and the
  M101 landmark appears.
- 50.4–52 s: five Cepheids blink in its arms one after another, 0.3 s
  apart, each in a red ring and pulsing, the first labelled **tsefeiid** /
  **Cepheid**.
- 52.3–52.6 s: a readout shows **periood → heledus → kaugus** /
  **period → luminosity → distance**, and below it **d ≈ 7 Mpc**.
- 52.8–53.8 s: the `--cep` bar grows to ~40 Mpc.

The Hubble plot of the first version's scene 5 is dropped too: it comes
in once, in scene 10.

### 9. A white dwarf explodes (56–64 s) — part 4

- 56–57 s: the slide brings in a drawn binary star as on the supernoovad
  page: a red giant fills its Roche lobe and loses gas through the inner
  Lagrange point, in a stream that flows onto the accretion disc of a
  white dwarf. Labels **punane hiid** and **valge kääbus**, with the white
  dwarf's mass. In the lower left corner is the M101 image, small, with an
  `--accent` orange ring at the place of SN 2011fe.
- 57.3–60 s: gas flows along the stream, and the mass grows from 1,30 to
  1,38 M☉. At 60 s the white dwarf turns yellow: carbon ignites.
- 60.5–63 s: the white dwarf explodes: a white-hot cloud with sparks grows
  over the scene and engulfs the red giant.

### 10. Supernovae (64–77 s) — part 4

This is the scene 7 of the first version, with its steps further apart.
Only the start and the Hubble plot are new.

- 64–65 s: the slide takes the cloud, still growing, out to the left and
  brings M101 back, with SN 2011fe as a bright point at its place.
- 65–67 s: SN 2011fe shines in M101, labelled, while the Cepheids of
  scene 8 blink again next to it. The two candles in one galaxy show how
  the supernova is calibrated: its peak brightness is found from the
  Cepheid distance. It fades at 66.8–67.6 s, as the camera pulls out.
- 67–69.5 s: the camera pulls out to hundreds of Mpc, past a field of
  nearer galaxies drawn as soft ellipses, with M101 in the centre and the
  Milky Way, a small drawn spiral, to the lower left, to a field of many
  faint galaxies. The marker slides to ~500 Mpc, and the `--accent` bar
  grows past 1 Gpc. This is the one camera move of the animation.
- 69.5–71.5 s: supernovae flash in twelve of the faint galaxies, one after
  another, 0.15 s apart, `--accent` orange, with a fast rise and a slow
  decline.
- 71.5–72 s: the field dims, and a Hubble plot of **kiirus** against
  **kaugus (Mpc)** fades in, 0–25 Mpc, with ticks at 10 and 20, the
  Cepheid galaxies of part 3 as `--cep` red points, M101 labelled, and a
  line through the origin, labelled **tõus H₀** / **slope H₀**. It stays
  for a second to be read.
- 73–74 s: it widens from 25 to 500 Mpc: its points crowd into the lower
  left, and the ticks every 10 Mpc give way to ticks every 100 Mpc.
- 74–75 s: the supernovae add points far out along the same line, 0.08 s
  apart, `--accent` orange.
- 75–75.3 s: the readout shows **H₀ ≈ 73 km/s/Mpc**, and below it
  **– selle mõõdad ise 3. ja 4. osas** / **– you will measure it in parts
  3 and 4**, so that it reads as what the user will measure, not as a
  given answer. It stays to the end of the scene.

The velocity axis has no numbers and the points are schematic, so that the
plot does not give away the answer of part 3. Its axes keep the line at the
same slope on the screen at every width (80 km/s per Mpc of the axis), so
that it can widen.

### 11. The ladder (77–80 s)

The scene fades, and the three bars of the distance scale turn and stack
into the three rungs of the ladder figure, with the icons and labels of the
home page. Each rung briefly lights up in turn from the bottom with its
part number. In the last frame the animation is replaced by the ladder
figure itself, and the focus returns to the **Vaata tutvustust** button.

## Pacing

The length follows from what is to be read, not from a limit: the first
version was held under 60 s and went too fast. The rules:

- A caption is up for at least 4 s after the motion of its scene has
  stopped, enough to read eight words and look at the scene.
- A readout (**1 au**, **ϖ ≈ 7,4 mas**, **d ≈ 135 pc**, **P = 9,75 p**,
  **d ≈ 7 Mpc**, **H₀ ≈ 73 km/s/Mpc**) stays at least 2 s before anything
  else moves, and stays up to the end of its scene.
- A plot that comes in stands for at least a second before points move in
  it, so its axes can be read first.
- Points that come in one after another are at least 0.2 s apart, except
  the 30 points of the supernovae in the widened Hubble plot, which make a
  line together.
- Only one step happens at a time within a scene, apart from the marker
  and the bars on the scale, which move with the step that gives them.

If the build shows a scene too fast after all, it is lengthened, and the
scenes after it start later.

## Motion

- Scene changes are slides: the old panel and the new one move together
  from right to left over 1 s, eased in and out, the old one leaving past
  the left edge as the new one comes in from the right. The distance scale
  is the same direction: the farther objects come from the far end of it.
- The sky, the caption and the distance scale stay in place. The stars of
  the sky drift with the slide at a fifth of its speed, so that the panels
  read as near and the sky as far.
- The marker on the scale moves during the slide, or just after it, to the
  distance of the new scene, so the scale carries the feeling of going
  outward that the zooms carried before.
- Scenes 1–2 and 3–5 share a panel and change without a slide. Within
  scenes 3–5 the plots move as a row in the same direction as the slides.
- The only camera move is the pull-out of scene 10, 2.5 s long. Being the
  only one, it stands out as the step to the far Universe.
- Nothing moves faster than the eye can follow while a caption changes:
  the caption fades out before the slide and the next one fades in after
  it has stopped.
- At most two things move at once.
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
- Each scene is drawn in a panel of its own, a group the size of the scene.
  A slide is the horizontal offset of the two panels as a function of `t`,
  so a frame in the middle of a slide is a still frame like any other. The
  sky, the caption and the distance scale are outside the panels.
- The times of each scene are counted from its start, as those of the
  ladder scene already are, so that a scene can be lengthened, shortened
  or moved by changing its start alone.
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
  scenes 1–7 and the labels of the distance scale are hidden, leaving only
  the captions, the readouts (**1 au**, **d ≈ 135 pc**, **d ≈ 7 Mpc**, **H₀ ≈ 73
  km/s/Mpc**) and the labels of the ladder.
- The SVG has a `<title>` and a `<desc>` that tell the whole story in a few
  sentences for screen readers, in the language of the page when the
  window opens, and each caption is in an `aria-live` region.

## Build stages

The first version was built in five stages (commit `8a083c3`). This
revision is built in four more, each in a fresh session that starts from
this document, so that no session carries the history of the ones before.
Each stage ends in a working state that can be committed.

| Stage | Contents | Frames checked |
|---|---|---|
| 1 | The slides: a panel for each scene, the slide transition, the drift of the sky, the new timeline with the times of each scene counted from its start, and the marker moves. The existing scenes moved onto it: scene 2 (the parallax view from 8 s, with scene 1 as a placeholder of its caption over the parallax view), scenes 3 and 5 with the row of plot panels (scene 4 as a placeholder: the empty diagram with its axes), scene 7 with the NGC 6087 inset, scene 8 without the plots, scene 9 with the M101 inset, scene 10 with the Hubble plot coming in, and scene 11. Scene 6 as a placeholder: the Sun on the sky with the caption. Removed: the zooms between scenes, the top view of the whole Milky Way, the period–luminosity plot and the Hubble plot of the old scene 5. The button reads 1 min 20 s | 1.5, 13, 16.5, 20.5, 30, 33, 34.5, 41.5, 46, 49.5, 53, 56.5, 59, 62, 64.5, 66, 68.5, 72.5, 76 s and the end |
| 2 | Scene 1 in place of its placeholder, and the tilt into the parallax view; scene 4 in place of its placeholder | 4.6, 6.5, 8.5, 25.5 and 27.5 s |
| 3 | Scene 6 in place of its placeholder: the map, the arms, the clusters, the lines and the ring on NGC 6087 | 35.6, 37, 39.5 and 40.5 s |
| 4 | The twelve key frames for reduced motion, the phone layout, the `<desc>` for screen readers, the README | the twelve key frames once in the dark theme and once in the light theme, and one at phone width |

Stage 1 is the largest, but most of it moves existing code to new times
and panels. Its placeholders already tell the story at its real pacing,
so the timing and the captions can be changed before stages 2 and 3 draw
the new scenes.

Frames are checked from still frames, not by watching the animation:
`index.html#intro=12.8` opens the window paused at 12.8 s, and
`#intro=12.8&play` plays on from there. As the animation is a function
`draw(t)`, a still frame shows exactly what the animation shows at that
moment, also in the middle of a slide. Only the frames listed above are
screenshot, and a frame is checked again only after a change to it.

Headless Chrome on macOS hardly runs `requestAnimationFrame`, so still
frames screenshot well but `&play` does not move. To see the end, the page
is loaded in an iframe of a scratch page that replaces the iframe's
`requestAnimationFrame` with a 16 ms `setTimeout` before setting the hash.
