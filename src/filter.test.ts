import {
    assert,
    assertEquals,
} from 'https://deno.land/std@0.193.0/testing/asserts.ts';
import { faker } from 'npm:@faker-js/faker';
import { RepositoryStatistics } from './types.ts';
import { filterRepositories } from './filter.ts';

const defaultRepository: RepositoryStatistics = {
    name: `${faker.lorem.slug()}`,
    description: faker.lorem.sentence(),
    primaryLanguage: faker.helpers.arrayElement([
        'C#',
        'F#',
        'C',
        'Rust',
        'TypeScript',
    ]),
    stars: faker.number.int(1000),
    starsToday: faker.number.int(500),
    forks: faker.number.int(100),
    url: `https://github.com/${faker.lorem.slug()}`,
};

export const createRepository = (
    properties: Partial<RepositoryStatistics> = {},
): RepositoryStatistics => ({
    ...defaultRepository,
    ...properties,
});

export const createRepositories = (
    amount = 3,
): readonly RepositoryStatistics[] =>
    [...Array(amount)].map<RepositoryStatistics>(() => createRepository());

Deno.test('filter', async (test) => {
    const languagesToFilter = ['apple', 'banana'];
    const keywordsToFilter = ['red', 'pink', 'brown', 'yellow'];

    const repositoriesWithExcludedPrimaryLanguages = [
        createRepository({ primaryLanguage: languagesToFilter[0] }),
        createRepository({ primaryLanguage: languagesToFilter[1] }),
    ];

    const repositoriesWithExcludedKeywordsInName = [
        createRepository({ name: `foo-${keywordsToFilter[0]}` }),
        createRepository({ name: `${keywordsToFilter[1]}-bar` }),
    ];

    const repositoriesWithExcludedKeywordsInDescription = [
        createRepository({
            description: `${faker.lorem.words()} ${
                keywordsToFilter[0]
            } ${faker.lorem.words()}`,
        }),
        createRepository({
            description: `${faker.lorem.words()} ${
                keywordsToFilter[1]
            } ${faker.lorem.words()}`,
        }),
    ];

    const validRepositories = [
        createRepository(),
        createRepository(),
        createRepository(),
        createRepository(),
    ];

    await test.step('should not filter when filtering with collections', () => {
        assertEquals(
            filterRepositories({
                repositories: [],
                languages: [],
                keywords: [],
            }).length,
            0,
        );
        assertEquals(
            filterRepositories({
                repositories: validRepositories,
                languages: [],
                keywords: [],
            }).length,
            4,
        );
        assertEquals(
            filterRepositories({
                repositories: [],
                languages: languagesToFilter,
                keywords: [],
            }).length,
            0,
        );
        assertEquals(
            filterRepositories({
                repositories: [],
                languages: [],
                keywords: keywordsToFilter,
            }).length,
            0,
        );
    });

    await test.step('should filter repositories with excluded primary language', () => {
        const result = filterRepositories({
            repositories: repositoriesWithExcludedPrimaryLanguages,
            languages: languagesToFilter,
            keywords: keywordsToFilter,
        });

        assertEquals(result.length, 0);
    });

    await test.step('should filter repository with excluded keywords in name', () => {
        const result = filterRepositories({
            repositories: repositoriesWithExcludedKeywordsInName,
            languages: languagesToFilter,
            keywords: keywordsToFilter,
        });

        assertEquals(result.length, 0);
    });

    await test.step('should filter repository with excluded keywords in description', () => {
        const result = filterRepositories({
            repositories: repositoriesWithExcludedKeywordsInDescription,
            languages: languagesToFilter,
            keywords: keywordsToFilter,
        });

        assertEquals(result.length, 0);
    });

    await test.step('should not filter valid repositories', () => {
        const result = filterRepositories({
            repositories: validRepositories,
            languages: languagesToFilter,
            keywords: keywordsToFilter,
        });

        assertEquals(result.length, 4);
    });

    await test.step('should sort repositories by number of stars today', () => {
        const repositories = createRepositories(3).map((repository) => ({
            ...repository,
            starsToday: faker.number.int(500),
        }));

        const result = filterRepositories({
            repositories: repositories,
            languages: languagesToFilter,
            keywords: keywordsToFilter,
        });

        const [first, second, third] = result;
        assert(first.starsToday >= second.starsToday);
        assert(second.starsToday >= third.starsToday);
    });
});
