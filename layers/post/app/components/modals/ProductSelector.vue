<template>
    <div 
        class="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
        @click.self="$emit('close')"
    >
        <div class="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="p-4 border-b border-gray-200 dark:border-neutral-800">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-neutral-100">
                        Tag Products
                    </h3>
                    <button 
                        @click="$emit('select', selectedProducts)"
                        class="px-4 py-2 bg-brand text-white rounded-lg font-semibold hover:bg-[#d81b36]"
                    >
                        Done
                    </button>
                </div>

                <!-- Search -->
                <div class="relative">
                    <Icon name="mdi:magnify" size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search products..."
                        class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                </div>
            </div>

            <!-- Products List -->
            <div class="flex-1 overflow-y-auto p-4">
                <div v-if="isLoading" class="text-center py-8">
                    <Icon name="eos-icons:loading" size="32" class="text-brand animate-spin" />
                </div>

                <div v-else-if="filteredProducts.length === 0" class="text-center py-8 text-gray-500 dark:text-neutral-400">
                    No products found
                </div>

                <div v-else class="grid grid-cols-2 gap-3">
                    <button
                        v-for="product in filteredProducts"
                        :key="product.id"
                        @click="toggleProduct(product)"
                        class="relative rounded-lg overflow-hidden border-2 transition-all text-left"
                        :class="isSelected(product.id)
                            ? 'border-brand ring-2 ring-brand/20'
                            : 'border-gray-200 dark:border-neutral-700 hover:border-brand/50'"
                    >
                        <div class="aspect-square bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                            <img
                                v-if="getProductImage(product)"
                                :src="getProductImage(product)"
                                :alt="product.title"
                                class="w-full h-full object-cover"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <Icon name="mdi:image-outline" size="40" class="text-gray-300" />
                            </div>
                        </div>
                        <div class="p-2 bg-white dark:bg-neutral-800">
                            <p class="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">
                                {{ product.title }}
                            </p>
                            <p class="text-xs text-gray-600 dark:text-neutral-400">
                                ${{ product.price.toFixed(2) }}
                            </p>
                        </div>
                        <div
                            v-if="isSelected(product.id)"
                            class="absolute top-2 right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center"
                        >
                            <Icon name="mdi:check" size="16" class="text-white" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProduct } from '~~/layers/commerce/app/composables/useProduct'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'

const props = defineProps<{ selected: any[] }>()
const emit = defineEmits(['select', 'close'])

const { fetchSellerProducts, isLoading } = useProduct()
const profileStore = useProfileStore()

const searchQuery = ref('')
const selectedProducts = ref([...props.selected])
const products = ref<any[]>([])

const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value
    return products.value.filter(p =>
        p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const getProductImage = (product: any) => {
    if (product.bannerImageUrl) return product.bannerImageUrl
    if (product.media && product.media.length > 0) return product.media[0].url
    return null
}

const isSelected = (productId: number) => selectedProducts.value.some(p => p.id === productId)

const toggleProduct = (product: any) => {
    if (isSelected(product.id)) {
        selectedProducts.value = selectedProducts.value.filter(p => p.id !== product.id)
    } else {
        selectedProducts.value.push(product)
    }
}

onMounted(async () => {
    const storeSlug = (profileStore.myProfile as any)?.sellerProfile?.store_slug
    if (!storeSlug) return
    try {
        const result: any = await fetchSellerProducts(storeSlug, { status: 'PUBLISHED' })
        products.value = result?.products || []
    } catch {
        // No seller profile or no products
    }
})
</script>