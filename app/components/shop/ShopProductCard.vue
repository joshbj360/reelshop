<template>
    <div
        class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden cursor-pointer group transition-shadow hover:shadow-md"
        @click="$emit('open-detail', product)"
    >
        <!-- Image -->
        <div class="relative aspect-square bg-gray-100 dark:bg-neutral-800 overflow-hidden">
            <img
                v-if="product.media?.length"
                :src="product.media[0].url"
                :alt="product.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="mdi:image-outline" size="40" class="text-gray-300 dark:text-neutral-600" />
            </div>

            <!-- Badges -->
            <div class="absolute top-2 left-2 flex flex-col gap-1">
                <span v-if="product.isThrift" class="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase">
                    Thrift
                </span>
                <span v-if="discountPercent > 0" class="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand text-white uppercase">
                    −{{ discountPercent }}%
                </span>
            </div>

            <!-- Multi-image indicator -->
            <div v-if="product.media && product.media.length > 1" class="absolute top-2 right-2 flex items-center gap-0.5 bg-black/50 rounded-full px-1.5 py-0.5">
                <Icon name="mdi:image-multiple-outline" size="10" class="text-white" />
                <span class="text-[9px] text-white font-medium">{{ product.media.length }}</span>
            </div>

            <!-- Low stock pill -->
            <div v-if="lowestStock !== null && lowestStock <= 5 && lowestStock > 0" class="absolute bottom-2 left-2 bg-amber-500/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                Only {{ lowestStock }} left
            </div>
            <div v-else-if="lowestStock === 0" class="absolute bottom-2 left-2 bg-gray-800/80 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                Sold out
            </div>
        </div>

        <!-- Info -->
        <div class="px-3 pt-2.5 pb-3">
            <!-- Title -->
            <h3 class="text-[13px] font-semibold text-gray-900 dark:text-neutral-100 leading-snug line-clamp-2">
                {{ product.title }}
            </h3>

            <!-- Seller -->
            <p v-if="product.seller?.store_name" class="text-[11px] text-gray-400 dark:text-neutral-500 mt-0.5 truncate">
                {{ product.seller.store_name }}
            </p>

            <!-- Price -->
            <div class="flex items-baseline gap-1.5 mt-1.5">
                <span class="text-[14px] font-bold text-gray-900 dark:text-neutral-100">{{ formatPrice(discountedPrice, currency) }}</span>
                <span v-if="discountPercent > 0" class="text-[11px] text-gray-400 dark:text-neutral-500 line-through">{{ formatPrice(product.price, currency) }}</span>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between mt-2.5">
                <!-- Likes -->
                <span class="flex items-center gap-1 text-[11px] text-gray-400 dark:text-neutral-500">
                    <Icon name="mdi:heart-outline" size="14" />
                    {{ product._count?.likes ?? 0 }}
                </span>

                <!-- CTA -->
                <button
                    v-if="isSingleVariant"
                    @click.stop="$emit('quick-add', product)"
                    :disabled="lowestStock === 0"
                    class="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    :class="lowestStock === 0
                        ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400'
                        : 'bg-brand text-white hover:bg-[#d81b36]'"
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

const currency = computed(() => props.product.seller?.default_currency ?? 'NGN')

const discountPercent = computed(() => props.product.discount ?? 0)

const discountedPrice = computed(() => {
    if (discountPercent.value > 0) {
        return Math.round(props.product.price * (1 - discountPercent.value / 100))
    }
    return props.product.price
})

const lowestStock = computed(() => {
    const variants = props.product.variants
    if (!variants?.length) return null
    return Math.min(...variants.map(v => v.stock))
})

const isSingleVariant = computed(() => (props.product.variants?.length ?? 0) <= 1)
</script>
