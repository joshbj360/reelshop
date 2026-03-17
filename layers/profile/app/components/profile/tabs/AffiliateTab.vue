<template>
  <div class="space-y-6 p-6">
    <!-- Loading -->
    <div v-if="isLoading && !loaded" class="py-12 text-center">
      <Icon name="eos-icons:loading" size="32" class="animate-spin text-brand" />
    </div>

    <template v-else>
      <!-- Not enrolled CTA -->
      <div
        v-if="!isEnrolled"
        class="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-center text-white"
      >
        <Icon name="mdi:cash-multiple" size="64" class="mx-auto mb-4" />
        <h2 class="mb-2 text-2xl font-bold">Join the Affiliate Program</h2>
        <p class="mb-6 text-white/90">
          Earn commission by sharing products you love. Get 10% on every sale!
        </p>
        <button
          @click="handleEnroll"
          :disabled="isLoading"
          class="rounded-lg bg-white px-8 py-3 font-bold text-purple-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
        >
          Enroll Now
        </button>
        <p v-if="enrollMessage" class="mt-3 text-sm text-white/80">
          {{ enrollMessage }}
        </p>
      </div>

      <!-- Enrolled Dashboard -->
      <template v-else>
        <!-- Overview stats -->
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <Icon name="mdi:cash" size="24" class="mb-2 text-green-500" />
            <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
              {{ formatAmount(stats.totalEarnings ?? 0) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">Total Earnings</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <Icon name="mdi:mouse" size="24" class="mb-2 text-blue-500" />
            <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
              {{ stats.totalClicks ?? 0 }}
            </p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">Total Clicks</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <Icon name="mdi:cart-check" size="24" class="mb-2 text-brand" />
            <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
              {{ stats.totalConversions ?? 0 }}
            </p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">Conversions</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <Icon name="mdi:percent" size="24" class="mb-2 text-purple-500" />
            <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
              {{ (stats.conversionRate ?? 0).toFixed(2) }}%
            </p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">Conversion Rate</p>
          </div>
        </div>

        <!-- Affiliate Link -->
        <div
          v-if="affiliateCode"
          class="rounded-xl border border-gray-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-neutral-100">Your Affiliate Link</h3>
          <div class="flex gap-2">
            <input
              :value="affiliateLink"
              readonly
              class="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 font-mono text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
            <button
              @click="copyLink"
              class="rounded-lg bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-[#d81b36]"
            >
              <Icon name="mdi:content-copy" size="20" />
            </button>
          </div>
        </div>

        <!-- ────────────────────────────────────────────────────────── -->
        <!-- SECTION: My Products Being Affiliated                      -->
        <!-- ────────────────────────────────────────────────────────── -->
        <div
          v-if="hasSellers"
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-neutral-800">
            <div class="flex items-center gap-3">
              <Icon name="mdi:store-check" size="22" class="text-brand" />
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-neutral-100">
                  My Affiliatable Products
                </h3>
                <p class="text-xs text-gray-400 dark:text-neutral-500">
                  Products from your stores with affiliate commission set
                </p>
              </div>
            </div>
            <div v-if="sellerProductStats.products.length" class="text-right">
              <p class="text-xs text-gray-400 dark:text-neutral-500">Total Revenue</p>
              <p class="text-sm font-bold text-gray-900 dark:text-neutral-100">
                {{ formatAmount(sellerProductStats.totalRevenue) }}
              </p>
            </div>
          </div>

          <!-- Loading products -->
          <div v-if="loadingSellerProducts" class="py-8 text-center">
            <Icon name="eos-icons:loading" size="24" class="animate-spin text-gray-300" />
          </div>

          <div
            v-else-if="!sellerProductStats.products.length"
            class="p-8 text-center text-gray-400 dark:text-neutral-500"
          >
            <Icon name="mdi:tag-off-outline" size="40" class="mx-auto mb-2" />
            <p class="text-sm">No affiliatable products yet</p>
            <p class="mt-1 text-xs">
              Set an affiliate commission on your products to let others promote them
            </p>
          </div>

          <div v-else class="divide-y divide-gray-100 dark:divide-neutral-800">
            <!-- Summary row -->
            <div class="grid grid-cols-3 gap-0 border-b border-gray-100 dark:border-neutral-800">
              <div class="p-3 text-center">
                <p class="text-lg font-bold text-gray-900 dark:text-neutral-100">
                  {{ sellerProductStats.products.length }}
                </p>
                <p class="text-[10px] text-gray-400 dark:text-neutral-500">Products</p>
              </div>
              <div class="border-x border-gray-100 p-3 text-center dark:border-neutral-800">
                <p class="text-lg font-bold text-gray-900 dark:text-neutral-100">
                  {{ sellerProductStats.totalUnitsSold }}
                </p>
                <p class="text-[10px] text-gray-400 dark:text-neutral-500">Units Sold</p>
              </div>
              <div class="p-3 text-center">
                <p class="text-lg font-bold text-green-600">
                  {{ formatAmount(sellerProductStats.totalCommission) }}
                </p>
                <p class="text-[10px] text-gray-400 dark:text-neutral-500">Commission Out</p>
              </div>
            </div>

            <!-- Product rows -->
            <div
              v-for="product in sellerProductStats.products"
              :key="product.id"
              class="flex items-center justify-between p-4"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="product.imageUrl || ''"
                  class="h-12 w-12 rounded-lg bg-gray-100 object-cover dark:bg-neutral-800"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">
                    {{ product.title }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-neutral-500">
                    {{ product.storeName }} ·
                    <span class="text-purple-600 dark:text-purple-400">
                      {{ product.affiliateCommission }}% commission
                    </span>
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                  {{ formatAmount(product.revenue) }}
                </p>
                <p class="text-xs text-gray-400 dark:text-neutral-500">
                  {{ product.unitsSold }} sold
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ────────────────────────────────────────────────────────── -->
        <!-- SECTION: Other users promoting my products                 -->
        <!-- ────────────────────────────────────────────────────────── -->
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-center gap-3 border-b border-gray-200 p-4 dark:border-neutral-800">
            <Icon name="mdi:account-group-outline" size="22" class="text-brand" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-neutral-100">
                Sellers Promoting My Products
              </h3>
              <p class="text-xs text-gray-400 dark:text-neutral-500">
                Affiliates who have referred buyers to your store
              </p>
            </div>
          </div>
          <div class="p-8 text-center text-gray-400 dark:text-neutral-500">
            <Icon name="mdi:account-group-outline" size="40" class="mx-auto mb-2" />
            <p class="text-sm">No affiliate sellers yet</p>
            <p class="mt-1 text-xs">
              When other sellers refer buyers to your products, they'll appear here
            </p>
          </div>
        </div>

        <!-- ────────────────────────────────────────────────────────── -->
        <!-- SECTION: Products I'm promoting for others                 -->
        <!-- ────────────────────────────────────────────────────────── -->
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-center gap-3 border-b border-gray-200 p-4 dark:border-neutral-800">
            <Icon name="mdi:tag-heart-outline" size="22" class="text-purple-500" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-neutral-100">
                Products I'm Promoting
              </h3>
              <p class="text-xs text-gray-400 dark:text-neutral-500">
                Products from other stores you're earning commission on
              </p>
            </div>
          </div>
          <div class="p-8 text-center text-gray-400 dark:text-neutral-500">
            <Icon name="mdi:tag-multiple-outline" size="40" class="mx-auto mb-2" />
            <p class="text-sm">Not promoting any products yet</p>
            <p class="mt-1 text-xs">
              Share products from other stores using their affiliate links to start earning
            </p>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../../../../../app/composables/useToast'
import { useAffiliate } from '~~/layers/commerce/app/composables/useAffiliate'
import { useSellerStore } from '~~/layers/seller/app/store/seller.store'
import { useAffiliateApi } from '~~/layers/commerce/app/services/affiliate.api'

const toast = useToast()
const sellerStore = useSellerStore()
const {
  isLoading,
  isEnrolled,
  affiliateCode,
  stats,
  fetchAffiliateStatus,
  enroll,
  fetchReferrals,
} = useAffiliate()

const enrollMessage = ref('')
const loaded = ref(false)
const loadingSellerProducts = ref(false)
const hasSellers = computed(() => sellerStore.hasSellers)

const sellerProductStats = ref<{
  products: any[]
  totalRevenue: number
  totalUnitsSold: number
  totalCommission: number
}>({ products: [], totalRevenue: 0, totalUnitsSold: 0, totalCommission: 0 })

const affiliateLink = computed(() =>
  affiliateCode.value
    ? `${window?.location?.origin ?? 'https://indix.app'}/ref/${affiliateCode.value}`
    : '',
)

const fetchSellerProductStats = async () => {
  if (!hasSellers.value) return
  loadingSellerProducts.value = true
  try {
    const api = useAffiliateApi()
    const res: any = await api.getSellerProducts()
    if (res?.data) {
      sellerProductStats.value = res.data
    }
  } catch {
    // non-critical
  } finally {
    loadingSellerProducts.value = false
  }
}

onMounted(async () => {
  try {
    await fetchAffiliateStatus()
    if (isEnrolled.value) {
      await Promise.allSettled([fetchReferrals(), fetchSellerProductStats()])
    }
  } catch {
    // Handled gracefully
  } finally {
    loaded.value = true
  }
})

const handleEnroll = async () => {
  try {
    const result = await enroll()
    enrollMessage.value = result?.message || 'Enrollment submitted!'
    toast.showToast('Enrollment request submitted!', 'success')
  } catch (e: any) {
    toast.showToast(e.message || 'Failed to enroll', 'error')
  }
}

const copyLink = () => {
  navigator.clipboard.writeText(affiliateLink.value)
  toast.showToast('Affiliate link copied!', 'success')
}

const formatAmount = (kobo: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
    kobo / 100,
  )
</script>
