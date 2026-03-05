<template>
    <div class="relative" ref="container">
        <!-- Trigger button -->
        <button
            @click="isOpen = !isOpen"
            class="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-left"
        >
            <!-- Store logo / icon -->
            <div class="w-8 h-8 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#f02c56] to-purple-600 flex items-center justify-center">
                <img
                    v-if="activeSeller?.store_logo"
                    :src="activeSeller.store_logo"
                    :alt="activeSeller.store_name"
                    class="w-full h-full object-cover"
                />
                <Icon v-else name="mdi:store" size="16" class="text-white" />
            </div>

            <!-- Name + slug (only visible at xl) -->
            <div class="hidden xl:flex flex-1 min-w-0 flex-col">
                <span class="text-[13px] font-semibold text-gray-900 dark:text-neutral-100 truncate leading-tight">
                    {{ activeSeller?.store_name ?? 'My Stores' }}
                </span>
                <span class="text-[11px] text-gray-400 dark:text-neutral-500 truncate">
                    {{ activeSeller ? `@${activeSeller.store_slug}` : `${sellers.length} store${sellers.length !== 1 ? 's' : ''}` }}
                </span>
            </div>

            <Icon
                name="mdi:chevron-down"
                size="16"
                class="hidden xl:block shrink-0 text-gray-400 dark:text-neutral-500 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"
            />
        </button>

        <!-- Dropdown -->
        <Transition name="dropdown">
            <div
                v-if="isOpen"
                class="absolute top-full left-0 mt-1 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 z-50 overflow-hidden min-w-[260px] max-w-[calc(100vw-2rem)] xl:w-56"
            >
                <!-- Store list -->
                <div class="py-1">
                    <button
                        v-for="seller in sellers"
                        :key="seller.id"
                        @click="selectStore(seller.store_slug)"
                        class="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        :class="{ 'bg-gray-50 dark:bg-neutral-800': activeSeller?.id === seller.id }"
                    >
                        <div class="w-7 h-7 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#f02c56] to-purple-600 flex items-center justify-center">
                            <img v-if="seller.store_logo" :src="seller.store_logo" class="w-full h-full object-cover" :alt="seller.store_name" />
                            <Icon v-else name="mdi:store" size="14" class="text-white" />
                        </div>
                        <div class="flex flex-1 min-w-0 flex-col text-left">
                            <span class="text-[12px] font-semibold text-gray-900 dark:text-neutral-100 truncate">{{ seller.store_name }}</span>
                            <span class="text-[10px] text-gray-400 dark:text-neutral-500">@{{ seller.store_slug }}</span>
                        </div>
                        <Icon
                            v-if="activeSeller?.id === seller.id"
                            name="mdi:check"
                            size="14"
                            class="shrink-0 text-brand"
                        />
                    </button>
                </div>

                <div class="border-t border-gray-100 dark:border-neutral-800 py-1">
                    <NuxtLink
                        to="/sellers/create"
                        @click="isOpen = false"
                        class="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-brand"
                    >
                        <Icon name="mdi:plus" size="16" class="shrink-0" />
                        <span class="text-[12px] font-semibold">Create Store</span>
                    </NuxtLink>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useSellerManagement } from '~~/layers/seller/app/composables/useSellerManagement';

const route = useRoute();
const router = useRouter();

const { sellers, loadUserSellers } = useSellerManagement();

const isOpen = ref(false);
const container = ref<HTMLElement | null>(null);

const activeSeller = computed(() =>
    sellers.value.find(s => s.store_slug === route.params.storeSlug) ?? null
);

const selectStore = (slug: string) => {
    isOpen.value = false;
    router.push(`/seller/${slug}/dashboard`);
};

const handleOutsideClick = (e: MouseEvent) => {
    if (container.value && !container.value.contains(e.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(async () => {
    document.addEventListener('click', handleOutsideClick);
    if (!sellers.value.length) {
        await loadUserSellers().catch(() => {});
    }
});

onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
