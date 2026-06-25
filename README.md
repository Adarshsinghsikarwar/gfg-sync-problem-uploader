# simple step to start with this 

unzip gfg-sync.zip && cd gfg-sync
npm install
node src/cli.js add --url "<gfg-problem-url>" --solution ./solutions/kadanes-algorithm.js --lang javascript

# GeeksforGeeks Solution Sync (gfg-sync)

Auto-generate clean Markdown documentation (problem statements, examples, constraints, and solutions) for your solved GeeksforGeeks (GFG) problems with a single command.

---

## 📂 Project Structure

This project is organized as a repository with the core tool contained within the `gfg-sync` subdirectory.

```
gfg-sync-workspace/
├── gfg-sync/                # Main application folder
│   ├── src/                 # Source code (CLI, Scrapers, Templates)
│   ├── solutions/           # Your raw solution code files
│   ├── docs/                # Generated Markdown documents (sorted by difficulty)
│   ├── gfg-sync.config.json # Project configuration file
│   └── problems.json        # Registry mapping problem slug to details
└── README.md                # This file
```

---

## 🚀 Getting Started

To use the tool, you need to navigate to the `gfg-sync` folder and set up the dependencies.

### 1. Navigate to the folder
```bash
cd gfg-sync
```

### 2. Install dependencies
```bash
npm install
```

### 3. (Optional) Install Puppeteer for scrapers
By default, the tool tries to use GFG's internal API. If it fails or isn't configured, it falls back to a browser scraper (Puppeteer) before falling back to manual input. To enable browser scraping:
```bash
npm install puppeteer
```

---

## ⚙️ Configuration

Open `gfg-sync/gfg-sync.config.json`. It looks like this:

```json
{
  "apiEndpointTemplate": "",
  "outputDir": "./docs",
  "solutionsDir": "./solutions"
}
```

### Finding the GFG API Endpoint (Highly Recommended)
Using the API is much faster and cleaner than Puppeteer. You can configure it once:
1. Open any GeeksforGeeks problem page in your web browser.
2. Open DevTools (F12 or right-click → Inspect) and navigate to the **Network** tab. Filter by `Fetch/XHR`.
3. Refresh the page.
4. Locate the network request that returns a JSON response containing the problem's details (such as title, description, and examples).
5. Copy the Request URL and paste it into `apiEndpointTemplate` in `gfg-sync.config.json`, replacing the problem's specific slug/name in the URL with `{slug}`.

*Example:* If the URL is `https://practiceapi.geeksforgeeks.org/api/v1/problems/kadanes-algorithm/`, change it to `https://practiceapi.geeksforgeeks.org/api/v1/problems/{slug}/`.

---

## 💻 Usage

> [!IMPORTANT]
> Always run these commands from within the `gfg-sync` directory.

### Add a New Problem
Save your solution file in the `solutions/` folder (e.g., `solutions/kadanes-algorithm.js`), then run the command to fetch details and document it:

```bash
node src/cli.js add \
  --url "https://www.geeksforgeeks.org/problems/kadanes-algorithm/1" \
  --solution ./solutions/kadanes-algorithm.js \
  --lang javascript \
  --notes "O(n) time, O(1) space — track running max and global max."
```

Alternatively, you can run it via npm scripts:
```bash
npm run add -- --url "https://www.geeksforgeeks.org/problems/kadanes-algorithm/1" --solution ./solutions/kadanes-algorithm.js --lang javascript --notes "O(n) time, O(1) space"
```

This will:
1. Fetch problem details (description, examples, constraints) using API, Scraping, or Manual input.
2. Save a markdown file under `docs/<difficulty>/<problem-slug>.md`.
3. Save information to `problems.json` so you can sync it later.

### Sync / Regenerate All Docs
If you update your styling template in `src/template.js` or modify a solution file, you can regenerate all markdown files in one go:

```bash
npm run sync
```

---

## 🤖 Scraping & API Strategies

To ensure reliability, `gfg-sync` uses a cascading fallback mechanism:
1. **API Strategy**: Fetches JSON directly from the configured API template. Instant and precise.
2. **Scraper Strategy**: Uses Puppeteer to spin up a headless browser, wait for client-side rendering (React), and extract content.
3. **Manual Strategy**: If both automated methods fail or miss fields, the CLI prompts you to paste the missing parts. This guarantees that your doc generation never gets completely blocked.
