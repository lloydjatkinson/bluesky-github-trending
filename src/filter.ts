import { RepositoryStatistics } from './types.ts';

/**
 * Applies various filters to remove low-quality, spam, and undesirable
 * repositories to keep the posts/feed interesting.
 *
 * @param {Object} options - The options for filtering.
 * @param {readonly RepositoryStatistics[]} options.repositories - The array of repository statistics.
 * @param {readonly string[]} options.languages - The array of languages to filter by.
 * @param {readonly string[]} options.keywords - The array of keywords to filter by.
 * @returns {readonly RepositoryStatistics[]} - The filtered array of repository statistics.
 */
export const filterRepositories = (
    {
        repositories,
        languages,
        keywords,
    }: {
        repositories: readonly RepositoryStatistics[];
        languages: readonly string[];
        keywords: readonly string[];
    },
): readonly RepositoryStatistics[] => {
    // This should be improved further by using Damerau-Levenshtein distance string metric,
    // so that variations and similar words are still filtered.
    // https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance
    const filtered = repositories
        .filter((repository) =>
            !languages.includes(repository.primaryLanguage?.toLowerCase())
        )
        .filter((repository) =>
            !keywords.some((keyword) =>
                repository.name &&
                repository.name.toLowerCase().includes(keyword.toLowerCase())
            )
        )
        .filter((repository) =>
            !keywords.some((keyword) =>
                repository.description &&
                repository.description.toLowerCase().includes(
                    keyword.toLowerCase(),
                )
            )
        );

    return filtered;
};
