# Design: Standardküünlad page

The design of the standard candles page, `standardkuunlad.html`. The page
covers the five items listed for it in section 2 of `PLAN.md`: the
inverse-square law, magnitudes, calibration, what makes a good candle, and
the two candles in the exercise. Related parts of the exercise: 2, 3 and 4.

The page is self-contained and built like `parallaks.html`: inline SVG and
no external dependencies. The layout is the same:

- a scene on the left with tabs above it, one tab for each item of the list;
- a control panel on the right;
- a **Mida joonis näitab** text below that explains the current tab.

The selected tab is kept in the address (`#magnituudid`), so that
`index.html` and the other pages can link to a tab.

## Light source selector

At the top of the control panel is a segmented button, **Valgusallikas**:
**Lamp**, **Tsefeiid** and **Ia supernoova**. The choice is shared by the
first three tabs and is kept when the tab changes. Each source has its own
luminosity, distance range and units. The distance slider is logarithmic,
because the ranges span many powers of ten.

| Source | Luminosity | Absolute magnitude | Distance slider | Units |
|---|---|---|---|---|
| Lamp: 100 W incandescent bulb, ≈ 1700 lm | ≈ 135 cd | M ≈ +68 | 1 m – 1 000 000 km | m, km |
| Cepheid with P = 10 d | ≈ 3000 L☉ | M_V ≈ −4.0 | 10 pc – 100 Mpc | pc, kpc, Mpc, ly |
| Type Ia supernova at peak | ≈ 5·10⁹ L☉ | M_B ≈ −19.3 | 10 pc – 5 Gpc | pc, kpc, Mpc, Gpc, ly |

Each source has a marker on the slider for each detection limit:
**palja silmaga** (naked eye, m ≈ 6), **suur teleskoop** (large telescope,
m ≈ 24) and **Hubble** (m ≈ 29). Beyond a limit the readout says the source
can no longer be seen with that instrument. Some facts worth putting in the
text:

- A 100 W bulb at 1 km has m ≈ −4 (as bright as Venus), and at 100 km
  m ≈ 6, the naked-eye limit. On the Moon it would have m ≈ 24, which a large
  telescope could still see.
- A supernova at 10 pc would look exactly as bright as the bulb seen from
  1 m (m ≈ −19.3).
- A P = 10 d Cepheid is seen with the naked eye to about 1 kpc and with
  *Hubble* to about 40 Mpc, the range of part 3. A supernova is seen with the
  naked eye to about 1 Mpc (S Andromedae, 1885), and with a large telescope
  across most of the observable Universe. Beyond about 1 Gpc the redshift
  matters, with a link to the Hubble'i seadus page.

The screen cannot show brightness differences of 10²⁰ times. The glow of a
source is therefore drawn with its size and opacity set by the magnitude, as
on star charts. The eye also judges brightness on a roughly logarithmic
scale, and the Magnituudid tab builds on that.

## Tab 1: Pöördruutude seadus (the inverse-square law)

The sliding lamp. The scene has two parts.

- **Kõrvalt** (side view, the larger part): the chosen source on a
  horizontal track and the observer's telescope at the left end. Moving the
  **Kaugus** slider, or dragging the source, slides it along the track. Light
  leaves the source as moving dots, each a packet of photons, spreading in a
  cone. With **Näita ruute** on, square frames at d, 2d and 3d show that the
  light passing through one square at d covers 4 squares at 2d and 9 at 3d.
  The telescope mirror has a fixed size and counts the dots that reach it,
  shown as a counter and a bar (**footoneid sekundis**). The track is drawn
  on a log scale with tick labels, so a whole range of distances fits. A
  note says so, as the parallax page does for its drawing.
- **Vaatleja vaade** (what the observer sees), a small square below the
  side view, next to the flux plot: a black sky with the source as a glowing dot. Beside it are two
  comparison stars of known magnitude, so the eye has something to compare
  with.

Below the scene is a small plot of the flux F/F₀ against the distance d/d₀,
with a point for the current distance and the 1/d² curve. With **Logaritmteljed**
on, the curve becomes a straight line of slope −2.

Readouts in the panel: the distance, the flux relative to the starting
distance (½ the distance → 4×, 10× the distance → 1/100) and the formula
F = L / (4π d²).

**Sama heledus, eri kaugus** (same brightness, different distance): a button
puts all three sources side by side in the observer's view at distances
where they look equally bright. A lamp at 1 km, a Cepheid at about 9 pc and
a supernova at about 10 kpc all look the same. Brightness alone gives no
distance. The luminosity has to be known, and that is what a standard candle
provides.

## Tab 2: Magnituudid (magnitudes)

The same source and distance slider as tab 1. The scene is a vertical
magnitude axis, with the bright end at the top and these reference marks:

- the Sun (−26.7), the full Moon (−12.7), Venus (−4.6), Sirius (−1.5) and
  Vega (0);
- the naked-eye limit (6), Pluto (14), the large-telescope limit (24) and
  the *Hubble* limit (29).

The source has two marks on the axis: **m**, which moves with the slider,
and **M**, which stays fixed. An arrow between them is labelled
μ = m − M. Beside the magnitude axis is a second axis for the distance in
parsecs, on a log scale. It is aligned so that every 5 magnitudes of μ is a
factor of 10 in distance. With it, the formula d = 10^(μ/5+1) pc can be read
off the picture: μ = 0 is 10 pc, μ = 5 is 100 pc, μ = 10 is 1 kpc and
μ = 30 is 10 Mpc.

Readouts in the panel: m, M, μ and d, with the formulas
m − M = 5 log₁₀ d − 5 and d = 10^(μ/5+1) pc, and the numbers filled in.

**Heleduste suhe** (brightness ratio), a small calculator below: two
sliders for m₁ and m₂, and the flux ratio 100^(Δm/5) = 10^(0.4 Δm). It shows
that 5 magnitudes is exactly 100 times and 1 magnitude is about 2.5 times,
and that a larger magnitude means a fainter source.

## Tab 3: Kalibreerimine (calibration)

Two copies of the chosen source on two tracks. The step buttons are
**1. Kalibreeri** and **2. Mõõda**.

1. **Kalibreeri** (calibrate): the upper source is at a known distance. The
   method that gives the distance depends on the source, and this is the link
   to the previous rung:
   - the lamp: a tape measure;
   - the Cepheid: the parallax of its cluster (part 1);
   - the supernova: the Cepheids of its host galaxy (part 3).

   The user reads m and presses **Arvuta M**. The page shows
   M = m − 5 log₁₀ d + 5 with the numbers filled in.
2. **Mõõda** (measure): the lower source is at a hidden random distance. The
   user reads its m and enters a distance, or presses **Arvuta kaugus**. The
   page compares the result with the true distance. **Uus allikas** draws a
   new hidden distance, as **Uus ülesanne** does on the parallax page.

**Kalibreerimise viga** (calibration error): a slider moves the known
distance of step 1 away from its true value by −20 % … +20 %. Every distance
measured in step 2 is then off by the same fraction. A plot of measured
against true distance, for the sources measured so far, shows the points
moving off the 1:1 line all together. The error does not average down with
more sources. This is the systematic error that is passed up the ladder, and
the reason parts 2–4 add the zero-point error to H₀.

A small three-rung ladder in the corner shows parallax → Cepheids →
supernovae. The error band of each rung is drawn as wider than the one
below, and the rung of the chosen source is highlighted.

## Tab 4: Hea küünal (what makes a good candle)

Without the source selector. The scene shows one simulated galaxy at a fixed
distance that contains N candles of one kind. Each candle gets a distance from
its own magnitude. A histogram shows these distances, with the true distance
marked.

Controls in the panel:

- **Küünla tüüp** (candle type), with a typical scatter σ_M for each:
  - lamps of unknown power: 1.5 mag;
  - Cepheids without the period: 0.8 mag;
  - Cepheids with the period–luminosity relation (W_H): 0.15 mag;
  - type Ia supernovae without correction: 0.4 mag;
  - standardised type Ia supernovae: 0.13 mag.
- **Hajuvus σ_M**, a slider (0–1.5 mag), set by the type but adjustable.
- **Küünalde arv N**, a slider (1–100). Cepheids can be many in a galaxy,
  supernovae usually one.

Readouts: the error of one distance, σ_d/d ≈ 0.46 σ_M (0.2 mag → 10 %), and
of the mean, divided by √N.

**Ulatus ja täpsus** (reach and precision), a second view: a scatter plot of
candle types, with the reach as the x-axis (the largest distance at
m = 29, on a log scale) and the scatter σ_M as the y-axis. The types are RR
Lyrae stars, Cepheids, the tip of the red giant branch, type Ia supernovae
and, for contrast, the lamp. Clicking a point shows a short card about that
type. A good candle sits at the bottom right. Every type is a trade-off
between reach and precision, and that is why a ladder has more than one rung.

A checklist on the side: **hele** (bright), **äratuntav**
(recognisable), **väike hajuvus** (small scatter) and **kalibreeritav**
(calibratable, with enough nearby examples). Each item is ticked for the
selected type.

## Tab 5: Tsefeiidid ja supernoovad (the two candles in the exercise)

This tab introduces *standardisable* candles. The two candles are not equally
bright every time, but their luminosity can be predicted from a quantity that
can be measured. The scene has two panels side by side, built the same way.

- **Tsefeiidid**: a small animated star that pulsates, its light curve, and
  a slider for the period P. Below is the period–luminosity plot with about
  30 simulated Cepheids. On the side of the plot is a histogram of their
  magnitudes.
- **Ia supernoovad**: a light curve after the peak, with a slider for how
  fast the supernova fades (Δm₁₅). Below is the plot of peak magnitude
  against Δm₁₅, with a histogram of the peak magnitudes on its side.

**Kasuta seost** (use the relation), a checkbox in each panel, subtracts the
relation from the magnitudes. The wide histogram (0.8 mag and 0.4 mag)
then narrows to 0.15 mag and 0.13 mag. The point is the same in both:
measure the period or the fading rate, and the luminosity follows.

Each panel ends with a link to the **Tsefeiidid** or **Ia supernoovad**
page, or a *tulekul* note until the page exists, and a link to the part of
the exercise that uses that candle (parts 2–3 or part 4).

Below the two panels is a shared distance axis on a log scale, from 1 pc to
10 Gpc. It shows the ranges of parallax (to a few kpc), Cepheids (to about
40 Mpc) and type Ia supernovae (from about 10 Mpc to Gpc). The overlaps are
highlighted and labelled **kalibreerimine**. Hovering over a range
highlights it, and clicking it goes to that part of the exercise. This is the
same idea as the ladder picture in `index.html`, now with real distances.

## Order of building

1. The page frame, the tabs, the source selector and tab 1 (the core of the
   page).
2. Tab 2, which reuses the slider and adds the magnitude axes.
3. Tab 3 with the calibration task.
4. Tabs 4 and 5, which use simulated data, so that only random-number code
   is needed.
