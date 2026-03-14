<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="product"
                class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
                @click.self="$emit('close')"
            >
                <!-- Modal Container -->
                <div class="bg-white dark:bg-neutral-900 rounded-t-3xl md:rounded-3xl w-full max-w-5xl lg:max-w-6xl h-[92vh] md:h-auto md:max-h-[85vh] shadow-2xl flex flex-col relative overflow-hidden">
                    
                    <!-- Mobile drag indicator for the modal itself -->
                    <div class="md:hidden absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-black/20 dark:bg-white/20 backdrop-blur-md rounded-full z-50 pointer-events-none"></div>

                    <!-- Close button (Mobile overlay, fixed to top right so it stays above the sliding content) -->
                    <button
                        @click="$emit('close')"
                        class="md:hidden absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-sm z-50"
                    >
                        <Icon name="mdi:close" size="20" class="text-white" />
                    </button>

                    <!-- ── SCROLLABLE WRAPPER ── -->
                    <!-- On mobile, this scrolls the whole page. On desktop, it splits into two columns -->
                    <div class="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden relative custom-scrollbar">
                        
                        <!-- ── Left: Image Gallery (Sticky on Mobile) ── -->
                        <div class="sticky md:relative top-0 z-0 bg-gray-100 dark:bg-neutral-800 w-full md:w-1/2 shrink-0 h-[45vh] md:h-auto md:min-h-[550px] lg:min-h-[650px] flex items-center justify-center">
                            <template v-if="mediaItems.length">
                                <img
                                    :src="mediaItems[currentIndex]?.url"
                                    :alt="product.title"
                                    class="w-full h-full object-cover"
                                />
                                
                                <!-- Navigation Controls -->
                                <button
                                    v-if="mediaItems.length > 1 && currentIndex > 0"
                                    @click="currentIndex--"
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors shadow-sm"
                                >
                                    <Icon name="mdi:chevron-left" size="24" class="text-white pr-0.5" />
                                </button>
                                <button
                                    v-if="mediaItems.length > 1 && currentIndex < mediaItems.length - 1"
                                    @click="currentIndex++"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors shadow-sm"
                                >
                                    <Icon name="mdi:chevron-right" size="24" class="text-white pl-0.5" />
                                </button>

                                <!-- Pagination Dots -->
                                <div v-if="mediaItems.length > 1" class="absolute bottom-10 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-2 bg-black/20 backdrop-blur-md rounded-full">
                                    <button
                                        v-for="(_, i) in mediaItems"
                                        :key="i"
                                        @click="currentIndex = i"
                                        class="h-1.5 rounded-full transition-all"
                                        :class="i === currentIndex ? 'bg-white w-5' : 'bg-white/50 w-1.5 hover:bg-white/80'"
                                    />
                                </div>
                            </template>
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <Icon name="mdi:image-outline" size="64" class="text-gray-300 dark:text-neutral-600" />
                            </div>
                        </div>

                        <!-- ── Right: Details (Slides over image on mobile) ── -->
                        <div class="relative z-10 bg-white dark:bg-neutral-900 flex-1 flex flex-col min-h-0 md:overflow-y-auto custom-scrollbar rounded-t-3xl md:rounded-none -mt-6 md:mt-0 pt-2 md:pt-0 shadow-[0_-10px_20px_rgba(0,0,0,0.08)] md:shadow-none">
                            
                            <!-- Sublte drag indicator for the sliding panel -->
                            <div class="w-10 h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full mx-auto mt-2 mb-1 md:hidden"></div>

                            <!-- Header -->
                            <div class="px-4 md:px-8 pt-3 md:pt-8 pb-3 shrink-0">
                                <div class="flex-1 min-w-0 pr-4">
                                    <!-- Seller chip -->
                                    <NuxtLink
                                        v-if="product.seller"
                                        :to="`/sellers/profile/${product.seller.store_slug}`"
                                        @click="$emit('close')"
                                        class="inline-flex items-center gap-2 mb-2 md:mb-3 group/seller"
                                    >
                                        <img
                                            v-if="product.seller.store_logo"
                                            :src="product.seller.store_logo"
                                            class="w-6 h-6 rounded-full object-cover border border-gray-100 dark:border-neutral-800"
                                        />
                                        <div v-else class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                                            <Icon name="mdi:store" size="12" class="text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <span class="text-[13px] font-medium text-gray-500 dark:text-neutral-400 group-hover/seller:text-brand transition-colors">
                                            {{ product.seller.store_name }}
                                        </span>
                                    </NuxtLink>

                                    <h2 class="text-xl md:text-3xl font-extrabold text-gray-900 dark:text-neutral-100 leading-snug">{{ product.title }}</h2>

                                    <div class="flex items-baseline gap-2.5 mt-2">
                                        <span class="text-2xl md:text-3xl font-black text-gray-900 dark:text-neutral-100 tracking-tight">{{ formatPrice(discountedPrice, product?.seller?.default_currency ?? 'NGN') }}</span>
                                        <span v-if="discountPercent > 0" class="text-[15px] font-medium text-gray-400 dark:text-neutral-500 line-through">{{ formatPrice(product.price, product?.seller?.default_currency ?? 'NGN') }}</span>
                                        <span v-if="discountPercent > 0" class="text-[12px] font-bold bg-brand text-white rounded-full px-2 py-0.5 shadow-sm shadow-brand/20">−{{ discountPercent }}%</span>
                                    </div>
                                </div>

                                <!-- Close (Desktop) -->
                                <button
                                    @click="$emit('close')"
                                    class="hidden md:flex absolute top-6 right-6 w-10 h-10 shrink-0 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 items-center justify-center transition-colors"
                                >
                                    <Icon name="mdi:close" size="22" class="text-gray-600 dark:text-neutral-300" />
                                </button>
                            </div>

                            <!-- Body -->
                            <div class="flex-1 px-4 md:px-8 pb-4 space-y-5 md:space-y-6">
                                
                                <!-- Badges -->
                                <div v-if="product.isThrift || product.isAccessory" class="flex flex-wrap gap-2">
                                    <span v-if="product.isThrift" class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">Pre-loved Thrift</span>
                                    <span v-if="product.isAccessory" class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">Accessory</span>
                                </div>

                                <!-- Description -->
                                <div v-if="product.description">
                                    <p
                                        class="text-[14px] md:text-[15px] text-gray-600 dark:text-neutral-300 leading-relaxed"
                                        :class="descExpanded ? '' : 'line-clamp-4 md:line-clamp-6'"
                                    >
                                        {{ product.description }}
                                    </p>
                                    <button
                                        v-if="product.description.length > 150"
                                        @click="descExpanded = !descExpanded"
                                        class="text-[13px] font-semibold text-brand mt-1 hover:underline"
                                    >
                                        {{ descExpanded ? 'Show less' : 'Read full description' }}
                                    </button>
                                </div>

                                <!-- Variant selector -->
                                <div v-if="product.variants && product.variants.length > 0">
                                    <div class="flex items-center justify-between mb-2.5">
                                        <p class="text-[13px] font-bold text-gray-900 dark:text-neutral-100 uppercase tracking-wide">Select Size / Option</p>
                                        <p v-if="selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0" class="text-[11px] font-bold text-amber-500">Only {{ selectedVariant.stock }} left!</p>
                                    </div>
                                    <div class="flex flex-wrap gap-2.5">
                                        <button
                                            v-for="variant in product.variants"
                                            :key="variant.id"
                                            @click="variant.stock > 0 && (selectedVariant = variant)"
                                            :disabled="variant.stock === 0"
                                            class="px-4 py-2.5 rounded-xl border-2 text-[13px] font-bold transition-all relative overflow-hidden"
                                            :class="[
                                                variant.stock === 0
                                                    ? 'border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50 text-gray-300 dark:text-neutral-600 cursor-not-allowed'
                                                    : selectedVariant?.id === variant.id
                                                        ? 'border-brand bg-brand/5 text-brand dark:bg-brand/10'
                                                        : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:border-brand/50 hover:bg-gray-50 dark:hover:bg-neutral-800'
                                            ]"
                                        >
                                            {{ variant.size }}
                                            <!-- Strike-through line for out of stock -->
                                            <div v-if="variant.stock === 0" class="absolute inset-0 w-full h-0.5 bg-gray-300 dark:bg-neutral-600 top-1/2 -translate-y-1/2 -rotate-12"></div>
                                        </button>
                                    </div>
                                    <p v-if="!selectedVariant" class="text-[12px] font-medium text-brand mt-2 flex items-center gap-1">
                                        <Icon name="mdi:alert-circle-outline" size="14" /> Please select an option to continue
                                    </p>
                                </div>

                                <!-- Background music player -->
                                <div v-if="bgMusic" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-800">
                                    <audio ref="audioRef" :src="bgMusic.url" loop preload="none" @ended="bgMusicPlaying = false" />
                                    <button
                                        @click="toggleBgMusic"
                                        class="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shrink-0 hover:bg-[#d81b36] transition-colors shadow-sm"
                                    >
                                        <Icon :name="bgMusicPlaying ? 'mdi:pause' : 'mdi:play'" size="20" />
                                    </button>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-[12px] font-bold text-gray-900 dark:text-neutral-100 truncate">Background Audio</p>
                                        <div class="flex items-center gap-1 mt-0.5">
                                            <Icon name="mdi:music-note" size="12" class="text-brand" />
                                            <span class="text-[11px] font-medium text-gray-500 dark:text-neutral-400">{{ bgMusicPlaying ? 'Playing now...' : 'Tap to listen' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div> <!-- End of Scrollable Wrapper -->

                    <!-- ── Footer Actions (Sticky at bottom always) ── -->
                    <div class="relative z-20 px-4 md:px-8 pt-4 pb-6 md:pb-8 border-t border-gray-100 dark:border-neutral-800 shrink-0 bg-white dark:bg-neutral-900 space-y-3">
                        
                        <!-- Quantity and Add to Cart Row -->
                        <div class="flex items-center gap-2 md:gap-3">
                            <!-- Quantity -->
                            <div v-if="canAddToCart || selectedVariant" class="flex items-center border-2 border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden h-[50px] md:h-[52px] bg-white dark:bg-neutral-900 shrink-0">
                                <button @click="qty = Math.max(1, qty - 1)" class="w-10 md:w-11 h-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-400">
                                    <Icon name="mdi:minus" size="16" />
                                </button>
                                <span class="w-8 text-center text-[14px] font-extrabold text-gray-900 dark:text-neutral-100">{{ qty }}</span>
                                <button @click="qty = Math.min(maxQty, qty + 1)" class="w-10 md:w-11 h-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-400">
                                    <Icon name="mdi:plus" size="16" />
                                </button>
                            </div>

                            <!-- Add to Cart Button -->
                            <button
                                @click="handleAddToCart"
                                :disabled="!canAddToCart || isAdding"
                                class="flex-1 h-[50px] md:h-[52px] rounded-xl text-[14px] md:text-[15px] font-bold transition-all flex items-center justify-center gap-2"
                                :class="cartAdded
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : canAddToCart
                                        ? 'bg-brand text-white hover:bg-[#d81b36] shadow-lg shadow-brand/20 active:scale-[0.98]'
                                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-400 cursor-not-allowed'"
                            >
                                <template v-if="cartAdded">
                                    <Icon name="mdi:check-circle" size="20" /> Added!
                                </template>
                                <template v-else-if="isAdding">
                                    <Icon name="eos-icons:loading" size="20" class="animate-spin" /> Adding…
                                </template>
                                <template v-else-if="!product.variants?.length">
                                    Not available
                                </template>
                                <template v-else-if="isSoldOut">
                                    Sold out
                                </template>
                                <template v-else>
                                    <Icon name="mdi:cart-plus" size="20" /> Add to Cart
                                </template>
                            </button>
                        </div>

                        <!-- Create content buttons (logged-in users) -->
                        <ClientOnly>
                            <div v-if="profileStore.isLoggedIn" class="flex gap-2 md:gap-3 pt-2">
                                <button
                                    @click="showPostModal = true"
                                    class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 text-[12px] font-bold text-gray-600 dark:text-neutral-400 hover:border-brand hover:text-brand hover:bg-brand/5 transition-all"
                                >
                                    <Icon name="mdi:camera-plus-outline" size="18" />
                                    Create Post
                                </button>
                                <button
                                    @click="showStoryModal = true"
                                    class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 text-[12px] font-bold text-gray-600 dark:text-neutral-400 hover:border-brand hover:text-brand hover:bg-brand/5 transition-all"
                                >
                                    <Icon name="mdi:image-plus-outline" size="18" />
                                    Add to Story
                                </button>
                            </div>
                        </ClientOnly>
                        
                        <!-- Stats -->
                        <div v-if="product._count" class="flex items-center justify-center gap-6 text-[12px] font-medium text-gray-400 dark:text-neutral-500 pt-1">
                            <span class="flex items-center gap-1.5"><Icon name="mdi:heart" size="14" class="text-brand/70" /> {{ product._count.likes }}</span>
                            <button @click="$emit('open-comments', product)" class="flex items-center gap-1.5 hover:text-blue-400 transition-colors"><Icon name="mdi:comment-processing" size="14" class="text-blue-400/70" /> {{ product._count.comments }}</button>
                            <span class="flex items-center gap-1.5"><Icon name="mdi:share-variant" size="14" class="text-green-400/70" /> {{ product._count.shares }}</span>
                        </div>
                    </div>

                </div>
            </div>
        </Transition>

        <!-- Post creation modal (product pre-tagged) -->
        <PostUploadModal
            v-if="showPostModal"
            :is-open="showPostModal"
            :initial-tagged-product="product ? { id: product.id, name: product.title } : null"
            @close="showPostModal = false"
            @posted="showPostModal = false"
        />

        <!-- Story creation modal (product linked) -->
        <StoryUploadModal
            v-if="showStoryModal"
            :is-open="showStoryModal"
            :initial-product-id="product?.id ?? null"
            @close="showStoryModal = false"
            @posted="showStoryModal = false"
        />
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { IProduct, IProductVariant } from '~~/layers/commerce/app/types/commerce.types'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import PostUploadModal from '~~/layers/post/app/components/modals/PostUploadModal.vue'
import StoryUploadModal from '~/components/modals/StoryUploadModal.vue'

// Assume you have a cart composable
const { addToCart } = useCart()

const props = defineProps<{ product: IProduct | null }>()
const emit = defineEmits(['close', 'open-comments'])

const profileStore = useProfileStore()

const currentIndex = ref(0)
const selectedVariant = ref<IProductVariant | null>(null)
const qty = ref(1)
const isAdding = ref(false)
const cartAdded = ref(false)
const descExpanded = ref(false)
const showPostModal = ref(false)
const showStoryModal = ref(false)
const bgMusicPlaying = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

watch(() => props.product?.id, () => {
    currentIndex.value = 0
    selectedVariant.value = null
    qty.value = 1
    cartAdded.value = false
    descExpanded.value = false
    showPostModal.value = false
    showStoryModal.value = false
    bgMusicPlaying.value = false
    if (audioRef.value) { audioRef.value.pause(); audioRef.value.currentTime = 0 }
})

const mediaItems = computed(() => (props.product?.media ?? []).filter((m: any) => !m.isBgMusic))
const bgMusic = computed(() => (props.product?.media ?? []).find((m: any) => m.isBgMusic) ?? null)

const toggleBgMusic = () => {
    if (!audioRef.value) return
    if (bgMusicPlaying.value) {
        audioRef.value.pause()
        bgMusicPlaying.value = false
    } else {
        audioRef.value.play()
        bgMusicPlaying.value = true
    }
}

// Utility function for formatting price
const formatPrice = (price: number, cur: string) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: cur, minimumFractionDigits: 0 }).format(price);
}

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
    if (!variants?.length) return false  // no variants = not purchasable
    return !!selectedVariant.value
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
    } catch {
        // useCart handles error notification
    } finally {
        isAdding.value = false
    }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active > div, .modal-leave-active > div { transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from > div, .modal-leave-to > div { transform: translateY(40px) scale(0.96); }

/* Custom Scrollbar for the details section */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 10px;
}
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #404040;
}
</style>