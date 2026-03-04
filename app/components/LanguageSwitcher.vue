<template>
    <div class="relative" ref="dropdownRef">
        <button
            @click="isOpen = !isOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
            <Icon name="mdi:web" size="14" />
            <span>{{ currentLocale?.name ?? 'EN' }}</span>
            <Icon name="mdi:chevron-down" size="13" :class="isOpen ? 'rotate-180' : ''" class="transition-transform" />
        </button>

        <Transition
            enter-active-class="transition-all duration-150 ease-out"
            leave-active-class="transition-all duration-150 ease-in"
            enter-from-class="opacity-0 translate-y-1"
            leave-to-class="opacity-0 translate-y-1"
        >
            <div
                v-if="isOpen"
                class="absolute bottom-full mb-1 left-0 w-40 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 overflow-hidden z-50"
            >
                <button
                    v-for="locale in locales"
                    :key="locale.code"
                    @click="switchLocale(locale.code)"
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                    :class="locale.code === currentCode ? 'text-brand font-semibold' : 'text-gray-700 dark:text-neutral-300'"
                >
                    <span class="text-base leading-none">{{ flagEmoji(locale.code) }}</span>
                    <span>{{ locale.name }}</span>
                    <Icon v-if="locale.code === currentCode" name="mdi:check" size="12" class="ml-auto text-brand" />
                </button>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const { locale, locales, setLocale } = useI18n();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const currentCode = computed(() => locale.value);
const currentLocale = computed(() => (locales.value as any[]).find(l => l.code === locale.value));

const FLAGS: Record<string, string> = {
    en: '🇬🇧', fr: '🇫🇷', es: '🇪🇸', de: '🇩🇪',
    pt: '🇧🇷', zh: '🇨🇳', ar: '🇸🇦'
};
const flagEmoji = (code: string) => FLAGS[code] ?? '🌐';

const switchLocale = async (code: string) => {
    await setLocale(code);
    isOpen.value = false;
};

// Close on outside click
const onClickOutside = (e: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        isOpen.value = false;
    }
};
onMounted(() => document.addEventListener('click', onClickOutside));
onUnmounted(() => document.removeEventListener('click', onClickOutside));
</script>
