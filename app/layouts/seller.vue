<template>
    <div class="flex min-h-screen bg-gray-50 dark:bg-neutral-950">

        <!-- ── Desktop Sidebar (xl+) ─────────────────────────────────── -->
        <aside class="hidden xl:flex w-60 shrink-0 flex-col h-screen sticky top-0 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 overflow-y-auto">

            <!-- Logo / Back to Styli -->
            <div class="p-4 border-b border-gray-100 dark:border-neutral-800">
                <NuxtLink to="/" class="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <div class="w-9 h-9 shrink-0 bg-gradient-to-br from-[#f02c56] to-purple-600 rounded-full flex items-center justify-center">
                        <Icon name="mdi:hanger" class="w-5 h-5 text-white" />
                    </div>
                    <span class="text-sm font-bold text-gray-500 dark:text-neutral-400">← Back to Styli</span>
                </NuxtLink>
            </div>

            <!-- Store Switcher -->
            <div class="px-3 py-2.5 border-b border-gray-100 dark:border-neutral-800">
                <StoreSwitcher />
            </div>

            <!-- Nav Links -->
            <nav class="flex-1 flex flex-col px-2 py-3 space-y-0.5">
                <template v-if="storeSlug">
                    <NuxtLink :to="`/seller/${storeSlug}/dashboard`" class="seller-nav-link" active-class="active">
                        <Icon name="mdi:view-dashboard-outline" size="22" />
                        <span>Overview</span>
                    </NuxtLink>
                    <NuxtLink :to="`/seller/${storeSlug}/products`" class="seller-nav-link" active-class="active">
                        <Icon name="mdi:package-variant-closed" size="22" />
                        <span>Products</span>
                    </NuxtLink>
                    <button disabled class="seller-nav-link opacity-40 cursor-not-allowed">
                        <Icon name="mdi:truck-outline" size="22" />
                        <span>Orders</span>
                        <span class="ml-auto text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-400 rounded-full">Soon</span>
                    </button>
                    <NuxtLink :to="`/seller/${storeSlug}/settings`" class="seller-nav-link" active-class="active">
                        <Icon name="mdi:cog-outline" size="22" />
                        <span>Settings</span>
                    </NuxtLink>
                    <div class="pt-3 pb-1 px-2">
                        <span class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-600">General</span>
                    </div>
                    <div class="border-t border-gray-100 dark:border-neutral-800 my-1" />
                </template>
                <NuxtLink to="/seller/dashboard" class="seller-nav-link" exact-active-class="active">
                    <Icon name="mdi:store-outline" size="22" />
                    <span>My Stores</span>
                </NuxtLink>
                <NuxtLink to="/sellers/create" class="seller-nav-link">
                    <Icon name="mdi:plus-circle-outline" size="22" />
                    <span>New Store</span>
                </NuxtLink>
            </nav>
        </aside>

        <!-- ── Mobile / Tablet wrapper ───────────────────────────────── -->
        <div class="flex flex-col flex-1 min-w-0">

            <!-- Mobile top bar (< xl) -->
            <header class="xl:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
                <NuxtLink to="/" class="flex items-center gap-1.5 text-gray-500 dark:text-neutral-400 hover:text-gray-700 shrink-0">
                    <Icon name="mdi:arrow-left" size="20" />
                    <div class="w-7 h-7 bg-gradient-to-br from-[#f02c56] to-purple-600 rounded-full flex items-center justify-center">
                        <Icon name="mdi:hanger" class="w-4 h-4 text-white" />
                    </div>
                </NuxtLink>
                <div class="flex-1 min-w-0">
                    <StoreSwitcher />
                </div>
            </header>

            <!-- Main content -->
            <main class="flex-1 overflow-y-auto pb-16 xl:pb-0">
                <slot />
            </main>

            <!-- Mobile bottom tab bar (< xl) -->
            <nav v-if="storeSlug" class="xl:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-around px-2">
                <NuxtLink
                    :to="`/seller/${storeSlug}/dashboard`"
                    class="mobile-tab"
                    active-class="mobile-tab-active"
                >
                    <Icon name="mdi:view-dashboard-outline" size="24" />
                    <span>Overview</span>
                </NuxtLink>
                <NuxtLink
                    :to="`/seller/${storeSlug}/products`"
                    class="mobile-tab"
                    active-class="mobile-tab-active"
                >
                    <Icon name="mdi:package-variant-closed" size="24" />
                    <span>Products</span>
                </NuxtLink>
                <button disabled class="mobile-tab opacity-40 cursor-not-allowed">
                    <Icon name="mdi:truck-outline" size="24" />
                    <span>Orders</span>
                </button>
                <NuxtLink
                    :to="`/seller/${storeSlug}/settings`"
                    class="mobile-tab"
                    active-class="mobile-tab-active"
                >
                    <Icon name="mdi:cog-outline" size="24" />
                    <span>Settings</span>
                </NuxtLink>
            </nav>

            <!-- Mobile bottom tab bar — no store context -->
            <nav v-else class="xl:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-around px-2">
                <NuxtLink to="/seller/dashboard" class="mobile-tab" active-class="mobile-tab-active">
                    <Icon name="mdi:store-outline" size="24" />
                    <span>My Stores</span>
                </NuxtLink>
                <NuxtLink to="/sellers/create" class="mobile-tab">
                    <Icon name="mdi:plus-circle-outline" size="24" />
                    <span>New Store</span>
                </NuxtLink>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import StoreSwitcher from '~/components/seller/StoreSwitcher.vue';

const route = useRoute();
const storeSlug = computed(() => route.params.storeSlug as string | undefined);
</script>

<style scoped>
.seller-nav-link {
    @apply flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white transition-colors w-full text-left text-sm font-medium;
}
.seller-nav-link.active {
    @apply bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold;
}

.mobile-tab {
    @apply flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-gray-500 dark:text-neutral-500 text-[10px] font-medium transition-colors min-w-[56px];
}
.mobile-tab-active {
    @apply text-brand;
}
</style>
