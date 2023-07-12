/**
 * Trending statistics for a repository.
 */
export type RepositoryStatistics = Readonly<{
    name: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    starsToday: number;
    primaryLanguage: string;
}>;
