<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <div
          class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-neutral-800"
          >
            <h2
              class="text-lg font-semibold text-gray-900 dark:text-neutral-100"
            >
              Withdraw Funds
            </h2>
            <button
              @click="handleClose"
              class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <Icon
                name="mdi:close"
                size="24"
                class="text-gray-900 dark:text-neutral-100"
              />
            </button>
          </div>

          <!-- Content -->
          <div class="space-y-6 p-6">
            <!-- Available Balance -->
            <div
              class="rounded-xl bg-gradient-to-br from-brand to-[#d81b36] p-4 text-white"
            >
              <p class="mb-1 text-sm text-white/80">Available Balance</p>
              <p class="text-3xl font-bold">${{ balance.toFixed(2) }}</p>
            </div>

            <!-- Withdraw Amount -->
            <div>
              <label
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300"
              >
                Withdraw Amount
              </label>
              <div class="relative">
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-500 dark:text-neutral-400"
                >
                  $
                </span>
                <input
                  v-model.number="amount"
                  type="number"
                  :min="minWithdraw"
                  :max="balance"
                  step="1"
                  placeholder="0.00"
                  class="w-full rounded-lg border border-gray-200 bg-white py-3 pl-8 pr-4 text-lg font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
              <div class="mt-2 flex justify-between">
                <p class="text-xs text-gray-500 dark:text-neutral-400">
                  Minimum: ${{ minWithdraw }}
                </p>
                <button
                  @click="amount = balance"
                  class="text-xs font-medium text-brand hover:underline"
                >
                  Withdraw All
                </button>
              </div>

              <!-- Error Message -->
              <p v-if="amountError" class="mt-2 text-xs text-red-500">
                {{ amountError }}
              </p>
            </div>

            <!-- Withdrawal Method -->
            <div>
              <label
                class="mb-3 block text-sm font-medium text-gray-700 dark:text-neutral-300"
              >
                Withdrawal Method
              </label>
              <div class="space-y-2">
                <button
                  v-for="method in withdrawalMethods"
                  :key="method.id"
                  @click="selectedMethod = method.id"
                  class="flex w-full items-center gap-3 rounded-lg border-2 p-4 transition-all"
                  :class="
                    selectedMethod === method.id
                      ? 'border-brand bg-brand/5'
                      : 'border-gray-200 hover:border-gray-300 dark:border-neutral-700 dark:hover:border-neutral-600'
                  "
                >
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full"
                    :class="method.color"
                  >
                    <Icon :name="method.icon" size="20" class="text-white" />
                  </div>
                  <div class="flex-1 text-left">
                    <p
                      class="font-semibold text-gray-900 dark:text-neutral-100"
                    >
                      {{ method.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-neutral-400">
                      {{ method.description }}
                    </p>
                    <p class="mt-1 text-xs text-gray-400 dark:text-neutral-500">
                      Processing time: {{ method.processingTime }}
                    </p>
                  </div>
                  <div
                    v-if="selectedMethod === method.id"
                    class="flex h-5 w-5 items-center justify-center rounded-full bg-brand"
                  >
                    <Icon name="mdi:check" size="16" class="text-white" />
                  </div>
                </button>
              </div>
            </div>

            <!-- Bank Account Info (if bank selected) -->
            <div
              v-if="selectedMethod === 'bank'"
              class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/10"
            >
              <div class="flex gap-2">
                <Icon
                  name="mdi:information"
                  size="20"
                  class="flex-shrink-0 text-blue-600 dark:text-blue-400"
                />
                <div class="text-sm text-blue-700 dark:text-blue-300">
                  <p class="mb-1 font-semibold">Bank Account Required</p>
                  <p>
                    You'll need to add your bank account details to proceed with
                    this withdrawal method.
                  </p>
                  <button class="mt-2 text-brand underline">
                    Add Bank Account
                  </button>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div
              class="space-y-2 rounded-lg bg-gray-50 p-4 dark:bg-neutral-800"
            >
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-neutral-400"
                  >Withdrawal Amount</span
                >
                <span class="font-semibold text-gray-900 dark:text-neutral-100">
                  ${{ amount.toFixed(2) }}
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-neutral-400"
                  >Processing Fee</span
                >
                <span class="font-semibold text-gray-900 dark:text-neutral-100">
                  ${{ withdrawalFee.toFixed(2) }}
                </span>
              </div>
              <div
                class="flex justify-between border-t border-gray-200 pt-2 dark:border-neutral-700"
              >
                <span class="font-semibold text-gray-900 dark:text-neutral-100"
                  >You'll Receive</span
                >
                <span
                  class="text-lg font-bold text-green-600 dark:text-green-400"
                >
                  ${{ amountToReceive.toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Withdraw Button -->
            <button
              @click="handleWithdraw"
              :disabled="!canProceed || isProcessing"
              class="w-full rounded-lg bg-brand py-3 font-bold text-white transition-colors hover:bg-[#d81b36] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{
                isProcessing
                  ? 'Processing...'
                  : `Withdraw $${amount.toFixed(2)}`
              }}
            </button>

            <!-- Important Notes -->
            <div
              class="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/10"
            >
              <div class="flex gap-2">
                <Icon
                  name="mdi:alert"
                  size="16"
                  class="mt-0.5 flex-shrink-0 text-yellow-600 dark:text-yellow-400"
                />
                <div
                  class="space-y-1 text-xs text-yellow-700 dark:text-yellow-300"
                >
                  <p class="font-semibold">Important Notes:</p>
                  <ul class="list-inside list-disc space-y-0.5">
                    <li>Withdrawals are processed within 1-5 business days</li>
                    <li>You cannot cancel a withdrawal once submitted</li>
                    <li>Minimum withdrawal amount is ${{ minWithdraw }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWallet } from '~~/layers/commerce/app/composables/useWallet'

const props = defineProps<{
  balance: number
}>()
const { withdraw } = useWallet()

const emit = defineEmits(['close', 'success'])

const amount = ref(0)
const selectedMethod = ref('paypal')
const isProcessing = ref(false)
const minWithdraw = 10

const withdrawalMethods = [
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Withdraw to your PayPal account',
    icon: 'mdi:paypal',
    color: 'bg-[#0070ba]',
    processingTime: '1-2 business days',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    description: 'Direct deposit to your bank account',
    icon: 'mdi:bank',
    color: 'bg-green-500',
    processingTime: '3-5 business days',
  },
  {
    id: 'card',
    name: 'Debit Card',
    description: 'Instant withdrawal to your debit card',
    icon: 'mdi:credit-card',
    color: 'bg-purple-500',
    processingTime: 'Instant',
  },
]

const withdrawalFee = computed(() => {
  // Example fees:
  // PayPal: 2% ($0.25 min)
  // Bank: $0 (free)
  // Card: 1.5% ($1 min)

  if (selectedMethod.value === 'paypal') {
    return Math.max(amount.value * 0.02, 0.25)
  } else if (selectedMethod.value === 'bank') {
    return 0
  } else if (selectedMethod.value === 'card') {
    return Math.max(amount.value * 0.015, 1)
  }
  return 0
})

const amountToReceive = computed(() => {
  return Math.max(amount.value - withdrawalFee.value, 0)
})

const amountError = computed(() => {
  if (amount.value < minWithdraw) {
    return `Minimum withdrawal is $${minWithdraw}`
  }
  if (amount.value > props.balance) {
    return 'Insufficient balance'
  }
  return null
})

const canProceed = computed(() => {
  return (
    amount.value >= minWithdraw &&
    amount.value <= props.balance &&
    selectedMethod.value &&
    !amountError.value
  )
})

const handleWithdraw = async () => {
  if (!canProceed.value) return

  // Confirmation
  const confirmed = confirm(
    `Are you sure you want to withdraw $${amount.value.toFixed(2)}?\n\n` +
      `You will receive $${amountToReceive.value.toFixed(2)} after fees.\n` +
      `This action cannot be undone.`,
  )

  if (!confirmed) return

  isProcessing.value = true

  try {
    await withdraw(amount.value, { method: selectedMethod.value })

    // Success
    emit('success', amount.value)
  } catch (error) {
    console.error('Failed to withdraw funds:', error)
    alert('Failed to process withdrawal. Please try again.')
  } finally {
    isProcessing.value = false
  }
}

const handleClose = () => {
  if (isProcessing.value) return
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}

/* Hide number input arrows */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
