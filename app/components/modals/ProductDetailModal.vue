<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="product"
                class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
                @click.self="$emit('close')"
            >
                <div class="bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[88vh] overflow-hidden shadow-2xl flex flex-col sm:flex-row">

                    <!-- ── Left: Image Gallery ── -->
                    <div class="relative bg-gray-100 dark:bg-neutral-800 sm:w-[48%] shrink-0 aspect-square sm:aspect-auto sm:min-h-[400px]">
                        <template v-if="mediaItems.length">
                            <img
                                :src="mediaItems[currentIndex].url"
                                :alt="product.title"
                                class="w-full h-full object-cover"
                            />
                            <button
                                v-if="mediaItems.length > 1 && currentIndex > 0"
                                @click="currentIndex--"
                                class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                            >
                                <Icon name="mdi:chevron-left" size="20" class="text-white" />
                            </button>
                            <button
                                v-if="mediaItems.length > 1 && currentIndex < mediaItems.length - 1"
                                @click="currentIndex++"
                                class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                            >
                                <Icon name="mdi:chevron-right" size="20" class="text-white" />
                            </button>
                            <div v-if="mediaItems.length > 1" class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                <button
                                    v-for="(_, i) in mediaItems"
                                    :key="i"
                                    @click="currentIndex = i"
                                    class="h-1.5 rounded-full transition-all"
                                    :class="i === currentIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'"
                                />
                            </div>
                        </template>
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <Icon name="mdi:image-outline" size="48" class="text-gray-300 dark:text-neutral-600" />
                        </div>

                        <!-- Close button (mobile) -->
                        <button
                            @click="$emit('close')"
                            class="sm:hidden absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                        >
                            <Icon name="mdi:close" size="18" class="text-white" />
                        </button>
                    </div>

                    <!-- ── Right: Details ── -->
                    <div class="flex-1 overflow-y-auto flex flex-col min-h-0">
                        <!-- Header -->
                        <div class="flex items-start justify-between px-5 pt-5 pb-2 shrink-0">
                            <div class="flex-1 min-w-0 pr-3">
                                <!-- Seller chip -->
                                <NuxtLink
                                    v-if="product.seller"
                                    :to="`/sellers/profile/${product.seller.store_slug}`"
                                    @click="$emit('close')"
                                    class="inline-flex items-center gap-1.5 mb-2 group/seller"
                                >
                                    <img
                                        v-if="product.seller.store_logo"
                                        :src="product.seller.store_logo"
                                        class="w-5 h-5 rounded-full object-cover"
                                    />
                                    <div v-else class="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                                        <Icon name="mdi:store" size="11" class="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span class="text-[12px] text-gray-500 dark:text-neutral-400 group-hover/seller:text-brand transition-colors">
                                        {{ product.seller.store_name }}
                                    </span>
                                </NuxtLink>

                                <h2 class="text-[17px] font-bold text-gray-900 dark:text-neutral-100 leading-snug">{{ product.title }}</h2>

                                <div class="flex items-baseline gap-2 mt-1.5">
                                    <span class="text-[20px] font-bold text-gray-900 dark:text-neutral-100">{{ formatPrice(discountedPrice, product?.seller?.default_currency ?? 'NGN') }}</span>
                                    <span v-if="discountPercent > 0" class="text-[13px] text-gray-400 dark:text-neutral-500 line-through">{{ formatPrice(product.price, product?.seller?.default_currency ?? 'NGN') }}</span>
                                    <span v-if="discountPercent > 0" class="text-[11px] font-bold bg-brand/10 text-brand rounded-full px-1.5 py-0.5">−{{ discountPercent }}%</span>
                                </div>
                            </div>

                            <!-- Close (desktop) -->
                            <button
                                @click="$emit('close')"
                                class="hidden sm:flex w-8 h-8 shrink-0 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 items-center justify-center transition-colors"
                            >
                                <Icon name="mdi:close" size="20" class="text-gray-500 dark:text-neutral-400" />
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="flex-1 overflow-y-auto px-5 pb-2 space-y-4">
                            <!-- Description -->
                            <p v-if="product.description" class="text-[13px] text-gray-600 dark:text-neutral-400 leading-relaxed">
                                {{ product.description }}
                            </p>

                            <!-- Badges -->
                            <div v-if="product.isThrift || product.isAccessory" class="flex flex-wrap gap-1.5">
                                <span v-if="product.isThrift" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Pre-loved</span>
                                <span v-if="product.isAccessory" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">Accessory</span>
                            </div>

                            <!-- Variant selector -->
                            <div v-if="product.variants && product.variants.length > 0">
                                <p class="text-[12px] font-semibold text-gray-700 dark:text-neutral-300 mb-2">Select size</p>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        v-for="variant in product.variants"
                                        :key="variant.id"
                                        @click="variant.stock > 0 && (selectedVariant = variant)"
                                        :disabled="variant.stock === 0"
                                        class="px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all"
                                        :class="[
                                            variant.stock === 0
                                                ? 'border-gray-200 dark:border-neutral-700 text-gray-300 dark:text-neutral-600 cursor-not-allowed line-through'
                                                : selectedVariant?.id === variant.id
                                                    ? 'border-brand bg-brand text-white'
                                                    : 'border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:border-brand hover:text-brand'
                                        ]"
                                    >
                                        {{ variant.size }}
                                        <span v-if="variant.stock > 0 && variant.stock <= 5" class="ml-1 text-[10px] opacity-60">({{ variant.stock }})</span>
                                    </button>
                                </div>
                                <p v-if="!selectedVariant" class="text-[11px] text-amber-500 mt-1.5">Please select a size to continue</p>
                            </div>

                            <!-- Quantity -->
                            <div v-if="canAddToCart || selectedVariant" class="flex items-center gap-3">
                                <p class="text-[12px] font-semibold text-gray-700 dark:text-neutral-300">Qty</p>
                                <div class="flex items-center border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden">
                                    <button @click="qty = Math.max(1, qty - 1)" class="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-400">
                                        <Icon name="mdi:minus" size="14" />
                                    </button>
                                    <span class="w-9 text-center text-[13px] font-bold text-gray-900 dark:text-neutral-100">{{ qty }}</span>
                                    <button @click="qty = Math.min(maxQty, qty + 1)" class="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-400">
                                        <Icon name="mdi:plus" size="14" />
                                    </button>
                                </div>
                            </div>

                            <!-- Stats -->
                            <div v-if="product._count" class="flex items-center gap-4 text-[12px] text-gray-400 dark:text-neutral-500 pt-3 border-t border-gray-100 dark:border-neutral-800">
                                <span class="flex items-center gap-1"><Icon name="mdi:heart-outline" size="14" />{{ product._count.likes }}</span>
                                <span class="flex items-center gap-1"><Icon name="mdi:comment-outline" size="14" />{{ product._count.comments }}</span>
                                <span class="flex items-center gap-1"><Icon name="mdi:share-outline" size="14" />{{ product._count.shares }}</span>
                            </div>
                        </div>

                        <!-- Footer: Add to Cart -->
                        <div class="px-5 pt-3 pb-5 border-t border-gray-100 dark:border-neutral-800 shrink-0">
                            <button
                                @click="handleAddToCart"
                                :disabled="!canAddToCart || isAdding"
                                class="w-full py-3.5 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                :class="cartAdded
                                    ? 'bg-emerald-500 text-white'
                                    : canAddToCart
                                        ? 'bg-brand text-white hover:bg-[#d81b36]'
                                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-400 cursor-not-allowed'"
                            >
                                <template v-if="cartAdded">
                                    <Icon name="mdi:check-circle" size="18" />
                                    Added to cart!
                                </template>
                                <template v-else-if="isAdding">
                                    <Icon name="eos-icons:loading" size="18" class="animate-spin" />
                                    Adding…
                                </template>
                                <template v-else-if="isSoldOut">
                                    Sold out
                                </template>
                                <template v-else>
                                    <Icon name="mdi:cart-plus" size="18" />
                                    Add to Cart
                                </template>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'
import type { IProduct, IProductVariant } from '~~/layers/commerce/types/commerce.types'

const props = defineProps<{ product: IProduct | null }>()
defineEmits(['close'])

const { addToCart } = useCart()

const currentIndex = ref(0)
const selectedVariant = ref<IProductVariant | null>(null)
const qty = ref(1)
const isAdding = ref(false)
const cartAdded = ref(false)

watch(() => props.product?.id, () => {
    currentIndex.value = 0
    selectedVariant.value = null
    qty.value = 1
    cartAdded.value = false
})

const mediaItems = computed(() => props.product?.media ?? [])
const discountPercent = computed(() => props.product?.discount ?? 0)
const discountedPrice = computed(() => {
    if (!props.product) return 0
    if (discountPercent.value > 0) return Math.round(props.product.price * (1 - discountPercent.value / 100))
    return props.product.price
})

const maxQty = computed(() => selectedVariant.value ? Math.min(selectedVariant.value.stock, 99) : 99)

const isSoldOut = computed(() => {
    const variants = props.product?.variants
    if (!variants?.length) return false
    return variants.every(v => v.stock === 0)
})

const canAddToCart = computed(() => {
    if (isSoldOut.value) return false
    const variants = props.product?.variants
    if (variants?.length) return !!selectedVariant.value
    return true
})

const handleAddToCart = async () => {
    if (!canAddToCart.value || !props.product) return
    const variantId = selectedVariant.value?.id
    if (!variantId) return

    isAdding.value = true
    try {
        await addToCart(variantId, qty.value)
        cartAdded.value = true
        setTimeout(() => { cartAdded.value = false }, 1800)
    } catch (e: any) {
        notify({ type: 'error', text: e.message || 'Failed to add to cart' })
    } finally {
        isAdding.value = false
    }
}


</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active > div, .modal-leave-active > div { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from > div, .modal-leave-to > div { transform: translateY(30px) scale(0.97); }
</style>
