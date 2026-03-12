const STORAGE_KEY = 'styli_settings'

export interface AppSettings {
  autoMute: boolean
  textSize: 'small' | 'medium' | 'large'
  compactFeed: boolean
  showLikeCounts: boolean
  showCaptions: boolean
}

const defaults: AppSettings = {
  autoMute: true,
  textSize: 'medium',
  compactFeed: false,
  showLikeCounts: true,
  showCaptions: true,
}

const settings = ref<AppSettings>({ ...defaults })
let initialized = false

const load = () => {
  if (!import.meta.client) return
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) Object.assign(settings.value, JSON.parse(stored))
  } catch { /* ignore */ }
}

const save = () => {
  if (!import.meta.client) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
}

const applyTextSize = (size: AppSettings['textSize']) => {
  if (!import.meta.client) return
  document.documentElement.classList.remove('text-size-small', 'text-size-large')
  if (size !== 'medium') document.documentElement.classList.add(`text-size-${size}`)
}

export const useSettings = () => {
  if (import.meta.client && !initialized) {
    initialized = true
    load()
    applyTextSize(settings.value.textSize)
  }

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    settings.value[key] = value
    save()
    if (key === 'textSize') applyTextSize(value as AppSettings['textSize'])
  }

  const reset = () => {
    Object.assign(settings.value, defaults)
    save()
    applyTextSize(defaults.textSize)
  }

  return { settings: readonly(settings), update, reset }
}
