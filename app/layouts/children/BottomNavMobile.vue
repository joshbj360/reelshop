<template>
    <nav class="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border-t border-gray-200/60 dark:border-neutral-800/60 transition-transform duration-300 ease-in-out">
        <div class="flex items-center justify-around h-16 px-2">

            <NuxtLink to="/" class="nav-item" active-class="active">
                <Icon name="mdi:home" size="26" />
            </NuxtLink>

            <NuxtLink to="/discover" class="nav-item" active-class="active">
                <Icon name="mdi:compass-outline" size="26" />
            </NuxtLink>

            <!-- Create button — gradient pill -->
            <ClientOnly>
                <button
                    v-if="profileStore.isLoggedIn"
                    @click="$emit('create')"
                    class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#f02c56] to-purple-600 rounded-2xl shadow-md active:scale-95 transition-transform"
                    aria-label="Create"
                >
                    <Icon name="mdi:plus" size="26" class="text-white" />
                </button>
                <template #fallback>
                    <div class="w-12 h-12" />
                </template>
            </ClientOnly>

            <NuxtLink to="/reels" class="nav-item" active-class="active">
                <Icon name="mdi:play-box-outline" size="26" />
            </NuxtLink>

            

            <ClientOnly>
                <NuxtLink
                    v-if="profileStore.isLoggedIn"
                    :to="profileStore.me?.role === 'buyer' ? '/buyer/profile' : profileStore.me?.role === 'seller' ? '/sellers/dashboard' : '/profile/' + profileStore.me?.username"
                    class="nav-item"
                    active-class="active"
                >
                    <img
                        :src="profileStore.me?.avatar || ''"
                        class="w-7 h-7 rounded-full ring-2 transition-all"
                        :class="isProfileActive ? 'ring-brand' : 'ring-transparent'"
                    />
                </NuxtLink>
                <NuxtLink v-else to="/user-login" class="nav-item">
                    <Icon name="mdi:account-circle-outline" size="26" />
                </NuxtLink>
            </ClientOnly>

        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';

defineEmits(['create']);

const route = useRoute();
const profileStore = useProfileStore();

const isProfileActive = computed(() =>
    route.path.includes('/profile') ||
    route.path.includes('/sellers/dashboard') ||
    route.path.includes('/buyer/profile')
);
</script>

<style scoped>
.nav-item {
    @apply flex items-center justify-center w-12 h-12 text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors rounded-xl;
}

.nav-item.active {
    @apply text-gray-900 dark:text-neutral-100;
}
</style>
