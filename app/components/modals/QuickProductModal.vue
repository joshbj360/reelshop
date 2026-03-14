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
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
        @click.self="close"
      >
        <div
          @click.stop
          class="flex w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl dark:bg-neutral-900"
          style="max-height: 92vh"
        >
          <!-- Header -->
          <div
            class="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3.5 dark:border-neutral-800"
          >
            <h2
              class="text-base font-semibold text-gray-900 dark:text-neutral-100"
            >
              Quick Add Product
            </h2>
            <button
              @click="close"
              class="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <Icon
                name="mdi:close"
                size="20"
                class="text-gray-500 dark:text-neutral-400"
              />
            </button>
          </div>

          <!-- Scrollable body -->
          <div class="flex-1 space-y-4 overflow-y-auto p-4">
            <!-- Store Selector -->
            <div>
              <label
                class="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-400"
                >Store *</label
              >
              <div class="relative">
                <button
                  type="button"
                  @click="storeDropdownOpen = !storeDropdownOpen"
                  class="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <div class="flex min-w-0 items-center gap-2">
                    <img
                      v-if="selectedSeller?.store_logo"
                      :src="selectedSeller.store_logo"
                      class="h-5 w-5 shrink-0 rounded-full object-cover"
                    />
                    <div
                      v-else
                      class="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-[#f02c56] to-purple-600"
                    />
                    <span class="truncate">{{
                      selectedSeller?.store_name ?? 'Select a store'
                    }}</span>
                  </div>
                  <Icon
                    name="mdi:chevron-down"
                    size="18"
                    class="shrink-0 text-gray-400 transition-transform"
                    :class="storeDropdownOpen ? 'rotate-180' : ''"
                  />
                </button>

                <!-- Dropdown -->
                <div
                  v-if="storeDropdownOpen"
                  class="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <div
                    v-if="sellers.length === 0"
                    class="px-4 py-3 text-center text-sm text-gray-500 dark:text-neutral-400"
                  >
                    No stores found
                  </div>
                  <button
                    v-for="seller in sellers"
                    :key="seller.id"
                    type="button"
                    @click="selectStore(seller)"
                    class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-neutral-700"
                  >
                    <img
                      v-if="seller.store_logo"
                      :src="seller.store_logo"
                      class="h-7 w-7 shrink-0 rounded-full object-cover"
                    />
                    <div
                      v-else
                      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f02c56] to-purple-600"
                    >
                      <Icon name="mdi:store" size="14" class="text-white" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p
                        class="truncate text-sm font-medium text-gray-900 dark:text-neutral-100"
                      >
                        {{ seller.store_name }}
                      </p>
                      <p
                        class="text-[11px] text-gray-400 dark:text-neutral-500"
                      >
                        @{{ seller.store_slug }}
                      </p>
                    </div>
                    <Icon
                      v-if="selectedSeller?.id === seller.id"
                      name="mdi:check"
                      size="16"
                      class="shrink-0 text-brand"
                    />
                  </button>
                </div>
              </div>
            </div>

            <!-- Cover Image -->
            <div>
              <label
                class="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-400"
                >Cover Image</label
              >
              <div
                v-if="!coverPreview"
                @click="triggerImagePick"
                class="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-brand dark:border-neutral-700 dark:bg-neutral-800"
              >
                <div
                  v-if="uploadingCover"
                  class="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent"
                />
                <template v-else>
                  <Icon
                    name="mdi:image-plus-outline"
                    size="32"
                    class="text-gray-300 dark:text-neutral-600"
                  />
                  <p class="text-xs text-gray-400 dark:text-neutral-500">
                    Tap to add photo
                  </p>
                </template>
              </div>
              <div
                v-else
                class="relative aspect-video overflow-hidden rounded-xl"
              >
                <img :src="coverPreview" class="h-full w-full object-cover" />
                <button
                  @click="removeCover"
                  class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 transition-colors hover:bg-black/80"
                >
                  <Icon name="mdi:close" size="16" class="text-white" />
                </button>
                <div
                  v-if="uploadingCover"
                  class="absolute inset-0 flex items-center justify-center bg-black/40"
                >
                  <div
                    class="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"
                  />
                </div>
              </div>
              <input
                ref="imageInputRef"
                type="file"
                accept="image/*,video/*"
                class="hidden"
                @change="onImagePicked"
              />
            </div>

            <!-- Background Music -->
            <div>
              <label
                class="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-400"
                >Background Music
                <span class="font-normal text-gray-400">(optional)</span></label
              >
              <div
                v-if="!bgMusicName"
                @click="triggerMusicPick"
                class="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-white px-3 py-2.5 transition-colors hover:border-brand dark:border-neutral-700 dark:bg-neutral-800"
              >
                <span class="text-base leading-none">🎵</span>
                <span class="text-sm text-gray-400 dark:text-neutral-500"
                  >Add a song...</span
                >
                <div
                  v-if="uploadingMusic"
                  class="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent"
                />
              </div>
              <div
                v-else
                class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <span class="shrink-0 text-base leading-none">🎵</span>
                <span
                  class="flex-1 truncate text-sm text-gray-900 dark:text-neutral-100"
                  >{{ bgMusicName }}</span
                >
                <div
                  v-if="uploadingMusic"
                  class="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-brand border-t-transparent"
                />
                <button
                  v-else
                  @click="removeBgMusic"
                  class="shrink-0 text-gray-400 transition-colors hover:text-red-500"
                >
                  <Icon name="mdi:close" size="16" />
                </button>
              </div>
              <input
                ref="musicInputRef"
                type="file"
                accept="audio/*"
                class="hidden"
                @change="onMusicPicked"
              />
            </div>

            <!-- AI Magic Lister (shown after cover upload) -->
            <div
              v-if="coverResult && !uploadingCover"
              class="flex items-center justify-between gap-3 rounded-xl border border-brand/20 bg-gradient-to-r from-brand/10 to-purple-600/10 p-3 dark:from-brand/20 dark:to-purple-600/20"
            >
              <div class="min-w-0">
                <p
                  class="flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-white"
                >
                  <Icon
                    name="mdi:magic-staff"
                    class="shrink-0 text-brand"
                    size="14"
                  />
                  AI Magic Lister
                </p>
                <p
                  class="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400"
                >
                  Auto-fill title, price & social captions
                </p>
              </div>
              <button
                type="button"
                @click="autoFillWithAI"
                :disabled="isGeneratingAI"
                class="flex shrink-0 items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-bold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 dark:bg-white dark:text-gray-900"
              >
                <Icon
                  :name="isGeneratingAI ? 'eos-icons:loading' : 'mdi:creation'"
                  :class="{ 'animate-spin': isGeneratingAI }"
                  size="14"
                />
                {{ isGeneratingAI ? 'Working...' : 'Auto-Fill' }}
              </button>
            </div>

            <!-- Title -->
            <div>
              <label
                class="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-400"
                >Product Title *</label
              >
              <input
                v-model="form.title"
                type="text"
                placeholder="e.g. Nike Air Max 90"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>

            <!-- Price + Status row -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label
                  class="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-400"
                  >Price (₦) *</label
                >
                <input
                  v-model="form.price"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
              <div>
                <label
                  class="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-400"
                  >Status</label
                >
                <select
                  v-model="form.status"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>

            <!-- Affiliate Commission -->
            <div
              class="rounded-lg border border-purple-100 bg-purple-50 px-3 py-3 dark:border-purple-800/30 dark:bg-purple-900/10"
            >
              <label
                class="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-400"
                >Affiliate Commission (₦)
                <span class="font-normal text-gray-400">(optional)</span></label
              >
              <input
                v-model="form.affiliateCommission"
                type="number"
                min="0"
                placeholder="e.g. 500"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
              <p
                v-if="Number(form.affiliateCommission) > 0"
                class="mt-1.5 text-[11px] text-purple-600 dark:text-purple-400"
              >
                Marketers will see: "Earn ₦{{
                  Number(form.affiliateCommission).toLocaleString()
                }}
                by selling this"
              </p>
            </div>

            <!-- Description (optional) -->
            <div>
              <label
                class="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-400"
                >Description
                <span class="font-normal text-gray-400">(optional)</span></label
              >
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Short description..."
                class="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>

            <!-- Categories -->
            <div>
              <label
                class="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-400"
                >Categories
                <span class="font-normal text-gray-400">(optional)</span></label
              >
              <div
                v-if="categoriesLoading"
                class="flex items-center gap-2 text-xs text-gray-400 dark:text-neutral-500"
              >
                <Icon name="mdi:loading" size="14" class="animate-spin" />
                Loading…
              </div>
              <div v-else class="flex flex-wrap gap-1.5">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  type="button"
                  @click="toggleCategory(cat.id)"
                  class="rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
                  :class="
                    selectedCategoryIds.includes(cat.id)
                      ? 'border-brand bg-brand text-white'
                      : 'border-gray-200 bg-gray-100 text-gray-600 hover:border-brand dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                  "
                >
                  {{ cat.name }}
                </button>
              </div>
            </div>

            <!-- Error -->
            <p
              v-if="submitError"
              class="text-xs text-red-500 dark:text-red-400"
            >
              {{ submitError }}
            </p>
          </div>

          <!-- Footer -->
          <div
            class="flex shrink-0 gap-3 border-t border-gray-200 px-4 py-3 dark:border-neutral-800"
          >
            <button
              @click="close"
              class="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              @click="submit"
              :disabled="!canSubmit || isSubmitting"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d81b36] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div
                v-if="isSubmitting"
                class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
              />
              <Icon
                v-else-if="submitted"
                name="mdi:check"
                size="18"
                class="text-white"
              />
              <span>{{
                isSubmitting ? 'Saving…' : submitted ? 'Saved!' : 'Add Product'
              }}</span>
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
import { useProductApi } from '~~/layers/commerce/app/services/product.api'
import { useAiApi } from '~~/layers/base/app/services/ai.api'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'posted'])

const { createProduct } = useProduct()
const { sellers, loadUserSellers } = useSellerManagement()
const { uploadMedia } = useMediaUpload()
const productApi = useProductApi()
const aiApi = useAiApi()

// Store selector
const storeDropdownOpen = ref(false)
const selectedSeller = ref<any>(null)

const selectStore = (seller: any) => {
  selectedSeller.value = seller
  storeDropdownOpen.value = false
}

// Cover image
const imageInputRef = ref<HTMLInputElement | null>(null)
const coverFile = ref<File | null>(null)
const coverPreview = ref<string | null>(null)
const coverResult = ref<{
  url: string
  public_id: string
  type: string
} | null>(null)
const uploadingCover = ref(false)

const triggerImagePick = () => imageInputRef.value?.click()

const onImagePicked = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  coverFile.value = file
  coverPreview.value = URL.createObjectURL(file)
  uploadingCover.value = true
  try {
    const res = await uploadMedia({ file })
    coverResult.value = {
      url: res.url,
      public_id: res.public_id,
      type: res.type,
    }
  } catch {
    coverFile.value = null
    coverPreview.value = null
    coverResult.value = null
  } finally {
    uploadingCover.value = false
    if (imageInputRef.value) imageInputRef.value.value = ''
  }
}

const removeCover = () => {
  coverFile.value = null
  coverPreview.value = null
  coverResult.value = null
  aiCaptions.instagram = ''
  aiCaptions.facebook = ''
  aiCaptions.pinterest = ''
}

// ── AI Auto-Fill ──────────────────────────────────────────────────────────────
const isGeneratingAI = ref(false)
const aiCaptions = reactive({ instagram: '', facebook: '', pinterest: '' })
const hasAiCaptions = computed(
  () => !!(aiCaptions.instagram || aiCaptions.facebook || aiCaptions.pinterest),
)

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
  })

const autoFillWithAI = async () => {
  if (!coverFile.value) return
  isGeneratingAI.value = true
  try {
    const base64 = await fileToBase64(coverFile.value)
    const response = await aiApi.generateListing(base64, coverFile.value.type)
    if (response.success && response.data) {
      const d = response.data
      if (d.title && !form.title) form.title = d.title
      if (d.description && !form.description) form.description = d.description
      if (d.suggestedPrice && !form.price)
        form.price = String(Math.round((d.suggestedPrice * 1500) / 100) * 100)
      if (d.socialCaptions) {
        aiCaptions.instagram = d.socialCaptions.instagram || ''
        aiCaptions.facebook = d.socialCaptions.facebook || ''
        aiCaptions.pinterest = d.socialCaptions.pinterest || ''
      }
    }
  } catch {
    /* silent */
  } finally {
    isGeneratingAI.value = false
  }
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
  affiliateCommission: '',
})

// Categories
const categories = ref<Array<{ id: number; name: string; slug: string }>>([])
const categoriesLoading = ref(false)
const selectedCategoryIds = ref<number[]>([])

const toggleCategory = (id: number) => {
  const idx = selectedCategoryIds.value.indexOf(id)
  if (idx === -1) selectedCategoryIds.value.push(id)
  else selectedCategoryIds.value.splice(idx, 1)
}

const canSubmit = computed(
  () =>
    !!selectedSeller.value &&
    form.title.trim().length >= 2 &&
    Number(form.price) >= 0 &&
    form.price !== '' &&
    !uploadingCover.value &&
    !uploadingMusic.value,
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
    if (Number(form.affiliateCommission) > 0)
      payload.affiliateCommission = Number(form.affiliateCommission)
    if (selectedCategoryIds.value.length)
      payload.categoryIds = selectedCategoryIds.value
    if (coverResult.value) payload.mediaItems = [coverResult.value]
    if (bgMusicResult.value) payload.bgMusic = bgMusicResult.value
    if (hasAiCaptions.value) payload.socialCaptions = { ...aiCaptions }

    await createProduct(payload)
    submitted.value = true
    emit('posted')
    setTimeout(() => close(), 800)
  } catch (e: any) {
    submitError.value =
      e?.data?.statusMessage || e?.message || 'Failed to create product'
  } finally {
    isSubmitting.value = false
  }
}

const close = () => {
  if (isSubmitting.value) return
  emit('close')
}

// Reset state when modal closes
watch(
  () => props.isOpen,
  (open) => {
    if (!open) {
      storeDropdownOpen.value = false
      form.title = ''
      form.price = ''
      form.status = 'DRAFT'
      form.description = ''
      form.affiliateCommission = ''
      coverFile.value = null
      coverPreview.value = null
      coverResult.value = null
      aiCaptions.instagram = ''
      aiCaptions.facebook = ''
      aiCaptions.pinterest = ''
      bgMusicName.value = null
      bgMusicResult.value = null
      selectedCategoryIds.value = []
      submitError.value = null
      submitted.value = false
      // Keep selectedSeller — convenient for repeat additions
    } else {
      // Load sellers if not loaded
      if (sellers.value.length === 0) loadUserSellers().catch(() => {})
      // Load categories if not loaded
      if (categories.value.length === 0) {
        categoriesLoading.value = true
        productApi
          .getCategories()
          .then((res: any) => {
            categories.value = res?.data || []
          })
          .catch(() => {})
          .finally(() => {
            categoriesLoading.value = false
          })
      }
      // Auto-select if only one store
      if (sellers.value.length === 1 && !selectedSeller.value) {
        selectedSeller.value = sellers.value[0]
      }
    }
  },
)

// Also auto-select when sellers load
watch(sellers, (list) => {
  if (list.length === 1 && !selectedSeller.value) selectedSeller.value = list[0]
})
</script>
