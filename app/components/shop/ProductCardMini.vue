<template>
    <div
        class="group bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 overflow-hidden hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-300 flex flex-col cursor-pointer relative"
        @click="$emit('open-detail', product)"
    >
        <!-- ─── MEDIA BLOCK ─────────────────────────────────────────────────── -->
        <div class="relative w-full aspect-square bg-gray-50 dark:bg-neutral-800 overflow-hidden">
            
            <!-- Image -->
            <img 
                v-if="coverImage"
                :src="coverImage" 
                :alt="product.title" 
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div v-else class="absolute inset-0 flex items-center justify-center">
                <Icon name="mdi:image-outline" size="32" class="text-gray-300 dark:text-neutral-700" />
            </div>

            <!-- Overlays: Badges (Top Left) -->
            <div v-if="product.isThrift || discountPercent > 0" class="absolute top-2 left-2 flex flex-col gap-1 z-10">
                <span v-if="product.isThrift" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider shadow-sm">
                    Thrift
                </span>
                <span v-if="discountPercent > 0" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand text-white uppercase tracking-wider shadow-sm">
                    −{{ discountPercent }}%
                </span>
            </div>

            <!-- Overlays: Like Button (Top Right) -->
            <button
                @click.stop="handleLike"
                class="absolute top-2 right-2 z-20 h-7 w-7 bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm"
                aria-label="Like Product"
            >
                <Icon 
                    :name="localLiked ? 'mdi:heart' : 'mdi:heart-outline'" 
                    size="16" 
                    :class="localLiked ? 'text-brand' : 'text-gray-600 dark:text-gray-300'" 
                />
            </button>

            <!-- Overlays: Stock Indicator (Bottom Left) -->
            <div v-if="lowestStock === 0" class="absolute bottom-2 left-2 bg-gray-900/90 backdrop-blur-md text-white text-[9px] font-semibold px-2 py-0.5 rounded-full z-10 shadow-sm">
                Sold out
            </div>
            <div v-else-if="lowestStock !== null && lowestStock <= 5" class="absolute bottom-2 left-2 bg-amber-500/95 backdrop-blur-md text-white text-[9px] font-semibold px-2 py-0.5 rounded-full z-10 shadow-sm">
                Only {{ lowestStock }} left
            </div>
        </div>

        <!-- ─── INFO BLOCK ────────────────────────────────────────────────── -->
        <div class="px-2.5 py-2.5 flex-1 flex flex-col justify-between">
            <div>
                <!-- Title -->
                <h3 class="text-xs font-semibold text-gray-900 dark:text-neutral-100 leading-snug line-clamp-1 group-hover:text-brand transition-colors">
                    {{ product.title }}
                </h3>
                <!-- Store Name -->
                <p v-if="product.seller?.store_name" class="text-[10px] text-gray-500 dark:text-neutral-400 mt-0.5 truncate flex items-center gap-1">
                    <Icon name="mdi:storefront-outline" size="10" />
                    {{ product.seller.store_name }}
                </p>
            </div>

            <!-- Price & Add to Cart -->
            <div class="flex items-end justify-between mt-2">
                <div class="flex flex-col">
                    <span v-if="discountPercent > 0" class="text-[9px] text-gray-400 dark:text-neutral-500 line-through leading-none mb-0.5">
                        {{ formatPrice(product.price, currency) }}
                    </span>
                    <span class="text-[13px] font-bold text-gray-900 dark:text-neutral-100 leading-none">
                        {{ formatPrice(discountedPrice, currency) }}
                    </span>
                </div>

                <!-- Smart Add to Cart Button -->
                <button
                    @click.stop="handleAddToCart"
                    :disabled="lowestStock === 0 || isAddingToCart"
                    class="h-7 w-7 flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
                    :class="cartAdded
                        ? 'bg-green-500 text-white'
                        : lowestStock === 0
                            ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400'
                            : 'bg-brand text-white hover:bg-[#d81b36] hover:scale-105 active:scale-95'"
                    :title="lowestStock === 0 ? 'Out of stock' : 'Add to cart'"
                >
                    <Icon v-if="isAddingToCart" name="eos-icons:loading" size="14" class="animate-spin" />
                    <Icon v-else-if="cartAdded" name="mdi:check" size="14" />
                    <Icon v-else name="mdi:cart-plus" size="14" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { IProduct } from '~~/layers/commerce/app/types/commerce.types'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { notify } from '@kyvg/vue3-notification'

// Use your central cart & product composables
const { addToCart } = useCart()
const { likeProduct, unlikeProduct } = useProduct()
const profileStore = useProfileStore()

const props = defineProps<{ product: IProduct }>()
const emit = defineEmits<{
    'open-detail': [product: IProduct]
    'quick-add': [product: IProduct]
}>()

// ── Media ────────────────────────────────────────────────────────────────────
const coverImage = computed(() => {
    const images = (props.product.media ?? []).filter(m => m.type === 'IMAGE' || m.type === 'VIDEO')
    return images[0]?.url || null
})

// ── Pricing ──────────────────────────────────────────────────────────────────
const formatPrice = (price: number, cur: string) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: cur, minimumFractionDigits: 0 }).format(price);
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

// ── Like Logic (Optimistic) ──────────────────────────────────────────────────
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
        // Rollback optimistic update on error
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

// ── Cart Logic ───────────────────────────────────────────────────────────────
const cartAdded = ref(false)
const isAddingToCart = ref(false)

const handleAddToCart = async () => {
    // If the product has multiple variants (e.g. Sizes/Colors), 
    // redirect to the detail modal so they can choose.
    if (!isSingleVariant.value || !firstVariantId.value) {
        return emit('open-detail', props.product)
    }

    // Direct Quick-Add for single variant items
    try {
        isAddingToCart.value = true
        await addToCart(firstVariantId.value, 1)
        
        cartAdded.value = true
        emit('quick-add', props.product) 
        
        setTimeout(() => { cartAdded.value = false }, 2000)
    } catch {
        // useCart usually handles the error notification natively
    } finally {
        isAddingToCart.value = false
    }
}
</script>