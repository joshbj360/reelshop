<template>
    <div class="p-6 space-y-6">
        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-12">
            <Icon name="eos-icons:loading" size="32" class="text-brand animate-spin" />
        </div>

        <template v-else>
            <!-- Enrollment Status -->
            <div v-if="!isEnrolled" class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-8 text-white text-center">
                <Icon name="mdi:cash-multiple" size="64" class="mx-auto mb-4" />
                <h2 class="text-2xl font-bold mb-2">Join Our Affiliate Program</h2>
                <p class="text-white/90 mb-6">
                    Earn commission by sharing products you love. Get 10% on every sale!
                </p>
                <button
                    @click="handleEnroll"
                    :disabled="isLoading"
                    class="px-8 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                    Enroll Now
                </button>
                <p v-if="enrollMessage" class="text-white/80 text-sm mt-3">{{ enrollMessage }}</p>
            </div>

            <!-- Affiliate Dashboard -->
            <template v-else>
                <!-- Stats Overview -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4">
                        <Icon name="mdi:cash" size="24" class="text-green-500 mb-2" />
                        <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
                            ${{ (stats.totalEarnings ?? 0).toFixed(2) }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-neutral-400">Total Earnings</p>
                    </div>

                    <div class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4">
                        <Icon name="mdi:mouse" size="24" class="text-blue-500 mb-2" />
                        <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
                            {{ stats.totalClicks ?? 0 }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-neutral-400">Total Clicks</p>
                    </div>

                    <div class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4">
                        <Icon name="mdi:cart-check" size="24" class="text-brand mb-2" />
                        <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
                            {{ stats.totalConversions ?? 0 }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-neutral-400">Conversions</p>
                    </div>

                    <div class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4">
                        <Icon name="mdi:percent" size="24" class="text-purple-500 mb-2" />
                        <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
                            {{ (stats.conversionRate ?? 0).toFixed(2) }}%
                        </p>
                        <p class="text-xs text-gray-500 dark:text-neutral-400">Conversion Rate</p>
                    </div>
                </div>

                <!-- Affiliate Link -->
                <div v-if="affiliateCode" class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6">
                    <h3 class="font-semibold text-gray-900 dark:text-neutral-100 mb-4">Your Affiliate Link</h3>
                    <div class="flex gap-2">
                        <input
                            :value="affiliateLink"
                            readonly
                            class="flex-1 px-4 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-neutral-100 font-mono text-sm"
                        />
                        <button
                            @click="copyLink"
                            class="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-[#d81b36] transition-colors"
                        >
                            <Icon name="mdi:content-copy" size="20" />
                        </button>
                    </div>
                </div>

                <!-- Recent Referrals -->
                <div class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <div class="p-4 border-b border-gray-200 dark:border-neutral-800">
                        <h3 class="font-semibold text-gray-900 dark:text-neutral-100">Recent Referrals</h3>
                    </div>

                    <div v-if="referrals.length === 0" class="p-8 text-center text-gray-400 dark:text-neutral-500">
                        <Icon name="mdi:link-variant" size="40" class="mx-auto mb-2" />
                        <p class="text-sm">No referrals yet. Share your link to start earning!</p>
                    </div>

                    <div v-else class="divide-y divide-gray-200 dark:divide-neutral-800">
                        <div
                            v-for="referral in referrals"
                            :key="referral.id"
                            class="p-4 flex items-center justify-between"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                                    <Icon name="mdi:account" size="20" class="text-brand" />
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">
                                        {{ referral.productName || `Product #${referral.productId}` }}
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
                                    class="text-xs px-2 py-0.5 rounded-full"
                                    :class="referral.status === 'PAID'
                                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'"
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
const { isLoading, isEnrolled, affiliateCode, stats, referrals, fetchAffiliateStatus, enroll, fetchReferrals } = useAffiliate()

const enrollMessage = ref('')

const affiliateLink = computed(() =>
    affiliateCode.value ? `${window?.location?.origin ?? 'https://styli.com'}/ref/${affiliateCode.value}` : ''
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
        day: 'numeric'
    })
}
</script>
