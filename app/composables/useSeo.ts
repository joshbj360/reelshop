/**
 * SEO helper composable — centralises useSeoMeta calls for every page type.
 * Usage: const { setHomePage } = useSeo(); setHomePage()
 */
export const useSeo = () => {
  const config = useRuntimeConfig()
  const siteName = (config.public.siteName as string) || 'Styli'
  const baseURL = (config.public.baseURL as string) || 'https://styli.app'
  const defaultImage = `${baseURL}/og-default.png`

  const defaults = () => {
    useHead({
      titleTemplate: (t) => (t ? `${t} | ${siteName}` : siteName),
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'canonical', href: baseURL }],
    })
    useSeoMeta({
      ogSiteName: siteName,
      ogType: 'website',
      ogLocale: 'en_US',
      twitterCard: 'summary_large_image',
      twitterSite: '@styliapp',
    })
  }

  const setHomePage = () => {
    const desc =
      'Discover fashion, thrift, and lifestyle products from African creators on Styli.'
    useSeoMeta({
      title: siteName,
      description: desc,
      ogTitle: `${siteName} — Shop the Trend`,
      ogDescription: desc,
      ogImage: defaultImage,
      twitterTitle: `${siteName} — Shop the Trend`,
      twitterDescription: desc,
      twitterImage: defaultImage,
    })
  }

  const setDiscoverPage = () => {
    const desc =
      'Browse thousands of products from verified African sellers and independent creators.'
    useSeoMeta({
      title: 'Discover',
      description: desc,
      ogTitle: `Discover | ${siteName}`,
      ogDescription: desc,
      ogImage: defaultImage,
    })
  }

  const setThriftPage = () => {
    const desc =
      'Find pre-loved fashion and thrift items at unbeatable prices on Styli.'
    useSeoMeta({
      title: 'Thrift Store',
      description: desc,
      ogTitle: `Thrift Store | ${siteName}`,
      ogDescription: desc,
      ogImage: defaultImage,
    })
  }

  const setCategoryPage = (name: string, slug: string) => {
    const desc = `Browse ${name} products from African sellers on ${siteName}.`
    useSeoMeta({
      title: name,
      description: desc,
      ogTitle: `${name} | ${siteName}`,
      ogDescription: desc,
      ogUrl: `${baseURL}/category/${slug}`,
    })
  }

  const setSellerProfilePage = (seller: {
    store_name?: string | null
    store_description?: string | null
    store_logo?: string | null
    store_slug: string
  }) => {
    const name = seller.store_name || seller.store_slug
    const desc =
      seller.store_description || `Shop products from ${name} on ${siteName}.`
    useSeoMeta({
      title: name,
      description: desc,
      ogTitle: `${name} | ${siteName}`,
      ogDescription: desc,
      ogImage: seller.store_logo || defaultImage,
      ogUrl: `${baseURL}/sellers/profile/${seller.store_slug}`,
    })
  }

  const setProfilePage = (profile: {
    username?: string | null
    bio?: string | null
    avatar?: string | null
  }) => {
    const name = profile.username || 'Profile'
    const desc = profile.bio || `Follow ${name} on ${siteName}.`
    useSeoMeta({
      title: `@${name}`,
      description: desc,
      ogTitle: `@${name} | ${siteName}`,
      ogDescription: desc,
      ogImage: profile.avatar || defaultImage,
      ogUrl: `${baseURL}/profile/${profile.username}`,
    })
  }

  const setProductPage = (product: {
    title?: string
    description?: string
    imageUrl?: string
  }) => {
    const desc = product.description || `Buy ${product.title} on ${siteName}.`
    useSeoMeta({
      title: product.title || 'Product',
      description: desc,
      ogTitle: `${product.title} | ${siteName}`,
      ogDescription: desc,
      ogImage: product.imageUrl || defaultImage,
      ogType: 'product',
    })
  }

  const setCheckoutPage = () => {
    useSeoMeta({
      title: 'Checkout',
      description: 'Complete your order on Styli.',
      robots: 'noindex',
    })
  }

  const setOrdersPage = () => {
    useSeoMeta({
      title: 'My Orders',
      description: 'View and track your orders on Styli.',
      robots: 'noindex',
    })
  }

  return {
    defaults,
    setHomePage,
    setDiscoverPage,
    setThriftPage,
    setCategoryPage,
    setSellerProfilePage,
    setProfilePage,
    setProductPage,
    setCheckoutPage,
    setOrdersPage,
  }
}
