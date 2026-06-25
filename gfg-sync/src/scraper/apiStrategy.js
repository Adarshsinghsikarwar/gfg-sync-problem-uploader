import axios from 'axios';
import { extractSlug } from '../utils.js';

/**
 * Calls GFG's internal JSON endpoint directly (the one its own React
 * frontend calls to render the problem page).
 *
 * You MUST set config.apiEndpointTemplate first:
 *   1. Open any GFG problem page in a browser
 *   2. DevTools -> Network -> filter XHR/Fetch
 *   3. Reload, find the request returning problem title/statement JSON
 *   4. Copy its URL into gfg-sync.config.json, replacing the slug
 *      with the literal string "{slug}"
 *
 * This is the fastest, cleanest strategy when it works, but GFG can
 * change this contract without notice - that's why scrapeStrategy and
 * manualStrategy exist as fallbacks.
 */
export async function fetchViaApi(url, config) {
  if (!config.apiEndpointTemplate) {
    console.log('[apiStrategy] no apiEndpointTemplate configured, skipping');
    return null;
  }

  const slug = extractSlug(url);
  if (!slug) return null;

  const endpoint = config.apiEndpointTemplate.replace('{slug}', slug);

  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'application/json',
      },
      timeout: 8000,
    });
    return normalize(data);
  } catch (err) {
    console.warn('[apiStrategy] failed:', err.message);
    return null;
  }
}

function normalize(raw) {
  const data = raw?.results ?? raw;
  
  let tags = [];
  if (Array.isArray(data?.tags)) {
    tags = data.tags;
  } else if (data?.tags && typeof data.tags === 'object') {
    tags = [...(data.tags.topic_tags || []), ...(data.tags.company_tags || [])];
  } else if (Array.isArray(data?.topic_tags)) {
    tags = data.topic_tags;
  }

  return {
    title: data?.problem_name ?? data?.title ?? null,
    difficulty: data?.difficulty ?? data?.problem_level_text ?? null,
    tags: tags,
    statement: data?.problem_statement ?? data?.problem_question ?? data?.question ?? null,
    examples: data?.examples ?? [],
    constraints: data?.constraints ?? [],
  };
}
