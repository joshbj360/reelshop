<template>
  <nav
    v-bind="$attrs"
    class="bottom-nav fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200/60 bg-white/90 backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-900/90"
  >
    <div class="flex h-16 items-center justify-around px-1">
      <NuxtLink to="/" class="nav-item" active-class="active">
        <Icon name="mdi:home" size="24" />
      </NuxtLink>

      <NuxtLink to="/reels" class="nav-item" active-class="active">
        <Icon name="mdi:play-circle-outline" size="24" />
      </NuxtLink>

      <!-- Create button — smaller to fit 6 items -->
      <ClientOnly>
        <button
          v-if="profileStore.isLoggedIn"
          @click="$emit('create')"
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand shadow-lg shadow-brand/30 transition-transform active:scale-95"
          aria-label="Create"
        >
          <Icon name="mdi:plus" size="22" class="text-white" />
        </button>
        <template #fallback>
          <div class="h-10 w-10" />
        </template>
      </ClientOnly>

      <NuxtLink to="/thrift" class="nav-item" active-class="active">
        <Icon name="mdi:tshirt-crew" size="24" />
      </NuxtLink>

      <!-- Profile / Login -->
      <ClientOnly>
        <div v-if="profileStore.isLoggedIn" class="relative" ref="menuRef">
          <!-- Avatar button — tap to open popup -->
          <button @click="menuOpen = !menuOpen" class="nav-item">
            <Avatar
              :username="profileStore.me?.username ?? 'User'"
              :avatar="profileStore.me?.avatar ?? ''"
              size="sm"
              class="ring-2 transition-all"
              :class="isProfileActive ? 'ring-brand' : 'ring-transparent'"
            />
          </button>

          <!-- Popup menu — slides up from bottom -->
          <Transition name="menu-pop">
            <div
              v-if="menuOpen"
              class="absolute bottom-full right-0 z-50 mb-3 w-52 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
            >
              <NuxtLink
                :to="'/profile/' + profileStore.me?.username"
                @click="menuOpen = false"
                class="menu-item"
              >
                <Icon name="mdi:account-circle-outline" size="18" />
                <span>View Profile</span>
              </NuxtLink>
              <NuxtLink
                to="/buyer/orders"
                @click="menuOpen = false"
                class="menu-item"
              >
                <Icon name="mdi:package-variant-closed" size="18" />
                <span>My Orders</span>
              </NuxtLink>
              <NuxtLink
                to="/settings"
                @click="menuOpen = false"
                class="menu-item"
              >
                <Icon name="mdi:cog-outline" size="18" />
                <span>Settings</span>
              </NuxtLink>
              <div class="mx-3 h-px bg-gray-100 dark:bg-neutral-800" />
              <button
                @click="handleLogout"
                class="menu-item w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import Avatar from '~~/layers/profile/app/components/Avatar.vue'

defineEmits(['create'])
defineOptions({ inheritAttrs: false })

const route = useRoute()
const profileStore = useProfileStore()
const { logout } = useAuth()

const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const isProfileActive = computed(
  () =>
    route.path.includes('/profile') ||
    route.path.includes('/sellers/dashboard') ||
    route.path.includes('/buyer/profile'),
)

const handleLogout = async () => {
  menuOpen.value = false
  await logout()
}

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
  @apply flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:text-gray-900 dark:text-neutral-500 dark:hover:text-neutral-100;
}

.nav-item.active {
  @apply text-gray-900 dark:text-neutral-100;
}

.menu-item {
  @apply flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800;
}

.menu-pop-enter-active,
.menu-pop-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.97);
}
</style>
