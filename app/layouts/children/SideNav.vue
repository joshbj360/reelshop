<!-- ~/layouts/children/SideNav.vue -->
<template>
  <div class="flex h-full flex-col p-3 xl:p-4">
    <!-- Logo -->
    <NuxtLink
      to="/"
      class="mb-6 flex items-center justify-center gap-2.5 xl:justify-start"
    >
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand shadow-lg shadow-brand/25"
      >
        <span class="text-sm font-black italic text-white">sX</span>
      </div>
      <span
        class="hidden text-xl font-black tracking-tight text-gray-900 xl:inline dark:text-white"
      >
        {{ $config.public.siteName || 'styleX' }}
      </span>
    </NuxtLink>

    <!-- Navigation Links -->
    <nav class="flex flex-col space-y-1.5 xl:space-y-2">
      <NuxtLink to="/" class="nav-button group" active-class="active">
        <Icon name="mdi:home" size="26" />
        <span class="nav-text">{{ $t('nav.home') }}</span>
      </NuxtLink>

      <NuxtLink to="/discover" class="nav-button group" active-class="active">
        <Icon name="mdi:magnify" size="26" />
        <span class="nav-text">{{ $t('nav.discover') }}</span>
      </NuxtLink>

      <NuxtLink to="/reels" class="nav-button group" active-class="active">
        <Icon name="mdi:play-box-multiple-outline" size="26" />
        <span class="nav-text">{{ $t('nav.reels') }}</span>
      </NuxtLink>

      <NuxtLink to="/thrift" class="nav-button group" active-class="active">
        <Icon name="mdi:tshirt-crew" size="26" />
        <span class="nav-text">{{ $t('nav.thrift') }}</span>
      </NuxtLink>

      <!-- Create (only logged in) -->
      <ClientOnly>
        <button
          v-if="profileStore.isLoggedIn"
          @click="$emit('create')"
          class="create-button group mt-2"
        >
          <Icon name="mdi:plus-circle" size="26" />
          <span class="nav-text">{{ $t('nav.create') }}</span>
        </button>
      </ClientOnly>

      <!-- Notifications -->
      <ClientOnly>
        <button
          v-if="profileStore.isLoggedIn"
          @click="$emit('open-notifications')"
          class="nav-button group relative"
        >
          <div class="relative">
            <Icon name="mdi:bell-outline" size="26" />
            <span
              v-if="unreadCount > 0"
              class="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white shadow-sm"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </div>
          <span class="nav-text">{{ $t('nav.notifications') }}</span>
        </button>
      </ClientOnly>

      <!-- Messages -->
      <ClientOnly>
        <NuxtLink
          v-if="profileStore.isLoggedIn"
          to="/messages"
          class="nav-button group relative"
          active-class="active"
        >
          <div class="relative">
            <Icon name="mdi:message-outline" size="26" />
            <span
              v-if="messageCount > 0"
              class="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white shadow-sm"
            >
              {{ messageCount > 99 ? '99+' : messageCount }}
            </span>
          </div>
          <span class="nav-text">{{ $t('nav.messages') }}</span>
        </NuxtLink>
      </ClientOnly>

      <!-- Cart -->
      <button @click="$emit('open-cart')" class="nav-button group relative">
        <div class="relative">
          <Icon name="mdi:cart-outline" size="26" />
          <span
            v-if="cartCount > 0"
            class="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white shadow-sm"
          >
            {{ cartCount > 99 ? '99+' : cartCount }}
          </span>
        </div>
        <span class="nav-text">Cart</span>
      </button>
    </nav>

    <!-- Bottom Profile Section -->
    <div class="relative mt-auto pb-2">
      <ClientOnly>
        <!-- Logged in: avatar + menu trigger -->
        <button
          v-if="profileStore.isLoggedIn"
          @click="menuOpen = !menuOpen"
          class="nav-button group w-full justify-between"
          :class="{ 'bg-gray-100 dark:bg-neutral-800': menuOpen }"
        >
          <div class="flex items-center gap-3">
            <Avatar
              :username="profileStore.me?.username || 'User'"
              :avatar="profileStore.me?.avatar ?? undefined"
              size="md"
              class="ring-2 ring-gray-200 dark:ring-neutral-700"
            />
            <span
              class="hidden max-w-[140px] truncate font-medium text-gray-900 xl:inline dark:text-white"
            >
              {{ profileStore.me?.username || 'Profile' }}
            </span>
          </div>
          <Icon
            name="mdi:chevron-up"
            size="20"
            class="hidden text-gray-500 transition-transform xl:block"
            :class="{ 'rotate-180': menuOpen }"
          />
        </button>

        <!-- Not logged in: sign in prompt -->
        <NuxtLink v-else to="/user-login" class="nav-button group">
          <Icon name="mdi:login" size="26" />
          <span class="nav-text">{{ $t('nav.signIn') }}</span>
        </NuxtLink>
      </ClientOnly>

      <!-- Popup Menu -->
      <Transition name="menu-pop">
        <div
          v-if="menuOpen && profileStore.isLoggedIn"
          class="absolute bottom-full left-0 z-50 mb-3 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
        >
          <NuxtLink
            :to="`/profile/${profileStore.me?.username}`"
            @click="menuOpen = false"
            class="menu-item group"
          >
            <Icon name="mdi:account-circle-outline" size="20" />
            <span>View Profile</span>
          </NuxtLink>

          <NuxtLink
            to="/buyer/orders"
            @click="menuOpen = false"
            class="menu-item group"
          >
            <Icon name="mdi:package-variant-closed" size="20" />
            <span>My Orders</span>
          </NuxtLink>

          <NuxtLink
            v-if="sellerStore.hasSellers"
            to="/seller/dashboard"
            @click="menuOpen = false"
            class="menu-item group"
          >
            <Icon name="mdi:store-outline" size="20" />
            <span>My Stores</span>
          </NuxtLink>

          <div class="mx-4 my-1.5 h-px bg-gray-100 dark:bg-neutral-800" />

          <NuxtLink
            to="/settings"
            @click="menuOpen = false"
            class="menu-item group"
          >
            <Icon name="mdi:cog-outline" size="20" />
            <span>Settings</span>
          </NuxtLink>

          <div class="mx-4 my-1.5 h-px bg-gray-100 dark:bg-neutral-800" />

          <button
            @click="logout"
            class="menu-item group w-full text-left text-red-600 hover:bg-red-50/80 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <Icon name="mdi:logout-variant" size="20" />
            <span>Log Out</span>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { useNotificationStore } from '~~/layers/profile/app/stores/notification.store'
import { useSellerStore } from '~~/layers/seller/app/store/seller.store'
import { useChatStore } from '~~/layers/profile/app/stores/chat.store'

import Avatar from '~~/layers/profile/app/components/Avatar.vue'

const emit = defineEmits(['create', 'open-notifications', 'open-cart'])

const { logout } = useAuth()
const profileStore = useProfileStore()
const notificationStore = useNotificationStore()
const sellerStore = useSellerStore()
const { cartCount } = useCart()

const chatStore = useChatStore()
const unreadCount = computed(() => notificationStore.unreadCount)
const messageCount = computed(() =>
  chatStore.conversations.reduce(
    (sum, c: any) => sum + (c.unreadCount ?? c.unread_count ?? 0),
    0,
  ),
)

const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

// Close menu on outside click
const onClickOutside = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside, true)
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside, true)
})
</script>

<style scoped>
.nav-button {
  @apply flex items-center gap-4 rounded-xl px-3 py-3 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white;
}

.nav-button.active {
  @apply bg-gray-100 font-medium text-gray-900 dark:bg-neutral-800 dark:text-white;
}

.create-button {
  @apply flex items-center gap-4 rounded-xl px-3 py-3 font-semibold text-brand transition-all hover:bg-brand/10 dark:hover:bg-brand/10;
}

.nav-text {
  @apply hidden text-base xl:inline;
}

.menu-item {
  @apply flex items-center gap-3 px-5 py-3.5 text-sm text-gray-800 transition-colors hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800;
}

.menu-pop-enter-active,
.menu-pop-leave-active {
  transition: all 0.18s ease;
}
.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}
</style>
