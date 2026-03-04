<template>
    <div class="p-6 max-w-2xl">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-neutral-100">Store Settings</h1>
            <p class="text-[13px] text-gray-400 dark:text-neutral-500 mt-1">@{{ storeSlug }}</p>
        </div>

        <!-- Loading skeleton -->
        <div v-if="pageLoading" class="space-y-4 animate-pulse">
            <div class="h-32 bg-gray-100 dark:bg-neutral-800 rounded-2xl" />
            <div class="h-10 bg-gray-100 dark:bg-neutral-800 rounded-xl" />
            <div class="h-10 bg-gray-100 dark:bg-neutral-800 rounded-xl" />
            <div class="h-10 bg-gray-100 dark:bg-neutral-800 rounded-xl" />
        </div>

        <template v-else>
            <!-- Success -->
            <div v-if="saveSuccess" class="mb-4 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[13px] text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <Icon name="mdi:check-circle" size="16" />
                Store updated successfully!
            </div>

            <!-- Error -->
            <div v-if="error" class="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-[13px] text-red-600 dark:text-red-400">
                {{ error }}
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">

                <!-- Banner -->
                <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-5 space-y-4">
                    <h2 class="font-semibold text-gray-900 dark:text-neutral-100 text-[14px]">Store Branding</h2>

                    <!-- Banner upload -->
                    <div>
                        <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Store Banner</label>
                        <div
                            class="relative h-32 rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 hover:border-brand transition-colors"
                            :style="bannerPreview ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
                            @click="bannerInput?.click()"
                        >
                            <div v-if="!bannerPreview" class="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400">
                                <Icon name="mdi:image-plus-outline" size="28" />
                                <span class="text-[11px] font-medium">Upload banner</span>
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

                    <!-- Logo upload -->
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
                            <button type="button" @click="logoInput?.click()" class="mt-1 text-[11px] font-semibold text-brand hover:text-[#d81b36] transition-colors">
                                {{ logoPreview ? 'Change logo' : 'Upload logo' }}
                            </button>
                        </div>
                        <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="handleLogoUpload" />
                    </div>
                </div>

                <!-- Store Info -->
                <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-5 space-y-4">
                    <h2 class="font-semibold text-gray-900 dark:text-neutral-100 text-[14px]">Store Information</h2>

                    <!-- Store Name -->
                    <div>
                        <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">
                            Store Name <span class="text-brand">*</span>
                        </label>
                        <input
                            v-model="form.store_name"
                            type="text"
                            maxlength="100"
                            required
                            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[14px] text-gray-900 dark:text-neutral-100 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                        />
                    </div>

                    <!-- Slug (read-only) -->
                    <div>
                        <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">
                            Store URL <span class="text-gray-400 font-normal text-[11px]">(cannot be changed)</span>
                        </label>
                        <div class="w-full px-4 py-2.5 bg-gray-100 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-xl text-[14px] text-gray-500 dark:text-neutral-400 select-none">
                            fitsy.com/sellers/profile/{{ storeSlug }}
                        </div>
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
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Description</label>
                        <textarea
                            v-model="form.store_description"
                            rows="3"
                            maxlength="500"
                            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[14px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition resize-none"
                        />
                        <p class="text-[11px] text-gray-400 text-right mt-0.5">{{ (form.store_description?.length ?? 0) }}/500</p>
                    </div>
                </div>

                <!-- Contact -->
                <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-5 space-y-4">
                    <h2 class="font-semibold text-gray-900 dark:text-neutral-100 text-[14px]">Contact & Location</h2>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Location</label>
                            <input
                                v-model="form.store_location"
                                type="text"
                                placeholder="Lagos, Nigeria"
                                class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[13px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                            />
                        </div>
                        <div>
                            <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Phone</label>
                            <input
                                v-model="form.store_phone"
                                type="tel"
                                class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[13px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="text-[12px] font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 block">Website</label>
                        <input
                            v-model="form.store_website"
                            type="url"
                            placeholder="https://yourstore.com"
                            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[14px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                        />
                    </div>
                </div>

                <!-- Save -->
                <button
                    type="submit"
                    :disabled="isSaving || isUploadingLogo || isUploadingBanner"
                    class="w-full py-3.5 bg-gradient-to-r from-[#f02c56] to-purple-600 text-white text-[14px] font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Icon v-if="isSaving" name="eos-icons:loading" size="18" class="animate-spin" />
                    {{ isSaving ? 'Saving…' : 'Save Changes' }}
                </button>
            </form>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useSellerManagement } from '~~/layers/seller/app/composables/useSellerManagement';
import { useMediaUpload } from '~~/layers/base/app/composables/useMediaUpload';
import { SUPPORTED_CURRENCIES } from '~/utils/currency';

definePageMeta({ middleware: 'auth', layout: 'seller' });

const route = useRoute();
const storeSlug = computed(() => route.params.storeSlug as string);

const { loadPublicSeller, updateSeller, currentSeller, error, isLoading } = useSellerManagement();
const { uploadMedia } = useMediaUpload();

const pageLoading = ref(true);
const isSaving = ref(false);
const saveSuccess = ref(false);
const logoInput = ref<HTMLInputElement | null>(null);
const bannerInput = ref<HTMLInputElement | null>(null);
const logoPreview = ref('');
const bannerPreview = ref('');
const isUploadingLogo = ref(false);
const isUploadingBanner = ref(false);

const form = reactive({
    store_name: '',
    store_description: '',
    store_location: '',
    store_phone: '',
    store_website: '',
    store_logo: '',
    store_banner: '',
    default_currency: 'NGN' as string,
});

const prefillForm = (s: any) => {
    form.store_name = s.store_name ?? '';
    form.store_description = s.store_description ?? '';
    form.store_location = s.store_location ?? '';
    form.store_phone = s.store_phone ?? '';
    form.store_website = s.store_website ?? '';
    form.store_logo = s.store_logo ?? '';
    form.store_banner = s.store_banner ?? '';
    form.default_currency = s.default_currency ?? 'NGN';
    logoPreview.value = s.store_logo ?? '';
    bannerPreview.value = s.store_banner ?? '';
};

onMounted(async () => {
    try {
        await loadPublicSeller(storeSlug.value);
        if (currentSeller.value) prefillForm(currentSeller.value);
    } finally {
        pageLoading.value = false;
    }
});

watch(storeSlug, async (slug) => {
    pageLoading.value = true;
    try {
        await loadPublicSeller(slug);
        if (currentSeller.value) prefillForm(currentSeller.value);
    } finally {
        pageLoading.value = false;
    }
});

const handleLogoUpload = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    isUploadingLogo.value = true;
    try {
        const result = await uploadMedia({ file });
        form.store_logo = result.url;
        logoPreview.value = result.url;
    } finally {
        isUploadingLogo.value = false;
    }
};

const handleBannerUpload = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    isUploadingBanner.value = true;
    try {
        const result = await uploadMedia({ file });
        form.store_banner = result.url;
        bannerPreview.value = result.url;
    } finally {
        isUploadingBanner.value = false;
    }
};

const handleSubmit = async () => {
    if (isSaving.value || !currentSeller.value) return;
    isSaving.value = true;
    saveSuccess.value = false;
    try {
        await updateSeller(currentSeller.value.id, {
            store_name: form.store_name || undefined,
            store_description: form.store_description || undefined,
            store_location: form.store_location || undefined,
            store_phone: form.store_phone || undefined,
            store_website: form.store_website || undefined,
            store_logo: form.store_logo || undefined,
            store_banner: form.store_banner || undefined,
            default_currency: form.default_currency,
        } as any);
        saveSuccess.value = true;
        setTimeout(() => { saveSuccess.value = false; }, 3000);
    } finally {
        isSaving.value = false;
    }
};
</script>
