<template>
    <Teleport to="body">
        <Transition name="sidebar">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex justify-end">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/40" @click="$emit('close')" />

                <!-- Panel -->
                <div class="relative bg-white dark:bg-neutral-900 w-full sm:max-w-[400px] h-full flex flex-col shadow-2xl">
                    <!-- Header -->
                    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-neutral-800 shrink-0">
                        <div class="flex items-center gap-2">
                            <Icon name="mdi:shopping-outline" size="22" class="text-gray-700 dark:text-neutral-300" />
                            <h2 class="text-[16px] font-bold text-gray-900 dark:text-neutral-100">Cart</h2>
                            <span v-if="cartCount > 0" class="bg-brand text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                                {{ cartCount }}
                            </span>
                        </div>
                        <button
                            @click="$emit('close')"
                            class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
                        >
                            <Icon name="mdi:close" size="20" class="text-gray-500 dark:text-neutral-400" />
                        </button>
                    </div>

                    <!-- Items list -->
                    <div class="flex-1 overflow-y-auto">
                        <!-- Empty state -->
                        <div v-if="!items.length && !isLoading" class="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                            <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                                <Icon name="mdi:shopping-outline" size="36" class="text-gray-300 dark:text-neutral-600" />
                            </div>
                            <p class="text-[15px] font-semibold text-gray-700 dark:text-neutral-300">Your cart is empty</p>
                            <p class="text-[13px] text-gray-400 dark:text-neutral-500">Browse the shop and add items to get started</p>
                            <button @click="$emit('close')" class="text-[13px] font-semibold text-brand hover:text-[#d81b36] transition-colors">
                                Continue shopping →
                            </button>
                        </div>

                        <!-- Loading skeleton -->
                        <div v-else-if="isLoading && !items.length" class="px-5 pt-4 space-y-4">
                            <div v-for="i in 3" :key="i" class="flex gap-3 animate-pulse">
                                <div class="w-16 h-16 rounded-xl bg-gray-100 dark:bg-neutral-800 shrink-0" />
                                <div class="flex-1 space-y-2">
                                    <div class="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-3/4" />
                                    <div class="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-1/2" />
                                </div>
                            </div>
                        </div>

                        <!-- Cart items -->
                        <ul v-else class="px-4 pt-4 pb-2 space-y-3">
                            <li
                                v-for="item in items"
                                :key="item.variantId"
                                class="flex gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group"
                            >
                                <!-- Thumbnail -->
                                <div class="w-[60px] h-[60px] rounded-xl bg-gray-100 dark:bg-neutral-800 overflow-hidden shrink-0">
                                    <img
                                        v-if="item.variant?.product?.media?.length"
                                        :src="item.variant.product.media[0].url"
                                        :alt="item.variant?.product?.title"
                                        class="w-full h-full object-cover"
                                    />
                                    <div v-else class="w-full h-full flex items-center justify-center">
                                        <Icon name="mdi:image-outline" size="22" class="text-gray-300 dark:text-neutral-600" />
                                    </div>
                                </div>

                                <!-- Info -->
                                <div class="flex-1 min-w-0">
                                    <p class="text-[13px] font-semibold text-gray-900 dark:text-neutral-100 truncate leading-snug">
                                        {{ item.variant?.product?.title ?? 'Product' }}
                                    </p>
                                    <p v-if="item.variant?.size" class="text-[11px] text-gray-400 dark:text-neutral-500 mt-0.5">
                                        Size: {{ item.variant.size }}
                                    </p>
                                    <p class="text-[13px] font-bold text-gray-900 dark:text-neutral-100 mt-0.5">
                                        {{ formatPrice(itemPrice(item) * item.quantity, item.variant?.product?.seller?.default_currency ?? 'NGN') }}
                                    </p>

                                    <!-- Qty controls -->
                                    <div class="flex items-center gap-2 mt-1.5">
                                        <div class="flex items-center border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                                            <button
                                                @click="handleDecrement(item)"
                                                class="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-500"
                                            >
                                                <Icon name="mdi:minus" size="14" />
                                            </button>
                                            <span class="w-8 text-center text-[13px] font-semibold text-gray-900 dark:text-neutral-100">{{ item.quantity }}</span>
                                            <button
                                                @click="updateQuantity(item.variantId, item.quantity + 1)"
                                                class="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-500"
                                            >
                                                <Icon name="mdi:plus" size="14" />
                                            </button>
                                        </div>

                                        <!-- Remove — always visible on touch, fade on desktop -->
                                        <button
                                            @click="removeFromCart(item.variantId)"
                                            class="ml-auto p-1.5 rounded-full text-gray-400 dark:text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                                        >
                                            <Icon name="mdi:trash-can-outline" size="16" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- Footer -->
                    <div v-if="items.length > 0" class="shrink-0 px-5 py-4 border-t border-gray-100 dark:border-neutral-800 space-y-3">
                        <!-- Subtotal -->
                        <div class="flex items-center justify-between text-[14px]">
                            <span class="text-gray-500 dark:text-neutral-400">Subtotal</span>
                            <span class="font-bold text-gray-900 dark:text-neutral-100">{{ formatPrice(cartTotal) }}</span>
                        </div>

                        <!-- Checkout CTA -->
                        <NuxtLink
                            to="/checkout"
                            @click="$emit('close')"
                            class="flex items-center justify-center gap-2 w-full py-3.5 bg-brand text-white rounded-xl text-[14px] font-bold hover:bg-[#d81b36] active:scale-[0.98] transition-all"
                        >
                            <Icon name="mdi:lock-outline" size="16" />
                            Checkout
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'

const props = defineProps<{ isOpen: boolean }>()
defineEmits(['close'])

const profileStore = useProfileStore()
const { items, cartCount, cartTotal, isLoading, fetchCart, updateQuantity, removeFromCart } = useCart()

watch(() => props.isOpen, async (open) => {
    if (open && profileStore.isLoggedIn) {
        await fetchCart()
    }
})

const handleDecrement = (item: any) => {
    if (item.quantity <= 1) {
        removeFromCart(item.variantId)
    } else {
        updateQuantity(item.variantId, item.quantity - 1)
    }
}

const itemPrice = (item: any): number => {
    return item.variant?.price ?? item.variant?.product?.price ?? 0
}

</script>

<style scoped>
.sidebar-enter-active, .sidebar-leave-active { transition: opacity 0.25s ease; }
.sidebar-enter-from, .sidebar-leave-to { opacity: 0; }
.sidebar-enter-active > div:last-child, .sidebar-leave-active > div:last-child { transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1); }
.sidebar-enter-from > div:last-child, .sidebar-leave-to > div:last-child { transform: translateX(100%); }
</style>
