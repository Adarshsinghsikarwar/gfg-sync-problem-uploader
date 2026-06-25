# gfg-sync

Generates a markdown doc (problem statement + examples + constraints + your solution)
for every GeeksforGeeks problem you solve, from a single CLI command.

## Why it's built this way

GFG has no public API, and its problem pages are rendered client-side (React),
so a plain HTML fetch won't contain the problem text. The tool tries three
strategies in order, falling back gracefully:

1. **API strategy** — calls the same internal JSON endpoint GFG's own frontend
   uses. Fastest and cleanest, but you have to find the endpoint yourself
   (see setup below) and it can change without notice.
2. **Scrape strategy** — Puppeteer renders the page like a real browser and
   reads the DOM. Slower, more robust to API changes, breaks if GFG redesigns
   the page markup.
3. **Manual strategy** — prompts you to paste whatever's still missing.
   Guarantees the tool always finishes, even on a bad day.

Whatever you got from each step is merged, so usually you'll only get prompted
for the 1-2 fields the automated steps couldn't find.

## Setup

```bash
npm install
# optional, only needed for the scrape fallback:
npm install puppeteer
```

### Find the API endpoint (do this once)

1. Open any GFG problem page in Chrome.
2. DevTools → Network tab → filter by `Fetch/XHR`.
3. Reload the page.
4. Look through the requests for one returning JSON with the problem title /
   statement / examples.
5. Copy that URL into `gfg-sync.config.json` → `apiEndpointTemplate`, replacing
   the problem's slug in the URL with the literal text `{slug}`.

If you don't do this step, the tool just skips straight to the Puppeteer
fallback (slower, but works without any config).

## Usage

Generate one doc:

```bash
node src/cli.js add \
  --url "https://www.geeksforgeeks.org/problems/kadanes-algorithm/1" \
  --solution ./solutions/kadanes-algorithm.js \
  --lang javascript \
  --notes "O(n) time, O(1) space — track running max and global max."
```

This writes `docs/<difficulty>/<slug>.md` and records the entry in `problems.json`.

Regenerate every doc later (e.g. after tweaking the template):

```bash
npm run sync
```

## Folder structure

```
gfg-sync/
  solutions/        <- your raw solution files, one per problem
  docs/             <- generated markdown, organized by difficulty
  problems.json     <- registry: slug -> {url, solution, output}
  gfg-sync.config.json
  src/
    cli.js
    template.js
    scraper/
      apiStrategy.js
      scrapeStrategy.js
      manualStrategy.js
      index.js
```

## Automating it

`.github/workflows/gfg-sync.yml` re-runs `npm run sync` and commits the
generated docs whenever you push to `solutions/` or `problems.json` — same
pattern as a streak-tracker action, just for your solved problems instead of
commit count.

## Known fragility (read this before relying on it)

- The selectors in `scrapeStrategy.js` are starting guesses — GFG's markup
  changes often. Inspect the real DOM and adjust them.
- The field names in `apiStrategy.js`'s `normalize()` function are guesses
  too — once you find the real endpoint, check the actual response shape and
  fix the mapping.
- GFG may rate-limit or block automated requests. If `apiStrategy` keeps
  failing, lean on the Puppeteer + manual fallback instead of hammering it.
