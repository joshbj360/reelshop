// layers/auth/app/plugins/auth-init.ts

import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { useAuthStore } from '../stores/auth.store'
import { useSellerStore } from '~~/layers/seller/app/store/seller.store'
import { useNotificationStore } from '~~/layers/profile/app/stores/notification.store'

/**
 * Auth Initialization Plugin
 * Runs on app startup to initialize auth state.
 *
 * On a hard refresh, the Pinia store is empty even though a valid JWT is in
 * localStorage. We restore the token first, then call GET /api/profile to
 * re-hydrate profileStore.me so isLoggedIn stays true across refreshes.
 */

const hydrateSellerStore = async (
  token: string,
  sellerStore: ReturnType<typeof useSellerStore>,
) => {
  try {
    const sellerRes = await $fetch<{ success: boolean; data: any[] }>(
      '/api/seller/list',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    if (sellerRes?.data) {
      sellerStore.setSellers(sellerRes.data)
    }
  } catch {
    // Non-sellers — silently ignore
  }
}

const hydrateNotificationCount = async (
  token: string,
  notificationStore: ReturnType<typeof useNotificationStore>,
) => {
  try {
    const res = await $fetch<{ success: boolean; data: { count: number } }>(
      '/api/shared/notifications/unread',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    if (res?.data) notificationStore.unreadCount = res.data.count
  } catch {
    /* non-fatal */
  }
}

export default defineNuxtPlugin(async () => {
  const profileStore = useProfileStore()
  const authStore = useAuthStore()
  const sellerStore = useSellerStore()
  const notificationStore = useNotificationStore()

  // Restore tokens from localStorage (client-only, guarded inside the action)
  authStore.initializeAuth()

  // Only attempt profile restoration on the client and when a token exists
  if (import.meta.client && authStore.accessToken) {
    try {
      const response = await $fetch<{ success: boolean; data: any }>(
        '/api/profile',
        {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        },
      )

      if (response?.data) {
        profileStore.setPrivateProfile(response.data)
      }
    } catch {
      // Token is expired or invalid — clear it so the user is treated as a guest
      authStore.clearAuth()
    }

    // Hydrate seller store + notification count on initial load
    if (authStore.accessToken) {
      await Promise.all([
        hydrateSellerStore(authStore.accessToken, sellerStore),
        hydrateNotificationCount(authStore.accessToken, notificationStore),
      ])
    }
  }

  // Watch for token changes (login/logout mid-session) to keep seller store in sync
  if (import.meta.client) {
    watch(
      () => authStore.accessToken,
      async (newToken) => {
        if (newToken) {
          await hydrateSellerStore(newToken, sellerStore)
        } else {
          sellerStore.setSellers([])
        }
      },
    )
  }

  return {
    provide: {
      auth: {
        isLoggedIn: () => profileStore.isLoggedIn,
        user: () => profileStore.me,
      },
    },
  }
})
