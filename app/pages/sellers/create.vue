<template>
    <HomeLayout :narrow-feed="true" :hide-right-sidebar="true">
        <div class="w-full max-w-xl mx-auto pb-20 md:pb-6">

            <!-- Back -->
            <NuxtLink to="/sellers/dashboard" class="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-700 dark:hover:text-neutral-300 mb-5 transition-colors">
                <Icon name="mdi:arrow-left" size="16" />
                Back to My Stores
            </NuxtLink>

            <h1 class="text-[22px] font-bold text-gray-900 dark:text-neutral-100 mb-1">Create a Store</h1>
            <p class="text-[13px] text-gray-400 dark:text-neutral-500 mb-6">Set up your seller profile to start listing products</p>

            <!-- Error -->
            <div v-if="error" class="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-[13px] text-red-600 dark:text-red-400">
                {{ error }}
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">

                <!-- Logo + Banner upload row -->
                <div class="space-y-3">
                    <!-- Banner -->
                    <div>
                        <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Store Banner</label>
                        <div
                            class="relative h-32 rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 hover:border-brand transition-colors"
                            :style="bannerPreview ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
                            @click="bannerInput?.click()"
                        >
                            <div v-if="!bannerPreview" class="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400">
                                <Icon name="mdi:image-plus-outline" size="28" />
                                <span class="text-[11px] font-medium">Upload banner (recommended: 1200×400)</span>
                            </div>
                            <div v-else class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                                <Icon name="mdi:pencil" size="22" class="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div v-if="isUploadingBanner" class="absolute inset-0 flex items-center justify-center bg-black/40">
                                <Icon name="eos-icons:loading" size="24" class="text-white animate-spin" />
                            </div>
                        </div>
                        <input ref="bannerInput" type="file" accept="image/*" class="hidden" @change="handleBannerUpload" />
                    </div>

                    <!-- Logo -->
                    <div class="flex items-center gap-4">
                        <div
                            class="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 overflow-hidden cursor-pointer group hover:border-brand transition-colors shrink-0 relative"
                            @click="logoInput?.click()"
                        >
                            <img v-if="logoPreview" :src="logoPreview" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <Icon name="mdi:store-plus-outline" size="22" />
                            </div>
                            <div v-if="isUploadingLogo" class="absolute inset-0 flex items-center justify-center bg-black/40">
                                <Icon name="eos-icons:loading" size="16" class="text-white animate-spin" />
                            </div>
                        </div>
                        <div>
                            <p class="text-[13px] font-semibold text-gray-700 dark:text-neutral-300">Store Logo</p>
                            <p class="text-[11px] text-gray-400 dark:text-neutral-500">Square image, at least 200×200px</p>
                            <button type="button" @click="logoInput?.click()" class="mt-1 text-[11px] font-semibold text-brand hover:text-[#d81b36] transition-colors">
                                {{ logoPreview ? 'Change logo' : 'Upload logo' }}
                            </button>
                        </div>
                        <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="handleLogoUpload" />
                    </div>
                </div>

                <!-- Store Name -->
                <div>
                    <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Store Name <span class="text-brand">*</span></label>
                    <input
                        v-model="form.store_name"
                        type="text"
                        placeholder="e.g. Lagos Streetwear Co."
                        maxlength="100"
                        required
                        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[14px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                        @input="onNameChange"
                    />
                </div>

                <!-- Slug -->
                <div>
                    <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Store URL <span class="text-brand">*</span></label>
                    <div class="relative">
                        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 dark:text-neutral-500 select-none">fitsy.com/sellers/</span>
                        <input
                            v-model="form.store_slug"
                            type="text"
                            placeholder="your-store"
                            maxlength="50"
                            required
                            class="w-full pl-[144px] pr-10 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[14px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:ring-2 transition"
                            :class="slugStatus === 'available' ? 'border-emerald-400 focus:ring-emerald-400/20' : slugStatus === 'taken' ? 'border-red-400 focus:ring-red-400/20' : 'focus:border-brand focus:ring-brand/20'"
                            @input="onSlugInput"
                        />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2">
                            <Icon v-if="slugStatus === 'available'" name="mdi:check-circle" size="18" class="text-emerald-500" />
                            <Icon v-else-if="slugStatus === 'taken'" name="mdi:close-circle" size="18" class="text-red-500" />
                            <Icon v-else-if="slugChecking" name="eos-icons:loading" size="16" class="text-gray-400 animate-spin" />
                        </div>
                    </div>
                    <p v-if="slugStatus === 'taken'" class="text-[11px] text-red-500 mt-1">This slug is already taken</p>
                    <p v-else-if="slugStatus === 'available'" class="text-[11px] text-emerald-600 mt-1">Available!</p>

                    <!-- Suggestions -->
                    <div v-if="slugSuggestions.length" class="flex flex-wrap gap-1.5 mt-2">
                        <button
                            v-for="s in slugSuggestions"
                            :key="s"
                            type="button"
                            @click="pickSuggestion(s)"
                            class="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors"
                        >
                            {{ s }}
                        </button>
                    </div>
                    <button
                        v-if="form.store_name && !slugSuggestions.length"
                        type="button"
                        @click="loadSuggestions"
                        class="mt-1.5 text-[11px] font-semibold text-brand hover:text-[#d81b36] transition-colors"
                    >
                        Get suggestions →
                    </button>
                </div>

                <!-- Currency -->
                <div>
                    <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Store Currency</label>
                    <select
                        v-model="form.default_currency"
                        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[14px] text-gray-900 dark:text-neutral-100 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                    >
                        <option v-for="c in SUPPORTED_CURRENCIES" :key="c" :value="c">{{ c }}</option>
                    </select>
                    <p class="text-[11px] text-gray-400 dark:text-neutral-500 mt-1">All product prices in your store will use this currency</p>
                </div>

                <!-- Description -->
                <div>
                    <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Description <span class="text-gray-400 font-normal">(optional)</span></label>
                    <textarea
                        v-model="form.store_description"
                        placeholder="Tell buyers about your store…"
                        rows="3"
                        maxlength="500"
                        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[14px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition resize-none"
                    />
                    <p class="text-[11px] text-gray-400 text-right mt-0.5">{{ (form.store_description?.length ?? 0) }}/500</p>
                </div>

                <!-- Location + Phone -->
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Location <span class="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            v-model="form.store_location"
                            type="text"
                            placeholder="Lagos, Nigeria"
                            class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[13px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                        />
                    </div>
                    <div>
                        <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Phone <span class="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            v-model="form.store_phone"
                            type="tel"
                            placeholder="+2348012345678"
                            class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[13px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                        />
                    </div>
                </div>

                <!-- Website -->
                <div>
                    <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Website <span class="text-gray-400 font-normal">(optional)</span></label>
                    <input
                        v-model="form.store_website"
                        type="url"
                        placeholder="https://yourstore.com"
                        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[14px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                    />
                </div>

                <!-- Submit -->
                <button
                    type="submit"
                    :disabled="isSubmitting || slugStatus === 'taken' || slugChecking"
                    class="w-full py-3.5 bg-gradient-to-r from-[#f02c56] to-purple-600 text-white text-[14px] font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Icon v-if="isSubmitting" name="eos-icons:loading" size="18" class="animate-spin" />
                    {{ isSubmitting ? 'Creating store…' : 'Create Store' }}
                </button>
            </form>
        </div>
    </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from '~/layouts/HomeLayout.vue'
import { useSellerManagement } from '~~/layers/seller/app/composables/useSellerManagement'
import { useMediaUpload } from '~~/layers/base/app/composables/useMediaUpload'
import { SUPPORTED_CURRENCIES } from '~/utils/currency'

definePageMeta({ middleware: 'auth' })

const { createSeller, checkSlugAvailability, suggestSlugs, error } = useSellerManagement()
const { uploadMedia, isUploading: isUploadingMedia } = useMediaUpload()

const logoInput = ref<HTMLInputElement | null>(null)
const bannerInput = ref<HTMLInputElement | null>(null)
const logoPreview = ref('')
const bannerPreview = ref('')
const isUploadingLogo = ref(false)
const isUploadingBanner = ref(false)
const isSubmitting = ref(false)

const form = reactive({
    store_name: '',
    store_slug: '',
    store_description: '',
    store_location: '',
    store_phone: '',
    store_website: '',
    store_logo: '',
    store_banner: '',
    default_currency: 'NGN' as string,
})

// Slug checker
const slugStatus = ref<'idle' | 'available' | 'taken'>('idle')
const slugChecking = ref(false)
const slugSuggestions = ref<string[]>([])
let slugTimer: ReturnType<typeof setTimeout> | null = null

const onNameChange = () => {
    const base = form.store_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!form.store_slug) {
        form.store_slug = base
        triggerSlugCheck()
    }
}

const onSlugInput = () => {
    slugStatus.value = 'idle'
    slugSuggestions.value = []
    triggerSlugCheck()
}

const triggerSlugCheck = () => {
    if (slugTimer) clearTimeout(slugTimer)
    slugTimer = setTimeout(async () => {
        const slug = form.store_slug
        if (!slug || slug.length < 3) return
        slugChecking.value = true
        const available = await checkSlugAvailability(slug)
        slugStatus.value = available ? 'available' : 'taken'
        slugChecking.value = false
    }, 500)
}

const loadSuggestions = async () => {
    if (!form.store_name) return
    const suggestions = await suggestSlugs(form.store_name)
    slugSuggestions.value = suggestions.slice(0, 4)
}

const pickSuggestion = (s: string) => {
    form.store_slug = s
    slugSuggestions.value = []
    slugStatus.value = 'available'
}

const handleLogoUpload = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    isUploadingLogo.value = true
    try {
        const result = await uploadMedia({ file })
        form.store_logo = result.url
        logoPreview.value = result.url
    } finally {
        isUploadingLogo.value = false
    }
}

const handleBannerUpload = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    isUploadingBanner.value = true
    try {
        const result = await uploadMedia({ file })
        form.store_banner = result.url
        bannerPreview.value = result.url
    } finally {
        isUploadingBanner.value = false
    }
}

const handleSubmit = async () => {
    if (isSubmitting.value || slugStatus.value === 'taken') return
    isSubmitting.value = true
    try {
        await createSeller({
            store_name: form.store_name,
            store_slug: form.store_slug,
            store_description: form.store_description || undefined,
            store_location: form.store_location || undefined,
            store_phone: form.store_phone || undefined,
            store_website: form.store_website || undefined,
            store_logo: form.store_logo || undefined,
            store_banner: form.store_banner || undefined,
            default_currency: form.default_currency,
        })
    } finally {
        isSubmitting.value = false
    }
}

onUnmounted(() => {
    if (slugTimer) clearTimeout(slugTimer)
})
</script>
