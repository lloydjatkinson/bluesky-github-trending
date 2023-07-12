import bsky from 'npm:@atproto/api@0.4.0';
import { load } from 'https://deno.land/std@0.191.0/dotenv/mod.ts';

await load();

const { BskyAgent } = bsky;
const agent = new BskyAgent({
    service: 'https://bsky.social',
});

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

const bleet =
    'You can find the code for this bleet >>>here<<<, with a link card, a title and a description!';
await agent.post({
    text: bleet,
    facets: [
        {
            index: {
                byteStart: bleet.indexOf('>>>') + 3,
                byteEnd: bleet.indexOf('<<<'),
            },
            features: [
                {
                    $type: 'app.bsky.richtext.facet#link',
                    uri: 'https://github.com/sharunkumar/atproto-starter-kit',
                },
            ],
        },
    ],
    embed: {
        $type: 'app.bsky.embed.external',
        external: {
            uri: 'https://github.com/sharunkumar/atproto-starter-kit',
            title: 'sharun\'s atproto starter kit',
            description: 'i\'m just playing around with the api',
        },
    },
});
