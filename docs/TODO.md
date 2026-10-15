# To check after the English translation

All seven pages now have English next to the Estonian, built as in option 3
of [OPTIONS-languages.md](OPTIONS-languages.md): both languages in the
markup, `data-l="et"` and `data-l="en"` on the two versions, `L(et, en)` for
texts drawn by the scripts, and **Eesti | English** buttons at the top right.
This list collects what still needs a human look.

## 1. Language review

Everything in English was written by Claude and has not been read by a
fluent speaker. Read every page in English, including the readouts that
appear only after an action (the quizzes, wrong answers, error states).

The spelling is British throughout: colour, centre, grey, travelled,
kilometres, standardised, recognisable, neighbour. Check that this is wanted.

### Term choices to confirm

| Estonian | English used | Where |
|---|---|---|
| pekuliaarne kiirus | peculiar velocity | several pages |
| omaliikumine | proper motion | several pages |
| kauguste redel, pulk | distance ladder, rung | all pages |
| tähesuurus | magnitude | all pages |
| kaugusmoodul | distance modulus | several pages |
| perioodi-heleduse seos | period–luminosity relation | all pages |
| väljatäht, väljatsefeiid | field star, field Cepheid | open clusters page, part 2 |
| Näita tõde | Show the truth | open clusters page |
| võõrad (in the lasso readout) | others | open clusters page |
| Nihe / Süstemaatika | Bias / Systematics | open clusters page |
| luksmeeter, valgustatus, valgustugevus | lux meter, illuminance, luminous intensity | standard candles page |
| kalibreeritav, äratuntav | calibratable, recognisable | standard candles page |
| klapp (κ-mehhanismi sammud) | valve | Cepheids page |
| vari (periodogrammis) | alias | Cepheids page |
| vaatlusperiood | time span | Cepheids page |
| sobivus | fit | Cepheids page |
| Maapealne (vaatlused) | Ground | Cepheids page |
| nõrgenemise korrektsioon | fading correction | supernovae page |
| venitus | stretch | supernovae page, Hubble law page |
| Mõõda ise / Lõpeta | Measure / Finish | Hubble law page |
| taustkiirgus | microwave background, CMB in tight places | Hubble law page |
| Sobitusse | In the fit | part 3 |
| Kontrolli / Kustuta | Check / Delete | part 3 |

### Tab and view names

The English tab names are:

- **Parallax:** 3D view, Sky plane, Parallax angle, Puzzle.
- **Open clusters:** Cluster members, Colour–magnitude diagram, Averaging parallaxes.
- **Standard candles:** Inverse-square law, Magnitudes, Calibration, A good candle, Cepheids and supernovae.
- **Cepheids:** Pulsation, Measuring the period, Leavitt's law, Dust and Wesenheit.
- **Supernovae:** Explosion, Light curve, Standardisation, Small scatter.
- **Hubble law:** Redshift, Expansion, Accelerating expansion, Hubble time, Hubble tension.
- **Exercise:** Introduction, Query, Table, Plots, Distance; Cepheids in clusters, Field Cepheids, Period–luminosity; Galaxies, Distances, Hubble law; Supernovae, Hubble tension.

Links between pages name tabs by these English names (for example "Small
scatter" on the Hubble law page), so a renamed tab must be renamed in its
links too.

### Specific to each page

- **Exercise (`index.html`):**
  - Part names in the part links: Cluster distances, Cepheids, Hubble law, Supernovae; the contents cards use the page names (Hubble's law).
  - Tab navigation buttons: "← Contents", "Next: …", "Back to the contents"; "part 2" is lower-case inside them ("Next: part 2 →").
  - The contents section "Uuri lähemalt" → "Explore", "Harjutus andmetega" → "Exercise with data", "Seotud:" → "Related:".
  - Query form: "Päri Gaiast" → "Query Gaia", "Näita taevapilti" → "Show the sky image", "G piir" → "G limit", "Proovi:" → "Try:"; the data source "ESA Gaia arhiiv" is shown as "ESA Gaia archive".
  - Plot cards: "selgitus" → "explanation", "⤢ Suurenda" → "⤢ Enlarge", "Eemalda erindid" → "Remove outliers", "Taasta valik" → "Restore selection".
  - Distance tiles: parsecs, light years, astronomical units, kilometres.
  - The menu options "Minu seos (2. osa)" → "My relation (part 2)", "Minu M_B (3. osa galaktikatest)" → "My M_B (from the galaxies of part 3)"; the SH0ES option shows −19.253 with a point.
  - The status and error messages of the name lookup and the Gaia query (SIMBAD, Sesame, timeouts, cancelled query) are translated; read them by trying a wrong name and stopping a query.
  - The footer names the data services in English ("GAVO Data Center", "ARI Heidelberg Gaia data centre").
  - The ladder drawing on the home view has its labels as SVG tspans and its title and description swapped by the script.
- **Parallax:**
  - The views of the 3D tab are Oblique, From behind the Sun, From the side and From the ecliptic pole.
  - "Rada joonena" → "Path as a line", "Gaia vaatlused (14 aastas)" → "Gaia observations (14 a year)".
  - "Kaugus (Maa orbiidi raadiustes)" → "Distance (in radii of the Earth's orbit)".
  - "Suund (põhjast itta)" → "Direction (from north to east)".
- **Hubble law:**
  - Example buttons: Andromeeda → Andromeda, Neitsi parv → Virgo Cluster.
  - The spectral line "G-riba" → "G band".
  - "Kohalik liikumine" → "Local motion", "Redeli vead" → "Ladder errors".
  - In the Local motion bars, "taustkiirguse suhtes" → "relative to the CMB".
  - The ladder-error formula is written "5 log" in English instead of "5 lg".
  - The routes diagram (Two roads to H₀) says "CMB" in a box where the Estonian has "Taustkiirgus".
- **Open clusters:**
  - The sky compass letters `P`/`I` → `N`/`E`.
  - "Taevas ja omaliikumised" → "Sky and proper motions", "Jäljed" → "Tracks", "Kaksiktähed" → "Binaries", "Iga täht oma kaugusega" → "Each star at its own distance".
  - The systematic errors: "Gaia zero point", "Zero-point correction", "Correlated errors".
  - The link to part 1's Kaugus tab is named "Distance" in English.
- **Standard candles:**
  - The light sources, landmarks (Moon, Galactic Centre, Andromeda, Virgo Cluster), reference magnitudes (Sun, full Moon, Venus, Sirius, Pluto) and candle types have English fields in the data, read with `tr()`.
  - The Estonian readouts use a genitive form (`gen`: "lambi", "tsefeiidi"); English uses `lowEn` ("lamp", "Cepheid", "supernova").
  - The limit labels: "eye", "large telescope", "Hubble"; the visibility readout says "Seen only with the Hubble Space Telescope".
  - The checklist marks have the screen-reader labels "yes", "no", "partly".
  - The thousands separator is a no-break space in Estonian and a comma in English.
- **Cepheids:**
  - The valve steps: Compressed, Expanding, Expanded, Falling.
  - The observation modes: Ground, Gaia, Hubble; the steps of Leavitt's law: Discovery, Calibration, Distant galaxy.
  - The HR diagram ticks: 20 000 → 20,000.
  - The bands table headings: "band", "shift", "scatter σ", "distance error".
- **Supernovae:**
  - The stages: Gains mass, Shrinks, Ignites, Explodes; for two white dwarfs: Two dwarfs, Spiral, Merge, Explodes.
  - The spectrum descriptions: "thermonuclear explosion of a white dwarf", "core collapse of a massive star, without hydrogen" and so on.
  - The corrections table: "no correction", "by fading", "by colour", "by both".
  - English puts no separator in the wavelength ticks (4000 Å); Estonian keeps "4 000".

### Units and symbols

- Years: `a` → `yr`, `mas/a` → `mas/yr`, `mld a` → `Gyr`, `mln a` → `Myr`.
- Days: `p` and `ööp` → `d`.
- `aü` → `au`.

## 2. Decisions to make

- **Default language.** A first visit is in Estonian; the browser's language
  is not looked at. After that the last choice is remembered (localStorage
  key `lang`, shared by all pages), and `?lang=en` or `?lang=et` in the
  address overrides it.
- **One address per page.** The English and Estonian versions share a URL;
  search engines see the Estonian title and description (the English ones
  are set by the script). The hashes stay Estonian (`#paisumine`, `#osa-1`).
- **Number format.** On the exercise page (`index.html`) Estonian uses a
  decimal comma and English a point. The other pages used a decimal point in
  Estonian before the translation and still do; only their thousands
  separator changes (space in Estonian, comma in English). Decide whether the
  other pages should also use the decimal comma in Estonian.
- **Links to the other pages** go to the same file, which opens in the
  remembered language. External links in English go to English Wikipedia.
- **The "Ingliskeelne Vikipeedia" tooltips** on links without an Estonian
  article are kept in the Estonian text only.

## 3. Layout

Check these on a wide screen and on a phone:

- The exercise page: the language buttons sit over the top right corner of
  the home view and of each part's link row. On a narrow screen they may
  overlap the title or the part links.
- The exercise page, Distance tab: the kilometre tile wraps a digit onto a
  second line in English ("26,260,000,000,000,00 / 0"), because the commas
  make the number wider than in Estonian.
- The standard candles page: "Type Ia supernova" in the light source switch
  is tight, and "Cepheids without the period" ends at the right edge of the
  reach plot.
- The Hubble law page: the comb labels of the redshift quiz overlap at
  z = 0, as in Estonian.
- Longer English labels in SVG drawings and buttons in general, especially
  on phones.

## 4. Behaviour

- **Status and error messages** on the exercise page (name lookup, Gaia
  query) appear in the language of the moment and are not translated when the
  language is switched while they are shown.
- **Messages from the data services** (TAP errors, SIMBAD) come as the
  services send them, usually in English.
- **The CSV download** is named `…_gaia_valik.csv` in Estonian and
  `…_gaia_selection.csv` in English.
- **Changes beyond translation:**
  - On the exercise page, the "In use" line next to the Hubble plot is now
    set as HTML. Before, it showed "Cruz Reyes &amp;amp; Anderson" with a
    literal `&amp;`.
  - In English, negative numbers there use the minus sign (−), as Estonian
    already did.
- **Untested interactions** after a language switch in the middle of things:
  a running animation, an open lasso, an enlarged plot, an open explanation,
  a running Gaia query.
- **Untested browsers:** testing was in headless Chrome only, not in Safari,
  Firefox or on a phone.

## 5. Found while translating

- An Estonian typo, left unchanged: "parenduse" in the last item of the
  Väike hajuvus list on the supernovae page (probably "paranduse").

## 6. Documentation and maintenance

- The README still says that the user interface is in Estonian, and it does
  not describe the language switch.
- [OPTIONS-languages.md](OPTIONS-languages.md) still reads as a proposal;
  mark option 3 as chosen and done.
- Every new text now needs both languages:
  - **Markup:** a pair of elements or spans with `data-l="et"` and
    `data-l="en"`.
  - **Attributes:** a `data-en-…` copy (`aria-label`, `title`,
    `placeholder`, `content`, and `text` for options and SVG titles on the
    exercise page).
  - **Scripts:** `L(et, en)`, or an `…En` field in a data table, read with
    `tr()` on the standard candles page.

  It is easy to forget one language. A small check could list Estonian
  letters (õ ä ö ü) in script strings outside `L()`.
- **Local variables named `L`** shadow the helper. One such variable broke the
  Local motion view of the Hubble law page until it was renamed, and two on
  the standard candles page were renamed before they could. Avoid `L` as a
  variable name in functions that draw text.

## 7. What was checked

- Every page loads in both languages without console errors.
- Every tab and view was rendered in English (headless Chrome screenshots)
  and read for leftover Estonian.
- Switching from Estonian to English with the button was tested once on
  every page.
- On the exercise page:
  - A real Gaia query (M67) with a simulated lasso selection, through the
    Plots and Distance tabs, in both languages.
  - Parts 2–4 with made-up saved cluster distances.
- On every page, the Estonian text in the markup was compared with the
  previous version: none is lost, only split into spans in a few places.
