import { filterRepositories } from './filter.ts';
import { createRepositories } from './filter.test.ts';

const repositories = createRepositories(25);

Deno.bench('filter repositories with single values', {
    group: 'filtering',
    baseline: true,
}, async () => {
    await filterRepositories({
        repositories,
        languages: ['Python'],
        keywords: ['llm'],
    });
});

Deno.bench(
    'filter repositories with multiple values',
    { group: 'filtering' },
    async () => {
        await filterRepositories({
            repositories,
            languages: ['Python', 'Jupyter Notebook', 'R'],
            keywords: ['llm', 'chatgpt', 'ml'],
        });
    },
);
