import { MockFetch } from 'https://deno.land/x/deno_mock_fetch@1.0.1/mod.ts';
import { getLogger } from './logging.ts';
import { fetchAndParse } from './scraper.ts';

const url = new URL('https://github.com/trending');
const mockFetch = new MockFetch();

const trendingDaily = await Deno.readTextFile(
    './src/scraper-fixtures/trending-daily.html',
);
mockFetch
    .intercept(url)
    .response(trendingDaily, { status: 200 })
    .persist();

const logger = getLogger('Scraper');
Deno.bench('scrape repositories', async () => {
    await fetchAndParse({ logger, url });
});
