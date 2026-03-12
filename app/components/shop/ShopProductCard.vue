<template>
    <div
        class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden"
        @click="$emit('open-detail', product)"
    >
        <!-- ─── No images ─────────────────────────────────────────────────── -->
        <div v-if="!imageItems.length" class="relative aspect-square bg-gray-100 dark:bg-neutral-800 flex items-center justify-center cursor-pointer">
            <Icon name="mdi:image-outline" size="40" class="text-gray-300 dark:text-neutral-600" />
            <MediaOverlays />
        </div>

        <!-- ─── Single image ─────────────────────────────────────────────── -->
        <div
            v-else-if="imageItems.length === 1"
            class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-800 cursor-pointer"
        >
            <img :src="imageItems[0]!.url" :alt="product.title" class="w-full h-full object-cover" />
            <MediaOverlays />
        </div>

        <!-- ─── Two images — side by side ───────────────────────────────── -->
        <div v-else-if="imageItems.length === 2" class="relative grid grid-cols-2 gap-0.5 cursor-pointer">
            <div v-for="item in imageItems" :key="item.id" class="aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-900">
                <img :src="item.url" :alt="product.title" class="w-full h-full object-cover" />
            </div>
            <MediaOverlays />
        </div>

        <!-- ─── Three or more — 3-collage with +N overlay ───────────────── -->
        <div v-else class="relative grid grid-cols-2 gap-0.5 cursor-pointer">
            <div class="overflow-hidden bg-gray-100 dark:bg-neutral-900" style="aspect-ratio: 4/5;">
                <img :src="imageItems[0]!.url" :alt="product.title" class="w-full h-full object-cover" />
            </div>
            <div class="grid grid-rows-2 gap-0.5">
                <div class="aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-900">
                    <img :src="imageItems[1]!.url" :alt="product.title" class="w-full h-full object-cover" />
                </div>
                <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-900">
                    <img :src="imageItems[2]!.url" :alt="product.title" class="w-full h-full object-cover" />
                    <div v-if="imageItems.length > 3" class="absolute inset-0 bg-black/55 flex items-center justify-center">
                        <span class="text-white text-xl font-bold">+{{ imageItems.length - 3 }}</span>
                    </div>
                </div>
            </div>
            <MediaOverlays />
        </div>

        <!-- ─── Info ─────────────────────────────────────────────────────── -->
        <div class="px-3 pt-2.5 pb-2">
            <h3 class="text-[13px] font-semibold text-gray-900 dark:text-neutral-100 leading-snug line-clamp-2 cursor-pointer">{{ product.title }}</h3>
            <p v-if="product.seller?.store_name" class="text-[11px] text-gray-400 dark:text-neutral-500 mt-0.5 truncate cursor-pointer">{{ product.seller.store_name }}</p>

            <div class="flex items-baseline gap-1.5 mt-1 cursor-pointer">
                <span class="text-[14px] font-bold text-gray-900 dark:text-neutral-100">{{ formatPrice(discountedPrice, currency) }}</span>
                <span v-if="discountPercent > 0" class="text-[11px] text-gray-400 dark:text-neutral-500 line-through">{{ formatPrice(product.price, currency) }}</span>
            </div>
        </div>

        <!-- ─── Action bar ────────────────────────────────────────────────── -->
        <div class="flex items-center gap-0.5 px-2 pb-2.5" @click.stop>

            <!-- Like -->
            <button
                @click="handleLike"
                class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                :class="localLiked
                    ? 'text-brand'
                    : 'text-gray-500 dark:text-neutral-400 hover:text-brand hover:bg-brand/5'"
            >
                <Icon :name="localLiked ? 'mdi:heart' : 'mdi:heart-outline'" size="16" />
                <span>{{ localLikeCount }}</span>
            </button>

            <!-- Comment — opens detail -->
            <button
                @click="$emit('open-detail', product)"
                class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 dark:text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
                <Icon name="mdi:comment-outline" size="16" />
                <span>{{ product._count?.comments ?? 0 }}</span>
            </button>

            <!-- Share -->
            <button
                @click="handleShare"
                class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-gray-500 dark:text-neutral-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
                <Icon name="mdi:share-outline" size="16" />
                <span>{{ product._count?.shares ?? 0 }}</span>
            </button>

            <!-- Market — only shown when seller has set an affiliate commission -->
            <button
                v-if="product.affiliateCommission && product.affiliateCommission > 0"
                @click="$emit('market', product)"
                class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-gray-500 dark:text-neutral-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                title="Market this product and earn commission"
            >
                <Icon name="mdi:bullhorn-outline" size="16" />
                <span class="hidden sm:inline">Market</span>
            </button>

            <!-- Spacer -->
            <div class="flex-1" />

            <!-- Add to Cart -->
            <button
                @click="handleAddToCart"
                :disabled="lowestStock === 0"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                :class="cartAdded
                    ? 'bg-green-500 text-white'
                    : lowestStock === 0
                        ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400'
                        : 'bg-brand text-white hover:bg-[#d81b36]'"
            >
                <Icon :name="cartAdded ? 'mdi:check' : 'mdi:cart-plus'" size="14" />
                <span>{{ lowestStock === 0 ? 'Sold out' : cartAdded ? 'Added' : 'Cart' }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~~/layers/commerce/types/commerce.types'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { notify } from '@kyvg/vue3-notification'

const props = defineProps<{ product: IProduct }>()
const emit = defineEmits<{
    'open-detail': [product: IProduct]
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
const localLiked = ref(false)
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
        setTimeout(() => { cartAdded.value = false }, 2000)
    } catch {}
}

// ── MediaOverlays sub-component ───────────────────────────────────────────────
// Renders badges + stock pills as a slot-less inline component
const MediaOverlays = defineComponent({
    setup() {
        return () => h('div', { class: 'contents' }, [
            // Top-left badges
            (props.product.isThrift || discountPercent.value > 0) && h('div', { class: 'absolute top-2 left-2 flex flex-col gap-1' }, [
                props.product.isThrift && h('span', { class: 'text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase' }, 'Thrift'),
                discountPercent.value > 0 && h('span', { class: 'text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand text-white uppercase' }, `−${discountPercent.value}%`)
            ]),
            // Top-right music
            hasBgMusic.value && h('span', { class: 'absolute top-2 right-2 bg-black/50 rounded-full px-1.5 py-0.5 text-[11px] leading-none' }, '🎵'),
            // Bottom-left stock
            lowestStock.value === 0
                ? h('div', { class: 'absolute bottom-2 left-2 bg-gray-800/80 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full' }, 'Sold out')
                : (lowestStock.value !== null && lowestStock.value <= 5)
                    ? h('div', { class: 'absolute bottom-2 left-2 bg-amber-500/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full' }, `Only ${lowestStock.value} left`)
                    : null
        ].filter(Boolean))
    }
})
</script>
