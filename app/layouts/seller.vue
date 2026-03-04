<template>
    <div class="flex h-screen bg-gray-50 dark:bg-neutral-950 overflow-hidden">
        <!-- Sidebar -->
        <aside class="w-16 xl:w-60 shrink-0 flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800">

            <!-- Logo / Back to Fitsy -->
            <div class="p-3 xl:p-4 border-b border-gray-100 dark:border-neutral-800">
                <NuxtLink to="/" class="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <div class="w-9 h-9 shrink-0 bg-gradient-to-br from-[#f02c56] to-purple-600 rounded-full flex items-center justify-center">
                        <Icon name="mdi:store-fashion" class="w-5 h-5 text-white" />
                    </div>
                    <span class="hidden xl:inline text-sm font-bold text-gray-500 dark:text-neutral-400">← Back to Fitsy</span>
                </NuxtLink>
            </div>

            <!-- Store Switcher -->
            <div class="px-2 xl:px-3 py-2.5 border-b border-gray-100 dark:border-neutral-800">
                <StoreSwitcher />
            </div>

            <!-- Nav Links -->
            <nav class="flex-1 flex flex-col px-2 py-3 space-y-0.5 overflow-y-auto">

                <!-- Store-scoped links — only shown when inside a specific store -->
                <template v-if="storeSlug">
                    <NuxtLink :to="`/seller/${storeSlug}/dashboard`" class="seller-nav-link" active-class="active">
                        <Icon name="mdi:view-dashboard-outline" size="22" />
                        <span class="seller-nav-text">Overview</span>
                    </NuxtLink>
                    <NuxtLink :to="`/seller/${storeSlug}/products`" class="seller-nav-link" active-class="active">
                        <Icon name="mdi:package-variant-closed" size="22" />
                        <span class="seller-nav-text">Products</span>
                    </NuxtLink>
                    <button disabled class="seller-nav-link opacity-40 cursor-not-allowed">
                        <Icon name="mdi:truck-outline" size="22" />
                        <span class="seller-nav-text">Orders</span>
                        <span class="hidden xl:inline ml-auto text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-400 rounded-full">Soon</span>
                    </button>
                    <NuxtLink :to="`/seller/${storeSlug}/settings`" class="seller-nav-link" active-class="active">
                        <Icon name="mdi:cog-outline" size="22" />
                        <span class="seller-nav-text">Settings</span>
                    </NuxtLink>

                    <!-- Divider -->
                    <div class="pt-3 pb-1 px-2 hidden xl:block">
                        <span class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-600">General</span>
                    </div>
                    <div class="hidden xl:block border-t border-gray-100 dark:border-neutral-800 my-1" />
                </template>

                <NuxtLink to="/seller/dashboard" class="seller-nav-link" exact-active-class="active">
                    <Icon name="mdi:store-outline" size="22" />
                    <span class="seller-nav-text">My Stores</span>
                </NuxtLink>
                <NuxtLink to="/sellers/create" class="seller-nav-link">
                    <Icon name="mdi:plus-circle-outline" size="22" />
                    <span class="seller-nav-text">New Store</span>
                </NuxtLink>
            </nav>
        </aside>

        <!-- Main content area -->
        <main class="flex-1 overflow-y-auto">
            <slot />
        </main>
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

.seller-nav-text {
    @apply hidden xl:inline;
}
</style>
