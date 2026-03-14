<template>
  <MainLayout>
    <div id="SuccessPage" class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div
        class="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-xl sm:p-12"
      >
        <!-- Success Icon -->
        <div class="mb-6">
          <Icon
            name="mdi:check-circle-outline"
            class="h-20 w-20 text-green-500"
          />
        </div>

        <!-- Main Message -->
        <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
          Thank You for Your Order!
        </h1>
        <p class="mt-3 max-w-lg text-gray-600">
          Your order has been placed successfully. A confirmation email with
          your order details has been sent to you.
        </p>

        <!-- Order Summary (Optional but recommended) -->
        <div class="mt-8 w-full max-w-md border-b border-t py-6">
          <h2 class="mb-4 text-lg font-semibold text-gray-800">What's Next?</h2>
          <ul class="space-y-3 text-left text-sm text-gray-500">
            <li class="flex items-start">
              <Icon
                name="mdi:email-fast-outline"
                class="mr-3 mt-1 shrink-0 text-gray-400"
                size="18"
              />
              <span>You'll receive an email confirmation shortly.</span>
            </li>
            <li class="flex items-start">
              <Icon
                name="mdi:package-variant-closed-check"
                class="mr-3 mt-1 shrink-0 text-gray-400"
                size="18"
              />
              <span>We'll notify you again once your order has shipped.</span>
            </li>
            <li class="flex items-start">
              <Icon
                name="mdi:account-clock-outline"
                class="mr-3 mt-1 shrink-0 text-gray-400"
                size="18"
              />
              <span
                >You can view your order history in your profile at any
                time.</span
              >
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex flex-col gap-4 sm:flex-row">
          <NuxtLink
            to="/"
            class="rounded-lg bg-brand px-6 py-3 font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-brand-light"
          >
            Continue Shopping
          </NuxtLink>
          <NuxtLink
            to="/buyer/profile"
            class="rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-200"
          >
            View My Orders
          </NuxtLink>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '~/layouts/HomeLayout.vue'
import { useCartStore } from '~/stores/cart.store'
import { onMounted } from 'vue'

const cartStore = useCartStore()

// This ensures that if the checkout list is empty (e.g., user refreshes the success page),
// the cart is also cleared of the purchased items.
onMounted(() => {
  if (cartStore.checkout.length > 0) {
    cartStore.clearPurchasedItems()
  }
})
</script>
