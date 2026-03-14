<template>
    <div
        class="group bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-300 flex flex-col cursor-pointer"
        @click="$emit('open-detail', product)"
    >
        <!-- ─── MEDIA BLOCK (Single Relative Container) ───────────────────── -->
        <div class="relative w-full aspect-[4/5] bg-gray-50 dark:bg-neutral-800 overflow-hidden">
            
            <!-- 0 Images: Placeholder -->
            <div v-if="!imageItems.length" class="absolute inset-0 flex items-center justify-center">
                <Icon name="mdi:image-outline" size="48" class="text-gray-300 dark:text-neutral-700" />
            </div>

            <!-- 1 Image -->
            <img 
                v-else-if="imageItems.length === 1"
                :src="imageItems[0]!.url" 
                :alt="product.title" 
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />

            <!-- 2 Images: Side by side -->
            <div v-else-if="imageItems.length === 2" class="absolute inset-0 grid grid-cols-2 gap-0.5">
                <div v-for="item in imageItems" :key="item.id" class="overflow-hidden">
                    <img :src="item.url" :alt="product.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
            </div>

            <!-- 3+ Images: Collage -->
            <div v-else class="absolute inset-0 grid grid-cols-2 gap-0.5">
                <div class="overflow-hidden">
                    <img :src="imageItems[0]!.url" :alt="product.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div class="grid grid-rows-2 gap-0.5">
                    <div class="overflow-hidden">
                        <img :src="imageItems[1]!.url" :alt="product.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div class="relative overflow-hidden">
                        <img :src="imageItems[2]!.url" :alt="product.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <!-- +N Overlay -->
                        <div v-if="imageItems.length > 3" class="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <span class="text-white text-lg font-bold">+{{ imageItems.length - 3 }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ─── OVERLAYS (Positioned over the entire media block) ──────── -->
            
            <!-- Top Left: Badges -->
            <div v-if="product.isThrift || discountPercent > 0" class="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                <span v-if="product.isThrift" class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wide shadow-sm">
                    Thrift
                </span>
                <span v-if="discountPercent > 0" class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand text-white uppercase tracking-wide shadow-sm">
                    −{{ discountPercent }}%
                </span>
            </div>

            <!-- Top Right: Music Indicator -->
            <span v-if="hasBgMusic" class="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md rounded-full p-1.5 text-[12px] leading-none z-10 text-white">
                <Icon name="mdi:music" size="14" />
            </span>

            <!-- Bottom Left: Stock Indicator -->
            <div v-if="lowestStock === 0" class="absolute bottom-2.5 left-2.5 bg-gray-900/90 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full z-10 shadow-sm">
                Sold out
            </div>
            <div v-else-if="lowestStock !== null && lowestStock <= 5" class="absolute bottom-2.5 left-2.5 bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full z-10 shadow-sm">
                Only {{ lowestStock }} left
            </div>
        </div>

        <!-- ─── INFO BLOCK ────────────────────────────────────────────────── -->
        <div class="px-3.5 pt-3 pb-2 flex-1 flex flex-col justify-between">
            <div>
                <h3 class="text-[13px] font-semibold text-gray-900 dark:text-neutral-100 leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                    {{ product.title }}
                </h3>
                <NuxtLink v-if="product.seller?.store_name" :to="`/sellers/profile/${product.seller.store_slug}`" class="text-[11px] text-gray-500 dark:text-neutral-400 mt-1 truncate flex items-center gap-1">
                    <Icon name="mdi:storefront-outline" size="12" />
                    {{ product.seller.store_name }}
                </NuxtLink>
            </div>

            <div class="flex items-baseline gap-2 mt-2">
                <span class="text-[15px] font-bold text-gray-900 dark:text-neutral-100">{{ formatPrice(discountedPrice, currency) }}</span>
                <span v-if="discountPercent > 0" class="text-[11px] text-gray-400 dark:text-neutral-500 line-through">{{ formatPrice(product.price, currency) }}</span>
            </div>
        </div>

        <!-- ─── ACTION BAR ────────────────────────────────────────────────── -->
        <div class="flex items-center justify-between px-2.5 pb-2.5 pt-1" @click.stop>
            
            <div class="flex items-center gap-1">
                <!-- Like -->
                <button
                    @click="handleLike"
                    class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                    :class="localLiked ? 'text-brand bg-brand/5' : 'text-gray-500 dark:text-neutral-400 hover:text-brand hover:bg-brand/5 dark:hover:bg-brand/10'"
                >
                    <Icon :name="localLiked ? 'mdi:heart' : 'mdi:heart-outline'" size="16" :class="localLiked ? 'scale-110' : ''" class="transition-transform" />
                    <span>{{ localLikeCount }}</span>
                </button>

                <!-- Comment -->
                <button
                    @click="$emit('open-comments', product)"
                    class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 dark:text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                >
                    <Icon name="mdi:comment-outline" size="16" />
                    <span>{{ product._count?.comments ?? 0 }}</span>
                </button>

                <!-- Share -->
                <button
                    @click="handleShare"
                    class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 dark:text-neutral-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
                >
                    <Icon name="mdi:share-outline" size="16" />
                </button>
            </div>

            <div class="flex items-center gap-1">
                <!-- Market -->
                <button
                    v-if="product.affiliateCommission && product.affiliateCommission > 0"
                    @click="$emit('market', product)"
                    class="flex items-center justify-center p-1.5 rounded-full text-purple-500 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors"
                    title="Market this product and earn commission"
                >
                    <Icon name="mdi:bullhorn-outline" size="16" />
                </button>

                <!-- Add to Cart -->
                <button
                    @click="handleAddToCart"
                    :disabled="lowestStock === 0 || !product.variants?.length"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="cartAdded
                        ? 'bg-green-500 text-white scale-105'
                        : (lowestStock === 0 || !product.variants?.length)
                            ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400'
                            : 'bg-brand text-white hover:bg-[#d81b36] hover:shadow-md hover:shadow-brand/20 active:scale-95'"
                >
                    <Icon :name="cartAdded ? 'mdi:check' : 'mdi:cart-plus'" size="14" />
                    <span class="hidden xs:inline">{{ !product.variants?.length ? 'N/A' : lowestStock === 0 ? 'Sold out' : cartAdded ? 'Added' : 'Cart' }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~~/layers/commerce/app/types/commerce.types'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { notify } from '@kyvg/vue3-notification'

const props = defineProps<{ product: IProduct }>()
const emit = defineEmits<{
    'open-detail': [product: IProduct]
    'open-comments': [product: IProduct]
    'quick-add': [product: IProduct]
    'market': [product: IProduct]
    'share': [product: IProduct]
}>()

const profileStore = useProfileStore()
const { addToCart } = useCart()
const { openShare } = useShareModal()
const { likeProduct, unlikeProduct } = useProduct()

// ── Media ────────────────────────────────────────────────────────────────────
const imageItems = computed(() =>
    (props.product.media ?? []).filter(m => !m.isBgMusic && (m.type === 'IMAGE' || m.type === 'VIDEO'))
)
const hasBgMusic = computed(() =>
    (props.product.media ?? []).some(m => m.isBgMusic || m.type === 'AUDIO')
)

// ── Pricing ──────────────────────────────────────────────────────────────────
// Utility function for formatting price (assuming it's globally imported or provided by a composable)
const formatPrice = (price: number, cur: string) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: cur }).format(price);
}

const currency = computed(() => props.product.seller?.default_currency ?? 'NGN')
const discountPercent = computed(() => props.product.discount ?? 0)
const discountedPrice = computed(() =>
    discountPercent.value > 0
        ? Math.round(props.product.price * (1 - discountPercent.value / 100))
        : props.product.price
)

// ── Stock / Variant ──────────────────────────────────────────────────────────
const lowestStock = computed(() => {
    const v = props.product.variants
    if (!v?.length) return null
    return Math.min(...v.map(x => x.stock))
})
const firstVariantId = computed(() => props.product.variants?.[0]?.id ?? null)
const isSingleVariant = computed(() => (props.product.variants?.length ?? 0) <= 1)

// ── Like ─────────────────────────────────────────────────────────────────────
const localLiked = ref(false) // Assuming initial state needs checking against user profile if available
const localLikeCount = ref(props.product._count?.likes ?? 0)

const handleLike = async () => {
    if (!profileStore.isLoggedIn) {
        notify({ type: 'warn', text: 'Sign in to like products' })
        return
    }
    const wasLiked = localLiked.value
    localLiked.value = !wasLiked
    localLikeCount.value += wasLiked ? -1 : 1
    
    try {
        if (wasLiked) await unlikeProduct(props.product.id)
        else await likeProduct(props.product.id)
    } catch (err: any) {
        // Rollback optimistic update
        localLiked.value = wasLiked
        localLikeCount.value += wasLiked ? 1 : -1
        
        const status = err?.response?.status ?? err?.statusCode
        if (status === 401 || status === 403) {
            notify({ type: 'warn', text: 'Sign in to like products' })
        } else {
            notify({ type: 'error', text: 'Could not like product' })
        }
    }
}

// ── Share ────────────────────────────────────────────────────────────────────
const handleShare = () => {
    const url = `${import.meta.client ? window.location.origin : ''}/discover?product=${props.product.id}`
    if (navigator.share) {
        navigator.share({ title: props.product.title, url }).catch(() => openShare(url, props.product.title))
    } else {
        openShare(url, props.product.title)
    }
}

// ── Cart ──────────────────────────────────────────────────────────────────────
const cartAdded = ref(false)

const handleAddToCart = async () => {
    // Multi-variant: open detail modal to pick a variant
    if (!isSingleVariant.value || !firstVariantId.value) {
        return emit('open-detail', props.product)
    }
    try {
        await addToCart(firstVariantId.value, 1)
        cartAdded.value = true
        // Allow parent component to also trigger side effects (like opening a cart drawer)
        emit('quick-add', props.product) 
        
        setTimeout(() => { cartAdded.value = false }, 2000)
    } catch {}
}
</script>