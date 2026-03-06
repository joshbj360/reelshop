<template>
    <header class="fixed top-0 left-0 right-0 z-20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-neutral-800/60 md:hidden">
        <div class="flex items-center justify-between h-14 px-4">
            <!-- Logo -->
            <NuxtLink to="/" class="flex items-center gap-2">
                <div class="w-8 h-8 bg-gradient-to-br from-[#f02c56] to-purple-600 rounded-full flex items-center justify-center">
                    <Icon name="mdi:hanger" class="w-4 h-4 text-white" />
                </div>
                <span class="text-lg font-bold text-gray-900 dark:text-neutral-100">Styli</span>
            </NuxtLink>

            <!-- Actions -->
            <div class="flex items-center gap-2">
                <button @click="$emit('open-cart')" class="header-button">
                <div class="relative">
                    <Icon name="mdi:shopping-outline" size="26" />
                    <span v-if="cartCount > 0" class="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-brand text-white text-[9px] font-bold flex items-center justify-center px-0.5">{{ cartCount > 9 ? '9+' : cartCount }}</span>
                </div>
            </button>
                <button @click="$emit('open-search')" class="header-button">
                    <Icon name="mdi:magnify" size="24" />
                </button>
                
                <ClientOnly>
                    <button
                        v-if="profileStore.isLoggedIn"
                        @click="$emit('open-notifications')"
                        class="header-button relative"
                    >
                        <Icon name="mdi:bell-outline" size="24" />
                        <span v-if="unreadCount > 0" class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-brand"></span>
                    </button>
                </ClientOnly>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';
import { useNotificationStore } from '~~/layers/profile/app/stores/notification.store';

defineEmits(['open-search', 'open-notifications', 'open-cart']);

const profileStore = useProfileStore();
const notificationStore = useNotificationStore();

const { cartCount } = useCart();


const unreadCount = computed(() => notificationStore.unreadCount);
</script>

<style scoped>
.header-button {
    @apply p-2 rounded-full text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors;
}
</style>