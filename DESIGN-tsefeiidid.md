# Design: Tsefeiidid page

The design of a new background page about Cepheids, `tsefeiidid.html`. It
covers the three items listed for it in section 3 of `PLAN.md`:

1. Why Cepheids pulsate (the κ mechanism), their light curves, and how the
   period is measured.
2. Henrietta Leavitt and the discovery of the period-luminosity relation.
3. Interstellar dust and the Wesenheit magnitude W_H, which part 2 uses and
   nothing in the exercise explains yet.

The first item is split into two tabs, one on the pulsation and one on
measuring the period, so the page has four tabs. Related parts of the
exercise: 2 and 3.

The page is self-contained and built like `standardkuunlad.html` and
`hajusparved.html`, with inline SVG and no external dependencies. The layout
is the same:

- a scene on the left with tabs above it, one tab for each item;
- a control panel on the right, whose groups change with the tab
  (`data-tabs`);
- a **Mida joonis näitab** text below that explains the current tab
  (`data-tab`).

The selected tab is kept in the address (`#pulsatsioon`, `#periood`,
`#leavitt`, `#tolm`), so that `index.html` and the other pages can link to a
tab.

The top row is "← Kosmiliste kauguste redel · Parallaks · Hajusparved ·
Standardküünlad · Tsefeiidid". The heading is **Tsefeiidid**.

The intro: Cepheids are young, massive giant stars that swell and shrink
with a period of days to months, and their brightness changes with them.
Their period gives their luminosity, so they are standard candles (link to
`standardkuunlad.html#tsefeiidid-ja-supernoovad`) that can be seen in other
galaxies. The name comes from δ Cephei, whose variability John Goodricke
found in 1784.

## The simulated Cepheid

Tabs 1, 2 and 4 share one Cepheid, as the tabs of the standard candles page
share the light source. Its properties follow from the period P, so that the
pulsation, the light curve and the magnitudes in all bands agree:

- **Mean magnitudes** in V (F555W), I (F814W) and H (F160W) from
  period-luminosity relations in each band. V and I are taken from the
  literature (for example Benedict et al. 2007), and H is set so that
  M_H − 0.386 (M_V − M_I) gives exactly the relation used in the app,
  M_H^W = −5.914 − 3.29 (log P − 1) (Cruz Reyes & Anderson 2023). The page
  and the exercise then agree.
- **Radius** from the period-radius relation, log (R/R☉) ≈ 1.1 + 0.7 log P,
  so about 60 R☉ at 10 days. It changes by about ±10 % over a cycle.
- **Temperature** about 6000 K at 10 days, cooler for longer periods, and
  changing by about ±600 K over a cycle.
- **Light curve** from a Fourier template: a fast rise and a slow decline,
  with an amplitude of about 0.8 mag in V. The amplitudes in I and H are
  about 0.6 and 0.35 of that in V. Maximum light comes near minimum radius,
  when the star is hottest.
- **Radial velocity** from the change of radius, with the sign astronomers
  use (positive away from us).

Controls at the top of the panel, shared by tabs 1, 2 and 4:

- **Periood**, a log slider from 1 to 100 days;
- **Tuntud tsefeiidid** (known Cepheids), buttons that set the period:
  δ Cep (5.37 d), η Aql (7.18 d), S Nor (9.75 d, in the cluster NGC 6087 of
  part 2), ℓ Car (35.6 d) and SV Vul (44.9 d, also in part 2). The star
  keeps its simulated properties; the buttons only set P and the name in the
  readouts.

## Tab 1: Pulsatsioon (pulsation)

Why a Cepheid pulsates. The scene has two panels side by side.

- **Täht** (the star): a cross-section that swells and shrinks with the
  phase, coloured by its temperature. Inside it, a thin layer is marked: the
  zone where helium is ionized a second time (He⁺ → He⁺⁺), at about
  40 000 K. Arrows show the gas moving out or in.
- **Kõverad** (curves): four stacked curves against phase over two cycles,
  with a shared phase marker: the brightness in V, the radius, the
  temperature and the radial velocity. The brightness axis is reversed, as
  magnitudes are.

Under the scene are the **Faas** slider and a play button, with a speed
choice, as on the parallax page.

**Klapp** (the valve), four step buttons that move the phase to each stage
and show a short caption:

1. **Kokkusurutud**: the star is compressed. The helium layer heats up and
   ionizes, and ionized helium is more opaque, so it traps the heat flowing
   out of the star.
2. **Paisub**: the trapped heat raises the pressure, which pushes the layers
   out.
3. **Paisunud**: the layer cools, helium recombines and becomes transparent,
   and the heat escapes.
4. **Langeb**: without the extra pressure, gravity pulls the layers back in,
   and the cycle starts again.

The analogy in the text is a lid on a pot that lifts when the pressure
builds and falls back when the steam has escaped. This is the κ mechanism,
named after the opacity κ.

**HR-diagramm**, a small inset: the main sequence, the instability strip as a
narrow band, and the Cepheid as a point that moves along a small loop during
the cycle. The **Periood** slider moves the star up the strip: longer periods
are higher, larger and more luminous. Stars only pulsate inside the strip.
Hotter stars have the helium layer too close to the surface, and cooler ones
have convection that damps the pulsation.

Readouts in the panel: P, the mean radius and its range in R☉, the mean
temperature and its range, the mean M_V and the amplitude in V.

Mida joonis näitab:

- A Cepheid is a giant star that has left the main sequence. For a few
  million years it crosses the instability strip, and while it is there it
  pulsates.
- The engine is a layer of helium that traps heat when compressed and lets
  it out when expanded. Most stars do not have such a valve in the right
  place.
- The star is brightest when it is hottest, near its smallest size, not when
  it is largest. The brightness depends more on the temperature than on the
  radius, since L = 4π R² σ T⁴.
- The period is set by the star's mean density: roughly, the time it takes
  a sound wave to cross the star. A larger star has a lower density and a
  longer period. Tab 3 builds on this.

## Tab 2: Perioodi mõõtmine (measuring the period)

How a period is found from observations made on separate nights. The scene
has three plots stacked.

- **Vaatlused** (observations): the magnitude against time, a set of
  simulated measurements of the chosen Cepheid with errors, taken at random
  times on clear nights over a season. Without the period they look like a
  jumble.
- **Kokkuvolditud** (folded): the same points against the phase,
  φ = (t / P_test) mod 1, for a trial period P_test set by a slider. With a
  wrong period the points scatter; with the right one they form a clean
  light curve. Each point keeps its colour from the time axis above, so the
  user can follow the cycles.
- **Periodogramm**: a measure of how well the folded curve fits, for every
  trial period (phase dispersion minimisation, which is easy to explain: the
  scatter of neighbouring points in phase). The true period is the deepest
  minimum. A marker shows the current P_test, and dragging it moves the
  slider. Smaller minima at simple fractions and at 1-day aliases come from
  the nightly sampling, and the hint says so.

Controls:

- **Proovi periood** P_test, a fine slider with arrow buttons;
- **Leia periood**, which jumps to the deepest minimum;
- **Vaatlusi** (number of nights, 10–200) and **Vaatlusperiood** (time span,
  10–1000 days);
- **Mõõtmisviga** (0.01–0.2 mag);
- **Uued vaatlused**, which draws new times and errors.

Readouts: the period found, its error, and the number of cycles in the time
span. The error of the period is about P² δφ / T, where T is the time span
and δφ the phase error, so a longer span gives a more precise period. A
small table compares two real cases: *Gaia* observed each Cepheid about 40
times over almost three years (the periods of part 2), and *Hubble*
observed the galaxy Cepheids of part 3 about a dozen times over a couple of
months (to check against Riess et al. 2016 when building).

Mida joonis näitab:

- Observations come on separate nights, so one cycle is never seen whole.
  Folding many cycles onto one adds them up into a single light curve.
- Only the right period folds the points into a clean curve. The computer
  tries every period and picks the best one.
- The longer the observations run, the more cycles fit into them, and the
  more a small error in the period adds up. This is why the period of a
  Cepheid is known much more precisely than its brightness.
- The periods in part 2 come from *Gaia* DR3; those in part 3 from *Hubble*.

## Tab 3: Leavitt'i seadus (Leavitt's law)

The discovery of the period-luminosity relation and how it gives distances.
The scene has a sky panel on the left and a plot on the right, and three
steps, set by step buttons as on the standard candles calibration tab:
**1. Avastus**, **2. Kalibreerimine** and **3. Kauge galaktika**.

### Step 1: Avastus (the discovery)

- **Taevas**: a field in the Small Magellanic Cloud with about 25 Cepheids
  that blink with their periods (sped up), among non-variable stars. The
  periods and magnitudes are those of Leavitt's 1912 table (Harvard College
  Observatory Circular 173, 25 stars, P = 1.25–127 days), taken from the
  circular when building.
- **Periood-tähesuurus**: the apparent magnitude m against log P. Clicking a
  star in the sky shows its light curve in a small box and lights up its
  point. **Kõik korraga** puts all points on the plot. The brighter stars
  have the longer periods.

The text is about Henrietta Swan Leavitt, who measured the variable stars on
photographic plates at Harvard College Observatory and found 1777 variables
in the Magellanic Clouds (1908). In 1912 she showed that for 25 of them the
brightness grows with the period. All stars in the Small Magellanic Cloud are
at about the same distance, so their apparent magnitudes differ only as their
luminosities do. A portrait is not included, to keep the page free of
external files; a link to the Wikipedia article is.

### Step 2: Kalibreerimine (calibration)

The relation of step 1 gives only relative luminosities. To make it a ruler,
the absolute magnitude of a few Cepheids with known distances is needed. The
plot gets a second y-axis, M, and the Milky Way cluster Cepheids of part 2,
placed by their published cluster distances. Sliding the SMC points down by
a **μ** slider until they lie on the cluster Cepheids gives the distance
modulus of the SMC (about 19, 60 kpc). The readout shows μ and the distance.

The text gives the history briefly: Hertzsprung made the first calibration in
1913. Hubble found Cepheids in the Andromeda galaxy in 1923–24, which showed
that it is far outside the Milky Way. In 1952 Baade found that the
calibration had mixed two kinds of pulsating stars, and the distances of
galaxies doubled. In part 2 the user makes the same calibration with *Gaia*
cluster distances.

### Step 3: Kauge galaktika (a distant galaxy)

The calibrated relation, as a line in M, and the Cepheids of a simulated
galaxy at a hidden distance, as points in m. The user slides the line with
the **μ** slider until it runs through the points, then presses
**Kontrolli**. **Sobita** does it with a least-squares fit. This is exactly
what part 3 does for its 29 galaxies, with a link to `index.html#galaxies`.
**Uus galaktika** draws a new distance (5–40 Mpc) and a new number of
Cepheids.

Readouts in the panel: μ, the distance, and, in step 3, the error of μ from
the scatter of the points, σ/√N.

Mida joonis näitab:

- A larger Cepheid is more luminous, and has a lower density, so it pulsates
  more slowly (tab 1). That is why the period gives the luminosity.
- Leavitt could find the relation because all her stars were at one
  distance. Her apparent magnitudes were enough.
- To turn it into a ruler, it has to be calibrated with Cepheids whose
  distance is known in another way: this is part 2 of the exercise.
- In a distant galaxy all Cepheids are again at one distance. The shift
  between their apparent magnitudes and the calibrated relation is the
  distance modulus μ. This is part 3.

## Tab 4: Tolm ja Wesenheit (dust and the Wesenheit magnitude)

Why W_H does not depend on dust. The scene has two views, **Üks täht** (one
star) and **Galaktika** (a galaxy), switched by a segmented button above it.

### View 1: Üks täht

- **Vaade** (the view): the Cepheid seen through a dust cloud. As the
  **Tolm** slider, A_V from 0 to 5 mag, grows, the cloud thickens and the
  star gets fainter and redder.
- **Ribad** (bands): bars of the magnitude in V, I and H, without dust
  (outline) and with dust (filled). The dust dims V the most and H the
  least. The extinction ratios are those of a Fitzpatrick (1999) law with
  R_V = 3.3, about A_I ≈ 0.55 A_V and A_H ≈ 0.18 A_V, chosen to satisfy
  A_H = 0.386 (A_V − A_I) exactly.
- **Värvus-tähesuurus**: H against V − I. The star moves down and to the
  right along the reddening arrow as dust grows. Dashed lines of constant
  W_H run parallel to the arrow, and the star never leaves its line. W_H is
  the magnitude where that line crosses V − I = 0: the star's H brightness
  as it would be without its colour, and so without the dust.

Readouts in the panel, a small table: V, I, H, V − I and
W_H = H − 0.386 (V − I), without dust and with it, and the difference. The
difference is 0.000 mag in the W_H row and grows in all the others.

**Vale tolmuseadus** (a wrong dust law), a toggle: the dust follows
R_V = 2.5 instead. W_H then drifts slightly with the dust. The coefficient
0.386 assumes a known law, and the readout shows by how much.

### View 2: Galaktika

About 50 Cepheids of a simulated galaxy behind patchy dust, each with its
own random A_V (mean and spread set by the slider). The plot is the
period-luminosity relation in one band, chosen with a segmented button:
**V**, **I**, **H** and **W_H**. A histogram on the side shows the scatter
around the line.

- In V the scatter is large, and the whole relation is shifted down. A
  distance from it would come out too large.
- In H the shift and scatter are smaller, but still there.
- In W_H the points lie on the line wherever they are, and the scatter is
  only that of the instability strip. W_H also reduces part of that, because
  a Cepheid that is hotter than average is also bluer.

The readouts give the scatter σ and the shift of the mean in each band, and
the distance error that the shift would cause, in %.

Mida joonis näitab:

- Dust between the stars absorbs and scatters blue light more than red, so a
  star behind dust looks fainter and redder.
- How much fainter it looks in each band is set by how much redder it looks.
  W_H = H − 0.386 (V − I) subtracts the dimming that the colour predicts.
  What is left does not depend on the amount of dust.
- The H band (1.6 μm, infrared) is used because dust dims it only a little,
  so the correction is small. The colour V − I comes from the visible
  bands.
- In part 2 the Milky Way Cepheids are behind different amounts of dust, and
  so are the Cepheids in the dusty spiral galaxies of part 3. With W_H the
  relation is the same for all of them, which is why the exercise uses only
  W_H.
- In part 1 the colour-magnitude diagram is not corrected for dust (link to
  `hajusparved.html#varvus-heledus`).

## Changes to other files

1. `index.html`:
   - in the **Uuri lähemalt** row, the Tsefeiidid card title becomes a link
     to `tsefeiidid.html`, and the *tulekul* badge and the `soon` class are
     removed;
   - the Tsefeiidid rung of the ladder picture becomes a `rung-link`, as the
     parallax rung is;
   - the word "tsefeiidide" in the main introduction points to the new page
     instead of Wikipedia;
   - the hint about W_H at the end of part 2's **Sissejuhatus** ends with
     *Loe lähemalt →* to `tsefeiidid.html#tolm`;
   - the hint of the **Perioodi-heleduse seos** plot of part 2 links to
     `tsefeiidid.html#leavitt`, and the note under the galaxy table of part 3
     (about the distance modulus μ) links to `tsefeiidid.html#leavitt` too.
2. `parallaks.html`, `hajusparved.html` and `standardkuunlad.html`: the top
   rows get the Tsefeiidid link.
3. `hajusparved.html`: the note "Tolmust ja Wesenheiti tähesuurusest räägib
   tsefeiidide leht *tulekul*" in tab 2 becomes a link to
   `tsefeiidid.html#tolm`.
4. `standardkuunlad.html`: in tab 5, "Tsefeiidide leht *tulekul*" becomes a
   link to `tsefeiidid.html`, and the Leavitt bullet of **Mida joonis
   näitab** links to `tsefeiidid.html#leavitt`.
5. `README.md`: a paragraph on `tsefeiidid.html`, and the sentence about
   which pages exist.
6. `PLAN.md`: section 3 says that the page exists, with a pointer to this
   file, and the intro lists it among the existing pages.

## Order of building

1. The page frame, the tabs, the shared controls and the simulated Cepheid.
2. Tab 1, the core of the page, with the star, the curves and the valve.
3. Tab 4, the item that the exercise needs most.
4. Tab 3, first the discovery, then the calibration and the distant galaxy.
5. Tab 2.
6. The links in `index.html` and the other pages, the README and the plan.
