<template>
    <div
        class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden cursor-pointer group transition-shadow hover:shadow-md"
        @click="$emit('open-detail', product)"
    >
        <!-- ─── No images ─────────────────────────────────────────────────── -->
        <div v-if="!imageItems.length" class="relative aspect-square bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
            <Icon name="mdi:image-outline" size="40" class="text-gray-300 dark:text-neutral-600" />
            <div class="absolute top-2 left-2 flex flex-col gap-1">
                <span v-if="product.isThrift" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase">Thrift</span>
                <span v-if="discountPercent > 0" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand text-white uppercase">−{{ discountPercent }}%</span>
            </div>
            <span v-if="hasBgMusic" class="absolute top-2 right-2 bg-black/50 rounded-full px-1.5 py-0.5 text-[11px] leading-none">🎵</span>
        </div>

        <!-- ─── Single image — hover carousel ───────────────────────────── -->
        <div
            v-else-if="imageItems.length === 1"
            class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-800"
            @mouseenter="startCycle"
            @mouseleave="stopCycle"
        >
            <img :src="imageItems[0]!.url" :alt="product.title" class="w-full h-full object-cover" />
            <div class="absolute top-2 left-2 flex flex-col gap-1">
                <span v-if="product.isThrift" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase">Thrift</span>
                <span v-if="discountPercent > 0" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand text-white uppercase">−{{ discountPercent }}%</span>
            </div>
            <span v-if="hasBgMusic" class="absolute top-2 right-2 bg-black/50 rounded-full px-1.5 py-0.5 text-[11px] leading-none">🎵</span>
            <div v-if="lowestStock === 0" class="absolute bottom-2 left-2 bg-gray-800/80 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">Sold out</div>
            <div v-else-if="lowestStock !== null && lowestStock <= 5" class="absolute bottom-2 left-2 bg-amber-500/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">Only {{ lowestStock }} left</div>
        </div>

        <!-- ─── Two images — side by side ───────────────────────────────── -->
        <div v-else-if="imageItems.length === 2" class="relative grid grid-cols-2 gap-0.5">
            <div v-for="item in imageItems" :key="item.id" class="aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-900">
                <img :src="item.url" :alt="product.title" class="w-full h-full object-cover" />
            </div>
            <div class="absolute top-2 left-2 flex flex-col gap-1">
                <span v-if="product.isThrift" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase">Thrift</span>
                <span v-if="discountPercent > 0" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand text-white uppercase">−{{ discountPercent }}%</span>
            </div>
            <span v-if="hasBgMusic" class="absolute top-2 right-2 bg-black/50 rounded-full px-1.5 py-0.5 text-[11px] leading-none">🎵</span>
        </div>

        <!-- ─── Three or more — 3-collage with +N overlay ───────────────── -->
        <div v-else class="relative grid grid-cols-2 gap-0.5">
            <!-- Tall left -->
            <div class="overflow-hidden bg-gray-100 dark:bg-neutral-900" style="aspect-ratio: 4/5;">
                <img :src="imageItems[0]!.url" :alt="product.title" class="w-full h-full object-cover" />
            </div>
            <!-- Two stacked right -->
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
            <!-- Overlays on the outer container -->
            <div class="absolute top-2 left-2 flex flex-col gap-1">
                <span v-if="product.isThrift" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase">Thrift</span>
                <span v-if="discountPercent > 0" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand text-white uppercase">−{{ discountPercent }}%</span>
            </div>
            <span v-if="hasBgMusic" class="absolute top-2 right-2 bg-black/50 rounded-full px-1.5 py-0.5 text-[11px] leading-none">🎵</span>
            <div v-if="lowestStock === 0" class="absolute bottom-2 left-2 bg-gray-800/80 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">Sold out</div>
            <div v-else-if="lowestStock !== null && lowestStock <= 5" class="absolute bottom-2 left-2 bg-amber-500/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">Only {{ lowestStock }} left</div>
        </div>

        <!-- ─── Info ─────────────────────────────────────────────────────── -->
        <div class="px-3 pt-2.5 pb-3">
            <h3 class="text-[13px] font-semibold text-gray-900 dark:text-neutral-100 leading-snug line-clamp-2">{{ product.title }}</h3>
            <p v-if="product.seller?.store_name" class="text-[11px] text-gray-400 dark:text-neutral-500 mt-0.5 truncate">{{ product.seller.store_name }}</p>

            <div class="flex items-baseline gap-1.5 mt-1.5">
                <span class="text-[14px] font-bold text-gray-900 dark:text-neutral-100">{{ formatPrice(discountedPrice, currency) }}</span>
                <span v-if="discountPercent > 0" class="text-[11px] text-gray-400 dark:text-neutral-500 line-through">{{ formatPrice(product.price, currency) }}</span>
            </div>

            <div class="flex items-center justify-between mt-2.5">
                <span class="flex items-center gap-1 text-[11px] text-gray-400 dark:text-neutral-500">
                    <Icon name="mdi:heart-outline" size="14" />
                    {{ product._count?.likes ?? 0 }}
                </span>
                <button
                    v-if="isSingleVariant"
                    @click.stop="$emit('quick-add', product)"
                    :disabled="lowestStock === 0"
                    class="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    :class="lowestStock === 0 ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400' : 'bg-brand text-white hover:bg-[#d81b36]'"
                >
                    {{ lowestStock === 0 ? 'Sold out' : 'Add' }}
                </button>
                <button
                    v-else
                    @click.stop="$emit('open-detail', product)"
                    class="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                >
                    View
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~~/layers/commerce/types/commerce.types'

const props = defineProps<{ product: IProduct }>()
defineEmits<{
    'open-detail': [product: IProduct]
    'quick-add': [product: IProduct]
}>()

const imageItems = computed(() =>
    (props.product.media ?? []).filter(m => !m.isBgMusic && (m.type === 'IMAGE' || m.type === 'VIDEO'))
)

const hasBgMusic = computed(() =>
    (props.product.media ?? []).some(m => m.isBgMusic || m.type === 'AUDIO')
)

const currency = computed(() => props.product.seller?.default_currency ?? 'NGN')
const discountPercent = computed(() => props.product.discount ?? 0)

const discountedPrice = computed(() =>
    discountPercent.value > 0
        ? Math.round(props.product.price * (1 - discountPercent.value / 100))
        : props.product.price
)

const lowestStock = computed(() => {
    const v = props.product.variants
    if (!v?.length) return null
    return Math.min(...v.map(x => x.stock))
})

const isSingleVariant = computed(() => (props.product.variants?.length ?? 0) <= 1)

// Carousel (single-image hover only)
const activeIndex = ref(0)
let cycleTimer: ReturnType<typeof setInterval> | null = null

const startCycle = () => {
    if (imageItems.value.length <= 1) return
    cycleTimer = setInterval(() => {
        activeIndex.value = (activeIndex.value + 1) % imageItems.value.length
    }, 1200)
}

const stopCycle = () => {
    if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null }
    activeIndex.value = 0
}

onUnmounted(stopCycle)
</script>
