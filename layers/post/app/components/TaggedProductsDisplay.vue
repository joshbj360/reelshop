<template>
  <div v-if="products && products.length > 0" class="mt-3">
    <!-- Single Product (Experience/Review/COMMERCE/any single) -->
    <button
      v-if="products.length === 1"
      @click.stop="emit('select-product', products[0].id)"
      class="flex w-full items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
    >
      <div
        class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-200 dark:bg-neutral-700"
      >
        <img
          v-if="products[0].image"
          :src="products[0].image"
          :alt="products[0].title"
          class="h-full w-full object-cover"
        />
        <Icon
          v-else
          name="mdi:shopping"
          size="16"
          class="text-gray-500 dark:text-neutral-400"
        />
      </div>
      <span
        class="flex-1 truncate text-xs font-semibold text-gray-700 dark:text-neutral-200"
      >
        {{ products[0].title }}
      </span>
      <span class="shrink-0 text-xs font-bold text-brand">{{
        formatPrice(products[0].price)
      }}</span>
      <Icon name="mdi:chevron-right" size="16" class="shrink-0 text-gray-400" />
    </button>

    <!-- Multiple Products Carousel (Inspiration / Shop this look) -->
    <div v-else-if="contentType === 'INSPIRATION'" class="space-y-2">
      <p class="text-xs font-semibold text-gray-600 dark:text-neutral-400">
        Shop this look:
      </p>
      <div class="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="product in products"
          :key="product.id"
          @click.stop="emit('select-product', product.id)"
          class="w-24 shrink-0 text-left"
        >
          <div
            class="mb-1 aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-neutral-800"
          >
            <img
              :src="product.image || '/placeholder.png'"
              :alt="product.title"
              class="h-full w-full object-cover"
            />
          </div>
          <p class="truncate text-xs text-gray-700 dark:text-neutral-300">
            {{ product.title }}
          </p>
          <p class="text-xs font-bold text-gray-900 dark:text-neutral-100">
            {{ formatPrice(product.price) }}
          </p>
        </button>
      </div>
    </div>

    <!-- Multiple Products List (Educational / Products used) -->
    <div v-else class="space-y-2">
      <p class="text-xs font-semibold text-gray-600 dark:text-neutral-400">
        {{
          contentType === 'EDUCATIONAL' ? 'Products used:' : 'Tagged products:'
        }}
      </p>
      <div class="space-y-1.5">
        <button
          v-for="product in products"
          :key="product.id"
          @click.stop="emit('select-product', product.id)"
          class="flex w-full items-center gap-2 rounded-lg bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
        >
          <img
            :src="product.image || '/placeholder.png'"
            :alt="product.title"
            class="h-10 w-10 shrink-0 rounded object-cover"
          />
          <div class="min-w-0 flex-1">
            <p
              class="truncate text-xs font-semibold text-gray-700 dark:text-neutral-200"
            >
              {{ product.title }}
            </p>
            <p class="text-xs font-bold text-brand">
              {{ formatPrice(product.price) }}
            </p>
          </div>
          <Icon
            name="mdi:chevron-right"
            size="16"
            class="shrink-0 text-gray-400"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  products: any[]
  contentType: string
}>()

const emit = defineEmits<{
  'select-product': [id: number]
}>()

const formatPrice = (price: number | null | undefined) => {
  if (price == null) return ''
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(price)
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
