<template>
    <nav class="bottom-nav fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-t border-gray-200/60 dark:border-neutral-800/60">
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

            <!-- Profile / Login -->
            <ClientOnly>
                <div v-if="profileStore.isLoggedIn" class="relative" ref="menuRef">
                    <!-- Avatar button — tap to open popup -->
                    <button @click="menuOpen = !menuOpen" class="nav-item">
                        <img
                            :src="profileStore.me?.avatar || ''"
                            class="w-7 h-7 rounded-full ring-2 transition-all"
                            :class="isProfileActive ? 'ring-brand' : 'ring-transparent'"
                        />
                    </button>

                    <!-- Popup menu — slides up from bottom -->
                    <Transition name="menu-pop">
                        <div
                            v-if="menuOpen"
                            class="absolute bottom-full mb-3 right-0 w-52 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-xl overflow-hidden z-50"
                        >
                            <NuxtLink :to="'/profile/' + profileStore.me?.username" @click="menuOpen = false"
                                class="menu-item">
                                <Icon name="mdi:account-circle-outline" size="18" />
                                <span>View Profile</span>
                            </NuxtLink>
                            <NuxtLink to="/buyer/orders" @click="menuOpen = false" class="menu-item">
                                <Icon name="mdi:package-variant-closed" size="18" />
                                <span>My Orders</span>
                            </NuxtLink>
                            <NuxtLink to="/settings" @click="menuOpen = false" class="menu-item">
                                <Icon name="mdi:cog-outline" size="18" />
                                <span>Settings</span>
                            </NuxtLink>
                            <div class="h-px bg-gray-100 dark:bg-neutral-800 mx-3" />
                            <button @click="handleLogout"
                                class="menu-item w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <Icon name="mdi:logout-variant" size="18" />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </Transition>
                </div>

                <NuxtLink v-else to="/user-login" class="nav-item">
                    <Icon name="mdi:account-circle-outline" size="26" />
                </NuxtLink>
            </ClientOnly>

        </div>
    </nav>

    <!-- Backdrop to close menu -->
    <Teleport to="body">
        <div v-if="menuOpen" @click="menuOpen = false" class="fixed inset-0 z-20" />
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';

defineEmits(['create']);

const route = useRoute();
const profileStore = useProfileStore();
const { logout } = useAuth();

const menuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const isProfileActive = computed(() =>
    route.path.includes('/profile') ||
    route.path.includes('/sellers/dashboard') ||
    route.path.includes('/buyer/profile')
);

const handleLogout = async () => {
    menuOpen.value = false;
    await logout();
};

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
.bottom-nav {
    display: flex;
    flex-direction: column;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    transition: transform 0.25s ease;
}

/* Hide on desktop */
@media (min-width: 768px) {
    .bottom-nav {
        display: none;
    }
}

.nav-item {
    @apply flex items-center justify-center w-12 h-12 text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors rounded-xl;
}

.nav-item.active {
    @apply text-gray-900 dark:text-neutral-100;
}

.menu-item {
    @apply flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer;
}

.menu-pop-enter-active,
.menu-pop-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}
.menu-pop-enter-from,
.menu-pop-leave-to {
    opacity: 0;
    transform: translateY(6px) scale(0.97);
}
</style>
