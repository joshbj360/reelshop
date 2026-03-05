/**
 * Fetch global layout data (top sellers, categories)
 * Cached across all pages
 *
 * NOTE: topSellers is a placeholder — requires a public /api/seller/featured
 * endpoint. Using the auth-protected /api/seller/list here was incorrect.
 */
export const useLayoutData = () => {
    return useLazyAsyncData(
        'layout-data',
        async () => ({
            topSellers: [] as any[],
        }),
        {
            server: false,
            default: () => ({
                topSellers: [] as any[],
            })
        }
    )
}
