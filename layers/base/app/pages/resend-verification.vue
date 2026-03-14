<!-- layers/auth/pages/resend-verification.vue -->
<template>
  <AuthLayout
    title="Verify Your Email"
    subtitle="We need to verify your email before you can log in"
  >
    <!-- Status Messages -->
    <div
      v-if="verificationState === 'sent'"
      class="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
    >
      <div class="flex gap-3">
        <Icon
          name="mdi:check-circle"
          class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
        />
        <div>
          <h3 class="text-sm font-semibold text-green-900 dark:text-green-300">
            Email sent!
          </h3>
          <p class="mt-1 text-xs text-green-800 dark:text-green-400">
            We've sent a verification link to <strong>{{ email }}</strong
            >. Check your inbox.
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="verificationState === 'pending' && email"
      class="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
    >
      <div class="flex gap-3">
        <Icon
          name="mdi:information"
          class="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
        />
        <div>
          <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-300">
            Check your email
          </h3>
          <p class="mt-1 text-xs text-blue-800 dark:text-blue-400">
            We need to verify your email before you can log in. Please enter
            your email below to receive a verification link.
          </p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
    >
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Resend Form -->
    <form
      v-if="verificationState !== 'sent'"
      class="space-y-4"
      @submit.prevent="handleResend"
    >
      <!-- Email Input -->
      <div>
        <label
          class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email Address
        </label>
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          :disabled="isLoading"
          :class="[
            'w-full rounded-xl border bg-transparent px-4 py-3 text-sm placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500',
            errors.email
              ? 'border-red-300 dark:border-red-700'
              : 'border-gray-200 text-gray-900 dark:border-neutral-700 dark:text-white',
          ]"
        />
        <p
          v-if="errors.email"
          class="mt-1.5 text-sm text-red-600 dark:text-red-400"
        >
          {{ errors.email }}
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-purple-700 hover:to-purple-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span v-if="isLoading" class="flex items-center justify-center gap-2">
          <span
            class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          />
          Sending...
        </span>
        <span v-else>Send Verification Email</span>
      </button>
    </form>

    <!-- After Sent -->
    <div v-if="verificationState === 'sent'" class="space-y-4">
      <div class="rounded-xl bg-gray-100 p-4 dark:bg-neutral-800">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          ✅ Verification email sent to <strong>{{ email }}</strong>
        </p>
        <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
          Please check your inbox and spam folder. The link expires in 24 hours.
        </p>
      </div>

      <!-- Back to Login Button -->
      <NuxtLink
        to="/user-login"
        class="block w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
      >
        Back to Login
      </NuxtLink>

      <!-- Resend Another -->
      <button
        @click="resetForm"
        type="button"
        class="w-full rounded-xl py-3 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
      >
        Resend to Different Email
      </button>
    </div>

    <!-- Info Box -->
    <div
      class="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20"
    >
      <div class="flex gap-3">
        <Icon
          name="mdi:lightbulb"
          class="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400"
        />
        <div>
          <p class="text-xs text-yellow-800 dark:text-yellow-300">
            <strong>Tip:</strong> After verifying your email, you'll be able to
            log in. If you don't see the email, check your spam folder.
          </p>
        </div>
      </div>
    </div>

    <!-- Footer Slot -->
    <template #footer>
      <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already verified?
        <NuxtLink
          to="/user-login"
          class="ml-1 font-semibold text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          Log in
        </NuxtLink>
      </p>
      <p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?
        <NuxtLink
          to="/user-register"
          class="ml-1 font-semibold text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          Create one
        </NuxtLink>
      </p>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'
import AuthLayout from '../layouts/AuthLayout.vue'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const route = useRoute()
const {
  resendVerificationEmail,
  isLoading: authLoading,
  error: authError,
} = useAuth()

type VerificationState = 'pending' | 'sent'

const email = ref('')
const verificationState = ref<VerificationState>('pending')

const errors = reactive({
  email: '',
})

const isLoading = computed(() => authLoading.value)
const error = computed(() => authError.value)

// Client-side validation
const validateEmail = () => {
  errors.email = ''

  if (!email.value) {
    errors.email = 'Email is required'
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Please enter a valid email address'
    return false
  }

  return true
}

const handleResend = async () => {
  if (!validateEmail()) return

  try {
    await resendVerificationEmail(email.value)
    verificationState.value = 'sent'
  } catch (err: any) {
    console.error('Resend error:', err)
    // Error is already in authError
  }
}

const resetForm = () => {
  email.value = ''
  verificationState.value = 'pending'
  errors.email = ''
}

onMounted(() => {
  // Pre-fill email from query parameter if provided
  const queryEmail = route.query.email as string
  if (queryEmail) {
    email.value = queryEmail
  }
})
</script>
