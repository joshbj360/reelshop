<!-- layers/auth/pages/forgot-password.vue -->
<template>
  <AuthLayout
    title="Forgot your password?"
    subtitle="Enter your email and we'll send you a link to reset it"
  >
    <!-- Error Message -->
    <div
      v-if="error"
      class="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
    >
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Forgot Password Form -->
    <form v-if="!submitted" class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Email Input -->
      <div>
        <input
          v-model="form.email"
          type="email"
          placeholder="Enter your email address"
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
          Sending reset link...
        </span>
        <span v-else>Send Reset Link</span>
      </button>
    </form>

    <!-- Success Message -->
    <div v-else class="space-y-4">
      <div
        class="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
      >
        <div class="flex gap-3">
          <Icon
            name="mdi:check-circle"
            class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
          />
          <div>
            <h3
              class="text-sm font-semibold text-green-900 dark:text-green-300"
            >
              Check your email
            </h3>
            <p class="mt-1 text-xs text-green-800 dark:text-green-400">
              We've sent a password reset link to
              <strong>{{ form.email }}</strong
              >. Please check your inbox and spam folder.
            </p>
          </div>
        </div>
      </div>

      <!-- Send Again Button -->
      <button
        type="button"
        @click="handleSendAgain"
        :disabled="isLoading"
        class="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
      >
        <span v-if="isLoading" class="flex items-center justify-center gap-2">
          <span
            class="h-4 w-4 animate-spin rounded-full border-2 border-gray-400/30 border-t-gray-900 dark:border-t-white"
          />
          Sending...
        </span>
        <span v-else>Send Link Again</span>
      </button>
    </div>

    <!-- Info Box -->
    <div
      class="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
    >
      <div class="flex gap-3">
        <Icon
          name="mdi:information"
          class="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
        />
        <p class="text-xs text-blue-800 dark:text-blue-300">
          The reset link will expire in 24 hours. If you don't receive an email,
          check your spam folder or try again.
        </p>
      </div>
    </div>

    <!-- Footer Slot -->
    <template #footer>
      <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Remember your password?
        <NuxtLink
          to="/user-login"
          class="ml-1 font-semibold text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          Sign In
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
import { reactive, ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import AuthLayout from '../layouts/AuthLayout.vue'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const {
  requestPasswordReset: authRequestReset,
  isLoading: authLoading,
  error: authError,
} = useAuth()

const submitted = ref(false)

const form = reactive({
  email: '',
})

const errors = reactive({
  email: '',
})

const isLoading = computed(() => authLoading.value)
const error = computed(() => authError.value)

// Client-side validation
const validateForm = () => {
  errors.email = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    await authRequestReset(form.email)
    submitted.value = true
  } catch (err: any) {
    console.error('Forgot password error:', err)
    // Error is already in authError
  }
}

const handleSendAgain = () => {
  submitted.value = false
  handleSubmit()
}
</script>
