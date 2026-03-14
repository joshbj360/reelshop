<template>
  <HomeLayout :narrow-feed="false">
    <div class="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-24">
      
      <!-- ─── HERO & SEARCH ─────────────────────────────────────────────── -->
      <div class="text-center mb-12">
        <div class="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Icon name="mdi:lifebuoy" size="32" />
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-neutral-100 tracking-tight mb-4">
          How can we help you?
        </h1>
        <p class="text-gray-500 dark:text-neutral-400 max-w-lg mx-auto mb-8 text-base">
          Search our knowledge base or browse categories below to find answers to your questions, policies, and contact information.
        </p>

        <!-- Search Bar -->
        <div class="relative max-w-2xl mx-auto group shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Icon name="mdi:magnify" size="24" class="text-gray-400 group-focus-within:text-brand transition-colors" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search for articles, tracking, returns..." 
            class="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl py-4 pl-14 pr-12 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-lg"
          >
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300"
          >
            <Icon name="mdi:close-circle" size="22" />
          </button>
        </div>
      </div>

      <!-- ─── HELP TOPICS GRID ──────────────────────────────────────────── -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <NuxtLink to="/help/getting-started" class="group bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-5 hover:border-brand/30 hover:shadow-md transition-all text-center flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:rocket-launch-outline" size="24" />
          </div>
          <span class="font-bold text-sm text-gray-900 dark:text-neutral-100">Getting Started</span>
        </NuxtLink>

        <NuxtLink to="/help/orders" class="group bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-5 hover:border-brand/30 hover:shadow-md transition-all text-center flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:package-variant-closed" size="24" />
          </div>
          <span class="font-bold text-sm text-gray-900 dark:text-neutral-100">Orders & Tracking</span>
        </NuxtLink>

        <NuxtLink to="/help/returns" class="group bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-5 hover:border-brand/30 hover:shadow-md transition-all text-center flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:keyboard-return" size="24" />
          </div>
          <span class="font-bold text-sm text-gray-900 dark:text-neutral-100">Returns & Refunds</span>
        </NuxtLink>

        <NuxtLink to="/help/sellers" class="group bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-5 hover:border-brand/30 hover:shadow-md transition-all text-center flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="mdi:storefront-outline" size="24" />
          </div>
          <span class="font-bold text-sm text-gray-900 dark:text-neutral-100">Seller Guide</span>
        </NuxtLink>
      </div>

      <!-- ─── FAQ SECTION ───────────────────────────────────────────────── -->
      <div class="mb-16">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">Frequently Asked Questions</h2>
        
        <!-- Category Filters -->
        <div class="flex overflow-x-auto custom-scrollbar gap-3 mb-8 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button 
            v-for="category in categories" 
            :key="category.id"
            @click="activeCategory = category.id"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap border shrink-0"
            :class="activeCategory === category.id 
              ? 'bg-brand text-white border-brand shadow-md shadow-brand/20' 
              : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-300 border-gray-200 dark:border-neutral-800 hover:border-brand/30 hover:bg-brand/5 dark:hover:bg-brand/10'"
          >
            <Icon :name="category.icon" size="18" />
            {{ category.label }}
          </button>
        </div>

        <!-- FAQ Accordions -->
        <div class="space-y-4 min-h-[250px]">
          <div v-if="filteredFaqs.length === 0" class="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800">
            <Icon name="mdi:file-search-outline" size="48" class="text-gray-300 dark:text-neutral-600 mb-3" />
            <h3 class="text-lg font-bold text-gray-900 dark:text-neutral-100">No results found</h3>
            <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1">We couldn't find any articles matching "{{ searchQuery }}"</p>
            <button @click="searchQuery = ''; activeCategory = 'all'" class="mt-4 text-brand font-semibold hover:underline">Clear Search</button>
          </div>

          <details 
            v-for="(faq, index) in filteredFaqs" 
            :key="index"
            class="group bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <summary class="flex items-center justify-between p-5 sm:p-6 font-bold text-[15px] cursor-pointer text-gray-900 dark:text-neutral-100 select-none">
              <span class="pr-4">{{ faq.question }}</span>
              <span class="w-8 h-8 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center shrink-0 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                <Icon name="mdi:chevron-down" class="transition-transform duration-300 group-open:-rotate-180" size="20" />
              </span>
            </summary>
            <div class="px-5 sm:px-6 pb-6 pt-0 text-sm text-gray-600 dark:text-neutral-400 leading-relaxed border-t border-gray-100 dark:border-neutral-800 mt-2 pt-4">
              {{ faq.answer }}
            </div>
          </details>
        </div>
      </div>

      <!-- ─── LEGAL & POLICIES ──────────────────────────────────────────── -->
      <div class="mb-16 pt-10 border-t border-gray-200 dark:border-neutral-800">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">Legal & Policies</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NuxtLink to="/terms" class="flex items-center justify-between p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl hover:border-brand/50 hover:shadow-sm transition-all group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-400 group-hover:text-brand transition-colors">
                <Icon name="mdi:file-document-outline" size="20" />
              </div>
              <div>
                <h3 class="font-bold text-sm text-gray-900 dark:text-neutral-100">Terms of Service</h3>
                <p class="text-xs text-gray-500 dark:text-neutral-500 mt-0.5">Rules and guidelines for using Styli</p>
              </div>
            </div>
            <Icon name="mdi:chevron-right" class="text-gray-400 group-hover:text-brand transition-colors" />
          </NuxtLink>

          <NuxtLink to="/privacy" class="flex items-center justify-between p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl hover:border-brand/50 hover:shadow-sm transition-all group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-400 group-hover:text-brand transition-colors">
                <Icon name="mdi:shield-check-outline" size="20" />
              </div>
              <div>
                <h3 class="font-bold text-sm text-gray-900 dark:text-neutral-100">Privacy Policy</h3>
                <p class="text-xs text-gray-500 dark:text-neutral-500 mt-0.5">How we handle and protect your data</p>
              </div>
            </div>
            <Icon name="mdi:chevron-right" class="text-gray-400 group-hover:text-brand transition-colors" />
          </NuxtLink>

          <NuxtLink to="/policy/returns" class="flex items-center justify-between p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl hover:border-brand/50 hover:shadow-sm transition-all group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-400 group-hover:text-brand transition-colors">
                <Icon name="mdi:keyboard-return" size="20" />
              </div>
              <div>
                <h3 class="font-bold text-sm text-gray-900 dark:text-neutral-100">Return Policy</h3>
                <p class="text-xs text-gray-500 dark:text-neutral-500 mt-0.5">Information on returns and refunds</p>
              </div>
            </div>
            <Icon name="mdi:chevron-right" class="text-gray-400 group-hover:text-brand transition-colors" />
          </NuxtLink>

          <NuxtLink to="/policy/cookies" class="flex items-center justify-between p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl hover:border-brand/50 hover:shadow-sm transition-all group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-400 group-hover:text-brand transition-colors">
                <Icon name="mdi:cookie-outline" size="20" />
              </div>
              <div>
                <h3 class="font-bold text-sm text-gray-900 dark:text-neutral-100">Cookie Policy</h3>
                <p class="text-xs text-gray-500 dark:text-neutral-500 mt-0.5">How we use cookies and tracking</p>
              </div>
            </div>
            <Icon name="mdi:chevron-right" class="text-gray-400 group-hover:text-brand transition-colors" />
          </NuxtLink>
        </div>
      </div>
      
      <!-- ─── STILL NEED HELP (CONTACT) ─────────────────────────────────── -->
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-neutral-900 dark:to-neutral-950 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-xl border border-gray-800 dark:border-neutral-800">
        <div class="absolute top-0 right-0 w-64 h-64 bg-brand/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div class="relative z-10">
          <div class="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-5 border border-white/10">
            <Icon name="mdi:headset" size="40" class="text-white" />
          </div>
          <h2 class="text-2xl font-bold text-white mb-3">Still need help?</h2>
          <p class="text-gray-300 max-w-md mx-auto mb-2 text-sm leading-relaxed">
            Can't find the answer you're looking for? Our support team is here to assist you with any questions.
          </p>
          <p class="text-brand-light text-xs font-semibold mb-8 tracking-wider uppercase">Average response time: Under 24 hours</p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              :href="`mailto:${config.public.supportEmail || 'support@styli.com'}`"
              class="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#d81b36] hover:shadow-lg hover:shadow-brand/20 transition-all active:scale-95"
            >
              <Icon name="mdi:email-fast-outline" size="20" />
              Email Support
            </a>
            <button class="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all active:scale-95">
              <Icon name="mdi:chat-processing-outline" size="20" />
              Live Chat
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Right Sidebar Slot -->
    <template #right-sidebar>
      <RightSideNavLinks />
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HomeLayout from '~/layouts/HomeLayout.vue'
import RightSideNavLinks from '~/layouts/children/RightSideNavLinks.vue'
const config = useRuntimeConfig()

// State
const searchQuery = ref('')
const activeCategory = ref('all')

// Categories
const categories = [
  { id: 'all', label: 'All Topics', icon: 'mdi:view-grid-outline' },
  { id: 'shopping', label: 'Shopping & Orders', icon: 'mdi:shopping-outline' },
  { id: 'selling', label: 'Selling on Styli', icon: 'mdi:storefront-outline' },
  { id: 'account', label: 'Account & Security', icon: 'mdi:shield-account-outline' },
  { id: 'ai', label: 'Dasah AI', icon: 'mdi:robot-happy-outline' }
]

// FAQ Data
const faqs = [
  {
    category: 'selling',
    question: 'How do I connect my Instagram Business Account?',
    answer: "Go to your Dashboard, select the 'Social & Marketing' tab, and click 'Connect Instagram.' You will be redirected to Facebook to grant necessary posting permissions. Remember, you must have an Instagram Business Account linked to a Facebook Page."
  },
  {
    category: 'selling',
    question: 'How do payouts work for sellers?',
    answer: "When a buyer purchases an item, the funds are held securely in escrow until the item is delivered. Once the buyer confirms delivery (or after a 3-day dispute window), the funds are released to your Seller Wallet. You can then withdraw to your bank account."
  },
  {
    category: 'ai',
    question: 'How does the Dasah AI Assistant find products?',
    answer: 'Dasah uses advanced vector embeddings (RAG) to search our entire product catalog based on concept, not just keywords. This allows her to understand complex style queries like "a dress for a summer beach wedding" and provide highly relevant recommendations.'
  },
  {
    category: 'shopping',
    question: 'What is the Thrift section?',
    answer: "The Thrift section features pre-owned, gently-used fashion items. These products are marked with a 'Thrift' tag and can be browsed by your existing categories (Shoes, Jackets, etc.) for affordable and sustainable shopping."
  },
  {
    category: 'shopping',
    question: 'How do I track my order?',
    answer: 'Once your order ships, you will receive a tracking link via email. You can also track your order status in real-time from the "My Orders" section of your user profile.'
  },
  {
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" at the login screen. We will send a reset link to your registered email. If you are already logged in, you can update your password in Account Settings -> Security.'
  },
  {
    category: 'account',
    question: 'How do I delete my account?',
    answer: 'You can request account deletion from your Account Settings. Please note that this action is permanent and will remove all your data, including order history and saved items. Any active seller profiles must be deactivated first.'
  }
]

// Computed Search & Filter
const filteredFaqs = computed(() => {
  let filtered = faqs

  // Filter by Category
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(faq => faq.category === activeCategory.value)
  }

  // Filter by Search Query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    )
  }

  return filtered
})
</script>

<style scoped>
/* Custom horizontal scrollbar for categories on mobile */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #404040;
}
</style>