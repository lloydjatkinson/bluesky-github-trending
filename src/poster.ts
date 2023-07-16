import bsky, { BskyAgent } from 'npm:@atproto/api@0.4.0';
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

export const postStatistics = async (
    {
        logger,
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

    // await agentService.post();

    // creating richtext
    const { RichText, AppBskyFeedPost } = bsky;
    // const rt = new RichText({ text: 'hello' });
    // const postRecord = {
    //     $type: 'app.bsky.feed.post',
    //     text: rt.text,
    //     facets: rt.facets,
    //     createdAt: new Date().toISOString(),
    // };

    const rt = new RichText({
        text:
            'Hello @lja.bsky.social, check out this link: https://example.com',
    });
    await rt.detectFacets(agentService); // automatically detects mentions and links
    const postRecord = {
        $type: 'app.bsky.feed.post',
        text: rt.text,
        facets: rt.facets,
        createdAt: new Date().toISOString(),
    };

    // if (AppBskyFeedPost.isRecord(postRecord)) {
    //     // typescript now recognizes `post` as a AppBskyFeedPost.Record
    //     // however -- we still need to validate it
    //     const res = AppBskyFeedPost.validateRecord(postRecord);
    //     if (res.success) {
    //         // a valid record
    //     } else {
    //         // something is wrong
    //         console.log(res.error);
    //     }
    // }

    // await agentService.post(postRecord);

    // // rendering as markdown
    // let markdown = '';
    // for (const segment of rt.segments()) {
    //     if (segment.isLink()) {
    //         markdown += `[${segment.text}](${segment.link?.uri})`;
    //     } else if (segment.isMention()) {
    //         markdown +=
    //             `[${segment.text}](https://my-bsky-app.com/user/${segment.mention?.did})`;
    //     } else {
    //         markdown += segment.text;
    //     }
    // }

    // // calculating string lengths
    // const rt2 = new RichText({ text: 'Hello' });
    // console.log(rt2.length); // => 5
    // console.log(rt2.graphemeLength); // => 5
    // const rt3 = new RichText({ text: '👨‍👩‍👧‍👧' });
    // console.log(rt3.length); // => 25
    // console.log(rt3.graphemeLength); // => 1

    // console.log(markdown);
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
