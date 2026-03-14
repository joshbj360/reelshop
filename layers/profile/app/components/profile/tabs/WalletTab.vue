<template>
  <div class="space-y-6 p-6">
    <!-- Loading State -->
    <div v-if="isLoading && !wallet" class="py-12 text-center">
      <Icon
        name="eos-icons:loading"
        size="32"
        class="animate-spin text-brand"
      />
    </div>

    <template v-else>
      <!-- Wallet Balance Card -->
      <div
        class="rounded-xl bg-gradient-to-br from-brand to-[#d81b36] p-6 text-white"
      >
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-sm text-white/80">Available Balance</p>
            <h2 class="text-4xl font-bold">${{ balance.toFixed(2) }}</h2>
            <p v-if="pendingBalance > 0" class="mt-1 text-sm text-white/70">
              ${{ pendingBalance.toFixed(2) }} pending
            </p>
          </div>
          <Icon name="mdi:wallet" size="48" class="text-white/20" />
        </div>
        <div class="flex gap-3">
          <button
            @click="showAddFundsModal = true"
            class="flex-1 rounded-lg bg-white/20 py-2 font-medium transition-colors hover:bg-white/30"
          >
            Add Funds
          </button>
          <button
            @click="showWithdrawModal = true"
            class="flex-1 rounded-lg bg-white/20 py-2 font-medium transition-colors hover:bg-white/30"
          >
            Withdraw
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <Icon name="mdi:trending-up" size="24" class="mb-2 text-green-500" />
          <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
            ${{ (stats.totalEarned ?? 0).toFixed(2) }}
          </p>
          <p class="text-xs text-gray-500 dark:text-neutral-400">
            Total Earned
          </p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <Icon name="mdi:trending-down" size="24" class="mb-2 text-red-500" />
          <p class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
            ${{ (stats.totalSpent ?? 0).toFixed(2) }}
          </p>
          <p class="text-xs text-gray-500 dark:text-neutral-400">Total Spent</p>
        </div>
      </div>

      <!-- Transaction History -->
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div class="border-b border-gray-200 p-4 dark:border-neutral-800">
          <h3 class="font-semibold text-gray-900 dark:text-neutral-100">
            Transaction History
          </h3>
        </div>

        <div
          v-if="transactions.length === 0"
          class="p-8 text-center text-gray-400 dark:text-neutral-500"
        >
          <Icon
            name="mdi:receipt-text-outline"
            size="40"
            class="mx-auto mb-2"
          />
          <p class="text-sm">No transactions yet</p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-neutral-800">
          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full"
                :class="
                  transaction.type === 'CREDIT'
                    ? 'bg-green-100 dark:bg-green-900/20'
                    : 'bg-red-100 dark:bg-red-900/20'
                "
              >
                <Icon
                  :name="
                    transaction.type === 'CREDIT'
                      ? 'mdi:arrow-down'
                      : 'mdi:arrow-up'
                  "
                  size="20"
                  :class="
                    transaction.type === 'CREDIT'
                      ? 'text-green-600'
                      : 'text-red-600'
                  "
                />
              </div>
              <div>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-neutral-100"
                >
                  {{ transaction.description }}
                </p>
                <p class="text-xs text-gray-500 dark:text-neutral-400">
                  {{ formatDate(transaction.created_at) }}
                </p>
              </div>
            </div>
            <div
              class="text-right"
              :class="
                transaction.type === 'CREDIT'
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              <p class="font-semibold">
                {{ transaction.type === 'CREDIT' ? '+' : '-' }}${{
                  transaction.amount.toFixed(2)
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- Add Funds Modal -->
  <AddFundsModal
    v-if="showAddFundsModal"
    @close="showAddFundsModal = false"
    @success="handleFundsAdded"
  />

  <!-- Withdraw Modal -->
  <WithdrawModal
    v-if="showWithdrawModal"
    :balance="balance"
    @close="showWithdrawModal = false"
    @success="handleWithdrawSuccess"
  />
</template>

<script setup lang="ts">
import AddFundsModal from '../modals/AddFundsModal.vue'
import WithdrawModal from '../modals/WithdrawModal.vue'
import { useWallet } from '~~/layers/commerce/app/composables/useWallet'

const {
  wallet,
  isLoading,
  balance,
  pendingBalance,
  stats,
  transactions,
  fetchWallet,
  fetchTransactions,
  addFunds,
  withdraw,
} = useWallet()

const showAddFundsModal = ref(false)
const showWithdrawModal = ref(false)

onMounted(async () => {
  try {
    await Promise.all([fetchWallet(), fetchTransactions()])
  } catch {
    // Wallet might not exist yet for non-sellers — handled gracefully
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleFundsAdded = async (amount: number) => {
  showAddFundsModal.value = false
  try {
    await addFunds(amount)
  } catch {
    // Error handled in composable
  }
}

const handleWithdrawSuccess = async (amount: number, bankAccount: any) => {
  showWithdrawModal.value = false
  try {
    await withdraw(amount, bankAccount)
  } catch {
    // Error handled in composable
  }
}
</script>
