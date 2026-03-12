/**
 * Fetch global layout data (top sellers, categories)
 * Cached across all pages via useLazyAsyncData key 'layout-data'
 */
export const useLayoutData = () => {
    return useLazyAsyncData(
        'layout-data',
        async () => {
            const [sellersRes, categoriesRes] = await Promise.allSettled([
                $fetch<any>('/api/seller/featured'),
                $fetch<any>('/api/commerce/categories'),
            ])
            return {
                topSellers: sellersRes.status === 'fulfilled' ? (sellersRes.value?.data ?? []) : [],
                categories: categoriesRes.status === 'fulfilled' ? (categoriesRes.value?.data ?? []) : [],
            }
        },
        {
            server: false,
            default: () => ({ topSellers: [] as any[], categories: [] as any[] })
        }
    )
}
