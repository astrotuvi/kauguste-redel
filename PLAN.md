# Plan: Uuri lähemalt pages

The table of contents of `index.html` has a row of **Uuri lähemalt** cards
that lead to background pages. Each page gives the wider picture behind a
rung of the distance ladder or behind the result of the exercise. So far the
parallax page (`parallaks.html`), the open clusters page (`hajusparved.html`)
and the standard candles page (`standardkuunlad.html`) exist; the other cards
are marked *tulekul* (coming).

The cards, in reading order:

1. Parallaks
2. Hajusparved
3. Standardküünlad
4. Tsefeiidid
5. Ia supernoovad
6. Hubble'i seadus

## 1. Parallaks (exists, `parallaks.html`)

Covers the geometry of parallax in 3D and on the sky, the parallax angle,
proper motion, Gaia observations and a puzzle. The page is complete: it is
about one star. The cluster items that part 1 relies on are on a page of
their own, `hajusparved.html`.

Related part: 1.

## 1b. Hajusparved (exists, `hajusparved.html`)

- **Finding cluster members by proper motion**, the idea behind the lasso
  step.
- **The colour–magnitude diagram**, the check after the lasso.
- **Averaging parallaxes**: why 1/⟨p⟩ is used rather than ⟨1/p⟩, and Gaia's
  zero-point and correlated systematic errors.

The design of the page is in `DESIGN-hajusparved.md`.

Related part: 1.

## 2. Standardküünlad (exists, `standardkuunlad.html`)

1. **The inverse-square law.** A light source of known luminosity looks
   fainter with distance, so its brightness gives the distance.
2. **Magnitudes.** Apparent magnitude m, absolute magnitude M, the distance
   modulus μ = m − M, and d = 10^(μ/5+1) pc. Parts 2–4 use these formulas.
3. **Calibration, the core idea of the ladder.** Measure a candle's
   luminosity for nearby examples whose distance comes from the previous
   rung, then use it further out.
4. **What makes a good candle.** Bright, recognisable, with a luminosity that
   is the same every time or predictable from something measurable, and
   small scatter.
5. **The two candles in the exercise.** Cepheids (luminosity from the period)
   and type Ia supernovae (luminosity from how fast they fade), each linking
   to its own page.

Interactive idea: a lamp that slides away from the viewer while its
brightness and magnitude update. A second step calibrates it at a known
distance and then measures an unknown one.

Related parts: 2, 3 and 4.

The design of the page, with its tabs and interactive plots, is in
`DESIGN-standardkuunlad.md`.

## 3. Tsefeiidid (new)

- Why Cepheids pulsate (the κ mechanism), light curves, and how the period is
  measured.
- Henrietta Leavitt and the discovery of the period–luminosity relation.
- **Interstellar dust and the Wesenheit magnitude.** Why W_H does not depend
  on dust. Part 2 uses only W_H, and nothing in the exercise explains it yet.

Interactive idea: a slider that adds dust, making the star fainter and redder
while W_H stays the same.

Related parts: 2 and 3.

## 4. Ia supernoovad (new)

- Why a white dwarf explodes near the Chandrasekhar mass, and why that makes
  the peak brightness nearly the same every time.
- **Standardisation.** Brighter supernovae fade more slowly (the Phillips
  relation). This is why part 4 uses corrected peak magnitudes (m_b_corr).
- Why the scatter is much smaller than for the nearby galaxies of part 3.

Related part: 4.

## 5. Hubble'i seadus (new)

- Redshift and recession velocity.
- Why nearby galaxies scatter (peculiar velocities of a few hundred km/s) and
  distant ones do not.
- The expansion correction (1 + 0.775 z) used in part 4.
- The Hubble time as an approximate age of the Universe.
- **The Hubble tension.** The distance ladder against Planck, which part 4
  compares.

Related parts: 3 and 4.

## Optional: fits and errors

Every part uses the weighted mean and its error, least-squares lines (also
through the origin), statistical against systematic error added in
quadrature, and χ² as a measure of scatter. Short **selgitus** texts inside
the parts could cover these better than a separate page.

## Suggested order of work

1. **Standardküünlad.** The formulas in parts 2–4 depend on it.
2. **Tsefeiidid**, with dust and W_H. Parts 2 and 3.
3. **Hubble'i seadus.** Parts 3 and 4.
4. **Ia supernoovad.** Part 4.
5. **Hajusparved.** Done. Part 1.

## When a page is ready

1. In the **Uuri lähemalt** row of `index.html`, turn the card title into a
   link, and remove the *tulekul* badge and the `soon` class.
2. Link its rung in the ladder picture, as the parallax rung already is
   (`rung-link`). For Standardküünlad, the bracket and its label can become
   the link.
3. For Standardküünlad, point the "standardküünlad" word in the main
   introduction to the new page instead of Wikipedia.
4. Give the page the same top row as `parallaks.html`
   ("← Kosmiliste kauguste redel"), plus links to the other pages once they
   exist.
5. Mention the page in the README.
