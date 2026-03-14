<!-- layers/auth/app/pages/user-login.vue -->
<template>
  <AuthLayout title="Welcome back" subtitle="Sign in to continue your journey">
    <!-- Error Message -->
    <div
      v-if="error"
      class="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
    >
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Success Message -->
    <div
      v-if="message"
      class="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
    >
      <p class="text-sm text-green-600 dark:text-green-400">{{ message }}</p>
    </div>

    <!-- Login Form -->
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Email Input -->
      <div>
        <input
          v-model="form.email"
          type="email"
          placeholder="Email address"
          :disabled="isLoading"
          :class="[
            'w-full rounded-xl border bg-transparent px-4 py-3 text-sm placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-brand/40',
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

      <!-- Password Input -->
      <div>
        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            :disabled="isLoading"
            :class="[
              'w-full rounded-xl border bg-transparent px-4 py-3 pr-12 text-sm placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-brand/40',
              errors.password
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-200 text-gray-900 dark:border-neutral-700 dark:text-white',
            ]"
          />
          <button
            type="button"
            :disabled="isLoading"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50 dark:hover:text-gray-300"
            @click="showPassword = !showPassword"
          >
            <Icon
              :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
              class="h-5 w-5"
            />
          </button>
        </div>
        <p
          v-if="errors.password"
          class="mt-1.5 text-sm text-red-600 dark:text-red-400"
        >
          {{ errors.password }}
        </p>
      </div>

      <!-- Forgot Password Link -->
      <div class="flex justify-end">
        <NuxtLink
          to="/forgot-password"
          class="text-sm font-medium text-brand transition-colors hover:text-[#d81b36]"
        >
          Forgot password?
        </NuxtLink>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#d81b36] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span v-if="isLoading" class="flex items-center justify-center gap-2">
          <span
            class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          />
          Signing in...
        </span>
        <span v-else>Sign In</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="my-6 flex items-center">
      <div class="flex-grow border-t border-gray-200 dark:border-neutral-700" />
      <span class="px-4 text-sm text-gray-400">or</span>
      <div class="flex-grow border-t border-gray-200 dark:border-neutral-700" />
    </div>

    <!-- Social Login (Placeholder) -->
    <div class="grid grid-cols-2 gap-3">
      <button
        type="button"
        :disabled="isLoading"
        class="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        @click="showComingSoon('Google')"
      >
        <Icon
          name="mdi:google"
          class="h-4 w-4 text-gray-600 dark:text-gray-300"
        />
        <span class="font-medium text-gray-700 dark:text-gray-300">Google</span>
      </button>

      <button
        type="button"
        :disabled="isLoading"
        class="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        @click="showComingSoon('Facebook')"
      >
        <Icon name="mdi:facebook" class="h-4 w-4 text-[#1877F2]" />
        <span class="font-medium text-gray-700 dark:text-gray-300"
          >Facebook</span
        >
      </button>
    </div>

    <!-- Footer Slot -->
    <template #footer>
      <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?
        <NuxtLink
          to="/user-register"
          class="ml-1 font-semibold text-brand transition-colors hover:text-[#d81b36]"
        >
          Sign Up
        </NuxtLink>
      </p>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { reactive, ref, computed } from 'vue'
import AuthLayout from '../layouts/AuthLayout.vue'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const router = useRouter()
const { login: authLogin, isLoading: authLoading, error: authError } = useAuth()

const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const isLoading = computed(() => authLoading.value)
const error = computed(() => authError.value)
const message = ref('')

// Simple client-side validation
const validateForm = () => {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email'
    return false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }

  if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    await authLogin(form.email, form.password)
    // authLogin handles navigation on success
  } catch (err: any) {
    console.error('Login error:', err)
    // Error is already in authError
  }
}

const showComingSoon = (provider: string) => {
  message.value = `${provider} login coming soon!`
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// Clear errors on input
const clearEmailError = () => {
  errors.email = ''
}
const clearPasswordError = () => {
  errors.password = ''
}
</script>
