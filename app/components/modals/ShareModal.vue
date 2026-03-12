<template>
    <Teleport to="body">
        <Transition name="sheet">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')" />

                <!-- Sheet -->
                <div class="relative bg-white dark:bg-neutral-900 rounded-t-3xl md:rounded-2xl w-full md:max-w-sm shadow-2xl overflow-hidden">
                    <!-- Handle -->
                    <div class="md:hidden flex justify-center pt-3 pb-1">
                        <div class="w-10 h-1 rounded-full bg-gray-200 dark:bg-neutral-700" />
                    </div>

                    <div class="px-5 pb-6 pt-3">
                        <h3 class="text-[15px] font-bold text-gray-900 dark:text-neutral-100 text-center mb-4">Share</h3>

                        <!-- Platform buttons -->
                        <div class="grid grid-cols-4 gap-3 mb-5">
                            <button
                                v-for="p in platforms"
                                :key="p.id"
                                @click="share(p)"
                                class="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors active:scale-95"
                            >
                                <div
                                    class="w-12 h-12 rounded-2xl flex items-center justify-center"
                                    :style="{ background: p.bg }"
                                >
                                    <Icon :name="p.icon" size="24" class="text-white" />
                                </div>
                                <span class="text-[11px] text-gray-600 dark:text-neutral-400 font-medium">{{ p.label }}</span>
                            </button>
                        </div>

                        <!-- Copy link row -->
                        <div class="flex items-center gap-2 bg-gray-50 dark:bg-neutral-800 rounded-xl px-3 py-2.5">
                            <Icon name="mdi:link-variant" size="18" class="text-gray-400 shrink-0" />
                            <span class="flex-1 text-[12px] text-gray-600 dark:text-neutral-400 truncate">{{ url }}</span>
                            <button
                                @click="copyLink"
                                class="text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0"
                                :class="copied ? 'bg-green-500 text-white' : 'bg-brand text-white hover:bg-[#d81b36]'"
                            >
                                {{ copied ? 'Copied!' : 'Copy' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'

const props = defineProps<{
    isOpen: boolean
    url: string
    title?: string
    text?: string
}>()

defineEmits(['close'])

const copied = ref(false)

const platforms = computed(() => [
    {
        id: 'whatsapp',
        label: 'WhatsApp',
        icon: 'mdi:whatsapp',
        bg: '#25D366',
        href: `https://wa.me/?text=${encodeURIComponent((props.title ? props.title + '\n' : '') + props.url)}`
    },
    {
        id: 'twitter',
        label: 'X / Twitter',
        icon: 'mdi:twitter',
        bg: '#000000',
        href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title || '')}&url=${encodeURIComponent(props.url)}`
    },
    {
        id: 'facebook',
        label: 'Facebook',
        icon: 'mdi:facebook',
        bg: '#1877F2',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`
    },
    {
        id: 'telegram',
        label: 'Telegram',
        icon: 'mdi:telegram',
        bg: '#229ED9',
        href: `https://t.me/share/url?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title || '')}`
    },
])

const share = (platform: { href: string }) => {
    window.open(platform.href, '_blank', 'noopener,width=600,height=500')
}

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(props.url)
        copied.value = true
        notify({ type: 'success', text: 'Link copied!' })
        setTimeout(() => { copied.value = false }, 2500)
    } catch {
        notify({ type: 'error', text: 'Could not copy link' })
    }
}
</script>

<style scoped>
.sheet-enter-active { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease; }
.sheet-leave-active { transition: transform 0.2s ease, opacity 0.15s ease; }
.sheet-enter-from, .sheet-leave-to { transform: translateY(100%); opacity: 0; }
@media (min-width: 768px) {
    .sheet-enter-from, .sheet-leave-to { transform: scale(0.95); }
}
</style>
