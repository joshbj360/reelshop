import { useAuthStore } from '~~/layers/base/app/stores/auth.store'

// SSE EventSource singleton — one stream per logged-in user
let eventSource: EventSource | null = null

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<any[]>([])
  const unreadCount = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getUnreadNotifications = computed(() =>
    notifications.value.filter((n) => !n.read),
  )

  const setNotifications = (newNotifications: any[]) => {
    notifications.value = newNotifications
    updateUnreadCount()
  }
  const addNotification = (notification: any) => {
    // Deduplicate
    if (notifications.value.some((n) => n.id === notification.id)) return
    notifications.value.unshift(notification)
    updateUnreadCount()
  }
  const markAsRead = (id: string) => {
    const n = notifications.value.find((n) => n.id === id)
    if (n) n.read = true
    updateUnreadCount()
  }
  const updateUnreadCount = () => {
    unreadCount.value = notifications.value.filter((n) => !n.read).length
  }
  const deleteNotification = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
    updateUnreadCount()
  }
  const setLoading = (loading: boolean) => { isLoading.value = loading }
  const setError = (err: string | null) => { error.value = err }
  const clearNotifications = () => {
    notifications.value = []
    unreadCount.value = 0
  }

  // ─── SSE stream ─────────────────────────────────────────────────────────────

  /**
   * Open the SSE stream — call this after the user logs in.
   *
   * The browser's EventSource API handles:
   *   - Auto-reconnect if the connection drops (with exponential backoff)
   *   - Deduplication of event IDs (if we ever add them)
   */
  const connectStream = () => {
    if (!import.meta.client) return
    if (eventSource) return // already connected

    const authStore = useAuthStore()
    const token = authStore.accessToken
    if (!token) return

    const url = `/api/notifications/stream?token=${encodeURIComponent(token)}`
    eventSource = new EventSource(url)

    // Server sends: event: connected
    eventSource.addEventListener('connected', () => {
      console.log('[Notifications] SSE stream connected')
    })

    // Server sends: event: notification  data: { ...notificationObject }
    eventSource.addEventListener('notification', (e: MessageEvent) => {
      try {
        const notification = JSON.parse(e.data)
        addNotification(notification)
      } catch {
        /* ignore malformed events */
      }
    })

    eventSource.onerror = () => {
      // EventSource auto-reconnects — we just log it
      console.warn('[Notifications] SSE stream error, will reconnect...')
    }
  }

  /**
   * Close the SSE stream — call this on logout.
   */
  const disconnectStream = () => {
    eventSource?.close()
    eventSource = null
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    getUnreadNotifications,
    setNotifications,
    addNotification,
    markAsRead,
    updateUnreadCount,
    deleteNotification,
    setLoading,
    setError,
    clearNotifications,
    connectStream,
    disconnectStream,
  }
})
