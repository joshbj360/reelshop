<template>
  <div class="flex h-full flex-col p-4">
    <!-- Logo -->
    <NuxtLink
      to="/"
      class="mb-6 flex items-center justify-center gap-2.5 xl:justify-start"
    >
      <div
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f02c56] to-purple-600"
      >
        <Icon name="mdi:hanger" class="h-5 w-5 text-white" />
      </div>
      <span
        class="hidden text-xl font-bold tracking-tight text-gray-900 xl:inline dark:text-neutral-100"
        >Styli</span
      >
    </NuxtLink>

    <!-- Navigation Links -->
    <nav class="flex flex-col space-y-2">
      <NuxtLink to="/" class="nav-button" active-class="active">
        <Icon name="mdi:home" size="26" />
        <span class="nav-text">{{ $t('nav.home') }}</span>
      </NuxtLink>

      <NuxtLink to="/discover" class="nav-button" active-class="active">
        <Icon name="mdi:magnify" size="26" />
        <span class="nav-text">{{ $t('nav.discover') }}</span>
      </NuxtLink>

      <NuxtLink to="/reels" class="nav-button" active-class="active">
        <Icon name="mdi:play-box-outline" size="26" />
        <span class="nav-text">{{ $t('nav.reels') }}</span>
      </NuxtLink>
      <NuxtLink to="/thrift" class="nav-button" active-class="active">
        <Icon name="mdi:tshirt-crew-outline" size="26" />
        <span class="nav-text">{{ $t('nav.thrift') }}</span>
      </NuxtLink>

      <ClientOnly>
        <button
          v-if="profileStore.isLoggedIn"
          @click="$emit('create')"
          class="create-button"
        >
          <Icon name="mdi:plus-circle-outline" size="26" />
          <span class="nav-text">{{ $t('nav.create') }}</span>
        </button>

        <button
          v-if="profileStore.isLoggedIn"
          @click="$emit('open-notifications')"
          class="nav-button relative"
        >
          <div class="relative">
            <Icon name="mdi:bell-outline" size="26" />
            <span
              v-if="unreadCount > 0"
              class="absolute -right-1 -top-1 block h-2.5 w-2.5 rounded-full bg-brand"
            ></span>
          </div>
          <span class="nav-text">{{ $t('nav.notifications') }}</span>
        </button>
      </ClientOnly>

      <ClientOnly>
        <NuxtLink
          v-if="profileStore.isLoggedIn"
          to="/messages"
          class="nav-button relative"
          active-class="active"
        >
          <div class="relative">
            <Icon name="mdi:message-outline" size="26" />
            <span
              v-if="messageCount > 0"
              class="absolute -right-1 -top-1 block h-2.5 w-2.5 rounded-full bg-brand"
            ></span>
          </div>
          <span class="nav-text">{{ $t('nav.messages') }}</span>
        </NuxtLink>
      </ClientOnly>

      <!-- Cart -->
      <button @click="$emit('open-cart')" class="nav-button relative">
        <div class="relative">
          <Icon name="mdi:shopping-outline" size="26" />
          <span
            v-if="cartCount > 0"
            class="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand px-0.5 text-[9px] font-bold text-white"
            >{{ cartCount > 9 ? '9+' : cartCount }}</span
          >
        </div>
        <span class="nav-text">Cart</span>
      </button>
    </nav>

    <!-- Bottom: Profile button + popup menu -->
    <div class="relative mt-auto" ref="menuRef">
      <ClientOnly>
        <!-- Logged in: avatar triggers popup -->
        <button
          v-if="profileStore.isLoggedIn"
          @click="menuOpen = !menuOpen"
          class="nav-button relative w-full"
          :class="menuOpen ? 'bg-gray-100 dark:bg-neutral-800' : ''"
        >
          <div class="relative">
            <!-- Avatar -->
            <Avatar
              :username="profileStore.me?.username || 'Shopper'"
              :avatar="profileStore.me?.avatar ?? undefined"
              size="sm"
            />
            <!-- Combined cart + notification dot -->
            <span
              v-if="cartCount > 0"
              class="absolute -right-1 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-brand px-0.5 text-[8px] font-bold text-white"
              >{{ cartCount > 9 ? '9+' : cartCount }}</span
            >
          </div>
          <span class="nav-text">{{
            profileStore.me?.username || $t('nav.profile')
          }}</span>
          <Icon
            name="mdi:dots-horizontal"
            size="18"
            class="ml-auto hidden text-gray-400 xl:block"
          />
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
          class="absolute bottom-full left-0 z-50 mb-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
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

          <div class="mx-3 h-px bg-gray-100 dark:bg-neutral-800" />

          <!-- Orders -->
          <NuxtLink
            to="/buyer/orders"
            @click="menuOpen = false"
            class="menu-item"
          >
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

          <div class="mx-3 h-px bg-gray-100 dark:bg-neutral-800" />

          <!-- Settings -->
          <NuxtLink to="/settings" @click="menuOpen = false" class="menu-item">
            <Icon name="mdi:cog-outline" size="20" />
            <span>Settings</span>
          </NuxtLink>
          <div class="mx-3 h-px bg-gray-100 dark:bg-neutral-800" />
          <button
            @click="logout"
            class="menu-item w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { useNotificationStore } from '~~/layers/profile/app/stores/notification.store'
import { useSellerStore } from '~~/layers/seller/app/store/seller.store'

import Avatar from '~~/layers/profile/app/components/Avatar.vue'

const emit = defineEmits([
  'create',
  'open-search',
  'open-notifications',
  'open-cart',
])

const { logout } = useAuth()
const profileStore = useProfileStore()
const notificationStore = useNotificationStore()
const sellerStore = useSellerStore()
const { cartCount } = useCart()

const unreadCount = computed(() => notificationStore.unreadCount)
const messageCount = computed(() => 0)

const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

// Close on outside click
const onClickOutside = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside, true))
onUnmounted(() => document.removeEventListener('click', onClickOutside, true))
</script>

<style scoped>
.nav-button {
  @apply flex items-center gap-4 rounded-xl p-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white;
}

.nav-button.active {
  @apply bg-gray-100 font-semibold text-gray-900 dark:bg-neutral-800 dark:text-white;
}

.create-button {
  @apply flex items-center gap-4 rounded-xl p-3 font-semibold text-brand transition-colors hover:bg-brand/10 dark:hover:bg-brand/10;
}

.nav-text {
  @apply hidden xl:inline;
}

.menu-item {
  @apply flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800;
}

.menu-pop-enter-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.menu-pop-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.1s ease;
}

.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
