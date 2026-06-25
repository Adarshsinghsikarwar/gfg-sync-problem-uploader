/**
 * Fallback strategy: renders the page with a real headless browser and
 * reads the DOM, since GFG problem pages are client-side rendered (a
 * plain axios.get() of the HTML won't contain the problem statement).
 *
 * Selectors below are best-guess starting points - GFG's markup changes
 * fairly often, so open DevTools, inspect the actual elements, and adjust
 * the selectors in the page.evaluate() block to match what you see.
 *
 * Requires: npm i puppeteer  (kept optional so it's not a hard dependency)
 */
export async function fetchViaScrape(url) {
  let puppeteer;
  try {
    puppeteer = (await import('puppeteer')).default;
  } catch {
    console.warn('[scrapeStrategy] puppeteer not installed - run: npm i puppeteer');
    return null;
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const data = await page.evaluate(() => {
      const text = (sel) => document.querySelector(sel)?.innerText?.trim() || null;

      const title =
        text('h1') ||
        text('.problem-statement h2') ||
        text('[class*="header_content"]');

      const statement =
        text('.problem-statement') ||
        text('[class*="problem_content"]') ||
        document.body.innerText.slice(0, 3000);

      const difficultyEl = [...document.querySelectorAll('div, span')].find((el) =>
        /^(Easy|Medium|Hard)$/i.test(el.textContent.trim())
      );

      return {
        title,
        difficulty: difficultyEl ? difficultyEl.textContent.trim() : null,
        tags: [],
        statement,
        examples: [],
        constraints: [],
      };
    });

    return data;
  } catch (err) {
    console.warn('[scrapeStrategy] failed:', err.message);
    return null;
  } finally {
    await browser.close();
  }
}
