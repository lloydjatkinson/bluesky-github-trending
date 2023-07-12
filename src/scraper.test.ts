import {
    assertEquals,
    assertNotEquals,
} from 'https://deno.land/std@0.193.0/testing/asserts.ts';
import { stub } from 'https://deno.land/std@0.193.0/testing/mock.ts';
import {
    beforeEach,
    describe,
    it,
} from 'https://deno.land/std@0.193.0/testing/bdd.ts';
import { MockFetch } from 'https://deno.land/x/deno_mock_fetch@1.0.1/mod.ts';
import { fetchAndParse } from './scraper.ts';
import { getLogger } from './logging.ts';

const trendingDaily = await Deno.readTextFile(
    './src/scraper-fixtures/trending-daily.html',
);

const trendingDailyMissingArticles = await Deno.readTextFile(
    './src/scraper-fixtures/trending-daily-missing-articles.html',
);

describe('scraper', () => {
    const url = new URL('https://github.com/trending');
    const mockFetch = new MockFetch();
    const logger = getLogger('Scraper');
    let loggerInfoStub = stub(logger, 'info');
    let loggerErrorStub = stub(logger, 'error');

    beforeEach(() => {
        loggerInfoStub.restore();
        loggerErrorStub.restore();
        loggerInfoStub = stub(logger, 'info');
        loggerErrorStub = stub(logger, 'error');
    });

    it('should return result with success false when fetching fails with server error', async () => {
        mockFetch
            .intercept(url)
            .response(undefined, { status: 500 });

        const result = await fetchAndParse({ logger, url });
        assertEquals(result.success, false);
        assertEquals(loggerErrorStub.calls.length, 1);
    });

    it('should return result with success false when fetching fails with resource not found', async () => {
        mockFetch
            .intercept(url)
            .response(undefined, { status: 404 });

        const result = await fetchAndParse({ logger, url });
        assertEquals(result.success, false);
    });

    it('should return result with success false when fetching succeeds with invalid html', async () => {
        mockFetch
            .intercept(url)
            .response(trendingDailyMissingArticles, { status: 200 });
        const result = await fetchAndParse({ logger, url });
        assertEquals(result.success, false);
        assertEquals(loggerErrorStub.calls.length, 1);
    });

    it('should return result with success true when fetching succeeds with html', async () => {
        mockFetch
            .intercept(url)
            .response(trendingDaily, { status: 200 });
        const result = await fetchAndParse({ logger, url });
        assertEquals(result.success, true);
    });

    it('should return result with parsed repositories', async () => {
        mockFetch
            .intercept(url)
            .response(trendingDaily, { status: 200 });
        const result = await fetchAndParse({ logger, url });
        assertEquals(result.success, true);
        if (result.success) {
            assertEquals(result.value.length, 25);
            assertEquals(result.value[0].name, 'ixahmedxi/noodle');
            assertEquals(
                result.value[0].description,
                'Open Source Education Platform',
            );
            assertEquals(result.value[0].primaryLanguage, 'TypeScript');
            assertEquals(
                result.value[0].url,
                'https://github.com/ixahmedxi/noodle',
            );
            assertEquals(result.value[0].stars, 5853);
            assertEquals(result.value[0].starsToday, 1549);
            assertEquals(result.value[0].forks, 495);
            assertNotEquals(result.value[0].name, result.value[1].name);
        }
    });
});
