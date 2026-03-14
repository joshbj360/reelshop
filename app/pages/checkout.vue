<template>
  <HomeLayout :narrow-feed="true" :hide-right-sidebar="true">
    <div class="mx-auto max-w-2xl px-2 py-6 sm:px-0">
      <!-- Header -->
      <div class="mb-6 flex items-center gap-3">
        <NuxtLink
          to="/"
          class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <Icon name="mdi:arrow-left" size="22" />
        </NuxtLink>
        <h1 class="text-xl font-bold text-gray-900 dark:text-neutral-100">
          Checkout
        </h1>
      </div>

      <!-- Empty cart guard -->
      <div v-if="!items.length" class="py-24 text-center">
        <Icon
          name="mdi:cart-outline"
          size="56"
          class="mb-4 text-gray-300 dark:text-neutral-600"
        />
        <p class="font-medium text-gray-600 dark:text-neutral-400">
          Your cart is empty
        </p>
        <NuxtLink
          to="/discover"
          class="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
          >Browse products</NuxtLink
        >
      </div>

      <div v-else class="space-y-5">
        <!-- Order Items -->
        <div
          class="rounded-2xl border border-gray-100 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h2
            class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400"
          >
            Order Summary
          </h2>
          <div class="space-y-3">
            <div
              v-for="item in items"
              :key="item.variantId"
              class="flex items-start gap-3"
            >
              <img
                :src="item.product?.media?.[0]?.url || ''"
                class="h-14 w-14 shrink-0 rounded-xl bg-gray-100 object-cover dark:bg-neutral-800"
              />
              <div class="min-w-0 flex-1">
                <p
                  class="truncate text-sm font-medium text-gray-900 dark:text-neutral-100"
                >
                  {{ item.product?.title }}
                </p>
                <p class="text-xs text-gray-400 dark:text-neutral-500">
                  {{ item.variant?.size || item.variant?.label }} ×
                  {{ item.quantity }}
                </p>
              </div>
              <p
                class="shrink-0 text-sm font-semibold text-gray-900 dark:text-neutral-100"
              >
                {{
                  formatPrice(
                    (item.variant?.price ?? item.product?.price ?? 0) *
                      item.quantity,
                  )
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Delivery Details -->
        <div
          class="rounded-2xl border border-gray-100 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h2
            class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400"
          >
            Delivery Details
          </h2>
          <div class="space-y-3">
            <div>
              <label
                class="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400"
                >Full Name</label
              >
              <input
                v-model="form.name"
                type="text"
                placeholder="Your full name"
                class="input-field"
              />
            </div>
            <div>
              <label
                class="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400"
                >Delivery Address</label
              >
              <input
                v-model="form.address"
                type="text"
                placeholder="Street address"
                class="input-field"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label
                  class="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400"
                  >City / State</label
                >
                <input
                  v-model="form.county"
                  type="text"
                  placeholder="Lagos"
                  class="input-field"
                />
              </div>
              <div>
                <label
                  class="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400"
                  >Postal Code</label
                >
                <input
                  v-model="form.zipcode"
                  type="text"
                  placeholder="100001"
                  class="input-field"
                />
              </div>
            </div>
            <div>
              <label
                class="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400"
                >Country</label
              >
              <select
                v-model="form.country"
                @change="onCountryChange"
                class="input-field"
              >
                <option value="">Select country</option>
                <option v-for="c in COUNTRIES" :key="c.code" :value="c.code">
                  {{ c.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Shipping -->
        <div
          class="rounded-2xl border border-gray-100 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h2
            class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400"
          >
            Shipping
          </h2>
          <div
            v-if="shippingLoading"
            class="flex items-center gap-2 text-sm text-gray-400"
          >
            <Icon name="eos-icons:loading" size="16" class="animate-spin" />
            Calculating…
          </div>
          <div v-else-if="shipping" class="flex items-center justify-between">
            <div>
              <p
                class="text-sm font-medium text-gray-900 dark:text-neutral-100"
              >
                {{ shipping.zoneName }}
              </p>
              <p class="text-xs text-gray-400 dark:text-neutral-500">
                Est. {{ shipping.estimatedDays }}
              </p>
            </div>
            <p
              class="text-sm font-semibold text-gray-900 dark:text-neutral-100"
            >
              {{ formatPrice(shipping.cost) }}
            </p>
          </div>
          <p v-else-if="form.country" class="text-sm text-gray-400">
            Could not calculate shipping for this country.
          </p>
          <p v-else class="text-sm text-gray-400 dark:text-neutral-500">
            Select a country to see shipping rates.
          </p>
        </div>

        <!-- Order Total -->
        <div
          class="space-y-2 rounded-2xl border border-gray-100 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div
            class="flex justify-between text-sm text-gray-600 dark:text-neutral-400"
          >
            <span>Subtotal</span>
            <span>{{ formatPrice(cartTotal) }}</span>
          </div>
          <div
            class="flex justify-between text-sm text-gray-600 dark:text-neutral-400"
          >
            <span>Shipping</span>
            <span>{{ shipping ? formatPrice(shipping.cost) : '—' }}</span>
          </div>
          <div
            class="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900 dark:border-neutral-800 dark:text-neutral-100"
          >
            <span>Total</span>
            <span>{{ formatPrice(cartTotal + (shipping?.cost ?? 0)) }}</span>
          </div>
        </div>

        <!-- Error -->
        <div
          v-if="checkoutError"
          class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          {{ checkoutError }}
        </div>

        <!-- Pay button -->
        <button
          @click="handleCheckout"
          :disabled="isSubmitting || !isFormValid"
          class="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-base font-bold text-white transition-all hover:bg-brand/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon
            v-if="isSubmitting"
            name="eos-icons:loading"
            size="20"
            class="animate-spin"
          />
          {{
            isSubmitting
              ? 'Redirecting to payment…'
              : `Pay ${formatPrice(cartTotal + (shipping?.cost ?? 0))}`
          }}
        </button>

        <p class="text-center text-xs text-gray-400 dark:text-neutral-500">
          Secured by Paystack · Your payment is encrypted
        </p>
      </div>
    </div>
  </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from '~/layouts/HomeLayout.vue'
import { useCart } from '~~/layers/commerce/app/composables/useCart'
import { useShipping } from '~~/layers/commerce/app/composables/useShipping'
import { useOrderApi } from '~~/layers/commerce/app/services/order.api'
import { notify } from '@kyvg/vue3-notification'

definePageMeta({ middleware: 'auth' })

const { setCheckoutPage } = useSeo()
setCheckoutPage()

const { items, cartTotal, fetchCart } = useCart()
const {
  calculation: shipping,
  calculateShipping,
  isLoading: shippingLoading,
} = useShipping()
const orderApi = useOrderApi()
const config = useRuntimeConfig()

const isSubmitting = ref(false)
const checkoutError = ref('')

const form = reactive({
  name: '',
  address: '',
  county: '',
  zipcode: '',
  country: '',
})

const isFormValid = computed(
  () =>
    form.name.trim() &&
    form.address.trim() &&
    form.zipcode.trim() &&
    form.country,
)

const onCountryChange = () => calculateShipping(form.country)

const formatPrice = (cents: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
    cents / 100,
  )

const handleCheckout = async () => {
  if (!isFormValid.value || isSubmitting.value) return
  checkoutError.value = ''
  isSubmitting.value = true
  try {
    const callbackUrl = `${config.public.baseURL}/buyer/orders?payment=success`
    const result: any = await orderApi.initializePayment({
      items: items.value.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      name: form.name,
      address: form.address,
      county: form.county,
      zipcode: form.zipcode,
      country: form.country,
      shippingCost: shipping.value?.cost ?? 0,
      shippingZone: shipping.value?.zoneName,
      estimatedDays: shipping.value?.estimatedDays,
      callback_url: callbackUrl,
    })
    // Redirect to Paystack hosted page
    window.location.href = result.data.authorizationUrl
  } catch (e: any) {
    checkoutError.value =
      e.message || 'Failed to initialize payment. Please try again.'
    // BaseApiClient handles the error toast; checkoutError shows inline in the form
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => fetchCart())

// COUNTRIES list — ISO 3166-1 alpha-2
const COUNTRIES = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'SN', name: 'Senegal' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'CM', name: 'Cameroon' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'UG', name: 'Uganda' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'MA', name: 'Morocco' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'AE', name: 'UAE' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
]
</script>

<style scoped>
.input-field {
  @apply w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500;
}
</style>
