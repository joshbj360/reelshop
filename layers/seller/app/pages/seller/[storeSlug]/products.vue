<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-900">
    <!-- Header -->
    <div class="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtLink to="/seller/dashboard" class="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200">
              <Icon name="mdi:arrow-left" size="20" />
            </NuxtLink>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Products</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">@{{ storeSlug }}</p>
            </div>
          </div>
          <NuxtLink
            :to="`/seller/${storeSlug}/products/create`"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-[#d81b36] transition-colors"
          >
            <Icon name="mdi:plus" size="18" />
            Add Product
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <!-- Filter Bar -->
      <div class="flex items-center gap-3 mb-6">
        <div class="flex rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="activeStatus = tab.value"
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors',
              activeStatus === tab.value
                ? 'bg-brand text-white'
                : 'bg-white dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="flex-1 relative max-w-xs">
          <Icon name="mdi:magnify" size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Search products..."
            class="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading && !products.length" class="flex justify-center py-20">
        <div class="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 dark:text-red-400 mb-3">{{ error }}</p>
        <button @click="load" class="px-4 py-2 bg-brand text-white rounded-lg text-sm hover:bg-[#d81b36] transition-colors">Retry</button>
      </div>

      <!-- Empty -->
      <div v-else-if="!products.length" class="text-center py-20">
        <Icon name="mdi:package-variant-closed" size="64" class="text-gray-300 dark:text-neutral-600 mb-4" />
        <h3 class="text-lg font-semibold text-gray-700 dark:text-neutral-300 mb-2">No products yet</h3>
        <p class="text-sm text-gray-500 dark:text-neutral-400 mb-6">Add your first product to start selling</p>
        <NuxtLink
          :to="`/seller/${storeSlug}/products/create`"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-lg font-semibold hover:bg-[#d81b36] transition-colors"
        >
          <Icon name="mdi:plus" size="18" />
          Add First Product
        </NuxtLink>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Image -->
          <div class="aspect-square bg-gray-100 dark:bg-neutral-700 relative">
            <img
              v-if="product.media?.[0]?.url"
              :src="product.media[0].url"
              :alt="product.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon name="mdi:image-off-outline" size="40" class="text-gray-300 dark:text-neutral-600" />
            </div>
            <!-- Status badge -->
            <span
              :class="[
                'absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full',
                product.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                product.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' :
                'bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-400'
              ]"
            >
              {{ product.status }}
            </span>
          </div>

          <!-- Info -->
          <div class="p-3">
            <p class="font-semibold text-gray-900 dark:text-neutral-100 truncate text-sm">{{ product.title }}</p>
            <p class="text-brand font-bold mt-1">₦{{ Number(product.price).toLocaleString() }}</p>
            <p class="text-xs text-gray-500 dark:text-neutral-400 mt-1">{{ product._count?.variants ?? 0 }} variant(s)</p>

            <!-- Actions -->
            <div class="flex gap-2 mt-3">
              <NuxtLink
                :to="`/seller/${storeSlug}/products/${product.id}/edit`"
                class="flex-1 py-1.5 text-center text-xs font-medium rounded-lg border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Edit
              </NuxtLink>
              <button
                @click="confirmDelete(product)"
                class="flex-1 py-1.5 text-center text-xs font-medium rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="flex justify-center mt-8">
        <button
          @click="loadMore"
          :disabled="isLoading"
          class="px-6 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
        >
          {{ isLoading ? 'Loading...' : 'Load more' }}
        </button>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <Teleport to="body">
      <div v-if="productToDelete" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="productToDelete = null" />
        <div class="relative bg-white dark:bg-neutral-900 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-2">Archive Product?</h3>
          <p class="text-sm text-gray-600 dark:text-neutral-400 mb-6">
            "{{ productToDelete.title }}" will be archived and hidden from the marketplace.
          </p>
          <div class="flex gap-3">
            <button
              @click="productToDelete = null"
              class="flex-1 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm font-medium text-gray-700 dark:text-neutral-300"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="isDeleting"
              class="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {{ isDeleting ? 'Archiving...' : 'Archive' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useProduct } from '~~/layers/commerce/app/composables/useProduct'

definePageMeta({ middleware: 'auth', layout: 'default' })

const route = useRoute()
const storeSlug = computed(() => route.params.storeSlug as string)

const { fetchSellerProducts, deleteProduct, isLoading, error } = useProduct()

const statusTabs = [
  { label: 'All', value: '' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Archived', value: 'ARCHIVED' },
]

const activeStatus = ref('')
const search = ref('')
const products = ref<any[]>([])
const total = ref(0)
const offset = ref(0)
const limit = 20
const hasMore = computed(() => offset.value < total.value)
const productToDelete = ref<any | null>(null)
const isDeleting = ref(false)

let debounce: ReturnType<typeof setTimeout> | null = null

const load = async (reset = true) => {
  if (reset) {
    offset.value = 0
    products.value = []
  }
  const params: any = { limit, offset: offset.value }
  if (activeStatus.value) params.status = activeStatus.value
  if (search.value.trim()) params.search = search.value.trim()

  const data: any = await fetchSellerProducts(storeSlug.value, params)
  if (data) {
    if (reset) {
      products.value = data.products || []
    } else {
      products.value.push(...(data.products || []))
    }
    total.value = data.meta?.total ?? 0
    offset.value = products.value.length
  }
}

const loadMore = () => load(false)

watch([activeStatus], () => load())
watch(search, () => {
  if (debounce) clearTimeout(debounce)
  debounce = setTimeout(() => load(), 350)
})

const confirmDelete = (product: any) => { productToDelete.value = product }

const handleDelete = async () => {
  if (!productToDelete.value) return
  isDeleting.value = true
  try {
    await deleteProduct(productToDelete.value.id)
    products.value = products.value.filter(p => p.id !== productToDelete.value!.id)
    productToDelete.value = null
  } catch (e) {
    console.error('Delete failed:', e)
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => load())
</script>
