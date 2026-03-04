<template>
  <div
    class="bg-white dark:bg-neutral-950 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-neutral-800 cursor-pointer group transition-shadow hover:shadow-md"
    @click="$emit('open-details', product)"
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
        <Icon name="mdi:image-outline" class="w-12 h-12 text-gray-300 dark:text-neutral-600" />
      </div>

      <!-- SHOP badge -->
      <span class="absolute top-2.5 left-2.5 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-brand text-white">
        SHOP
      </span>
    </div>

    <!-- Info -->
    <div class="px-4 pt-3 pb-4">
      <h3 class="font-semibold text-sm text-gray-900 dark:text-neutral-100 truncate leading-snug">
        {{ product.title }}
      </h3>
      <p class="text-base font-bold text-brand mt-0.5">{{ formatPrice(product.price) }}</p>

      <!-- Actions -->
      <div class="flex items-center justify-between mt-3">
        <button
          @click.stop="$emit('open-comments', product)"
          class="flex items-center gap-1.5 p-1.5 -m-1.5 rounded-full text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Comments"
        >
          <Icon name="mdi:chat-outline" size="20" />
        </button>

        <button
          @click.stop="$emit('open-details', product)"
          class="text-xs font-semibold text-white bg-brand hover:bg-[#d81b36] px-4 py-1.5 rounded-full transition-colors"
        >
          View
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps<{ product: any }>()
defineEmits(['open-comments', 'open-details'])

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price / 100)
</script>
