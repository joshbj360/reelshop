<template>
  <div class="space-y-6 p-6">
    <!-- Loading -->
    <div v-if="isLoading" class="py-12 text-center">
      <Icon
        name="eos-icons:loading"
        size="32"
        class="animate-spin text-brand"
      />
    </div>

    <template v-else>
      <!-- Enrollment Status -->
      <div
        v-if="!isEnrolled"
        class="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-center text-white"
      >
        <Icon name="mdi:cash-multiple" size="64" class="mx-auto mb-4" />
        <h2 class="mb-2 text-2xl font-bold">Join Our Affiliate Program</h2>
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

      <!-- Affiliate Dashboard -->
      <template v-else>
        <!-- Stats Overview -->
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div
            class="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Icon name="mdi:cash" size="24" class="mb-2 text-green-500" />
            <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
              ${{ (stats.totalEarnings ?? 0).toFixed(2) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">
              Total Earnings
            </p>
          </div>

          <div
            class="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Icon name="mdi:mouse" size="24" class="mb-2 text-blue-500" />
            <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
              {{ stats.totalClicks ?? 0 }}
            </p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">
              Total Clicks
            </p>
          </div>

          <div
            class="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Icon name="mdi:cart-check" size="24" class="mb-2 text-brand" />
            <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
              {{ stats.totalConversions ?? 0 }}
            </p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">
              Conversions
            </p>
          </div>

          <div
            class="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Icon name="mdi:percent" size="24" class="mb-2 text-purple-500" />
            <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
              {{ (stats.conversionRate ?? 0).toFixed(2) }}%
            </p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">
              Conversion Rate
            </p>
          </div>
        </div>

        <!-- Affiliate Link -->
        <div
          v-if="affiliateCode"
          class="rounded-xl border border-gray-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-neutral-100">
            Your Affiliate Link
          </h3>
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

        <!-- Recent Referrals -->
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div class="border-b border-gray-200 p-4 dark:border-neutral-800">
            <h3 class="font-semibold text-gray-900 dark:text-neutral-100">
              Recent Referrals
            </h3>
          </div>

          <div
            v-if="referrals.length === 0"
            class="p-8 text-center text-gray-400 dark:text-neutral-500"
          >
            <Icon name="mdi:link-variant" size="40" class="mx-auto mb-2" />
            <p class="text-sm">
              No referrals yet. Share your link to start earning!
            </p>
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-neutral-800">
            <div
              v-for="referral in referrals"
              :key="referral.id"
              class="flex items-center justify-between p-4"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10"
                >
                  <Icon name="mdi:account" size="20" class="text-brand" />
                </div>
                <div>
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-neutral-100"
                  >
                    {{
                      referral.productName || `Product #${referral.productId}`
                    }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-neutral-400">
                    {{ formatDate(referral.createdAt) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-green-600">
                  +${{ (referral.commission ?? 0).toFixed(2) }}
                </p>
                <span
                  class="rounded-full px-2 py-0.5 text-xs"
                  :class="
                    referral.status === 'PAID'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                  "
                >
                  {{ referral.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../../../../../app/composables/useToast'
import { useAffiliate } from '~~/layers/commerce/app/composables/useAffiliate'

const toast = useToast()
const {
  isLoading,
  isEnrolled,
  affiliateCode,
  stats,
  referrals,
  fetchAffiliateStatus,
  enroll,
  fetchReferrals,
} = useAffiliate()

const enrollMessage = ref('')

const affiliateLink = computed(() =>
  affiliateCode.value
    ? `${window?.location?.origin ?? 'https://styli.com'}/ref/${affiliateCode.value}`
    : '',
)

onMounted(async () => {
  try {
    await fetchAffiliateStatus()
    if (isEnrolled.value) {
      await fetchReferrals()
    }
  } catch {
    // Handled gracefully
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
</script>
