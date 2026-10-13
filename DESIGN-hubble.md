# Design: Hubble'i seadus page

The design of a new background page about the Hubble law, `hubble.html`. It
covers the five items listed for it in section 5 of `PLAN.md`:

1. Redshift and recession velocity.
2. Why nearby galaxies scatter (peculiar velocities of a few hundred km/s) and
   distant ones do not.
3. The expansion correction (1 + 0.775 z) used in part 4.
4. The Hubble time as an approximate age of the Universe.
5. The Hubble tension: the distance ladder against Planck, which part 4
   compares.

The second item is already covered in depth by tab 4 of the type Ia
supernovae page (`supernoovad.html#hajuvus`). This page does not repeat that
model. It explains where peculiar velocities come from and how the redshifts
are corrected for them, and links to that tab for the scatter itself. The
first item is split into two tabs, one on redshift and one on the expanding
Universe that causes it, so the page has five tabs. Related parts of the
exercise: 3 and 4.

The page is self-contained and built like `supernoovad.html`,
`tsefeiidid.html`, `standardkuunlad.html` and `hajusparved.html`, with inline
SVG and no external dependencies. The layout is the same:

- a scene on the left with tabs above it, one tab for each item;
- a control panel on the right, whose groups change with the tab
  (`data-tabs`);
- a **Mida joonis näitab** text below that explains the current tab
  (`data-tab`).

The selected tab is kept in the address (`#punanihe`, `#paisumine`,
`#kaugemale`, `#vanus`, `#pinge`), so that `index.html` and the other pages
can link to a tab.

The top row is "← Kosmiliste kauguste redel · Parallaks · Hajusparved ·
Standardküünlad · Tsefeiidid · Ia tüüpi supernoovad · Hubble'i seadus". The
heading is **Hubble'i seadus**.

The intro: the farther away a galaxy is, the faster it moves away from us,
v = H₀ d. The light of a receding galaxy is shifted to longer wavelengths,
so its spectrum gives its velocity directly, without any ladder. The
distance is the hard part, and that is what the ladder is for. Once H₀ is
known, the law turns around: a redshift alone gives the distance to any
galaxy. Georges Lemaître (1927) and Edwin Hubble (1929) found the law; since
2018 the International Astronomical Union recommends calling it the
Hubble–Lemaître law. H₀ also sets the scale of the whole Universe: its size
and its age.

## Shared model

All tabs use one flat cosmological model with matter and dark energy:

- **H₀**, 50–100 km/s/Mpc, 70 by default;
- **Ω_m**, the matter density, 0–1, 0.315 by default (Planck), with
  Ω_Λ = 1 − Ω_m.

From these follow, by numerical integration of
H(z) = H₀ √(Ω_m (1 + z)³ + Ω_Λ):

- the comoving distance D_C = c ∫ dz / H(z) and the luminosity distance
  D_L = (1 + z) D_C;
- the lookback time and the age t₀ = ∫ dz / ((1 + z) H(z));
- the deceleration parameter q₀ = Ω_m / 2 − Ω_Λ (−0.53 for Ω_m = 0.315,
  −0.55 for 0.3 as in SH0ES).

H₀ and Ω_m are shown as sliders only in the tabs that use them (3 and 4).
Tabs 1, 2 and 5 use the default values.

The constants 977.8 (1/H₀ in Gyr for H₀ in km/s/Mpc) and c = 299 792.458 km/s
are the same as in `index.html`.

## Tab 1: Punanihe (redshift)

What redshift is and how it gives a velocity. The scene has two views,
**Spekter** (the spectrum) and **Venitus** (stretching), switched by a
segmented button above it.

### View 1: Spekter

- **Galaktika spekter**: a schematic spectrum of a galaxy from 3500 to
  9000 Å, drawn as a colour band (invisible parts grey) with a line graph
  above it. It has the absorption lines of an old stellar population, Ca II
  K and H (3934, 3969 Å), the G band (4304 Å), Mg b (5175 Å) and Na D
  (5893 Å), and the emission lines of gas, Hβ (4861 Å), [O III]
  (5007 Å) and Hα (6563 Å).
- **Laboratoorne spekter**: the same lines at rest below it, joined to the
  shifted ones by thin lines, so the shift is visible line by line.

A **Punanihe z** slider (logarithmic, 0.001–1.5) shifts the spectrum.
Buttons set it to real galaxies: the Andromeda galaxy (z = −0.001, a
blueshift: it is coming towards us), the Virgo cluster (z ≈ 0.004), a galaxy
of part 3 (NGC 5584, z = 0.006), a supernova host of part 4 (z ≈ 0.04) and a
distant one (z = 1). At large z the visible lines move into the infrared and
lines from the ultraviolet, such as Mg II 2800 Å and [O II] 3727 Å, come in.

Readouts in the panel: z = Δλ / λ for the marked line, its observed
wavelength, v = cz in km/s, and the distance d = v / H₀ in Mpc and in light
years. With **Mõõda ise** (measure it yourself) the spectrum gets a random
hidden redshift: the user drags a set of rest-frame line markers until they
match the lines and reads z; **Kontrolli** compares it with the truth.

### View 2: Venitus

Why the light is redshifted. An animation of a light wave that travels
from a distant galaxy to the Milky Way across a grid of galaxies that
grows while it travels. The wave is drawn in the colour of its wavelength,
blue at the start, and it is stretched as much as the grid is: when it
arrives, it is redder.

A **Teekonna aeg** (travel time) slider and a play button. A readout gives
the scale factor a (the size of the grid compared with today), the
wavelength and 1 + z = 1 / a at emission.

A plot below compares three ways to turn z into a velocity, from z = 0 to
1.5:

- v = cz, used in parts 3 and 4;
- the special relativity Doppler formula, which never exceeds c;
- the actual recession velocity today in the model, v = H₀ D_C, which
  exceeds c beyond z ≈ 1.5.

All three agree below z ≈ 0.1. The ranges of parts 3 (z < 0.014) and 4
(0.023 < z < 0.06) are marked; in both, v = cz is correct to better than a
few per cent, and part 4 fixes even that (tab 3).

Mida joonis näitab:

- Every element absorbs and emits light at its own wavelengths. In the
  spectrum of a receding galaxy, all lines move by the same fraction towards
  the red. That fraction is the redshift z.
- For small z, the velocity is v = cz. A redshift of 0.01 means 3000 km/s.
  Measuring it needs only a spectrum, not a distance.
- The redshift of distant galaxies is not a Doppler shift through space: the
  space between the galaxies grows while the light travels, and the light
  waves grow with it. Nearby, both views give the same numbers.
- Nearby galaxies, such as Andromeda, can also be blueshifted. Their own
  motion is larger than the expansion (tab 2).

## Tab 2: Paisumine (the expansion)

Why v is proportional to d, and what spoils it nearby. The scene has two
views, **Paisuv Universum** (the expanding Universe) and **Hubble 1929**,
switched by a segmented button.

### View 1: Paisuv Universum

- **Galaktikad** (galaxies): about 40 galaxies scattered on a plane, which
  grows uniformly while a time slider or the play button runs. Each galaxy
  leaves a short trail. One galaxy is marked as "meie" (us); clicking any
  other makes it "us", and the view recentres on it. From every galaxy, the
  others move away with v ∝ d: no galaxy is the centre.
- **Kiirus ja kaugus**: v against d for the galaxies, seen from the galaxy
  that is "us". The points lie on a straight line through the origin, and the
  line is the same from every galaxy.

**Pekuliaarsed kiirused** (peculiar velocities), a slider from 0 to 600 km/s: each
galaxy gets a random velocity of its own, drawn as an arrow. Near "us" the
points of the v–d plot scatter widely, far away they hardly move from the
line. The text links to `supernoovad.html#hajuvus` for the model of the
scatter and the real data of parts 3 and 4.

**Kohalik liikumine** (local motion), a toggle that shows where the
peculiar velocities of real galaxies come from and how Pantheon+ corrects
them, as a chain of arrows with their sizes:

- the Earth around the Sun, 30 km/s;
- the Sun around the centre of the Milky Way, about 230 km/s;
- the Milky Way towards Andromeda and the Local Group as a whole, together
  about 620 km/s relative to the cosmic microwave background, towards the
  Great Attractor and the Shapley supercluster.

The redshift measured on the Earth (heliocentric) is first moved to the
frame of the microwave background (z_CMB), then corrected for the motion of
each galaxy predicted from a map of the matter around it (z_HD, Peterson
et al. 2022). The text says that parts 3 and 4 use z_HD, and that the
correction leaves a scatter of about 250 km/s.

### View 2: Hubble 1929

The historical Hubble diagram: the 24 galaxies of Hubble (1929, PNAS 15,
168, table 1), with velocities mostly from Vesto Slipher and distances from
Cepheids and the brightest stars. The points and Hubble's line,
K ≈ 500 km/s/Mpc, are drawn. A second set of axes, toggled by **Tänapäeva
kaugused** (today's distances), moves the points to their current distances
(from NED, built in) and shows the slope of about 70.

The text explains why Hubble's value was 7 times too large: he did not know
that there are two kinds of Cepheids (Walter Baade, 1952), so his Cepheid
distances were about 2 times too small, and farther away he took bright gas
clouds for single stars. The diagram also shows how short the ladder was: the
farthest galaxy is only about 2 Mpc away, and the velocities hardly exceed
1000 km/s, where peculiar velocities still matter.

Readouts in the panel: the slope fitted through the origin for the shown
points, and the Hubble time 1/H₀ it gives (2 Gyr for Hubble, compared with
the age of the Earth, 4.5 Gyr; tab 4).

Mida joonis näitab:

- If the Universe expands uniformly, every distance grows by the same
  fraction in the same time. Then a galaxy twice as far moves away twice as
  fast, from the point of view of every galaxy. The Hubble law follows from
  the expansion itself, and there is no centre.
- Galaxies also move on their own, a few hundred km/s, as they fall towards
  their neighbours. Nearby this is a large part of the velocity; far away a
  small one. This is why part 3 scatters much more than part 4 (link to
  `supernoovad.html#hajuvus`).
- Hubble's own data reached only 2 Mpc, and his distances were wrong by a
  factor of 7, but the line was there. The value of H₀ has been argued about
  ever since.

## Tab 3: Kaugemale (beyond the straight line)

Why part 4 multiplies cz by (1 + 0.775 z), and what happens farther away.
The scene has two plots.

- **Hubble'i diagramm**: the distance modulus μ against log z, from
  z = 0.001 to 2, for three model universes on the same H₀: an empty one
  (q₀ = 0), one with only matter (Ω_m = 1, q₀ = 0.5) and the chosen one (by
  default Ω_m = 0.315, q₀ = −0.53). About 200 simulated supernovae with a
  scatter of 0.13 mag are drawn from the chosen model.
- **Erinevus** (difference): μ − μ(empty universe) against z on a linear
  axis. Here the curves separate clearly beyond z ≈ 0.2: in the chosen
  model, supernovae at z = 0.5 are about 0.1 mag fainter than in the empty
  one and 0.4 mag fainter than with matter only. This is what Riess et al.
  (1998) and Perlmutter et al. (1999) found: the expansion is accelerating.

A segmented button picks the formula used to turn z into a distance:

- **v = cz** (the straight line);
- **cz (1 + 0.775 z)**, the correction of part 4, which is the first terms of
  the series D_L = (cz / H₀) [1 + (1 − q₀) z / 2 + …] with q₀ = −0.55;
- **täpne** (exact), the integral of the model.

A third plot, **H₀ viga** (the error in H₀), shows the H₀ that each formula
would give from supernovae at redshift z, compared with the true one, from
z = 0 to 0.5. At z = 0.04 the straight line gives H₀ about 3 % too small,
which is the "about 3 % low" of the README; the corrected formula is good to
0.1 % up to z = 0.06 and to 1 % up to z = 0.2 (for Ω_m = 0.3). The range of
part 4 (0.023–0.06) is shaded.

Controls: **Ω_m** (0–1) and buttons for the three models; the readout gives
q₀, the factor (1 − q₀) / 2 and the error in H₀ at z = 0.04 and at the
redshift under the cursor.

Mida joonis näitab:

- Light from a distant supernova travelled for a long time, and the
  Universe expanded meanwhile. The distance and the redshift are then no
  longer proportional, and how they differ depends on whether the expansion
  slows down or speeds up.
- For the supernovae of part 4 the difference is small, about 3 %. The
  factor (1 + 0.775 z) removes it, with the deceleration parameter
  q₀ = −0.55 that the more distant supernovae give.
- q₀ < 0 means that the expansion is speeding up. Dark energy, about 70 % of
  the content of the Universe, causes it. Saul Perlmutter, Brian Schmidt and
  Adam Riess received the 2011 Nobel Prize in Physics for finding it with
  type Ia supernovae.
- Part 4 stops at z = 0.06 so that H₀ hardly depends on the model: the
  correction is small and well known there.

## Tab 4: Hubble'i aeg (the age of the Universe)

What 1/H₀ means, and how it relates to the age of the Universe. The scene
has two plots.

- **Kahe galaktika kaugus** (the distance between two galaxies): the
  distance between the Milky Way and a galaxy now 100 Mpc away, against time
  in billions of years, run backwards from today. Three curves:
  - constant velocity (a straight line), which reaches zero exactly 1/H₀
    ago, the Hubble time;
  - only matter, which slowed the expansion, so the expansion was faster in
    the past and the age is (2/3) / H₀;
  - the chosen model, which first slowed and then sped up, and gives
    0.951 / H₀ for Ω_m = 0.315: 13.8 Gyr with H₀ = 67.4.

  The tangent at today is drawn on every curve; it is the same for all, and
  it meets the time axis at −1/H₀.
- **Vanus ja H₀** (age against H₀): the age of the chosen model as a
  function of H₀ from 50 to 100 km/s/Mpc, with the oldest stars as a
  horizontal band (globular clusters, about 12–13.5 Gyr) that the Universe
  must be older than. Markers show the values of part 3, part 4 and Planck
  (built in, the same as in tab 5), and Hubble's 1929 value, which gives
  about 2 Gyr, off the plot as an arrow, younger than the Earth.

Controls: **H₀** and **Ω_m** sliders; a slider **Aeg** with a play button
moves a marker along the curves. Readouts: 1/H₀ in Gyr, the age of the
model, its ratio to 1/H₀, and the age of the Universe when the light from
z = 0.04 and z = 1 left (the lookback time).

Mida joonis näitab:

- H₀ tells how fast distances grow today: at 70 km/s/Mpc, by 1 % in
  140 million years. If the rate had always been the same, all distances
  would have been zero 1/H₀ ago: 14 billion years for H₀ = 70.
- The expansion has not been constant. Gravity slowed it in the past and
  dark energy speeds it up now. The two nearly cancel, so the true age,
  13.8 billion years, is close to 1/H₀. That is a coincidence of our time.
- The age gives a check on H₀: the Universe must be older than its oldest
  stars. A larger H₀ means a younger Universe; Hubble's value gave an age of
  2 billion years, less than that of the Earth.
- Your result from part 3 or 4 gives the Hubble time in the H₀ tile; a link
  goes to `index.html#snHubble`.

## Tab 5: Hubble'i pinge (the Hubble tension)

Why the distance ladder and the cosmic microwave background give different
values of H₀, and how large an error in the ladder it would take to remove
the difference. The scene has two views, **Mõõtmised** (measurements) and
**Redeli vead** (errors of the ladder), switched by a segmented button.

### View 1: Mõõtmised

A plot of H₀ values with their errors, one per line, grouped:

- **Varane Universum** (the early Universe): Planck 2018 (67.4 ± 0.5),
  ACT, SPT and BAO with nucleosynthesis (DESI);
- **Kauguste redel** (the distance ladder): SH0ES (Riess et al. 2022,
  73.04 ± 1.04), the JWST check of SH0ES, CCHP with the tip of the red giant
  branch and JAGB stars (Freedman et al. 2025);
- **Muud** (other): gravitational lensing time delays (TDCOSMO), masers
  (MCP), gravitational waves (GW170817).

The exact values and references are checked against the papers when the
page is built; the list is kept short, one value per method.

Two vertical bands, Planck and SH0ES, run through the plot, and the
difference is given in km/s/Mpc, per cent and σ (about 5σ). Two editable
fields **Sinu 3. osa** and **Sinu 4. osa** add the user's own results as
points; empty by default. A footnote says that the published relation and
SH0ES M_B give about 67 and 72 in the exercise (from the real data of
`supernoovad.html`).

A schematic below the plot shows the two routes to H₀:

- the ladder: parallax → Cepheids → supernovae → H₀ today, direct and
  local;
- the early Universe: the sound waves in the plasma 380 000 years after the
  Big Bang, seen in the microwave background, → their size today in the
  model → H₀. This route needs the model (tab 3), and gives H₀ only if the
  model is right.

### View 2: Redeli vead

The ladder of the exercise as a chain of boxes, each with a slider for a
systematic error, and H₀ at the end compared with the two bands:

- **Gaia parallakside nullpunkt**, ±0.03 mas: shifts the cluster and field
  Cepheid distances of part 2 and so the zero-point of the Cepheid relation
  (the shift in magnitudes depends on the mean parallax of the calibrators,
  built in from part 2);
- **Tsefeiidide nullpunkt**, ±0.1 mag: for example metallicity or crowding
  in distant galaxies;
- **Supernoovade heledus**, ±0.1 mag: a difference between the calibrators
  and the distant supernovae, for example their host galaxies.

The shifts add up in magnitudes, and H₀ changes by the factor
10^(0.2 Δμ): 0.05 mag is 2.3 %. A readout says that removing the tension
needs 5 lg(73.0 / 67.4) = 0.17 mag, while the errors the SH0ES team
estimates add up to a few hundredths of a magnitude. The other way round,
the tension can also be removed by changing the model of the early Universe
(for example early dark energy); a short text says so, with no slider.

Mida joonis näitab:

- The distance ladder measures H₀ today, step by step, as in this exercise.
  The microwave background gives the H₀ that the standard model of cosmology
  predicts from the Universe 380 000 years old. They should agree, but they
  differ by 8 %.
- The errors of both are now about 1 %, so the difference is not chance. It
  is either an unknown systematic error in one of the methods, or a sign
  that the standard model is missing something.
- An error of 0.17 mag somewhere along the ladder would remove it. Many
  teams have looked for one. The JWST has measured the Cepheids again and
  found the same distances; other candles give values between the two.
- In the exercise you can compare your parts 3 and 4 with Planck yourself
  (link to `index.html#snHubble`).

## Data on the page

- The line wavelengths of tab 1 (air wavelengths, as is usual in optical
  spectra) and the redshifts of the example galaxies, from NED.
- Hubble's 24 galaxies with his distances and velocities, and their
  current distances from NED, with the references in a comment.
- The H₀ measurements of tab 5 with their references.
- The mean parallax of the part 2 calibrators and the summary values of
  parts 3 and 4 that tab 5 needs, with a comment that they come from
  `index.html` and `supernoovad.html`.

The page does not read the user's results from `index.html`. Tab 5 lets the
user type them in.

## Changes to other files

1. `index.html`:
   - in the **Uuri lähemalt** row, the Hubble'i seadus card title becomes a
     link to `hubble.html`, and the *tulekul* badge and the `soon` class are
     removed;
   - the words "Hubble'i seaduseni" in the main introduction point to the new
     page instead of Wikipedia;
   - the H₀ text of part 3 ("Lähedaste galaktikate pekuliaarsed kiirused … Hubble'i
     aeg on ligikaudne Universumi vanus.") ends with *Loe lähemalt →* to
     `hubble.html#vanus`; the text of part 4 about the Hubble tension ends
     with *Loe lähemalt →* to `hubble.html#pinge`; the note on
     v = cz (1 + 0.775 z) in part 4 links to `hubble.html#kaugemale`.
   - The ladder picture has no Hubble rung, so nothing changes there.
2. `parallaks.html`, `hajusparved.html`, `standardkuunlad.html`,
   `tsefeiidid.html` and `supernoovad.html`: the top rows get the
   Hubble'i seadus link.
3. `supernoovad.html`: in tab 4, "Hubble'i seaduse leht *tulekul*" becomes a
   link to `hubble.html#kaugemale`.
4. `tsefeiidid.html`: the sentence on Edwin Hubble finding Cepheids in
   Andromeda links to `hubble.html#paisumine`.
5. `README.md`: a paragraph on `hubble.html`, and the sentences about which
   pages exist.
6. `PLAN.md`: section 5 says that the page exists, with a pointer to this
   file, and the intro lists it among the existing pages.

## Order of building

1. The page frame, the tabs and the shared model, with a check of D_L, the
   age and q₀ against known values (13.8 Gyr for H₀ = 67.4, Ω_m = 0.315).
2. Tab 3, the item that part 4 uses directly.
3. Tab 5, first the measurements, then the ladder errors.
4. Tab 1, first the spectrum, then the stretching.
5. Tab 2, first the expanding Universe, then Hubble 1929.
6. Tab 4.
7. The links in `index.html` and the other pages, the README and the plan.
