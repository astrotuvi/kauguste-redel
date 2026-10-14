# Option: an LMC check in part 2

This note describes how the Large Magellanic Cloud (LMC) could be added to the
exercise as a second route to the period–luminosity (PL) relation. Nothing
here is implemented yet.

## Why the LMC

- Part 2 gets its zero point from Milky Way Cepheids with Gaia distances. The
  clusters have few long-period Cepheids, so field Cepheids are added to fix
  the slope.
- The LMC has thousands of Cepheids over the whole period range, all at
  nearly the same distance. Its slope is much better determined.
- Its distance comes from detached eclipsing binaries (Pietrzyński et al.
  2019: distance modulus 18.477, 49.59 kpc, 1 % in distance), a purely
  geometric method that does not use Cepheids. It is a second, independent
  anchor beside Gaia.
- The real ladder (SH0ES) fits the Milky Way, the LMC and NGC 4258 together,
  so the exercise would look more like the research.
- The Cepheids page already compares the SMC fit with the eclipsing-binary
  distance 18.98 (Graczyk et al. 2020), so the idea is partly there.

The anchors were left out of the exercise on purpose (see the README). This
option is a way to bring one of them back in small form.

## The option: "Check with the LMC"

A short, optional step after the PL relation of part 2.

1. Give the students the LMC distance modulus. They do not measure it: it is
   one number from a paper, explained on the Cepheids page.
2. Plot LMC Cepheids in W_H against log P, shifted by the modulus, on the
   same plot as the Milky Way relation.
3. Ask whether they fall on the line, and what an offset would mean.

It is cheap, it can be skipped without losing anything later, and part 3
uses whichever calibration the students end up with.

### What students would see

- The LMC points define the slope far better than the field Cepheids.
- If the LMC points sit slightly off the Milky Way line, the offset is a
  systematic error to discuss: the Gaia zero-point, the LMC distance, or
  metallicity.
- The LMC is more metal-poor than the Milky Way by about 0.4 dex. With a
  metallicity term of about −0.17 mag/dex in W_H, that is roughly 0.07 mag.
  Students can first see the offset and meet the metallicity term afterwards.

## What is needed

- **Data.** LMC Cepheids with periods and a Wesenheit magnitude W_H. The
  OGLE survey gives the periods and photometry. W_H must be on the same scale
  as the Milky Way values in the app, which are on the Cruz Reyes & Anderson
  (2023) scale (Riess et al. (2021) values are shifted by −0.046 mag). A
  sample from one of those papers avoids a zero-point mismatch between the
  two sets. A few hundred stars are enough, and it keeps the plot light.
- **Explanation.** A short text on the Cepheids page: the radius of a binary
  star from its eclipse light curve and radial velocities, the angular size
  from its surface brightness, and distance = radius / angle. It is the same
  geometry as parallax, which links it back to part 1. A diagram of a star
  with its radius, angular size and the distance triangle would help.
- **Page text.** Estonian and English, as on the other pages.

## Costs

- The distance is given, not measured, so the step is less hands-on than the
  rest of part 2.
- The exercise is already long, so the step should stay optional.
- Metallicity needs care. If the offset is ignored, students may think
  something is wrong; if the term is introduced, there is one more concept to
  explain.
- Depth and tilt of the LMC and the reddening of each star are small
  effects, but they are not zero, so the result should be described as a
  check and not as a calibration.

## Variants

- **Explanation only.** Add the eclipsing-binary text to the SMC step on the
  Cepheids page (it already quotes 18.98) and leave the exercise unchanged.
  This is the smallest change.
- **A full anchor.** Let students fit the Milky Way and LMC together and
  compare the zero points. This follows SH0ES most closely, but it needs the
  metallicity term and a longer part 2.

## Numbers to check

The values above are from memory. They should be checked against the papers
before they go into the pages.
