<template>
  <div class="px-3 py-4 sm:p-6">
    <!-- Page header -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
          Products
        </h1>
        <p class="mt-0.5 text-[13px] text-gray-400 dark:text-neutral-500">
          @{{ storeSlug }}
        </p>
      </div>
      <NuxtLink
        :to="`/seller/${storeSlug}/products/create`"
        class="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d81b36]"
      >
        <Icon name="mdi:plus" size="18" />
        Add Product
      </NuxtLink>
    </div>

    <div>
      <!-- Filter Bar -->
      <div class="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row">
        <div
          class="scrollbar-hide flex shrink-0 overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-700"
        >
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="activeStatus = tab.value"
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors',
              activeStatus === tab.value
                ? 'bg-brand text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700',
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="relative min-w-0 flex-1">
          <Icon
            name="mdi:magnify"
            size="18"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            v-model="search"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="isLoading && !products.length"
        class="flex justify-center py-20"
      >
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"
        />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="py-20 text-center">
        <p class="mb-3 text-red-500 dark:text-red-400">{{ error }}</p>
        <button
          @click="load"
          class="rounded-lg bg-brand px-4 py-2 text-sm text-white transition-colors hover:bg-[#d81b36]"
        >
          Retry
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="!products.length" class="py-20 text-center">
        <Icon
          name="mdi:package-variant-closed"
          size="64"
          class="mb-4 text-gray-300 dark:text-neutral-600"
        />
        <h3
          class="mb-2 text-lg font-semibold text-gray-700 dark:text-neutral-300"
        >
          No products yet
        </h3>
        <p class="mb-6 text-sm text-gray-500 dark:text-neutral-400">
          Add your first product to start selling
        </p>
        <NuxtLink
          :to="`/seller/${storeSlug}/products/create`"
          class="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[#d81b36]"
        >
          <Icon name="mdi:plus" size="18" />
          Add First Product
        </NuxtLink>
      </div>

      <!-- Products Grid -->
      <div
        v-else
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        >
          <!-- Image -->
          <div class="relative aspect-square bg-gray-100 dark:bg-neutral-700">
            <img
              v-if="product.media?.[0]?.url"
              :src="product.media[0].url"
              :alt="product.title"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center">
              <Icon
                name="mdi:image-off-outline"
                size="40"
                class="text-gray-300 dark:text-neutral-600"
              />
            </div>
            <!-- Status badge -->
            <span
              :class="[
                'absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold',
                product.status === 'PUBLISHED'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  : product.status === 'DRAFT'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-400',
              ]"
            >
              {{ product.status }}
            </span>
          </div>

          <!-- Info -->
          <div class="p-3">
            <p
              class="truncate text-sm font-semibold text-gray-900 dark:text-neutral-100"
            >
              {{ product.title }}
            </p>
            <p class="mt-1 font-bold text-brand">
              ₦{{ Number(product.price).toLocaleString() }}
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
              {{ product._count?.variants ?? 0 }} variant(s)
            </p>

            <!-- Actions -->
            <div class="mt-3 flex gap-2">
              <NuxtLink
                :to="`/seller/${storeSlug}/products/${product.id}/edit`"
                class="flex-1 rounded-lg border border-gray-200 py-1.5 text-center text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Edit
              </NuxtLink>
              <NuxtLink
                :to="`/seller/${storeSlug}/products/${product.id}/edit?tab=promote`"
                class="flex flex-1 items-center justify-center gap-1 rounded-lg border border-brand/40 py-1.5 text-center text-xs font-medium text-brand transition-colors hover:bg-brand/5"
              >
                <Icon name="mdi:rocket-launch-outline" size="12" />
                Promote
              </NuxtLink>
              <button
                @click="confirmDelete(product)"
                class="rounded-lg border border-red-200 px-2.5 py-1.5 text-center text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Icon name="mdi:archive-outline" size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="mt-8 flex justify-center">
        <button
          @click="loadMore"
          :disabled="isLoading"
          class="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          {{ isLoading ? 'Loading...' : 'Load more' }}
        </button>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <Teleport to="body">
      <div
        v-if="productToDelete"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/50"
          @click="productToDelete = null"
        />
        <div
          class="relative mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900"
        >
          <h3
            class="mb-2 text-lg font-semibold text-gray-900 dark:text-neutral-100"
          >
            Archive Product?
          </h3>
          <p class="mb-6 text-sm text-gray-600 dark:text-neutral-400">
            "{{ productToDelete.title }}" will be archived and hidden from the
            marketplace.
          </p>
          <div class="flex gap-3">
            <button
              @click="productToDelete = null"
              class="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 dark:border-neutral-700 dark:text-neutral-300"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="isDeleting"
              class="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
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

definePageMeta({ middleware: 'auth', layout: 'store-layout' })

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

const confirmDelete = (product: any) => {
  productToDelete.value = product
}

const handleDelete = async () => {
  if (!productToDelete.value) return
  isDeleting.value = true
  try {
    await deleteProduct(productToDelete.value.id)
    products.value = products.value.filter(
      (p) => p.id !== productToDelete.value!.id,
    )
    productToDelete.value = null
  } catch (e) {
    console.error('Delete failed:', e)
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => load())
</script>
