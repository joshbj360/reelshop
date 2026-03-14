<template>
    <div class="flex flex-col h-full bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-800">

        <!-- ─── SCROLLABLE CONTENT AREA ─────────────────────────────────────────── -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">

            <!-- 1. Help Topics -->
            <div class="bg-gray-50/50 dark:bg-neutral-800/30 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                <div class="flex items-center gap-2 mb-3">
                    <Icon name="mdi:book-open-page-variant-outline" size="20" class="text-brand" />
                    <h3 class="font-bold text-gray-900 dark:text-neutral-100">Help Topics</h3>
                </div>
                <div class="space-y-1.5">
                    <NuxtLink to="/help/getting-started" class="quick-link group">
                        <div class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors">
                            <Icon name="mdi:rocket-launch-outline" size="18" />
                        </div>
                        <span class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Getting Started</span>
                    </NuxtLink>
                    <NuxtLink to="/help/orders" class="quick-link group">
                        <div class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors">
                            <Icon name="mdi:package-variant-closed" size="18" />
                        </div>
                        <span class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Orders & Tracking</span>
                    </NuxtLink>
                    <NuxtLink to="/help/returns" class="quick-link group">
                        <div class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors">
                            <Icon name="mdi:keyboard-return" size="18" />
                        </div>
                        <span class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Returns & Refunds</span>
                    </NuxtLink>
                    <NuxtLink to="/help/sellers" class="quick-link group">
                        <div class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors">
                            <Icon name="mdi:storefront-outline" size="18" />
                        </div>
                        <span class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Seller Guide</span>
                    </NuxtLink>
                </div>
            </div>

            <!-- 2. Legal & Policies -->
            <div class="bg-gray-50/50 dark:bg-neutral-800/30 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                <div class="flex items-center gap-2 mb-3">
                    <Icon name="mdi:scale-balance" size="20" class="text-brand" />
                    <h3 class="font-bold text-gray-900 dark:text-neutral-100">Legal & Policies</h3>
                </div>
                <div class="space-y-1.5">
                    <NuxtLink to="/terms" class="quick-link group">
                        <div class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors">
                            <Icon name="mdi:file-document-outline" size="18" />
                        </div>
                        <span class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Terms of Service</span>
                    </NuxtLink>
                    <NuxtLink to="/privacy" class="quick-link group">
                        <div class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors">
                            <Icon name="mdi:shield-check-outline" size="18" />
                        </div>
                        <span class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Privacy Policy</span>
                    </NuxtLink>
                    <NuxtLink to="/policy/cookies" class="quick-link group">
                        <div class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors">
                            <Icon name="mdi:cookie-outline" size="18" />
                        </div>
                        <span class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Cookie Policy</span>
                    </NuxtLink>
                </div>
            </div>

            <!-- 3. Footer Copyright -->
            <div class="px-2 py-4">
                <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-gray-400 dark:text-neutral-500 mb-3 justify-center">
                    <NuxtLink to="/about" class="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">About Styli</NuxtLink>
                    <NuxtLink to="/support" class="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">Support Center</NuxtLink>
                </div>
                <div class="flex items-center justify-center text-[11px] font-medium text-gray-400 dark:text-neutral-600 text-center">
                    <p>© {{ new Date().getFullYear() }} {{ config.public.siteName || 'Styli' }}. All rights reserved.</p>
                </div>
            </div>
        </div>

        <!-- ─── STICKY BOTTOM CONTACT CTA ────────────────────────────────────────── -->
        <div class="flex-shrink-0 pt-2 pb-4 px-3 sticky bottom-0 bg-white dark:bg-neutral-900">
            <div class="bg-brand/5 dark:bg-brand/10 border border-brand/10 rounded-2xl p-4 shadow-sm text-center">
                <div class="w-10 h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon name="mdi:email-fast-outline" size="20" />
                </div>
                <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-1">Need direct help?</h4>
                <p class="text-[11px] text-gray-600 dark:text-neutral-400 mb-3">Our team typically responds in under 24hrs.</p>
                <a 
                    :href="`mailto:${config.public.supportEmail || 'support@styli.com'}`"
                    class="block w-full py-2.5 bg-brand text-white rounded-xl text-xs font-bold hover:bg-[#d81b36] hover:shadow-md transition-all active:scale-95"
                >
                    Contact Support
                </a>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<style scoped>
.quick-link {
    @apply flex items-center gap-3 p-2 -mx-2 rounded-lg transition-all cursor-pointer hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-neutral-700;
}

/* Custom Scrollbar Styling */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #d1d5db;
}

/* Dark mode scrollbar */
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #404040;
}

:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #525252;
}

/* Firefox scrollbar */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #e5e7eb transparent;
}

:global(.dark) .custom-scrollbar {
    scrollbar-color: #404040 transparent;
}
</style>