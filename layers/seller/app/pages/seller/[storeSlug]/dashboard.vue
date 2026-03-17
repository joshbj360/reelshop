<template>
  <div class="max-w-5xl px-3 py-4 sm:px-6 sm:py-6">
    <!-- Loading skeleton -->
    <div v-if="isPageLoading" class="animate-pulse space-y-6">
      <div class="h-8 w-1/3 rounded bg-gray-200 dark:bg-neutral-800" />
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="i in 3"
          :key="i"
          class="h-24 rounded-xl bg-gray-200 dark:bg-neutral-800"
        />
      </div>
      <div class="h-64 rounded-xl bg-gray-200 dark:bg-neutral-800" />
    </div>

    <template v-else>
      <!-- Header -->
      <div class="mb-6 flex items-start justify-between">
        <div>
          <div class="mb-1 flex flex-wrap items-center gap-2">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
              {{ seller?.store_name ?? storeSlug }}
            </h1>
            <span
              v-if="seller?.is_verified"
              class="flex items-center gap-0.5 rounded-full bg-blue-500 px-2 py-0.5 text-[11px] font-bold text-white"
            >
              <Icon name="mdi:check-circle" size="11" /> Verified
            </span>
            <span
              class="rounded-full px-2 py-0.5 text-[11px] font-bold"
              :class="
                seller?.is_active
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-400 text-white'
              "
            >
              {{ seller?.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <p class="text-[13px] text-gray-400 dark:text-neutral-500">
            @{{ storeSlug }}
          </p>
        </div>

        <div class="flex shrink-0 gap-2">
          <NuxtLink
            :to="`/sellers/profile/${storeSlug}`"
            target="_blank"
            class="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Icon name="mdi:open-in-new" size="16" />
            <span class="hidden sm:inline">View Profile</span>
          </NuxtLink>
          <NuxtLink
            :to="`/seller/${storeSlug}/products/create`"
            class="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#f02c56] to-purple-600 px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Icon name="mdi:plus" size="16" />
            <span class="hidden sm:inline">Add Product</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Wallet balance card -->
      <div class="mb-6 rounded-xl bg-gradient-to-br from-brand to-[#d81b36] p-5 text-white">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs text-white/70">Available Balance</p>
            <p class="text-3xl font-bold">{{ formatAmount(storeWallet.balance) }}</p>
            <p class="mt-1 text-xs text-white/70">
              <span class="font-semibold text-white/90">{{ formatAmount(storeWallet.pendingBalance) }}</span>
              pending (releases on delivery)
            </p>
          </div>
          <Icon name="mdi:wallet" size="40" class="text-white/20" />
        </div>
        <div class="mt-4 grid grid-cols-2 gap-3 border-t border-white/20 pt-4">
          <div>
            <p class="text-[11px] text-white/60">Total Earned</p>
            <p class="text-sm font-bold">{{ formatAmount(storeWallet.totalEarned) }}</p>
          </div>
          <div>
            <p class="text-[11px] text-white/60">Total Paid Out</p>
            <p class="text-sm font-bold">{{ formatAmount(storeWallet.totalSpent) }}</p>
          </div>
        </div>
      </div>

      <!-- Stats row -->
      <div class="mb-6 grid grid-cols-3 gap-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"
        >
          <p
            class="text-xl font-bold text-gray-900 sm:text-2xl dark:text-neutral-100"
          >
            {{ productCount }}
          </p>
          <p class="mt-0.5 text-[12px] text-gray-500 dark:text-neutral-400">
            Products
          </p>
        </div>
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"
        >
          <p
            class="text-xl font-bold text-gray-900 sm:text-2xl dark:text-neutral-100"
          >
            {{ seller?.followers_count ?? 0 }}
          </p>
          <p class="mt-0.5 text-[12px] text-gray-500 dark:text-neutral-400">
            Followers
          </p>
        </div>
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"
        >
          <p
            class="text-xl font-bold text-gray-500 sm:text-2xl dark:text-neutral-500"
          >
            0
          </p>
          <p class="mt-0.5 text-[12px] text-gray-500 dark:text-neutral-400">
            Orders
          </p>
        </div>
      </div>

      <!-- Recent Products -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="font-semibold text-gray-900 dark:text-neutral-100">
            Recent Products
          </h2>
          <NuxtLink
            :to="`/seller/${storeSlug}/products`"
            class="text-[13px] font-medium text-brand hover:underline"
          >
            View all
          </NuxtLink>
        </div>

        <!-- Loading -->
        <div
          v-if="productsLoading"
          class="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <div
            v-for="i in 4"
            :key="i"
            class="aspect-square animate-pulse rounded-xl bg-gray-100 dark:bg-neutral-800"
          />
        </div>

        <!-- Empty -->
        <div v-else-if="!recentProducts.length" class="py-10 text-center">
          <Icon
            name="mdi:package-variant-closed-remove"
            size="40"
            class="mb-2 text-gray-300 dark:text-neutral-600"
          />
          <p class="text-[13px] text-gray-500 dark:text-neutral-400">
            No products yet
          </p>
          <NuxtLink
            :to="`/seller/${storeSlug}/products/create`"
            class="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:underline"
          >
            <Icon name="mdi:plus" size="14" /> Add your first product
          </NuxtLink>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NuxtLink
            v-for="product in recentProducts"
            :key="product.id"
            :to="`/seller/${storeSlug}/products/${product.id}/edit`"
            class="group overflow-hidden rounded-xl border border-gray-100 transition-shadow hover:shadow-md dark:border-neutral-700"
          >
            <div class="relative aspect-square bg-gray-100 dark:bg-neutral-800">
              <img
                v-if="product.media?.[0]?.url"
                :src="product.media[0].url"
                :alt="product.title"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center"
              >
                <Icon
                  name="mdi:image-off-outline"
                  size="28"
                  class="text-gray-300 dark:text-neutral-600"
                />
              </div>
              <span
                :class="[
                  'absolute left-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                  product.status === 'PUBLISHED'
                    ? 'bg-emerald-500 text-white'
                    : product.status === 'DRAFT'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-400 text-white',
                ]"
                >{{ product.status }}</span
              >
            </div>
            <div class="p-2">
              <p
                class="truncate text-[12px] font-semibold text-gray-900 dark:text-neutral-100"
              >
                {{ product.title }}
              </p>
              <p class="text-[11px] font-bold text-brand">
                ₦{{ Number(product.price).toLocaleString() }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useSellerManagement } from '~~/layers/seller/app/composables/useSellerManagement'
import { useProduct } from '~~/layers/commerce/app/composables/useProduct'
import { BaseApiClient } from '~~/layers/base/app/services/base.api'

definePageMeta({ middleware: 'auth', layout: 'store-layout' })

const route = useRoute()
const storeSlug = computed(() => route.params.storeSlug as string)

const { loadPublicSeller, currentSeller: seller } = useSellerManagement()
const { fetchSellerProducts } = useProduct()

const isPageLoading = ref(true)
const productsLoading = ref(false)
const recentProducts = ref<any[]>([])
const productCount = ref(0)
const storeWallet = ref({ balance: 0, pendingBalance: 0, totalEarned: 0, totalSpent: 0 })

const formatAmount = (kobo: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(kobo / 100)

const loadData = async (slug: string) => {
  try {
    await loadPublicSeller(slug)
  } catch {}

  // Load products and wallet in parallel
  productsLoading.value = true
  const api = new BaseApiClient()
  const [productsRes, walletRes]: any[] = await Promise.allSettled([
    fetchSellerProducts(slug, { limit: 4 }),
    api.request(`/api/commerce/wallet/store/${slug}`, { method: 'GET' }),
  ])

  if (productsRes.status === 'fulfilled') {
    recentProducts.value = productsRes.value?.products ?? []
    productCount.value = productsRes.value?.meta?.total ?? 0
  } else {
    recentProducts.value = []
  }
  productsLoading.value = false

  if (walletRes.status === 'fulfilled' && walletRes.value?.data) {
    const w = walletRes.value.data
    storeWallet.value = {
      balance: w.balance ?? 0,
      pendingBalance: w.pendingBalance ?? 0,
      totalEarned: w.totalEarned ?? 0,
      totalSpent: w.totalSpent ?? 0,
    }
  }
}

onMounted(async () => {
  await loadData(storeSlug.value)
  isPageLoading.value = false
})

watch(storeSlug, (slug) => {
  isPageLoading.value = true
  loadData(slug).finally(() => {
    isPageLoading.value = false
  })
})
</script>
