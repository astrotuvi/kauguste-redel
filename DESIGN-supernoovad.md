# Design: Ia tüüpi supernoovad page

The design of a new background page about type Ia supernovae,
`supernoovad.html`. It covers the three items listed for it in section 4 of
`PLAN.md`:

1. Why a white dwarf explodes near the Chandrasekhar mass, and why that makes
   the peak brightness nearly the same every time.
2. Standardisation: brighter supernovae fade more slowly (the Phillips
   relation). This is why part 4 uses corrected peak magnitudes (m_b_corr).
3. Why the scatter of the distant supernovae is much smaller than that of the
   nearby galaxies of part 3.

The first item is split into two tabs, one on the explosion and one on the
light curve that the radioactive nickel powers, so the page has four tabs.
Related part of the exercise: 4.

The page is self-contained and built like `tsefeiidid.html`,
`standardkuunlad.html` and `hajusparved.html`, with inline SVG and no
external dependencies. The layout is the same:

- a scene on the left with tabs above it, one tab for each item;
- a control panel on the right, whose groups change with the tab
  (`data-tabs`);
- a **Mida joonis näitab** text below that explains the current tab
  (`data-tab`).

The selected tab is kept in the address (`#plahvatus`, `#heleduskover`,
`#standardiseerimine`, `#hajuvus`), so that `index.html` and the other pages
can link to a tab.

The top row is "← Kosmiliste kauguste redel · Parallaks · Hajusparved ·
Standardküünlad · Tsefeiidid · Ia tüüpi supernoovad". The heading is
**Ia tüüpi supernoovad**.

The intro: a type Ia supernova is the explosion of a white dwarf, a burnt-out
star about the size of the Earth, in a binary system. For a few weeks it
shines as brightly as a whole galaxy, a few billion Suns, so it can be seen
billions of light years away. All of them explode in nearly the same way, so
they are standard candles (link to
`standardkuunlad.html#tsefeiidid-ja-supernoovad`), and with a small
correction the best ones there are for large distances. About one explodes
in a galaxy like the Milky Way every few hundred years; the last one seen in
the Milky Way was Kepler's supernova in 1604.

## The simulated supernova

Tabs 2 and 3 share one supernova, as the tabs of the Cepheids page share one
Cepheid. Everything follows from the mass of radioactive nickel ⁵⁶Ni that
the explosion makes, M_Ni, so that the peak, the width of the light curve
and the colour agree:

- **Peak luminosity** from Arnett's rule: at the peak, the luminosity equals
  the power of the radioactive decay, L_peak ≈ 2.0·10⁴³ erg/s × M_Ni/M☉.
  For M_Ni = 0.6 M☉ this is about 1.2·10⁴³ erg/s, 3·10⁹ L☉, and
  M_B = −19.3. In general M_B = −19.3 − 2.5 log₁₀ (M_Ni / 0.6 M☉).
- **Decline rate** Δm₁₅ from the peak through the Phillips relation used on
  the standard candles page, M_B = −19.3 + 0.8 (Δm₁₅ − 1.1), so that the two
  pages agree. The **Nikli mass** slider runs from 0.4 to 0.8 M☉, which
  gives M_B from −18.86 to −19.61 and Δm₁₅ from 1.65 to 0.71. The stretch
  s, by which the time axis of a standard light curve is stretched, follows
  from Δm₁₅ (s ≈ 1 at Δm₁₅ = 1.1, larger for slower supernovae).
- **Light curve** in B and V: a rise of about 18 days times s to the peak, a
  decline over the first month with Δm₁₅, then a straight tail in
  magnitudes. The tail falls by about 0.014 mag/day in B: the decay of
  ⁵⁶Co (half-life 77 days) would give 0.0098, and more of the gamma rays
  escape as the ejecta thin out. In the red and infrared a second maximum
  comes about a month after the first; the B curve does not have one.
- **Colour** at the peak, B − V: about 0 for every M_Ni, with an intrinsic
  scatter of 0.05 mag. Dust in the host galaxy adds to it (tab 3).

Controls at the top of the panel, shared by tabs 2 and 3:

- **Nikli mass**, a slider from 0.4 to 0.8 M☉;
- **Tuntud supernoovad** (known supernovae), buttons that set M_Ni and the
  name in the readouts: SN 2011fe (M101, a normal one, the nearest in
  decades, and the first calibrator of part 3), SN 1991T (bright and slow)
  and SN 2014J (M82, behind a lot of dust, for tab 3). SN 1991bg (faint and
  fast, M_Ni ≈ 0.1 M☉) is a fourth button marked as a special case: it lies
  off the slider and below the relation, and the text says that such
  supernovae are left out of cosmology samples, as Pantheon+ does with its
  limits on the stretch and colour.

## Tab 1: Plahvatus (the explosion)

Why a white dwarf explodes, and why all of them explode at nearly the same
mass. The scene has two views, **Kaksiktäht** (the binary) and **Spekter**
(the spectrum), switched by a segmented button above it.

### View 1: Kaksiktäht

- **Süsteem** (the system): a white dwarf and a red giant companion that
  fills its Roche lobe. Gas flows over to an accretion disc around the white
  dwarf, drawn as moving dots. The white dwarf is drawn to its true relative
  size: it shrinks as it gains mass.
- **Mass ja raadius** (mass and radius): the radius of a white dwarf against
  its mass, from 0.2 to 1.44 M☉, with the curve of Nauenberg (1972),
  R ≈ 0.0126 R☉ (M/M_Ch)^(−1/3) [1 − (M/M_Ch)^(4/3)]^(1/2) with
  M_Ch = 1.44 M☉. The curve falls to zero at the Chandrasekhar mass. A point
  marks the current white dwarf, with the Earth's radius as a dashed line
  for comparison (a 0.6 M☉ white dwarf is about the size of the Earth).

Under the scene is the **Aeg** slider and a play button, as on the other
pages. Time runs from the start of the mass transfer (M = 1.0 M☉) for a few
million years, at about 10⁻⁷ M☉ per year. Four step buttons move the time to
each stage and show a short caption:

1. **Kogub massi**: the white dwarf takes gas from its companion. Its own
   heat cannot hold it up; the pressure of its electrons does, because two
   electrons cannot be in the same state (degenerate matter). A teaspoon of
   it weighs a few tonnes.
2. **Tõmbub kokku**: more mass means more gravity, and the electrons are
   squeezed closer. The white dwarf gets smaller and denser as it grows.
3. **Süttib**: near 1.38 M☉, just below the Chandrasekhar mass of 1.44 M☉,
   the density at the centre reaches about 2·10⁹ g/cm³ and carbon starts to
   fuse. Degenerate matter does not expand when it heats up, so nothing
   slows the burning down: it runs away.
4. **Plahvatab**: in about a second, a burning front crosses the star and
   turns half of it into iron-group elements, mostly radioactive nickel ⁵⁶Ni.
   The energy unbinds the whole star, which flies apart at about
   10 000 km/s. Nothing is left behind.

**Kaks valget kääbust** (two white dwarfs), a toggle: the other way it can
happen. Two white dwarfs spiral towards each other as they lose energy to
gravitational waves, and merge. The text says honestly that which of the two
ways is more common is still not known, and that some white dwarfs may
explode below the Chandrasekhar mass. This is one reason why the peak
brightness is not exactly the same every time, which tab 3 deals with.

Readouts in the panel: the time, the white dwarf's mass, its radius in
Earth radii and in km, its central density, and the stage.

### View 2: Spekter

How a type Ia supernova is recognised. Four schematic spectra near the peak,
from 4000 to 7000 Å, one under another: **Ia**, **Ib**, **Ic** and **II**,
with the lines marked: hydrogen (Hα), helium and ionised silicon
(Si II 6355 Å, blueshifted to about 6150 Å). Clicking a type highlights it.

- Type II shows hydrogen: a massive star whose core collapsed.
- Types Ib and Ic lack hydrogen, but they are also core collapses, of stars
  that lost their outer layers. Their luminosities differ widely.
- Type Ia shows no hydrogen and a deep silicon line. A white dwarf has no
  hydrogen left, and silicon is made in the outer layers of the explosion.

The blueshift of the silicon line gives the speed of the ejecta, about
10 000 km/s; the readout shows it for the line in the drawing. The text
says that the letter only names the spectrum: the physics of Ia and of the
others is completely different.

Mida joonis näitab:

- A white dwarf is what is left of a star like the Sun. It no longer burns,
  and the pressure of its electrons holds it up against its gravity.
- Electron pressure can hold up at most 1.44 M☉, the Chandrasekhar mass.
  A white dwarf that gains mass from a companion explodes just before
  reaching it.
- Because every white dwarf explodes at nearly the same mass, it has nearly
  the same amount of fuel, and the explosion makes nearly the same amount of
  nickel. This is why type Ia supernovae are nearly standard candles.
- The spectrum tells a type Ia apart from other supernovae, which are much
  less uniform. A distance measurement starts by taking a spectrum.

## Tab 2: Heleduskõver (the light curve)

What makes a supernova shine for weeks, and why the light curve and the peak
brightness are linked. The scene has three parts.

- **Paisuv pilv** (the expanding cloud): a cross-section of the ejecta that
  grows with time, with nickel in the middle (one colour), cobalt and iron
  forming from it as it decays (two other colours, as dots that change
  colour), and the intermediate elements (silicon, sulphur, calcium) in an
  outer shell. Gamma rays from the decay are short arrows; early on they are
  absorbed inside the cloud, later more of them escape.
- **Heleduskõver**: M_B and M_V against time from −20 to +100 days, with a
  time marker. The power of the radioactive decay is drawn as a dashed line
  on the same axis, so that the peak touches it (Arnett's rule) and the tail
  follows it. Δm₁₅ is marked as a bracket between the peak and 15 days
  later.
- **Lagunemisahel** (the decay chain): ⁵⁶Ni → ⁵⁶Co (half-life 6.1 days) →
  ⁵⁶Fe (77 days), as three bars that show how much of each there is at the
  current time.

Under the scene is the **Päev** slider and a play button.

The **Nikli mass** slider (shared) changes the whole picture: more nickel
gives a brighter peak, and because the iron-group elements are opaque, the
light takes longer to diffuse out, so the light curve is also wider and
fades more slowly. This is the physics behind the Phillips relation of tab 3.

Readouts in the panel: M_Ni, the peak M_B and L_peak in L☉ and erg/s, the
rise time, Δm₁₅, and at the current day the amounts of Ni, Co and Fe and the
fraction of the decay power that escapes as light.

Mida joonis näitab:

- A supernova does not shine from the heat of the explosion: the ejecta
  cool as they expand. It shines from radioactive decay, first of nickel and
  then of cobalt.
- The light is trapped in the dense cloud at first. It escapes once the
  cloud has thinned, about three weeks after the explosion, and that is the
  peak. After that the brightness follows the decay of cobalt, which is why
  the tail is a straight line in magnitudes.
- More nickel gives a brighter supernova that fades more slowly. The
  amount of nickel is not exactly the same every time, so neither is the
  peak, but the light curve shows how much there was. Tab 3 uses this.
- About half of the iron in the Universe, including the iron in our blood,
  was made in explosions like these.

## Tab 3: Standardiseerimine (standardisation)

How the scatter of peak magnitudes is reduced from about 0.4 mag to about
0.13 mag. The scene has two views, **Heleduskõverad** (light curves) and
**Phillipsi seos** (the Phillips relation), switched by a segmented button.
Both use the same simulated sample of 40 nearby supernovae at known
distances, each with its own M_Ni (0.4–0.8 M☉), its own dust in the host
galaxy (E(B − V) from an exponential distribution with a mean of
0.07 mag, R_B = 4.1 as for Milky Way dust; real host dust has a smaller R_B,
as the text says) and a random intrinsic scatter of 0.10 mag. The supernova
of the shared slider is drawn on top, in the accent colour.

### View 1: Heleduskõverad

The absolute B light curves of 12 of the supernovae, against days since the
peak. Without corrections they spread over about 1 mag at the peak. Two
checkboxes:

- **Venita ajatelge** (stretch the time axis): each curve is stretched by
  1/s on the time axis and moved by its Phillips correction in magnitude.
  The curves slide together, but a few stay too faint: the dusty ones.
- **Paranda värvi järgi** (correct for colour): each curve is moved up by
  β c, where c is its colour at the peak. Now all of them lie on one curve
  within about 0.15 mag.

The two corrections animate over about a second, so that the user sees
them move. This is the stretch method of Perlmutter et al. (1997), which the
Supernova Cosmology Project used.

### View 2: Phillipsi seos

- **Maksimum ja tuhmumine**: M_B against Δm₁₅ for the 40 supernovae, with
  the relation as a line. SN 1991bg is drawn as an open point far below,
  outside the range of the fit. A histogram of M_B is on its right side.
- **Maksimum ja värvus**: M_B against the colour c, with the line of slope
  β. The dusty supernovae are far to the right and down.

Checkboxes **Tuhmumise korrektsioon** and **Värvi korrektsioon** subtract
each relation; the points move and the histogram narrows. A small table
gives σ for no correction (about 0.40 mag), for Δm₁₅ alone (about 0.25), for
colour alone and for both (about 0.13).

The text gives the formula used in practice, the Tripp (1998) formula with
SALT2 parameters:

m_B,corr = m_B + α x₁ − β c, with α ≈ 0.15 and β ≈ 3.1,

where x₁ is the stretch parameter (larger for slower supernovae; x₁ = 0 is
roughly Δm₁₅ = 1.1, and α x₁ is nearly the same as 0.8 (1.1 − Δm₁₅)) and c
the colour. β ≈ 3.1 is smaller than R_B = 4.1 for Milky Way dust: part of the
colour is the supernova itself, and dust in other galaxies seems to differ.
Pantheon+ also adds a correction for selection effects and a step of about
0.05 mag for the mass of the host galaxy. These m_b_corr values are what
part 4 uses as m_B, with a link to `index.html#supernovae`. The M_B of the
calibrators in part 4 (with the published Cepheid relation of part 3, a
scatter of 0.125 mag about M_B = −19.33) is the corrected one, and the text
gives these two numbers.

Readouts in the panel: for the supernova of the shared slider, its Δm₁₅, x₁,
c, M_B before and after each correction, and the σ table.

Controls: **Uus valim** draws a new sample; **Tolm** sets the mean E(B − V)
(0–0.3 mag), to show that the colour correction matters more in dusty
samples.

Mida joonis näitab:

- The peak brightness of a type Ia supernova varies by about 40 %, too much
  for a precise distance. The light curve shows which ones are brighter: the
  slower ones (tab 2). Mark Phillips found this in 1993.
- Dust in the host galaxy makes a supernova fainter and redder. Its colour
  at the peak gives the correction, much as W_H does for Cepheids (link to
  `tsefeiidid.html#tolm`).
- After both corrections, one supernova gives its distance to about 6 %
  (0.13 mag). That is better than any other single object this far away.
- A supernova that does not look like the others, such as SN 1991bg, is not
  used. Measuring distances starts with choosing objects that the relation
  fits.

## Tab 4: Väike hajuvus (small scatter)

Why the distant supernovae of part 4 lie much closer to a straight line than
the Cepheid galaxies of part 3. The answer is mostly in the velocities, not
in the distances. The scene has two views, **Mudel** (a model) and **Päris
andmed** (real data), switched by a segmented button.

### View 1: Mudel

A simulated universe with H₀ = 70 km/s/Mpc. Every galaxy has its own motion,
a peculiar velocity with σ_v set by a slider (0–600 km/s, about 250 by
default), on top of the expansion; every distance has an error σ_μ (0–0.5
mag, default 0.13 for one supernova). Two plots:

- **Kiirus ja kaugus**: v against d from 0 to 300 Mpc, with the true line
  v = H₀ d. A shaded band shows ±σ_v around it, the same width everywhere.
  A **Kaugusvahemik** (distance range) double slider picks the galaxies used
  in the fit, from about 20 points; the fitted H₀ and its error are shown.
  Presets: **3. osa** (7–60 Mpc, 29 galaxies, σ_μ = 0.06 from many
  Cepheids) and **4. osa** (80–270 Mpc, 166 supernovae, σ_μ = 0.13).
- **Suhteline hälve** (relative deviation): (v − H₀ d) / (H₀ d) against d.
  The band of the peculiar velocities is now σ_v / (H₀ d): at 10 Mpc it is
  ±36 %, at 100 Mpc ±3.6 %. The distance error is a band of constant width,
  ±0.46 σ_μ (±6 % for one supernova). The two bands cross at about 60 Mpc,
  which is why the distant supernovae start at z = 0.023 (about 100 Mpc).

Readouts in the panel: the fitted H₀ with its error and the scatter about
the line, for the chosen range, and the share of the scatter from the
velocities and from the distances.

### View 2: Päris andmed

The same two plots with the data built into `index.html`:

- the 29 Cepheid galaxies of part 3, with μ from their Cepheids and the
  published relation (precomputed), v = c z_HD (1 + 0.775 z). They are 7–59
  Mpc away at 370–4000 km/s. The fit through the origin gives about
  68 km/s/Mpc, and the velocities scatter by about 15 % about the line
  (0.34 mag; about 230 km/s).
- the 166 distant supernovae of part 4 with M_B = −19.33 (the calibrators'
  mean with the published relation) or −19.253 (SH0ES), chosen by a
  segmented button. They are 80–270 Mpc away at 7 000–18 000 km/s, and they
  scatter by 0.146 mag (about 7 %) about the line. H₀ is about 70 or
  72 km/s/Mpc.

The relative deviation plot shows the part 3 galaxies spread widely and the
supernovae in a narrow band, and the σ_v band explains both. The page
does not read the user's own results from `index.html`; a link goes to
`index.html#snHubble` to do that.

The text explains also why part 4 stops at z = 0.06: farther out the
expansion of the Universe while the light travelled matters more, and the
factor (1 + 0.775 z) is only the first term. Link to the Hubble'i seadus
page, or *tulekul* until it exists.

Mida joonis näitab:

- The velocity of a galaxy is the expansion plus its own motion, a few
  hundred km/s, as it falls towards its neighbours. Corrections for it
  (z_HD) remove part of it.
- Nearby, a few hundred km/s is a large part of the velocity, 10–40 %. Far
  away it is only a few per cent. Only galaxies far away show the expansion
  cleanly.
- Cepheids can be seen only to about 40–60 Mpc, where the velocities still
  scatter a lot. Supernovae can be seen much farther, where they do not.
  This is why the ladder needs the third rung, and why part 4 gives a more
  precise H₀ than part 3.
- What sets the error in part 4 is the calibration: an error of 0.05 mag in
  M_B changes H₀ by 2.3 %. The number of distant supernovae matters much
  less.

## Real data on the page

To keep the page self-contained, it carries a small copy of the data of
part 4: for each of the 29 hosts, the name, the supernova, m_b_corr, z_HD and
μ from the published relation (a few kB), and the 166 pairs of z_HD and
m_b_corr. The comment above them says where they come from and that they
are copies of the arrays in `index.html`.

## Changes to other files

1. `index.html`:
   - in the **Uuri lähemalt** row, the Ia supernoovad card title becomes
     **Ia tüüpi supernoovad** and a link to `supernoovad.html`, and the
     *tulekul* badge and the `soon` class are removed;
   - the Ia supernoovad rung of the ladder picture becomes
     **Ia tüüpi supernoovad** and a `rung-link`;
   - the word "supernoovadeni" in the main introduction and "supernoova" in
     the lede of part 4 point to the new page instead of Wikipedia;
   - the note under the supernova table of part 4 (about m_B being the peak
     magnitude) mentions that it is standardised and ends with
     *Loe lähemalt →* to `supernoovad.html#standardiseerimine`; the hint of
     the distant supernova Hubble plot ends with *Loe lähemalt →* to
     `supernoovad.html#hajuvus`.
2. `parallaks.html`, `hajusparved.html`, `standardkuunlad.html` and
   `tsefeiidid.html`: the top rows get the Ia tüüpi supernoovad link.
3. `standardkuunlad.html`: in tab 5, "Ia supernoovade leht *tulekul*"
   becomes a link to `supernoovad.html`, and the Phillips bullet of **Mida
   joonis näitab** links to `supernoovad.html#standardiseerimine`.
4. `README.md`: a paragraph on `supernoovad.html`, and the sentence about
   which pages exist.
5. `PLAN.md`: section 4 says that the page exists, with a pointer to this
   file, and the intro lists it among the existing pages.

## Order of building

1. The page frame, the tabs, the shared controls and the simulated
   supernova.
2. Tab 3, the item that part 4 needs most.
3. Tab 1, first the binary and the mass–radius curve, then the spectra.
4. Tab 2.
5. Tab 4, first the model, then the real data.
6. The links in `index.html` and the other pages, the README and the plan.
