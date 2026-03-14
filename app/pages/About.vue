<template>
  <HomeLayout :narrow-feed="false">
    <div class="max-w-5xl mx-auto py-8 sm:py-16 px-4 sm:px-6 lg:px-8 pb-24">
      
      <!-- ─── HERO SECTION ─────────────────────────────────────────────── -->
      <div class="text-center mb-16 lg:mb-24">
        <div class="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-bold tracking-widest uppercase mb-6">
          The Commerce Revolution
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-neutral-100 tracking-tight mb-6 leading-tight">
          We give the upper hand <br class="hidden sm:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-600">back to the seller.</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {{ config.public.siteName || 'Styli' }} isn't just another marketplace. We are a complete Creative Management System built to automate your growth, eliminate borders, and turn every scroll into a sale.
        </p>
      </div>

      <!-- ─── THE 4 PILLARS (GRID) ──────────────────────────────────────── -->
      <div class="grid md:grid-cols-2 gap-6 lg:gap-8 mb-20">
        
        <!-- Pillar 1: AI -->
        <div class="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors"></div>
          <div class="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <Icon name="mdi:robot-outline" size="28" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">1. AI-Powered Enhancement</h3>
          <p class="text-gray-600 dark:text-neutral-400 leading-relaxed relative z-10">
            Upload an image and let our AI do the heavy lifting. From auto-generating high-converting product descriptions to optimizing pricing and sales strategies, we provide you with a world-class marketing team in your pocket.
          </p>
        </div>

        <!-- Pillar 2: Social Reach (The Killer Feature) -->
        <div class="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/20 transition-colors"></div>
          <div class="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <Icon name="mdi:share-all-outline" size="28" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">2. Automated Omni-Channel Reach</h3>
          <p class="text-gray-600 dark:text-neutral-400 leading-relaxed relative z-10">
            Why post manually? Publish your product once on our platform, and we automatically blast it across Facebook, Twitter, Instagram, and Pinterest. We give you massive, automated reach that legacy marketplaces simply can't match.
          </p>
        </div>

        <!-- Pillar 3: Borders & Logistics -->
        <div class="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors"></div>
          <div class="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <Icon name="mdi:earth" size="28" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">3. Cross-Border Commerce</h3>
          <p class="text-gray-600 dark:text-neutral-400 leading-relaxed relative z-10">
            Sell globally, effortlessly. We handle the complexities of cross-border payments, currency conversions, and international logistics, ensuring your products can reach buyers anywhere in the world without the headache.
          </p>
        </div>

        <!-- Pillar 4: The Buyer Experience -->
        <div class="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors"></div>
          <div class="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <Icon name="mdi:shopping-search" size="28" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">4. A Flawless Buyer Experience</h3>
          <p class="text-gray-600 dark:text-neutral-400 leading-relaxed relative z-10">
            For buyers, discovery is magic. We connect them with exactly what they are looking for across various price points—from premium stores to thrift finds. Combined with real customer video reviews (Reels), we've eliminated the guesswork from online shopping.
          </p>
        </div>

      </div>

      <!-- ─── THE MISSION BLOCK ────────────────────────────────────────── -->
      <div class="bg-gradient-to-br from-gray-900 to-neutral-950 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl border border-gray-800">
        <div class="absolute top-0 right-0 w-64 h-64 bg-brand/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div class="relative z-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-8 leading-tight max-w-3xl mx-auto">
            "Our mission is simple: To make every scroll a shopping opportunity and every transaction seamless."
          </h2>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink to="/seller/create" class="w-full sm:w-auto bg-brand text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#d81b36] transition-colors shadow-lg shadow-brand/20 flex items-center justify-center gap-2">
              <Icon name="mdi:store-plus" size="20" />
              Open Your Store
            </NuxtLink>
            <NuxtLink to="/discover" class="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
              <Icon name="mdi:compass-outline" size="20" />
              Start Shopping
            </NuxtLink>
          </div>
        </div>
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

const config = useRuntimeConfig()

useSeoMeta({
  title: 'Our Story · Styli',
  description: 'Learn how we are revolutionizing commerce by empowering sellers with AI, automated social reach, and cross-border logistics.'
})
</script>