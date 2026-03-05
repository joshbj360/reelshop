<template>
    <Teleport to="body">
        <transition
            enter-active-class="transition-opacity duration-200 ease-out"
            leave-active-class="transition-opacity duration-150 ease-in"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen"
                class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
                @click.self="close"
            >
                <div
                    @click.stop
                    class="bg-white dark:bg-neutral-900 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col"
                    style="max-height: 92vh;"
                >
                    <!-- Header -->
                    <div class="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 dark:border-neutral-800 shrink-0">
                        <h2 class="text-base font-semibold text-gray-900 dark:text-neutral-100">Quick Add Product</h2>
                        <button @click="close" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                            <Icon name="mdi:close" size="20" class="text-gray-500 dark:text-neutral-400" />
                        </button>
                    </div>

                    <!-- Scrollable body -->
                    <div class="overflow-y-auto flex-1 p-4 space-y-4">

                        <!-- Store Selector -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-1.5">Store *</label>
                            <div class="relative">
                                <button
                                    type="button"
                                    @click="storeDropdownOpen = !storeDropdownOpen"
                                    class="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand"
                                >
                                    <div class="flex items-center gap-2 min-w-0">
                                        <img
                                            v-if="selectedSeller?.store_logo"
                                            :src="selectedSeller.store_logo"
                                            class="w-5 h-5 rounded-full object-cover shrink-0"
                                        />
                                        <div v-else class="w-5 h-5 rounded-full bg-gradient-to-br from-[#f02c56] to-purple-600 shrink-0" />
                                        <span class="truncate">{{ selectedSeller?.store_name ?? 'Select a store' }}</span>
                                    </div>
                                    <Icon name="mdi:chevron-down" size="18" class="text-gray-400 shrink-0 transition-transform" :class="storeDropdownOpen ? 'rotate-180' : ''" />
                                </button>

                                <!-- Dropdown -->
                                <div
                                    v-if="storeDropdownOpen"
                                    class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-10 overflow-hidden"
                                >
                                    <div v-if="sellers.length === 0" class="px-4 py-3 text-sm text-gray-500 dark:text-neutral-400 text-center">
                                        No stores found
                                    </div>
                                    <button
                                        v-for="seller in sellers"
                                        :key="seller.id"
                                        type="button"
                                        @click="selectStore(seller)"
                                        class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-left"
                                    >
                                        <img
                                            v-if="seller.store_logo"
                                            :src="seller.store_logo"
                                            class="w-7 h-7 rounded-full object-cover shrink-0"
                                        />
                                        <div v-else class="w-7 h-7 rounded-full bg-gradient-to-br from-[#f02c56] to-purple-600 flex items-center justify-center shrink-0">
                                            <Icon name="mdi:store" size="14" class="text-white" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{{ seller.store_name }}</p>
                                            <p class="text-[11px] text-gray-400 dark:text-neutral-500">@{{ seller.store_slug }}</p>
                                        </div>
                                        <Icon
                                            v-if="selectedSeller?.id === seller.id"
                                            name="mdi:check"
                                            size="16"
                                            class="text-brand shrink-0"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Cover Image -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-1.5">Cover Image</label>
                            <div
                                v-if="!coverPreview"
                                @click="triggerImagePick"
                                class="w-full aspect-video bg-gray-50 dark:bg-neutral-800 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand transition-colors"
                            >
                                <div v-if="uploadingCover" class="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                                <template v-else>
                                    <Icon name="mdi:image-plus-outline" size="32" class="text-gray-300 dark:text-neutral-600" />
                                    <p class="text-xs text-gray-400 dark:text-neutral-500">Tap to add photo</p>
                                </template>
                            </div>
                            <div v-else class="relative rounded-xl overflow-hidden aspect-video">
                                <img :src="coverPreview" class="w-full h-full object-cover" />
                                <button
                                    @click="removeCover"
                                    class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                                >
                                    <Icon name="mdi:close" size="16" class="text-white" />
                                </button>
                                <div v-if="uploadingCover" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                            </div>
                            <input ref="imageInputRef" type="file" accept="image/*,video/*" class="hidden" @change="onImagePicked" />
                        </div>

                        <!-- Background Music -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-1.5">Background Music <span class="font-normal text-gray-400">(optional)</span></label>
                            <div v-if="!bgMusicName" @click="triggerMusicPick" class="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-neutral-800 border border-dashed border-gray-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:border-brand transition-colors">
                                <span class="text-base leading-none">🎵</span>
                                <span class="text-sm text-gray-400 dark:text-neutral-500">Add a song...</span>
                                <div v-if="uploadingMusic" class="ml-auto w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                            </div>
                            <div v-else class="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
                                <span class="text-base leading-none shrink-0">🎵</span>
                                <span class="text-sm text-gray-900 dark:text-neutral-100 flex-1 truncate">{{ bgMusicName }}</span>
                                <div v-if="uploadingMusic" class="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin shrink-0" />
                                <button v-else @click="removeBgMusic" class="shrink-0 text-gray-400 hover:text-red-500 transition-colors">
                                    <Icon name="mdi:close" size="16" />
                                </button>
                            </div>
                            <input ref="musicInputRef" type="file" accept="audio/*" class="hidden" @change="onMusicPicked" />
                        </div>

                        <!-- Title -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-1.5">Product Title *</label>
                            <input
                                v-model="form.title"
                                type="text"
                                placeholder="e.g. Nike Air Max 90"
                                class="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand"
                            />
                        </div>

                        <!-- Price + Status row -->
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-1.5">Price (₦) *</label>
                                <input
                                    v-model="form.price"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    class="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand"
                                />
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-1.5">Status</label>
                                <select
                                    v-model="form.status"
                                    class="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand"
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                </select>
                            </div>
                        </div>

                        <!-- Description (optional) -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-1.5">Description <span class="font-normal text-gray-400">(optional)</span></label>
                            <textarea
                                v-model="form.description"
                                rows="3"
                                placeholder="Short description..."
                                class="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                            />
                        </div>

                        <!-- Error -->
                        <p v-if="submitError" class="text-xs text-red-500 dark:text-red-400">{{ submitError }}</p>
                    </div>

                    <!-- Footer -->
                    <div class="px-4 py-3 border-t border-gray-200 dark:border-neutral-800 shrink-0 flex gap-3">
                        <button
                            @click="close"
                            class="flex-1 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            @click="submit"
                            :disabled="!canSubmit || isSubmitting"
                            class="flex-1 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-[#d81b36] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <Icon v-else-if="submitted" name="mdi:check" size="18" class="text-white" />
                            <span>{{ isSubmitting ? 'Saving…' : submitted ? 'Saved!' : 'Add Product' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { useProduct } from '~~/layers/commerce/app/composables/useProduct'
import { useSellerManagement } from '~~/layers/seller/app/composables/useSellerManagement'
import { useMediaUpload } from '~~/layers/base/app/composables/useMediaUpload'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'posted'])

const { createProduct } = useProduct()
const { sellers, loadUserSellers } = useSellerManagement()
const { uploadMedia } = useMediaUpload()

// Store selector
const storeDropdownOpen = ref(false)
const selectedSeller = ref<any>(null)

const selectStore = (seller: any) => {
    selectedSeller.value = seller
    storeDropdownOpen.value = false
}

// Cover image
const imageInputRef = ref<HTMLInputElement | null>(null)
const coverPreview = ref<string | null>(null)
const coverResult = ref<{ url: string; public_id: string; type: string } | null>(null)
const uploadingCover = ref(false)

const triggerImagePick = () => imageInputRef.value?.click()

const onImagePicked = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    coverPreview.value = URL.createObjectURL(file)
    uploadingCover.value = true
    try {
        const res = await uploadMedia({ file })
        coverResult.value = { url: res.url, public_id: res.public_id, type: res.type }
    } catch {
        coverPreview.value = null
        coverResult.value = null
    } finally {
        uploadingCover.value = false
        if (imageInputRef.value) imageInputRef.value.value = ''
    }
}

const removeCover = () => {
    coverPreview.value = null
    coverResult.value = null
}

// Background music
const musicInputRef = ref<HTMLInputElement | null>(null)
const bgMusicName = ref<string | null>(null)
const bgMusicResult = ref<{ url: string; public_id: string } | null>(null)
const uploadingMusic = ref(false)

const triggerMusicPick = () => musicInputRef.value?.click()

const onMusicPicked = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    // Strip extension for display
    bgMusicName.value = file.name.replace(/\.[^/.]+$/, '')
    uploadingMusic.value = true
    try {
        const res = await uploadMedia({ file })
        bgMusicResult.value = { url: res.url, public_id: res.public_id }
    } catch {
        bgMusicName.value = null
        bgMusicResult.value = null
    } finally {
        uploadingMusic.value = false
        if (musicInputRef.value) musicInputRef.value.value = ''
    }
}

const removeBgMusic = () => {
    bgMusicName.value = null
    bgMusicResult.value = null
}

// Form
const form = reactive({
    title: '',
    price: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
    description: '',
})

const canSubmit = computed(() =>
    !!selectedSeller.value &&
    form.title.trim().length >= 2 &&
    Number(form.price) >= 0 &&
    form.price !== '' &&
    !uploadingCover.value &&
    !uploadingMusic.value
)

const isSubmitting = ref(false)
const submitted = ref(false)
const submitError = ref<string | null>(null)

const submit = async () => {
    if (!canSubmit.value || isSubmitting.value) return
    isSubmitting.value = true
    submitError.value = null
    try {
        const payload: any = {
            storeSlug: selectedSeller.value.store_slug,
            title: form.title.trim(),
            price: Number(form.price),
            status: form.status,
        }
        if (form.description.trim()) payload.description = form.description.trim()
        if (coverResult.value) payload.mediaItems = [coverResult.value]
        if (bgMusicResult.value) payload.bgMusic = bgMusicResult.value

        await createProduct(payload)
        submitted.value = true
        emit('posted')
        setTimeout(() => close(), 800)
    } catch (e: any) {
        submitError.value = e?.data?.statusMessage || e?.message || 'Failed to create product'
    } finally {
        isSubmitting.value = false
    }
}

const close = () => {
    if (isSubmitting.value) return
    emit('close')
}

// Reset state when modal closes
watch(() => props.isOpen, (open) => {
    if (!open) {
        storeDropdownOpen.value = false
        form.title = ''
        form.price = ''
        form.status = 'DRAFT'
        form.description = ''
        coverPreview.value = null
        coverResult.value = null
        bgMusicName.value = null
        bgMusicResult.value = null
        submitError.value = null
        submitted.value = false
        // Keep selectedSeller — convenient for repeat additions
    } else {
        // Load sellers if not loaded
        if (sellers.value.length === 0) loadUserSellers().catch(() => {})
        // Auto-select if only one store
        if (sellers.value.length === 1 && !selectedSeller.value) {
            selectedSeller.value = sellers.value[0]
        }
    }
})

// Also auto-select when sellers load
watch(sellers, (list) => {
    if (list.length === 1 && !selectedSeller.value) selectedSeller.value = list[0]
})
</script>
