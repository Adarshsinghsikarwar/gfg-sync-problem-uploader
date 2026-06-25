import { fetchViaApi } from './apiStrategy.js';
import { fetchViaScrape } from './scrapeStrategy.js';
import { fetchViaManual } from './manualStrategy.js';

/**
 * Tries each strategy in order, merging results, until the data looks
 * complete enough (has a title and a statement). Whatever's still
 * missing after api + scrape gets asked for manually, so the tool always
 * produces a finished markdown file even on a bad day for scraping.
 */
export async function fetchProblemData(url, config) {
  let data = await fetchViaApi(url, config);

  if (!data?.statement || !data?.title) {
    console.log('-> falling back to headless browser scrape...');
    const scraped = await fetchViaScrape(url);
    data = { ...scraped, ...stripNulls(data) };
  }

  if (!data?.statement || !data?.title) {
    console.log('-> still missing fields, asking you to fill them in...');
    data = await fetchViaManual(data || {});
  }

  return data;
}

function stripNulls(obj) {
  if (!obj) return {};
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null));
}
