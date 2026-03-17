<!-- layers/auth/pages/user-register.vue -->
<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Full-screen Background -->
    <div class="absolute inset-0 z-0">
      <img
        src="http://funtimesmagazine.com/wp-content/uploads/2024/11/image1-1024x689.png"
        alt="Vibrant Lagos street fashion group in colorful Ankara and modern outfits"
        class="h-full w-full object-cover object-center brightness-[0.78] contrast-[1.08] saturate-[1.15]"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/45 to-black/30" />
    </div>

    <!-- Main Content – centered glassmorphism card -->
    <div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-10 sm:px-6 md:py-12 lg:px-8">
      <div
        class="fade-in w-full max-w-md rounded-2xl bg-white/88 p-6 shadow-2xl backdrop-blur-xl sm:p-8 md:max-w-lg md:p-10 lg:max-w-md dark:bg-neutral-900/82 dark:shadow-black/40"
      >
        <!-- Header & Motivational Copy -->
        <div class="mb-7 text-center">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Join {{ $config.public.siteName || 'Indix' }}
          </h1>
          <p class="mt-2.5 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            Create your account to share your style, discover trends, follow creators, and shop what moves you
          </p>
        </div>

        <!-- Messages -->
        <div v-if="error || message" class="mb-6 space-y-3">
          <div
            v-if="error"
            class="rounded-xl border border-red-200/80 bg-red-50/70 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-950/25 dark:text-red-300"
          >
            {{ error }}
          </div>
          <div
            v-if="message"
            class="rounded-xl border border-green-200/80 bg-green-50/70 p-4 text-sm text-green-700 dark:border-green-800/40 dark:bg-green-950/25 dark:text-green-300"
          >
            {{ message }}
          </div>
        </div>

        <!-- Social Sign Up – Prominent & First -->
        <div class="space-y-3.5 mb-8">
          <button
            type="button"
            :disabled="isLoading"
            class="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-sm font-semibold text-gray-900 shadow hover:bg-gray-50 disabled:opacity-60 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            @click="showComingSoon('Google')"
          >
            <Icon name="mdi:google" class="h-5 w-5 text-[#4285F4]" />
            Sign up with Google
          </button>

          <button
            type="button"
            :disabled="isLoading"
            class="flex w-full items-center justify-center gap-3 rounded-xl bg-black py-3.5 text-sm font-semibold text-white shadow hover:bg-neutral-900 disabled:opacity-60"
            @click="showComingSoon('Apple')"
          >
            <Icon name="mdi:apple" class="h-5 w-5" />
            Sign up with Apple
          </button>

          <button
            type="button"
            :disabled="isLoading"
            class="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#405de6] via-[#5851db] via-[#833ab4] to-[#fd1d1d] py-3.5 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
            @click="showComingSoon('Instagram')"
          >
            <Icon name="mdi:instagram" class="h-5 w-5" />
            Sign up with Instagram
          </button>

          <!-- Divider -->
          <div class="relative my-5">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300/60 dark:border-neutral-600/60" />
            </div>
            <div class="relative flex justify-center text-xs uppercase tracking-wider">
              <span class="bg-white/88 px-4 text-gray-500 dark:bg-neutral-900/82 dark:text-gray-400">
                or sign up with email
              </span>
            </div>
          </div>
        </div>

        <!-- Registration Form -->
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <!-- Username -->
          <div>
            <input
              v-model="form.username"
              type="text"
              placeholder="Choose a username"
              :disabled="isLoading"
              class="w-full rounded-xl border bg-white/60 px-4 py-3.5 text-base placeholder-gray-500 transition focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-neutral-600 dark:bg-neutral-800/50 dark:text-white dark:placeholder-gray-400"
              :class="{ 'border-red-400 dark:border-red-600': errors.username }"
            />
            <p v-if="errors.username" class="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {{ errors.username }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <input
              v-model="form.email"
              type="email"
              placeholder="Your email"
              :disabled="isLoading"
              class="w-full rounded-xl border bg-white/60 px-4 py-3.5 text-base placeholder-gray-500 transition focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-neutral-600 dark:bg-neutral-800/50 dark:text-white dark:placeholder-gray-400"
              :class="{ 'border-red-400 dark:border-red-600': errors.email }"
            />
            <p v-if="errors.email" class="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create password (min 12 characters)"
              :disabled="isLoading"
              class="w-full rounded-xl border bg-white/60 px-4 py-3.5 pr-12 text-base placeholder-gray-500 transition focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-neutral-600 dark:bg-neutral-800/50 dark:text-white dark:placeholder-gray-400"
              :class="{ 'border-red-400 dark:border-red-600': errors.password }"
            />
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              :disabled="isLoading"
              @click="showPassword = !showPassword"
            >
              <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" class="h-5.5 w-5.5" />
            </button>
            <p v-if="errors.password" class="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div class="relative">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm password"
              :disabled="isLoading"
              class="w-full rounded-xl border bg-white/60 px-4 py-3.5 pr-12 text-base placeholder-gray-500 transition focus:border-brand focus:ring-2 focus:ring-brand/30 dark:border-neutral-600 dark:bg-neutral-800/50 dark:text-white dark:placeholder-gray-400"
              :class="{ 'border-red-400 dark:border-red-600': errors.confirmPassword }"
            />
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              :disabled="isLoading"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <Icon :name="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'" class="h-5.5 w-5.5" />
            </button>
            <p v-if="errors.confirmPassword" class="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Password Strength Meter -->
          <PasswordStrengthMeter v-if="form.password" :password="form.password" />

          <!-- Terms Checkbox -->
          <div class="flex items-start gap-3 pt-1">
            <input
              v-model="agreedToTerms"
              type="checkbox"
              id="terms"
              class="mt-1.5 h-5 w-5 rounded border-gray-300 text-brand focus:ring-brand/40 dark:bg-neutral-700"
              :disabled="isLoading"
            />
            <label for="terms" class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              I agree to the
              <a href="#" class="font-medium text-brand hover:text-brand/80 transition">Terms of Service</a>
              and
              <a href="#" class="font-medium text-brand hover:text-brand/80 transition">Privacy Policy</a>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || !agreedToTerms"
            class="w-full rounded-xl bg-brand py-3.5 text-base font-semibold text-white shadow transition hover:bg-brand/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-60 mt-2"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2.5">
              <div class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Sign In Link -->
        <p class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Already on {{ $config.public.siteName || 'Indix' }}?
          <NuxtLink
            to="/user-login"
            class="font-semibold text-brand hover:text-brand/80 transition"
          >
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { reactive, ref, computed } from 'vue'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter.vue'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const { register: authRegister, isLoading: authLoading, error: authError, message: authMessage } = useAuth()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreedToTerms = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const isLoading = computed(() => authLoading.value)
const error = computed(() => authError.value)
const message = computed(() => authMessage.value)

const validateForm = () => {
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.username.trim()) {
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

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email'
    return false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }
  if (form.password.length < 12) {
    errors.password = 'Password must be at least 12 characters'
    return false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    return false
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    return false
  }

  if (!agreedToTerms.value) {
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    await authRegister(
      form.email.trim(),
      form.username.trim(),
      form.password,
      form.confirmPassword
    )
    // Navigation handled in useAuth
  } catch (err) {
    console.error('Registration error:', err)
  }
}

const showComingSoon = (provider: string) => {
  // You can replace with a toast/notification system
  console.log(`${provider} sign-up coming soon!`)
}
</script>

<style scoped>
.fade-in {
  animation: fadeInUp 0.55s ease-out forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>