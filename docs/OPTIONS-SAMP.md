# SAMP integration options

This note describes how the app could talk to the desktop VO tools TOPCAT and
Aladin with SAMP (Simple Application Messaging Protocol). Nothing here is
implemented yet.

## How a web page can use SAMP

SAMP has a **Web Profile** for browser applications. TOPCAT and Aladin Desktop
each start a SAMP hub, which listens on `http://localhost:21012`, and a web
page can register with that hub. The JavaScript library `samp.js`, from Mark
Taylor (the author of TOPCAT), implements the Web Profile. It can be loaded
from a CDN or inlined in `index.html`, so the app still needs no build step.

A web client can also receive messages: the library polls the hub for them.
Communication can therefore go both ways.

## Useful messages

| Message | Direction | Use in the app |
|---|---|---|
| `coord.pointAt.sky` | app → Aladin | Centre Aladin on the cluster |
| `table.load.votable` | app → TOPCAT, Aladin | Load the queried *Gaia* stars |
| `table.select.rowList` | both ways | Share the selected cluster members |
| `table.highlight.row` | both ways | Highlight a star clicked in either program |

## The main obstacle: SAMP sends URLs, not data

`table.load.votable` gives the receiving program a URL, and the program
downloads the table from it. The query results exist only in the page's
JavaScript memory. TOPCAT and Aladin cannot open a `blob:` URL from the
browser.

A browser page also cannot write a file to disk and send a link to it. A
download goes to a location the page cannot see. The page could guess
`~/Downloads/<name>.vot`, but it does not know the home folder, the browser
may ask where to save, and a duplicate name is changed to
`<name> (1).vot`. The File System Access API (`showSaveFilePicker`, Chrome
and Edge only) gives the page a handle to the file, not its path. Files in
the browser's private storage (OPFS) cannot be reached by other programs.
A page also cannot act as a web server: a service worker answers only the
page's own requests, not requests from TOPCAT.

## Options for getting a table to TOPCAT and Aladin

### 1. Send the TAP query URL

Build a synchronous TAP GET URL with the same ADQL as the app's own query
(`REQUEST=doQuery&LANG=ADQL&FORMAT=votable&QUERY=…`) and send that.
TOPCAT and Aladin run the query against the *Gaia* service themselves. They
are not subject to CORS, so the URL can point straight at VizieR, the ESA
archive or GAVO without the Cloudflare Worker.

The member selection is then sent as row indices with `table.select.rowList`.
The indices match only if both sides get the rows in the same order, so the
ADQL needs `ORDER BY source_id` and the app must sort its own rows the same
way.

Limits:

- Large fields are queried as async jobs. A finished job's result URL could
  be sent instead, but the services delete those results after a while.
- It works only for tables that come from a TAP query, not for tables the
  app builds itself (the period–luminosity data, the supernova data).

### 2. Upload the table to the Cloudflare Worker

The Worker (`proxy/worker.js`) could store an uploaded VOTable for a short
time, e.g. one hour, in Workers KV or R2 and return an HTTPS URL. The app
sends that URL over SAMP.

This works for any table, including the selected members and the tables the
app builds, and in every browser. The data are public *Gaia* and catalogue
data, so storing them briefly raises no privacy issues. The Worker needs an
upload size limit and a rate limit so that it cannot be used as free file
hosting.

### 3. Send a `data:` URL

The table could be embedded in the URL itself. This needs no server, but it is
not known whether TOPCAT and Aladin accept `data:` URLs (standard Java does
not handle them by default). It would need testing, and large tables would
make very long messages.

## Practical issues

- **The hub must be running.** TOPCAT or Aladin starts it on launch. TOPCAT
  accepts Web Profile clients by default. On the first registration it asks
  the user to allow the web application.
- **Browser restrictions.** A page served over HTTPS calls `http://localhost`.
  Chrome and Firefox allow this, but recent Chrome versions show a local
  network access permission prompt, and Safari has historically blocked or
  limited such calls. A page opened from a local file has the origin `null`;
  how the hubs handle that has not been tested.
- **Keep it optional.** SAMP controls (e.g. "Saada TOPCATi / Aladinisse")
  should appear only after a hub is found, so that students without the
  desktop tools see no change.

## Recommendation

Start small:

1. Point Aladin at the cluster (`coord.pointAt.sky`).
2. Send the *Gaia* query URL to TOPCAT and Aladin (option 1).
3. Send the current member selection with `table.select.rowList`.

Later, if needed, add the Worker upload (option 2) for the selected members
and the tables the app builds, and receive selections made in TOPCAT so that
a lasso drawn there updates the app.
