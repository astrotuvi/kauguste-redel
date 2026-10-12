# Design: Hajusparved page

The design of a new background page about open clusters, `hajusparved.html`.
It covers the three items that section 1 of `PLAN.md` lists as still to add
to the parallax page. They are on a page of their own instead, because
`parallaks.html` works as a whole: it is about one star, and these items are
about a cluster of stars.

1. Finding cluster members by proper motion: the lasso step.
2. The colour–magnitude diagram: the check after the lasso.
3. Averaging parallaxes: the **Kaugus** tab.

Related part of the exercise: 1.

The page is self-contained and built like `standardkuunlad.html`, with
inline SVG and no external dependencies. The layout is the same:

- a scene on the left with tabs above it, one tab for each item of the list;
- a control panel on the right, whose groups change with the tab
  (`data-tabs`);
- a **Mida joonis näitab** text below that explains the current tab
  (`data-tab`).

The selected tab is kept in the address (`#liikmed`, `#varvus-heledus`,
`#keskmine`), so that `index.html` and the other pages can link to a tab.

The top row is "← Kosmiliste kauguste redel · Parallaks · Hajusparved ·
Standardküünlad". The heading is **Hajusparvede kaugused**.

The intro: a parallax measures the distance of one star, but beyond a few
hundred parsecs the error of a single star is large. In a cluster, hundreds
of stars are at about the same distance, so their parallaxes can be
averaged. First, though, the cluster's stars have to be told apart from the
field stars in front of and behind it. The intro links to `parallaks.html`
for the parallax itself.

## The simulated cluster

All three tabs share one simulated star field, as the tabs of the standard
candles page share the light source. It is made from physical quantities, so
that the proper motions, the colour–magnitude diagram and the parallaxes all
follow from the same stars:

- **Cluster:** about 150 members at a distance d_c, in a small sphere (a few
  pc). They share one space velocity, with an internal spread of about
  1 km/s. Their absolute magnitudes and colours lie along the main sequence
  (table below). About a third are unresolved binaries, up to 0.75 mag
  brighter than the main sequence.
- **Field:** about 600 stars in the same cone of sky, between 50 pc and
  10 kpc, with density growing as d² and cut by a limiting magnitude
  G ≈ 20. A random main-sequence star, or one in ten a red giant. Velocities
  are the Sun's reflex motion plus a Gaussian scatter of about 30 km/s.
- **Proper motion** from the transverse velocity:
  μ [mas/a] = v_t [km/s] / (4.74 · d [kpc]). The cluster's velocity is
  about 25 km/s away from the field mean, in a random direction set by
  **Uus parv**.
- **Gaia-like errors** that grow with G: σ_p ≈ σ_μ ≈ 0.02 mas at G ≤ 15,
  0.07 at G = 17, 0.5 at G = 20 (DR3 values, interpolated in log σ).
- **Parallax** p = 1000/d mas, plus a Gaussian error with that σ, plus the
  zero-point and correlated errors of tab 3 when they are on.

Main sequence, Gaia bands (approximate, to be taken from the
Pecaut & Mamajek table when building):

| Type | BP−RP | M_G |
|---|---|---|
| A0 V | 0.0 | 1.4 |
| F5 V | 0.6 | 3.4 |
| G2 V (Sun) | 0.82 | 4.7 |
| K5 V | 1.4 | 7.0 |
| M0 V | 1.85 | 8.2 |
| M3 V | 2.6 | 10.3 |

Controls at the top of the panel, shared by all tabs:

- **Parve kaugus**, a log slider from 100 pc to 5 kpc, the range of the
  parallax rung in the ladder picture of `index.html`;
- **Nõrgad tähed**, the faint limit, a slider for G from 15 to 21;
- **Uus parv**, which draws a new velocity and a new set of stars.

The random-number code is seeded, so a cluster stays the same when moving
between tabs.

## Tab 1: Parve liikmed (cluster members)

The idea behind the lasso step. The scene has two panels side by side.

- **Taevas** (the sky): a field about 30′ across with all the stars, their
  size set by G as on star charts. Under the **Aeg** slider (0–100 000 a)
  and its play button, the stars drift with their proper motions. The time
  scale is real: at 6 mas/a a star moves 10′ in 100 000 years, so no
  exaggeration is needed. The parallax ellipses are far too small to see at
  this scale, and the hint says so, with a link to `parallaks.html`. With
  **Jäljed** (tracks) on, each star leaves a line. The cluster's lines are
  parallel and of equal length, while the field's point in every direction.
- **Omaliikumised** (the proper-motion diagram): μ_α* against μ_δ, with the
  same axes and orientation as in part 1. The cluster is a dense clump and the
  field a broad cloud. Hovering over a star highlights it in both panels.

**Lasso.** Dragging in the proper-motion diagram draws a lasso, as in part 1.
The stars inside it are highlighted in the sky. Each lasso replaces the
previous one, and **Tühjenda** clears it. Because the simulation knows which
stars are members, the panel shows two readouts:

- **leitud liikmeid** (members found): members inside the lasso, out of all
  members (completeness);
- **võõraid** (contaminants): field stars inside the lasso (contamination).

**Näita tõde** (show the truth) colours the true members, so the user can
see what a tight lasso misses and what a loose one takes in.

The shared sliders matter here:

- **Nõrgad tähed:** faint stars have large errors, so the clump blurs and
  spreads into the field. This is why part 1 is easier with only the
  brighter stars.
- **Parve kaugus:** a distant cluster has a smaller proper motion, which lies
  closer to the field's crowded centre, and fainter stars with larger errors.
  Around 3–5 kpc the clump is hard to separate from the field, and that is
  one reason the parallax rung ends there.

Mida joonis näitab:

- The stars of a cluster formed together and move through space together.
  Seen from the Sun, they share one proper motion, so they form a clump in
  the proper-motion diagram, even when they are spread over the sky among
  field stars.
- Field stars are at all distances and move in all directions, so their
  proper motions are spread out.
- μ = v_t / (4.74 d): the same velocity gives a smaller proper motion
  further away. Distant clusters are harder to separate.
- In part 1 the lasso does the same thing, with real Gaia data. Link:
  `index.html#plots`.

## Tab 2: Värvus-heledusdiagramm (the colour–magnitude diagram)

The check after the lasso. The scene is a colour–magnitude diagram, BP−RP
against G, with the bright end up. It uses the same stars as tab 1.

**Valik** (selection), a segmented button:

- **Kõik tähed**: the cluster's narrow main sequence lies inside a broad
  smear of field stars.
- **Lasso valik**: the stars selected in tab 1. Field stars that the lasso
  took in usually lie off the sequence and are drawn as rings. This is the
  check in part 1.
- **Tõelised liikmed** (true members).

Toggles:

- **Absoluutne M_G**, as in part 1: G − μ, where μ is the cluster's distance
  modulus from its mean parallax (tab 3). The cluster falls onto the
  reference main sequence, drawn as a thin line. The field stars are given
  the cluster's distance by mistake, so they stay smeared.
- **Iga täht oma kaugusega** (each star at its own distance): uses each
  star's true distance instead. The field stars also fall onto the main
  sequence, and the giants form a branch above it. This shows that the
  field's smear comes from the distances, not from different kinds of stars.
- **Kaksiktähed** (binaries): with it off, the binaries are drawn as single
  stars. With it on, a second, fainter band appears up to 0.75 mag above the
  sequence, as in real clusters.
- **Tolm** (dust), a slider for E(BP−RP) from 0 to 1 mag. It moves the
  cluster down and to the right along the reddening arrow, A_G ≈ 2 E(BP−RP).
  The absolute diagram of part 1 does not correct for extinction, so its
  sequence lies below the reference line. Links to the **Tsefeiidid** page
  for dust and W_H, or a *tulekul* note until that page exists.

Mida joonis näitab:

- The main sequence: stars that burn hydrogen in their cores. Hotter ones
  (blue, left) are more luminous than cooler ones (red, right).
- In a cluster all stars are at the same distance and have the same age and
  composition, so they form a narrow sequence. Field stars are at different
  distances, so in apparent magnitude each is shifted by its own distance
  modulus.
- The absolute magnitude M_G = G − 5 log₁₀ d + 5 removes the distance.
  A cluster whose sequence matches the reference line after this has a
  plausible distance. This is the same idea as the standard candles page
  (link to `standardkuunlad.html#tahesuurused`).
- In part 1 the diagram is a check of the lasso. Stars far from the
  sequence are probably not members. Link: `index.html#plots`.

## Tab 3: Parallakside keskmine (averaging parallaxes)

The steps of the **Kaugus** tab of part 1. The scene has two views,
**Nihe** (bias) and **Süstemaatika** (systematics), switched by a segmented
button above it.

### View 1: Nihe, why 1/⟨p⟩ and not ⟨1/p⟩

Two stacked histograms of the cluster's members:

- above, the measured parallaxes p_i, with the true parallax and the
  weighted mean ⟨p⟩ marked. The histogram is symmetric around the true
  value. Some faint stars have negative parallaxes;
- below, the distances 1/p_i, with the true distance marked. The histogram
  is skewed with a long tail, and negative parallaxes have no distance at
  all. They are counted in a note under it.

The readouts in the panel are a small table: the true distance, 1000/⟨p⟩,
the mean of 1000/p_i, and the median of 1000/p_i, each with its difference
from the truth in %.

Controls:

- **Tähtede arv N** (5–150);
- **Kaalutud**: weights 1/σ_i², as in part 1. Without weights, the faint
  stars spoil even ⟨p⟩;
- **Korda 200 korda** (repeat 200 times): draws 200 new samples of the
  cluster and shows the 200 results of both methods as two strips of dots
  around the true distance. The 1/⟨p⟩ strip is centred on the truth, and the
  ⟨1/p⟩ strip is shifted to larger distances. This shows that the problem
  is a bias, not bad luck.

A short worked example under the plot: a cluster at 2 kpc (p = 0.5 mas),
stars with σ_p = 0.25 mas. For each star 1/p has a bias of about
(σ/p)² = 25 % and can even be negative. ⟨p⟩ of 100 such stars has an error
of 0.025 mas, 5 %, and 1/⟨p⟩ has almost no bias.

### View 2: Süstemaatika, zero-point and correlated errors

A log–log plot of the error of the cluster's mean parallax against N:

- the statistical error 1/√Σw_i, which falls as 1/√N;
- the floor of 0.010 mas from the correlated errors (the `SYS` constant of
  part 1);
- the total, √(stat² + sys²), with a point for the current N.

Below is a second axis, the error converted into a distance error in % for
the current cluster distance. At 500 pc the floor is 0.5 %, at 2 kpc 2 %
and at 5 kpc 5 %.

Toggles:

- **Nullpunkt** (zero-point): gives all measured parallaxes the Gaia DR3
  offset of −0.017 mas (Lindegren et al. 2021). Without the correction, a
  cluster at 2 kpc comes out 3.5 % too far, and one at 500 pc 0.9 %.
- **Nullpunkti parandus** (+0.017 mas), which part 1 always applies.
- **Korreleeritud vead**: gives all stars of the cluster one common
  random error of about 0.010 mas, as for stars close together on the sky.
  **Korda 200 korda** then shows that the spread of the results no longer
  shrinks with N.

Mida joonis näitab:

- 1/p is a curved function. Averaging it does not give 1/⟨p⟩: it gives
  more, by about (σ/p)² for each star. Errors in p are symmetric, errors in
  1/p are not. That is why part 1 averages the parallaxes first and only
  then inverts the mean, as the note in its **Kaugus** tab says.
- Weights 1/σ² let the bright, precise stars count the most.
- The statistical error falls with more stars, but Gaia's errors are partly
  common to stars close together on the sky. Averaging does not remove them,
  so part 1 adds 0.010 mas in quadrature. For the same reason a parallax
  zero-point that is off by a little shifts all distances together. This is
  the systematic error that passes up the ladder (link to
  `standardkuunlad.html#kalibreerimine`).

## Changes to other files

1. `index.html`:
   - a new **Hajusparved** card in the **Uuri lähemalt** row, between
     Parallaks and Standardküünlad, with an icon of a clump of dots with
     parallel arrows and "Seotud: 1. osa";
   - the **selgitus** texts of **Omaliikumised**, **Värvus-heledusdiagramm**
     and **Valitud tähtede parallaksid** in part 1 end with a link,
     *Loe lähemalt →*, to `hajusparved.html#liikmed`, `#varvus-heledus`
     and `#keskmine`;
   - the note "Keskmista kõigepealt parallaksid…" in the **Kaugus** tab
     links to `hajusparved.html#keskmine`;
   - the word "hajusparvede" in the main introduction points to the new page
     instead of Wikipedia.
   - The ladder picture stays as it is: the parallax rung already links to
     `parallaks.html`.
2. `parallaks.html`: the top row gets the Hajusparved link. The last bullet
   of **Mida joonis näitab**, about Gaia, ends with a sentence that leads on:
   how parallaxes of many stars in a cluster give its distance, with a link.
   Nothing else changes.
3. `standardkuunlad.html`: the top row gets the Hajusparved link. In tab 3,
   the Cepheid calibration step ("the parallax of its cluster") links to
   `hajusparved.html#keskmine`.
4. `README.md`: a paragraph on `hajusparved.html`.
5. `PLAN.md`: the card list gets **Hajusparved** as item 2. Section 1 says
   that `parallaks.html` is complete and that its three items moved to the
   new page, with a pointer to this file.

## Order of building

1. The page frame, the tabs, the shared controls and the simulated cluster.
2. Tab 1 with the lasso, since tabs 2 and 3 use its selection.
3. Tab 2.
4. Tab 3, first the bias view, then the systematics view.
5. The card and links in `index.html`, the top rows and links of the other
   two pages, the README and the plan.
