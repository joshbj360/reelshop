<template>
  <HomeLayout :narrow-feed="false">
    <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1
        class="mb-6 border-b border-gray-200 pb-2 text-4xl font-bold text-gray-900 dark:border-neutral-800 dark:text-neutral-100"
      >
        Privacy Policy
      </h1>

      <div class="space-y-6 text-gray-700 dark:text-neutral-300">
        <p>**Effective Date: November 2025**</p>

        <h2
          class="mt-6 text-2xl font-semibold text-gray-900 dark:text-neutral-100"
        >
          1. Data We Collect
        </h2>
        <p class="text-sm">
          We collect personal information such as your email, username, and
          shipping address when you create an account or place an order. For
          security and service improvement, we also collect usage data (page
          views, interactions) and securely store social media access tokens via
          Supabase Auth for posting purposes.
        </p>

        <h2
          class="mt-6 text-2xl font-semibold text-gray-900 dark:text-neutral-100"
        >
          2. Use of Information
        </h2>
        <p class="text-sm">
          Your data is used to process transactions, fulfill orders, improve our
          product search engine (AI RAG), and personalize content discovery. We
          do not sell your personal data to third parties.
        </p>

        <h2
          class="mt-6 text-2xl font-semibold text-gray-900 dark:text-neutral-100"
        >
          3. Social Media Tokens
        </h2>
        <p class="text-sm">
          When you connect social media accounts (Facebook, Twitter, Instagram),
          we securely store the necessary access tokens via Supabase. These
          tokens are **only** used to publish content on your behalf when
          explicitly requested by you (e.g., clicking 'Publish Product'). We do
          not monitor or access private messages.
        </p>
      </div>
    </div>

    <!-- Right Sidebar -->
    <template #right-sidebar>
      <RightSideNavLinks />
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from '~/layouts/HomeLayout.vue'
import RightSideNavLinks from '~/layouts/children/RightSideNavLinks.vue'
</script>
