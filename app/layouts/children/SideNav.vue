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

            <NuxtLink to="/discover" class="nav-button" active-class="active">
                <Icon name="mdi:view-grid-outline" size="26" />
                <span class="nav-text">{{ $t('nav.discover') }}</span>
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
        </nav>

        <!-- Bottom: Profile button + popup menu -->
        <div class="mt-auto relative" ref="menuRef">
            <ClientOnly>
                <!-- Logged in: avatar triggers popup -->
                <button
                    v-if="profileStore.isLoggedIn"
                    @click="menuOpen = !menuOpen"
                    class="nav-button w-full relative"
                    :class="menuOpen ? 'bg-gray-100 dark:bg-neutral-800' : ''"
                >
                    <div class="relative">
                        <img
                            :src="profileStore.me?.avatar || ''"
                            class="w-7 h-7 rounded-full ring-2 ring-transparent"
                            :class="menuOpen ? 'ring-brand' : ''"
                        />
                        <!-- Combined cart + notification dot -->
                        <span
                            v-if="cartCount > 0"
                            class="absolute -top-1 -right-1 min-w-[14px] h-3.5 rounded-full bg-brand text-white text-[8px] font-bold flex items-center justify-center px-0.5"
                        >{{ cartCount > 9 ? '9+' : cartCount }}</span>
                    </div>
                    <span class="nav-text">{{ profileStore.me?.username || $t('nav.profile') }}</span>
                    <Icon name="mdi:dots-horizontal" size="18" class="ml-auto hidden xl:block text-gray-400" />
                </button>

                <!-- Not logged in -->
                <NuxtLink v-else to="/user-login" class="nav-button">
                    <Icon name="mdi:login-variant" size="26" />
                    <span class="nav-text">{{ $t('nav.signIn') }}</span>
                </NuxtLink>
            </ClientOnly>

            <!-- Popup menu -->
            <Transition name="menu-pop">
                <div
                    v-if="menuOpen"
                    class="absolute bottom-full mb-2 left-0 w-56 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-xl overflow-hidden z-50"
                >
                    <!-- Profile -->
                    <NuxtLink
                        :to="'/profile/' + profileStore.me?.username"
                        @click="menuOpen = false"
                        class="menu-item"
                    >
                        <Icon name="mdi:account-circle-outline" size="20" />
                        <span>View Profile</span>
                    </NuxtLink>

                    <div class="h-px bg-gray-100 dark:bg-neutral-800 mx-3" />

                    <!-- Orders -->
                    <NuxtLink to="/buyer/orders" @click="menuOpen = false" class="menu-item">
                        <Icon name="mdi:package-variant-closed" size="20" />
                        <span>My Orders</span>
                    </NuxtLink>

                    <!-- My Stores (sellers only) -->
                    <NuxtLink
                        v-if="sellerStore.hasSellers"
                        to="/seller/dashboard"
                        @click="menuOpen = false"
                        class="menu-item"
                    >
                        <Icon name="mdi:store-outline" size="20" />
                        <span>My Stores</span>
                    </NuxtLink>

                    <div class="h-px bg-gray-100 dark:bg-neutral-800 mx-3" />

                    <!-- Settings -->
                    <NuxtLink to="/settings" @click="menuOpen = false" class="menu-item">
                        <Icon name="mdi:cog-outline" size="20" />
                        <span>Settings</span>
                    </NuxtLink>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';
import { useNotificationStore } from '~~/layers/profile/app/stores/notification.store';
import { useSellerStore } from '~~/layers/seller/app/store/seller.store';

const emit = defineEmits(['create', 'open-search', 'open-notifications', 'open-cart']);

const profileStore = useProfileStore();
const notificationStore = useNotificationStore();
const sellerStore = useSellerStore();
const { cartCount } = useCart();

const unreadCount = computed(() => notificationStore.unreadCount);
const messageCount = computed(() => 0);

const menuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

// Close on outside click
const onClickOutside = (e: MouseEvent) => {
    if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
        menuOpen.value = false;
    }
};

onMounted(() => document.addEventListener('click', onClickOutside, true));
onUnmounted(() => document.removeEventListener('click', onClickOutside, true));
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

.menu-item {
    @apply flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors;
}

.menu-pop-enter-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}
.menu-pop-leave-active {
    transition: opacity 0.1s ease, transform 0.1s ease;
}
.menu-pop-enter-from,
.menu-pop-leave-to {
    opacity: 0;
    transform: translateY(6px);
}
</style>
