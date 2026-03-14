<template>
    <Teleport to="body">
        <transition
            enter-active-class="transition-opacity duration-200 ease-out"
            leave-active-class="transition-opacity duration-150 ease-in"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen && product"
                class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
                @click.self="$emit('close')"
            >
                <div
                    @click.stop
                    class="bg-white dark:bg-neutral-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
                >
                    <!-- Header -->
                    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-neutral-800">
                        <div class="flex items-center gap-2">
                            <Icon name="mdi:bullhorn-outline" size="20" class="text-brand" />
                            <h2 class="text-base font-semibold text-gray-900 dark:text-neutral-100">Market This Product</h2>
                        </div>
                        <button
                            @click="$emit('close')"
                            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <Icon name="mdi:close" size="18" class="text-gray-500 dark:text-neutral-400" />
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="px-5 py-5 space-y-5">

                        <!-- Product preview -->
                        <div class="flex items-center gap-3">
                            <div class="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 shrink-0">
                                <img
                                    v-if="coverImage"
                                    :src="coverImage"
                                    :alt="product.title"
                                    class="w-full h-full object-cover"
                                />
                                <div v-else class="w-full h-full flex items-center justify-center">
                                    <Icon name="mdi:image-outline" size="24" class="text-gray-300 dark:text-neutral-600" />
                                </div>
                            </div>
                            <div class="min-w-0">
                                <p class="text-sm font-semibold text-gray-900 dark:text-neutral-100 leading-snug line-clamp-2">{{ product.title }}</p>
                                <p class="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">{{ formatPrice(product.price) }}</p>
                            </div>
                        </div>

                        <!-- Earn pill -->
                        <div class="rounded-2xl bg-gradient-to-br from-brand to-[#8a0f2b] p-5 text-white text-center shadow-lg shadow-brand/20 dark:shadow-none">
                            <p class="text-xs font-medium uppercase tracking-wider opacity-80 mb-1">You earn</p>
                            <p class="text-4xl font-extrabold tracking-tight">{{ formatPrice(product.affiliateCommission!) }}</p>
                            <p class="text-sm opacity-80 mt-1">for every sale you drive</p>
                        </div>

                        <!-- How it works -->
                        <div class="space-y-2.5">
                            <p class="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wide">How it works</p>
                            <div class="flex items-start gap-2.5">
                                <div class="w-5 h-5 rounded-full bg-brand/10 dark:bg-brand/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span class="text-[10px] font-bold text-brand">1</span>
                                </div>
                                <p class="text-sm text-gray-600 dark:text-neutral-300">Copy your unique referral link below</p>
                            </div>
                            <div class="flex items-start gap-2.5">
                                <div class="w-5 h-5 rounded-full bg-brand/10 dark:bg-brand/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span class="text-[10px] font-bold text-brand">2</span>
                                </div>
                                <p class="text-sm text-gray-600 dark:text-neutral-300">Share it on your socials, stories, or DMs</p>
                            </div>
                            <div class="flex items-start gap-2.5">
                                <div class="w-5 h-5 rounded-full bg-brand/10 dark:bg-brand/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span class="text-[10px] font-bold text-brand">3</span>
                                </div>
                                <p class="text-sm text-gray-600 dark:text-neutral-300">Earn <strong>{{ formatPrice(product.affiliateCommission!) }}</strong> when someone buys through your link</p>
                            </div>
                        </div>

                        <!-- Referral link -->
                        <div>
                            <p class="text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-1.5">Your referral link</p>
                            <div class="flex items-center gap-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5">
                                <p class="flex-1 text-xs text-gray-500 dark:text-neutral-400 truncate font-mono">{{ referralUrl }}</p>
                                <button
                                    @click="copyLink"
                                    class="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
                                    :class="copied ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-brand/10 text-brand hover:bg-brand/20'"
                                >
                                    {{ copied ? 'Copied!' : 'Copy' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="px-5 pb-5 flex gap-3">
                        <button
                            @click="shareLink"
                            class="flex-1 flex items-center justify-center gap-2 py-3 bg-brand hover:bg-[#d81b36] text-white rounded-xl text-sm font-semibold transition-colors"
                        >
                            <Icon name="mdi:share-variant-outline" size="18" />
                            Share Now
                        </button>
                        <button
                            @click="$emit('close')"
                            class="px-5 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import type { IProduct } from '~~/layers/commerce/app/types/commerce.types'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';

const props = defineProps<{
    isOpen: boolean
    product: IProduct | null
}>()

defineEmits(['close'])

const profileStore = useProfileStore()
const coverImage = computed(() => {
    if (!props.product) return null
    return props.product.media?.find(m => !m.isBgMusic)?.url ?? null
})

const currency = computed(() => props.product?.seller?.default_currency ?? 'NGN')

const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: currency.value, maximumFractionDigits: 0 }).format(amount)

// Build referral URL — includes ?ref=userId so the server can attribute the sale
const referralUrl = computed(() => {
    if (!props.product || typeof window === 'undefined') return ''
    const base = `${window.location.origin}/discover?product=${props.product.id}`
    const userId = profileStore.me?.username
    return userId ? `${base}&ref=${userId}` : base
})

const copied = ref(false)

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(referralUrl.value)
        copied.value = true
        setTimeout(() => { copied.value = false }, 2500)
    } catch {}
}

const shareLink = async () => {
    if (!props.product) return
    const data = {
        title: props.product.title,
        text: `I earn ${formatPrice(props.product.affiliateCommission!)} when you buy this 👇`,
        url: referralUrl.value,
    }
    if (navigator.share) {
        try { await navigator.share(data) } catch {}
    } else {
        await copyLink()
    }
}

// Reset copied state when modal closes
watch(() => props.isOpen, (open) => {
    if (!open) copied.value = false
})
</script>
