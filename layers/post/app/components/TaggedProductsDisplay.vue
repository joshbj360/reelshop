<template>
    <div v-if="products && products.length > 0" class="mt-3">
        <!-- Single Product (Experience/Review/COMMERCE/any single) -->
        <button
            v-if="products.length === 1"
            @click.stop="emit('select-product', products[0].id)"
            class="w-full flex items-center gap-2 p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors border border-gray-100 dark:border-neutral-700 text-left"
        >
            <div class="w-8 h-8 rounded bg-gray-200 dark:bg-neutral-700 flex items-center justify-center shrink-0 overflow-hidden">
                <img v-if="products[0].image" :src="products[0].image" :alt="products[0].title" class="w-full h-full object-cover" />
                <Icon v-else name="mdi:shopping" size="16" class="text-gray-500 dark:text-neutral-400" />
            </div>
            <span class="text-xs font-semibold text-gray-700 dark:text-neutral-200 truncate flex-1">
                {{ products[0].title }}
            </span>
            <span class="text-xs font-bold text-brand shrink-0">{{ formatPrice(products[0].price) }}</span>
            <Icon name="mdi:chevron-right" size="16" class="text-gray-400 shrink-0" />
        </button>

        <!-- Multiple Products Carousel (Inspiration / Shop this look) -->
        <div v-else-if="contentType === 'INSPIRATION'" class="space-y-2">
            <p class="text-xs font-semibold text-gray-600 dark:text-neutral-400">Shop this look:</p>
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    v-for="product in products"
                    :key="product.id"
                    @click.stop="emit('select-product', product.id)"
                    class="shrink-0 w-24 text-left"
                >
                    <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 mb-1">
                        <img
                            :src="product.image || '/placeholder.png'"
                            :alt="product.title"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <p class="text-xs text-gray-700 dark:text-neutral-300 truncate">{{ product.title }}</p>
                    <p class="text-xs font-bold text-gray-900 dark:text-neutral-100">{{ formatPrice(product.price) }}</p>
                </button>
            </div>
        </div>

        <!-- Multiple Products List (Educational / Products used) -->
        <div v-else class="space-y-2">
            <p class="text-xs font-semibold text-gray-600 dark:text-neutral-400">
                {{ contentType === 'EDUCATIONAL' ? 'Products used:' : 'Tagged products:' }}
            </p>
            <div class="space-y-1.5">
                <button
                    v-for="product in products"
                    :key="product.id"
                    @click.stop="emit('select-product', product.id)"
                    class="w-full flex items-center gap-2 p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors text-left"
                >
                    <img
                        :src="product.image || '/placeholder.png'"
                        :alt="product.title"
                        class="w-10 h-10 rounded object-cover shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-semibold text-gray-700 dark:text-neutral-200 truncate">{{ product.title }}</p>
                        <p class="text-xs text-brand font-bold">{{ formatPrice(product.price) }}</p>
                    </div>
                    <Icon name="mdi:chevron-right" size="16" class="text-gray-400 shrink-0" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    products: any[];
    contentType: string;
}>()

const emit = defineEmits<{
    'select-product': [id: number]
}>()

const formatPrice = (price: number | null | undefined) => {
    if (price == null) return ''
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price)
}
</script>

<style scoped>
.scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>