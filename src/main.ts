import { load } from 'https://deno.land/std@0.193.0/dotenv/mod.ts';
import { getLogger, setupLogging } from './logging.ts';
import { schedulePost } from './scheduler.ts';
import { fetchAndParse } from './scraper.ts';
import { filterRepositories } from './filter.ts';
import { keywordFilter, primaryLanguageFilter } from './filter-defaults.ts';
import { getConfiguration } from './configuration.ts';

await setupLogging();
const logger = getLogger('Main');
logger.info('Starting up');

const configuration = getConfiguration(
    getLogger('Configuration'),
    await load(),
);

schedulePost({
    pattern: '*/1 * * * *',
    name: 'Daily Post',
    logger: getLogger('Scheduler'),
    action: async () => {
        const result = await fetchAndParse({
            logger: getLogger('Scraper'),
            url: configuration.githubTrendingUrl,
        });
        if (result.success) {
            // deno-lint-ignore no-unused-vars
            const filtered = filterRepositories({
                repositories: result.value,
                languages: primaryLanguageFilter,
                keywords: keywordFilter,
            });
        }
    },
});
