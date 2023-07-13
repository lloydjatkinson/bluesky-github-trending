import { load } from 'https://deno.land/std@0.193.0/dotenv/mod.ts';
import { getLogger, setupLogging } from './logging.ts';
import { scheduleJob } from './scheduler.ts';
import { fetchAndParse } from './scraper.ts';
import { getConfiguration } from './configuration.ts';
import { getAuthenticatedAgent } from './agent.ts';
import { postStatistics } from './poster.ts';

await setupLogging();
const logger = getLogger('Main');
logger.info('Starting up');

const configuration = getConfiguration(
    getLogger('Configuration'),
    await load(),
);

scheduleJob({
    // pattern: '0 15 * * *',
    pattern: '*/1 * * * *',
    name: 'Daily Post',
    logger: getLogger('Scheduler'),
    action: async () => {
        const parsed = await fetchAndParse({
            logger: getLogger('Scraper'),
            url: configuration.githubTrendingUrl,
        });

        if (parsed.success) {
            const agent = await getAuthenticatedAgent({
                logger: getLogger('Agent'),
                service: configuration.agentService,
                username: configuration.appUsername,
                password: configuration.appPassword,
            });

            if (agent.success) {
                await postStatistics({
                    logger: getLogger('Poster'),
                    agentService: agent.agent,
                    repositories: parsed.value,
                });
            }
        }
    },
});
