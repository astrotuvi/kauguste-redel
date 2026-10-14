# Options for an English version

This note describes how the app could be offered in Estonian and English in
parallel. Nothing here is implemented yet.

## Where the Estonian text is

The app is seven self-contained HTML pages (`index.html` and six background
pages), about 11,000 lines in all, with no build step. The Estonian text is
in three places:

- **HTML prose**: headings, explanations, labels and buttons.
- **Strings in the scripts**: button labels, hints and results that the code
  writes into the page, e.g. `q ? 'Lõpeta' : 'Mõõda ise'` in `hubble.html`,
  and long template strings with numbers filled in. Plotly axis titles,
  legends and hover texts are also strings in the scripts.
- **Number formatting**: `toLocaleString("et-EE")` is hard-coded (e.g. `fmt`
  in `index.html`), so numbers always get a decimal comma.

Any option must handle all three.

## Options

### 1. Separate copies per language

Copy the pages to `en/index.html`, `en/hubble.html` and so on, and translate
the copies.

- Each language has its own URL, which is good for search engines and for
  sharing links.
- Each file stays as readable as now, and the app still needs no build step.
- All code is duplicated. Every bug fix, new tab or plot change must be made
  twice, and the copies will drift apart. This only works for a finished
  site, and the app is still changing.
- Moving the shared code into common `.js` files reduces the duplication, but
  the strings inside that code still need another solution.

### 2. One page with translation tables

The classic approach: elements get keys (`data-i18n="key"`), the scripts call
`t('key')`, and each language has a dictionary. The language is chosen with
`?lang=en` or a remembered toggle.

- One copy of the code, and more languages are easy to add.
- This suits short interface labels, not paragraphs of explanation with
  `<b>`, `<sub>` and links inside them. The Estonian prose would move out of
  the HTML into key–value files, and the source would no longer read like the
  page. Much of the app is prose, so this costs more than it gives.

### 3. One page with both languages side by side

Write each translation next to its original, and hide the other language with
CSS:

```html
<p><span data-l="et">Valgus lahkus, kui …</span><span data-l="en">The light left when …</span></p>
```

```css
:root[lang="et"] [data-l="en"], :root[lang="en"] [data-l="et"] { display: none; }
```

In the scripts, a small helper picks the string: `L('Lõpeta', 'Finish')`.
The locale becomes a variable, so `fmt` uses `LOCALE` instead of `"et-EE"`,
which also switches between decimal comma and point. A language toggle sets
`document.documentElement.lang`, remembers the choice, and redraws the plots
and any text the scripts have written.

- No build step and one copy of the code.
- A translation sits beside its original, so an outdated one is easy to
  notice when editing.
- Pages can be translated one at a time.
- The source files become roughly twice as long, and both languages are
  downloaded. The text is small next to Plotly, so the download does not
  matter.
- A page has one URL for both languages. English is reached with `?lang=en`,
  which search engines index less well.
- The attribute must not be `lang`: the number inputs in `index.html` already
  have `lang="en"`, and a rule based on `lang` would hide them.

### 4. Generate both languages with a build step

Keep one source with language markers, as in option 3, and let a small script
write static pages to `et/` and `en/`.

- Separate URLs and no switching at run time, from a single source.
- Adds a build step and generated files, while the app now needs nothing to
  be built.
- Can be added later on top of option 3 if separate URLs become important,
  since the markers would already be in place.

### Not considered: machine translation in the browser

A widget such as Google Translate translates terms like *pekuliaarne kiirus*
badly and breaks formulas and numbers.

## Recommendation

Option 3. It keeps the app a set of plain HTML files with one copy of the
code, and it suits the prose-heavy pages. A good first step is to convert one
small page, such as `parallaks.html`, together with the language toggle, and
see how the source reads before converting the rest.
