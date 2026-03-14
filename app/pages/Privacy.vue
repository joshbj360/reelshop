<template>
  <HomeLayout :narrow-feed="false">
  <div class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-6 border-b border-gray-200 dark:border-neutral-800 pb-2">
      Privacy Policy
    </h1>
    
    <div class="space-y-6 text-gray-700 dark:text-neutral-300">
      <p>
        **Effective Date: November 2025**
      </p>
      
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-neutral-100 mt-6">1. Data We Collect</h2>
      <p class="text-sm">
        We collect personal information such as your email, username, and shipping address when you create an account or place an order. For security and service improvement, we also collect usage data (page views, interactions) and securely store social media access tokens via Supabase Auth for posting purposes.
      </p>
      
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-neutral-100 mt-6">2. Use of Information</h2>
      <p class="text-sm">
        Your data is used to process transactions, fulfill orders, improve our product search engine (AI RAG), and personalize content discovery. We do not sell your personal data to third parties.
      </p>
      
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-neutral-100 mt-6">3. Social Media Tokens</h2>
      <p class="text-sm">
        When you connect social media accounts (Facebook, Twitter, Instagram), we securely store the necessary access tokens via Supabase. These tokens are **only** used to publish content on your behalf when explicitly requested by you (e.g., clicking 'Publish Product'). We do not monitor or access private messages.
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