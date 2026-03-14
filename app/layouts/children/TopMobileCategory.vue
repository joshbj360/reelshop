<template>
  <div
    class="category-bar fixed left-0 right-0 top-14 z-10 border-b border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-900"
  >
    <div
      class="scrollbar-hide flex items-center gap-2 overflow-x-auto px-4 py-2"
    >
      <NuxtLink
        to="/"
        class="category-pill"
        :class="{ active: route.path === '/' && !route.params.slug }"
      >
        All
      </NuxtLink>

      <NuxtLink
        to="/thrift"
        class="category-pill"
        :class="{ active: route.path === '/thrift' }"
      >
        <Icon name="mdi:hanger" size="14" class="mr-1" />
        Thrift
      </NuxtLink>

      <NuxtLink
        v-for="cat in categories"
        :key="cat.id"
        :to="`/category/${cat.slug}`"
        class="category-pill"
        :class="{ active: route.params.slug === cat.slug }"
      >
        {{ cat.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductApi } from '~~/layers/commerce/app/services/product.api'

const route = useRoute()
const api = useProductApi()

const categories = ref<Array<{ id: number; name: string; slug: string }>>([])

onMounted(async () => {
  try {
    const res: any = await api.getCategories()
    categories.value = res?.data || []
  } catch {
    /* non-fatal */
  }
})
</script>

<style scoped>
.category-bar {
  top: calc(3.5rem + env(safe-area-inset-top, 0px));
}

/* Hide on desktop */
@media (min-width: 768px) {
  .category-bar {
    display: none;
  }
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.category-pill {
  @apply inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700;
}

.category-pill.active {
  @apply bg-brand text-white;
}
</style>
