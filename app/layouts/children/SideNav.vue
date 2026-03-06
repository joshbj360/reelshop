<template>
    <div class="flex flex-col h-full p-4">
        <!-- Logo -->
        <NuxtLink to="/" class="mb-6 flex items-center justify-center xl:justify-start gap-2.5">
            <div class="w-9 h-9 shrink-0 bg-gradient-to-br from-[#f02c56] to-purple-600 rounded-full flex items-center justify-center">
                <Icon name="mdi:hanger" class="w-5 h-5 text-white" />
            </div>
            <span class="hidden xl:inline text-xl font-bold tracking-tight text-gray-900 dark:text-neutral-100">Styli</span>
        </NuxtLink>

        <!-- Navigation Links -->
        <nav class="flex flex-col space-y-2">
            <NuxtLink to="/" class="nav-button" active-class="active">
                <Icon name="mdi:home" size="26" />
                <span class="nav-text">{{ $t('nav.home') }}</span>
            </NuxtLink>

            <!-- <button @click="$emit('open-search')" class="nav-button">
                <Icon name="mdi:magnify" size="26" />
                <span class="nav-text">{{ $t('nav.search') }}</span>
            </button> -->

            <NuxtLink to="/discover" class="nav-button" active-class="active">
                <Icon name="mdi:view-grid-outline" size="26" />
                <span class="nav-text">{{ $t('nav.discover') }}</span>
            </NuxtLink>

            <NuxtLink to="/thrift" class="nav-button" active-class="active">
                <Icon name="mdi:tshirt-crew-outline" size="26" />
                <span class="nav-text">{{ $t('nav.thrift') }}</span>
            </NuxtLink>

            <NuxtLink to="/reels" class="nav-button" active-class="active">
                <Icon name="mdi:play-box-outline" size="26" />
                <span class="nav-text">{{ $t('nav.reels') }}</span>
            </NuxtLink>

            <ClientOnly>
                <button v-if="profileStore.isLoggedIn" @click="$emit('create')" class="create-button">
                    <Icon name="mdi:plus-circle-outline" size="26" />
                    <span class="nav-text">{{ $t('nav.create') }}</span>
                </button>

                <button v-if="profileStore.isLoggedIn" @click="$emit('open-notifications')" class="nav-button relative">
                    <div class="relative">
                        <Icon name="mdi:bell-outline" size="26" />
                        <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-brand"></span>
                    </div>
                    <span class="nav-text">{{ $t('nav.notifications') }}</span>
                </button>
            </ClientOnly>

            <NuxtLink to="/messages" class="nav-button relative" active-class="active">
                <div class="relative">
                    <Icon name="mdi:message-outline" size="26" />
                    <span v-if="messageCount > 0" class="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-brand"></span>
                </div>
                <span class="nav-text">{{ $t('nav.messages') }}</span>
            </NuxtLink>

            <!-- Cart -->
            <button @click="$emit('open-cart')" class="nav-button relative">
                <div class="relative">
                    <Icon name="mdi:shopping-outline" size="26" />
                    <span v-if="cartCount > 0" class="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-brand text-white text-[9px] font-bold flex items-center justify-center px-0.5">{{ cartCount > 9 ? '9+' : cartCount }}</span>
                </div>
                <span class="nav-text">Cart</span>
            </button>

            <!-- Seller Dashboard -->
            <ClientOnly>
                <NuxtLink
                    v-if="profileStore.isLoggedIn && sellerStore.hasSellers"
                    to="/seller/dashboard"
                    class="nav-button"
                    active-class="active"
                >
                    <Icon name="mdi:store-outline" size="26" />
                    <span class="nav-text">My Stores</span>
                </NuxtLink>
            </ClientOnly>
        </nav>

        <!-- Profile Link (at the bottom) -->
        <div class="mt-auto">
            <ClientOnly>
                <NuxtLink
                    v-if="profileStore.isLoggedIn"
                    :to="profileStore.me?.role === 'buyer' ? '/buyer/profile' : profileStore.me?.role === 'seller' ? '/sellers/dashboard' : '/profile/' + profileStore.me?.username"
                    class="nav-button w-full"
                    active-class="active"
                >
                    <img
                        :src="profileStore.me?.avatar || ''"
                        class="w-7 h-7 rounded-full ring-2 ring-transparent hover:ring-[#f02c56]"
                    />
                    <span class="nav-text">{{ $t('nav.profile') }}</span>
                </NuxtLink>

                <!-- Login Button (if not logged in) -->
                <NuxtLink v-else to="/user-login" class="nav-button">
                    <Icon name="mdi:login-variant" size="26" />
                    <span class="nav-text">{{ $t('nav.signIn') }}</span>
                </NuxtLink>
            </ClientOnly>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';
import { useNotificationStore } from '~~/layers/profile/app/stores/notification.store';
import { useSellerStore } from '~~/layers/seller/app/store/seller.store';

defineEmits(['create', 'open-search', 'open-notifications', 'open-cart']);

const profileStore = useProfileStore();
const notificationStore = useNotificationStore();
const sellerStore = useSellerStore();
const { cartCount } = useCart();

const unreadCount = computed(() => notificationStore.unreadCount);
const messageCount = computed(() => 0); // Updated when chat unread tracking is added
</script>

<style scoped>
.nav-button {
    @apply flex items-center gap-4 p-3 rounded-xl text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white transition-colors;
}

.nav-button.active {
    @apply text-gray-900 dark:text-white font-semibold bg-gray-100 dark:bg-neutral-800;
}

.create-button {
    @apply flex items-center gap-4 p-3 rounded-xl font-semibold text-brand hover:bg-brand/10 dark:hover:bg-brand/10 transition-colors;
}

.nav-text {
    @apply hidden xl:inline;
}
</style>