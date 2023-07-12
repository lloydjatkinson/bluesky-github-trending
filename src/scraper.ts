import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';
import { RepositoryStatistics } from './types.ts';
import { Logger } from 'https://deno.land/std@0.193.0/log/mod.ts';

/**
 * The result of parsing the HTML. Does not currently provide reason for parsing failure.
 */
type ParseResult =
    | { success: true; value: readonly RepositoryStatistics[] }
    | { success: false };

/**
 * Parses the GitHub trending page for information such as the number of stars gained today.
 * @returns {Promise<ParseResult>} A result value indicating the success of the parse operation.
 */
export const fetchAndParse = async (
    { logger, url }: { logger: Logger; url: URL },
): Promise<ParseResult> => {
    try {
        const repositories: RepositoryStatistics[] = [];

        const fetchStart = performance.now();
        const response = await fetch(url);
        if (!response.ok) {
            logger.error(
                `Unable to fetch trending repositories due to status "${response.status} ${response.statusText}"`,
            );
            return { success: false };
        }

        const html = await response.text();
        const fetchEnd = performance.now();

        logger.info(`Fetched page in ${fetchEnd - fetchStart}ms`);

        const parseStart = performance.now();
        const $ = cheerio.load(html);

        const articles = $('article');
        if (articles.children().length <= 0) {
            logger.error(
                'Unable to find list of trending repositories. The structure of the HTML has likely changed. Aborting.',
            );
            return { success: false };
        }
        logger.info('Found list of trending repositories');

        for (const element of articles) {
            const nameElement = $(element).find('h2 a');
            const name = nameElement.attr('href')?.slice(1);
            const url = `https://github.com/${name}`;
            if (!name) {
                logger.error(
                    'Unable to parse name from repository. The structure of the HTML has likely changed. Aborting.',
                );
                return { success: false };
            }

            const descriptionElement = $(element).find('p');
            const description = descriptionElement
                .text()
                .trim();

            const primaryLanguageElement = $(element).find(
                '[itemprop="programmingLanguage"]',
            );
            const primaryLanguage = primaryLanguageElement.text().trim();

            const starsElement = $(element).find(
                `[href="/${name}/stargazers"]`,
            );
            const starsText = starsElement
                .text()
                .trim()
                .replace(',', '');
            const stars = parseInt(starsText, 10);

            const forksElement = $(element).find(`[href="/${name}/forks"]`);
            const forksText = forksElement
                .text()
                .trim()
                .replace(',', '');
            const forks = parseInt(forksText, 10);

            const starsTodayElement = $(element).find(
                `span:contains("stars today")`,
            );
            const starsTodayText = starsTodayElement
                .text()
                .trim()
                .replace(',', '');
            const starsToday = parseInt(starsTodayText, 10);

            repositories.push({
                name,
                description,
                url,
                primaryLanguage,
                stars,
                forks,
                starsToday,
            });
        }

        const parseEnd = performance.now();
        logger.info(
            `Parsed information from ${repositories.length} repositories in ${
                parseEnd - parseStart
            }ms`,
        );
        return {
            success: true,
            value: repositories,
        };
    } catch (error) {
        logger.error(error);
        return {
            success: false,
        };
    }
};
