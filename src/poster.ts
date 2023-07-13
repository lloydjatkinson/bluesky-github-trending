import { BskyAgent } from 'npm:@atproto/api@0.4.0';
import { RepositoryStatistics } from './types.ts';
import { Logger } from 'https://deno.land/std@0.193.0/log/mod.ts';
import { filterRepositories } from './filter.ts';
import { keywordFilter, primaryLanguageFilter } from './filter-defaults.ts';

/**
 * The result of posting. Does not currently provide reason for posting failure.
 */
type PostingResult =
    | { success: true }
    | { success: false };

export const postStatistics = (
    {
        logger,
        // deno-lint-ignore no-unused-vars
        agentService,
        repositories,
    }: {
        logger: Logger;
        agentService: BskyAgent;
        repositories: readonly RepositoryStatistics[];
    },
) => {
    const filtered = filterRepositories({
        repositories,
        languages: primaryLanguageFilter,
        keywords: keywordFilter,
    });
    logger.info(
        `Creating post content based on ${filtered.length} repositories`,
    );
    console.log(filtered);
};

// const bleet =
//     'You can find the code for this bleet >>>here<<<, with a link card, a title and a description!';
// await agent.post({
//     text: bleet,
//     facets: [
//         {
//             index: {
//                 byteStart: bleet.indexOf('>>>') + 3,
//                 byteEnd: bleet.indexOf('<<<'),
//             },
//             features: [
//                 {
//                     $type: 'app.bsky.richtext.facet#link',
//                     uri: 'https://github.com/sharunkumar/atproto-starter-kit',
//                 },
//             ],
//         },
//     ],
//     embed: {
//         $type: 'app.bsky.embed.external',
//         external: {
//             uri: 'https://github.com/sharunkumar/atproto-starter-kit',
//             title: 'sharun\'s atproto starter kit',
//             description: 'i\'m just playing around with the api',
//         },
//     },
// });
