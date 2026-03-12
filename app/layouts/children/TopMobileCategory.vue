<template>
    <div class="category-bar fixed top-14 left-0 right-0 z-10 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 transition-transform duration-300 ease-in-out">
        <div class="flex items-center gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
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
const route = useRoute()

const categories = ref<Array<{ id: number; name: string; slug: string }>>([])

onMounted(async () => {
    try {
        const res = await $fetch<{ success: boolean; data: any[] }>('/api/commerce/categories')
        categories.value = res.data || []
    } catch { /* non-fatal */ }
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
    @apply inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors shrink-0;
}

.category-pill.active {
    @apply bg-brand text-white;
}
</style>
