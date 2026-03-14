<template>
    <HomeLayout :narrow-feed="true" :hide-right-sidebar="true">
        <div class="max-w-2xl mx-auto py-6 px-2 sm:px-0 space-y-4">

            <!-- Header -->
            <div class="flex items-center gap-3 mb-2">
                <button @click="$router.back()" class="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                    <Icon name="mdi:arrow-left" size="22" />
                </button>
                <h1 class="text-xl font-bold text-gray-900 dark:text-neutral-100">Settings</h1>
            </div>

            <!-- Appearance -->
            <section class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
                <div class="px-5 py-3.5 border-b border-gray-100 dark:border-neutral-800">
                    <h2 class="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Appearance</h2>
                </div>

                <!-- Dark mode -->
                <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-neutral-800">
                    <div class="flex items-center gap-3">
                        <Icon name="mdi:weather-night" size="20" class="text-gray-500 dark:text-neutral-400" />
                        <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">Dark Mode</p>
                            <p class="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">Change app theme</p>
                        </div>
                    </div>
                    <div class="flex gap-1 bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl">
                        <button
                            v-for="opt in COLOR_MODES"
                            :key="opt.value"
                            @click="colorMode.preference = opt.value"
                            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            :class="colorMode.preference === opt.value
                                ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 shadow-sm'
                                : 'text-gray-500 dark:text-neutral-400'"
                        >
                            {{ opt.label }}
                        </button>
                    </div>
                </div>

                <!-- Text size -->
                <div class="flex items-center justify-between px-5 py-4">
                    <div class="flex items-center gap-3">
                        <Icon name="mdi:format-size" size="20" class="text-gray-500 dark:text-neutral-400" />
                        <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">Text Size</p>
                            <p class="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">Adjust reading comfort</p>
                        </div>
                    </div>
                    <div class="flex gap-1 bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl">
                        <button
                            v-for="opt in TEXT_SIZES"
                            :key="opt.value"
                            @click="update('textSize', opt.value)"
                            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            :class="settings.textSize === opt.value
                                ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 shadow-sm'
                                : 'text-gray-500 dark:text-neutral-400'"
                        >
                            {{ opt.label }}
                        </button>
                    </div>
                </div>
            </section>

            <!-- Playback -->
            <section class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
                <div class="px-5 py-3.5 border-b border-gray-100 dark:border-neutral-800">
                    <h2 class="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Playback</h2>
                </div>

                <SettingToggle
                    icon="mdi:volume-off"
                    label="Auto-mute Videos"
                    description="Videos play silently by default"
                    :value="settings.autoMute"
                    @change="update('autoMute', $event)"
                />
            </section>

            <!-- Feed -->
            <section class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
                <div class="px-5 py-3.5 border-b border-gray-100 dark:border-neutral-800">
                    <h2 class="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Feed</h2>
                </div>

                <SettingToggle
                    icon="mdi:view-agenda-outline"
                    label="Compact Feed"
                    description="Show smaller post cards"
                    :value="settings.compactFeed"
                    @change="update('compactFeed', $event)"
                    :border="true"
                />
                <SettingToggle
                    icon="mdi:closed-caption-outline"
                    label="Show Captions"
                    description="Display post captions on cards"
                    :value="settings.showCaptions"
                    @change="update('showCaptions', $event)"
                    :border="true"
                />
                <SettingToggle
                    icon="mdi:heart-outline"
                    label="Show Like Counts"
                    description="Display like numbers on posts"
                    :value="settings.showLikeCounts"
                    @change="update('showLikeCounts', $event)"
                />
            </section>

            <!-- Language -->
            <section class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
                <div class="px-5 py-3.5 border-b border-gray-100 dark:border-neutral-800">
                    <h2 class="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Language</h2>
                </div>
                <div class="px-5 py-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <Icon name="mdi:translate" size="20" class="text-gray-500 dark:text-neutral-400" />
                        <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">App Language</p>
                    </div>
                    <select
                        :value="locale"
                        @change="setLocale(($event.target as HTMLSelectElement).value as any)"
                        class="text-sm bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border-0 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
                    >
                        <option v-for="l in locales" :key="(l as any).code" :value="(l as any).code">{{ (l as any).name }}</option>
                    </select>
                </div>
            </section>

            <!-- Account -->
            <ClientOnly>
                <section v-if="profileStore.isLoggedIn" class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
                    <div class="px-5 py-3.5 border-b border-gray-100 dark:border-neutral-800">
                        <h2 class="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Account</h2>
                    </div>

                    <NuxtLink to="/buyer/orders" class="setting-link border-b border-gray-100 dark:border-neutral-800">
                        <Icon name="mdi:package-variant-closed-outline" size="20" class="text-gray-500 dark:text-neutral-400" />
                        <span>My Orders</span>
                        <Icon name="mdi:chevron-right" size="18" class="ml-auto text-gray-400" />
                    </NuxtLink>

                    <NuxtLink
                        :to="profileStore.me?.role === 'seller' ? '/sellers/dashboard' : '/buyer/profile'"
                        class="setting-link border-b border-gray-100 dark:border-neutral-800"
                    >
                        <Icon name="mdi:account-outline" size="20" class="text-gray-500 dark:text-neutral-400" />
                        <span>Edit Profile</span>
                        <Icon name="mdi:chevron-right" size="18" class="ml-auto text-gray-400" />
                    </NuxtLink>

                    <button @click="handleLogout" class="setting-link w-full text-red-500">
                        <Icon name="mdi:logout" size="20" />
                        <span>Log Out</span>
                    </button>
                </section>
            </ClientOnly>

            <!-- Reset -->
            <button
                @click="reset"
                class="w-full text-center text-xs text-gray-400 dark:text-neutral-600 hover:text-gray-600 dark:hover:text-neutral-400 py-2 transition-colors"
            >
                Reset all settings to defaults
            </button>

        </div>
    </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from '~/layouts/HomeLayout.vue'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'

definePageMeta({ middleware: undefined })

const { settings, update, reset } = useSettings()
const colorMode = useColorMode()
const profileStore = useProfileStore()
const { locale, locales, setLocale } = useI18n()

const COLOR_MODES = [
    { value: 'light', label: 'Light' },
    { value: 'system', label: 'Auto' },
    { value: 'dark', label: 'Dark' },
]

const TEXT_SIZES = [
    { value: 'small', label: 'S' },
    { value: 'medium', label: 'M' },
    { value: 'large', label: 'L' },
]

useSeoMeta({ title: 'Settings · Styli', robots: 'noindex' })

const handleLogout = async () => {
    await navigateTo('/user-login')
    // Auth store clears on login page mount
}
</script>

<style scoped>
.setting-link {
    @apply flex items-center gap-3 px-5 py-4 text-sm font-medium text-gray-900 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors;
}
</style>
