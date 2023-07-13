import { Logger } from 'https://deno.land/std@0.193.0/log/mod.ts';
import bsky, { BskyAgent } from 'npm:@atproto/api@0.4.0';

/**
 * The result of fetching a client and logging in.. Does not currently provide reason for failure.
 */
type AuthenticationResult =
    | { success: true; agent: BskyAgent }
    | { success: false };

export const getAuthenticatedAgent = async (
    {
        logger,
        service,
        username,
        password,
    }: {
        logger: Logger;
        service: string;
        username: string;
        password: string;
    },
): Promise<AuthenticationResult> => {
    const { BskyAgent } = bsky;
    const agent = new BskyAgent({
        service,
    });

    try {
        const response = await agent.login({ identifier: username, password });
        if (!response.success) {
            logger.error(`Unable to login due to response: ${response}`);
            return { success: false };
        }

        logger.info(`Created agent and logged as: ${agent.session?.handle}`);
        return { success: true, agent };
    } catch (error) {
        logger.error(`Unable to create agent and login due to error: ${error}`);
        return { success: false };
    }
};

// await agent.login({
//     identifier: Deno.env.get('BSKY_USERNAME')!,
//     password: Deno.env.get('BSKY_PASSWORD')!,
// });

// await agent.
// const logger = getLogger('Agent');

// const agent = new BskyAgent({
//     service: 'https://bsky.social/',
//     persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
//         // store the session-data for reuse
//         console.log(evt, sess);
//     },
// });

// // await agent.resumeSession(savedSessionData);
// const result = await agent.;
// console.log(result);

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
