<!-- layers/auth/pages/user-register.vue -->
<template>
  <AuthLayout title="Create your account" subtitle="Join Styli today">
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

    <!-- Register Form -->
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Username Input -->
      <div>
        <input
          v-model="form.username"
          type="text"
          placeholder="Username"
          :disabled="isLoading"
          :class="[
            'w-full rounded-xl border bg-transparent px-4 py-3 text-sm placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-brand/40',
            errors.username
              ? 'border-red-300 dark:border-red-700'
              : 'border-gray-200 text-gray-900 dark:border-neutral-700 dark:text-white',
          ]"
        />
        <p
          v-if="errors.username"
          class="mt-1.5 text-sm text-red-600 dark:text-red-400"
        >
          {{ errors.username }}
        </p>
      </div>

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
            placeholder="Password (min 12 characters)"
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

      <!-- Confirm Password Input -->
      <div>
        <div class="relative">
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm password"
            :disabled="isLoading"
            :class="[
              'w-full rounded-xl border bg-transparent px-4 py-3 pr-12 text-sm placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-brand/40',
              errors.confirmPassword
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-200 text-gray-900 dark:border-neutral-700 dark:text-white',
            ]"
          />
          <button
            type="button"
            :disabled="isLoading"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50 dark:hover:text-gray-300"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <Icon
              :name="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'"
              class="h-5 w-5"
            />
          </button>
        </div>
        <p
          v-if="errors.confirmPassword"
          class="mt-1.5 text-sm text-red-600 dark:text-red-400"
        >
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Password Strength Meter -->
      <PasswordStrengthMeter v-if="form.password" :password="form.password" />

      <!-- Terms & Conditions -->
      <div class="flex items-start gap-3 pt-2">
        <input
          v-model="agreedToTerms"
          type="checkbox"
          id="terms"
          class="mt-1 rounded border-gray-300 text-brand focus:ring-brand/40"
        />
        <label for="terms" class="text-xs text-gray-600 dark:text-gray-400">
          I agree to the
          <a
            href="#"
            class="font-medium text-brand transition-colors hover:text-[#d81b36]"
          >
            Terms of Service
          </a>
          and
          <a
            href="#"
            class="font-medium text-brand transition-colors hover:text-[#d81b36]"
          >
            Privacy Policy
          </a>
        </label>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading || !agreedToTerms"
        class="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#d81b36] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span v-if="isLoading" class="flex items-center justify-center gap-2">
          <span
            class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          />
          Creating account...
        </span>
        <span v-else>Create Account</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="my-6 flex items-center">
      <div class="flex-grow border-t border-gray-200 dark:border-neutral-700" />
      <span class="px-4 text-sm text-gray-400">or</span>
      <div class="flex-grow border-t border-gray-200 dark:border-neutral-700" />
    </div>

    <!-- Social Register (Placeholder) -->
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
        Already have an account?
        <NuxtLink
          to="/user-login"
          class="ml-1 font-semibold text-brand transition-colors hover:text-[#d81b36]"
        >
          Sign In
        </NuxtLink>
      </p>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { reactive, ref, computed } from 'vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter.vue'

definePageMeta({
  layout: false,
  middleware: 'guest', // Redirect to dashboard if already logged in
})

const router = useRouter()
const {
  register: authRegister,
  isLoading: authLoading,
  error: authError,
  message: authMessage,
} = useAuth()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreedToTerms = ref(false)

const form = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
})

const isLoading = computed(() => authLoading.value)
const error = computed(() => authError.value)
const message = computed(() => authMessage.value)

// Client-side validation
const validateForm = () => {
  errors.email = ''
  errors.username = ''
  errors.password = ''
  errors.confirmPassword = ''

  // Email validation
  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email'
    return false
  }

  // Username validation
  if (!form.username) {
    errors.username = 'Username is required'
    return false
  }

  if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    return false
  }

  if (form.username.length > 20) {
    errors.username = 'Username must be at most 20 characters'
    return false
  }

  // Password validation
  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }

  if (form.password.length < 12) {
    errors.password = 'Password must be at least 12 characters'
    return false
  }

  // Confirm password validation
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    return false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    return false
  }

  // Terms validation
  if (!agreedToTerms.value) {
    // Don't show error, just prevent submit (button is disabled)
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    await authRegister(
      form.email,
      form.username,
      form.password,
      form.confirmPassword,
    )
    // authRegister handles navigation on success
  } catch (err: any) {
    console.error('Register error:', err)
    // Error is already in authError
  }
}

const showComingSoon = (provider: string) => {
  // Would show a toast notification
  console.log(`${provider} registration coming soon!`)
}
</script>
