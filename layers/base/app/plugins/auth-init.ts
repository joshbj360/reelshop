// layers/auth/app/plugins/auth-init.ts

import { useProfileStore } from "~~/layers/profile/app/stores/profile.store"
import { useAuthStore } from "../stores/auth.store"
import { useSellerStore } from "~~/layers/seller/app/store/seller.store"

/**
 * Auth Initialization Plugin
 * Runs on app startup to initialize auth state.
 *
 * On a hard refresh, the Pinia store is empty even though a valid JWT is in
 * localStorage. We restore the token first, then call GET /api/profile to
 * re-hydrate profileStore.me so isLoggedIn stays true across refreshes.
 */

export default defineNuxtPlugin(async () => {
  const profileStore = useProfileStore()
  const authStore = useAuthStore()
  const sellerStore = useSellerStore()

  // Restore tokens from localStorage (client-only, guarded inside the action)
  authStore.initializeAuth()

  // Only attempt profile restoration on the client and when a token exists
  if (import.meta.client && authStore.accessToken) {
    try {
      const response = await $fetch<{ success: boolean; data: any }>('/api/profile', {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        }
      })

      if (response?.data) {
        profileStore.setPrivateProfile(response.data)
      }
    } catch {
      // Token is expired or invalid — clear it so the user is treated as a guest
      authStore.clearAuth()
    }

    // Hydrate seller store so hasSellers is accurate on all pages
    if (authStore.accessToken) {
      try {
        const sellerRes = await $fetch<{ success: boolean; data: any[] }>('/api/seller/list', {
          headers: { Authorization: `Bearer ${authStore.accessToken}` }
        })
        if (sellerRes?.data?.length) {
          sellerStore.setSellers(sellerRes.data)
        }
      } catch {
        // Non-sellers will 404 — silently ignore
      }
    }
  }

  return {
    provide: {
      auth: {
        isLoggedIn: () => profileStore.isLoggedIn,
        user: () => profileStore.me,
      }
    }
  }
})
