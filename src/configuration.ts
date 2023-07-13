import { Logger } from 'https://deno.land/std@0.193.0/log/mod.ts';

type Configuration = Readonly<{
    agentService: string;
    appUsername: string;
    appPassword: string;
    githubTrendingUrl: URL;
}>;

export const getConfiguration = (
    logger: Logger,
    configuration: Record<string, string>,
): Configuration => {
    // Refactoring this to use Zod would be nice.
    // I could also use Zod to validate the parsed repository information too,
    // this way changes to the page structure would be even more clear.
    if (
        !configuration['AGENT_SERVICE'] ||
        !configuration['APP_USERNAME'] ||
        !configuration['APP_PASSWORD'] ||
        !configuration['GITHUB_TRENDING_URL']
    ) {
        logger.critical('Missing environment variable(s). Aborting.');
        Deno.exit(1);
    }

    logger.debug('Loaded configuration from environment variables');

    return {
        agentService: configuration['AGENT_SERVICE'],
        appUsername: configuration['APP_USERNAME'],
        appPassword: configuration['APP_PASSWORD'],
        githubTrendingUrl: new URL(configuration['GITHUB_TRENDING_URL']),
    };
};
