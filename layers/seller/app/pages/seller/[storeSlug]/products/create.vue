<template>
  <div class="px-3 py-4 sm:px-6">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink :to="`/seller/${storeSlug}/products`" class="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200">
        <Icon name="mdi:arrow-left" size="20" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-neutral-100">New Product</h1>
    </div>

    <div class="max-w-3xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Error -->
        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Media Upload -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 sm:p-6 space-y-4">
          <h2 class="font-semibold text-gray-900 dark:text-neutral-100">Product Images</h2>
          <p class="text-xs text-gray-500 dark:text-neutral-400">Upload up to 5 images. First image becomes the cover.</p>

          <!-- Image previews grid -->
          <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
            <div
              v-for="(img, i) in mediaItems"
              :key="i"
              class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700"
            >
              <img :src="img.preview" class="w-full h-full object-cover" />
              <div v-if="img.uploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Icon name="mdi:loading" size="20" class="text-white animate-spin" />
              </div>
              <div v-if="i === 0" class="absolute top-1 left-1 bg-brand text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Cover</div>
              <button
                type="button"
                @click="removeMediaItem(i)"
                class="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
              >
                <Icon name="mdi:close" size="12" />
              </button>
            </div>

            <!-- Add image button -->
            <label
              v-if="mediaItems.length < 5"
              class="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex flex-col items-center justify-center cursor-pointer hover:border-brand hover:bg-brand/5 transition-colors"
            >
              <Icon name="mdi:image-plus" size="24" class="text-gray-400 dark:text-neutral-500 mb-1" />
              <span class="text-xs text-gray-400 dark:text-neutral-500">Add</span>
              <input type="file" accept="image/*,video/*" multiple class="hidden" @change="onImagesSelected" />
            </label>
          </div>

          <!-- Background Music -->
          <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Background Music (optional)</h3>
            <div v-if="bgMusic" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
              <Icon name="mdi:music-note" size="20" class="text-brand flex-shrink-0" />
              <span class="text-sm text-gray-700 dark:text-neutral-300 truncate flex-1">{{ bgMusic.name }}</span>
              <div v-if="bgMusicUploading" class="flex-shrink-0">
                <Icon name="mdi:loading" size="16" class="animate-spin text-brand" />
              </div>
              <button type="button" @click="removeBgMusic" class="text-gray-400 hover:text-red-500 flex-shrink-0">
                <Icon name="mdi:close" size="16" />
              </button>
            </div>
            <label v-else class="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 dark:border-neutral-600 rounded-lg cursor-pointer hover:border-brand hover:bg-brand/5 transition-colors w-fit">
              <Icon name="mdi:music-plus" size="18" class="text-gray-400 dark:text-neutral-500" />
              <span class="text-sm text-gray-500 dark:text-neutral-400">Add background music</span>
              <input type="file" accept="audio/*" class="hidden" @change="onBgMusicSelected" />
            </label>
          </div>
        </div>

        <!-- Basic Info -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 sm:p-6 space-y-4">
          <h2 class="font-semibold text-gray-900 dark:text-neutral-100">Basic Information</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Product Title *</label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="e.g. Vintage Denim Jacket"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Description *</label>
            <textarea
              v-model="form.description"
              required
              rows="4"
              placeholder="Describe your product..."
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Price (₦) *</label>
              <input
                v-model.number="form.price"
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Discount (%)</label>
              <input
                v-model.number="form.discount"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>
          </div>

          <!-- Affiliate Commission -->
          <div class="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
              Affiliate Commission (₦)
              <span class="ml-1 text-xs font-normal text-gray-400 dark:text-neutral-500">— optional. Set this to let others earn by marketing your product.</span>
            </label>
            <input
              v-model.number="form.affiliateCommission"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 500"
              class="w-full sm:w-1/2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
            <p v-if="form.affiliateCommission && form.affiliateCommission > 0" class="mt-1.5 text-xs text-purple-600 dark:text-purple-400">
              Marketers will see: "Earn ₦{{ Number(form.affiliateCommission).toLocaleString() }} by selling this product"
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">SKU</label>
              <input
                v-model="form.SKU"
                type="text"
                placeholder="Optional"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Status</label>
              <select
                v-model="form.status"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Variants -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 sm:p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-gray-900 dark:text-neutral-100">Variants</h2>
            <button type="button" @click="addVariant" class="text-sm text-brand hover:underline flex items-center gap-1">
              <Icon name="mdi:plus" size="16" /> Add Variant
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-neutral-400">Add size, color, or other options.</p>

          <div v-for="(variant, i) in form.variants" :key="i" class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Size / Name</label>
                <input v-model="variant.size" placeholder="e.g. M, Red, 42" class="w-full px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Price (₦)</label>
                <input v-model.number="variant.price" type="number" min="0" placeholder="Same as base" class="w-full px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Stock</label>
                <input v-model.number="variant.stock" type="number" min="0" placeholder="0" class="w-full px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none" />
              </div>
            </div>
            <button type="button" @click="removeVariant(i)" class="text-red-400 hover:text-red-600 mt-5 flex-shrink-0">
              <Icon name="mdi:close" size="18" />
            </button>
          </div>

          <p v-if="!form.variants.length" class="text-sm text-gray-400 dark:text-neutral-500 text-center py-2">
            No variants added. Product will have a single default option.
          </p>
        </div>

        <!-- Categories -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 sm:p-6">
          <h2 class="font-semibold text-gray-900 dark:text-neutral-100 mb-1">Categories</h2>
          <p class="text-xs text-gray-500 dark:text-neutral-400 mb-3">Select all that apply.</p>
          <div v-if="categoriesLoading" class="flex items-center gap-2 text-sm text-gray-400 dark:text-neutral-500">
            <Icon name="mdi:loading" size="16" class="animate-spin" /> Loading categories…
          </div>
          <div v-else-if="categories.length === 0" class="text-sm text-gray-400 dark:text-neutral-500">No categories available.</div>
          <div v-else class="flex flex-wrap gap-2">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              @click="toggleCategory(cat.id)"
              class="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
              :class="form.categoryIds.includes(cat.id)
                ? 'bg-brand text-white border-brand'
                : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-600 hover:border-brand'"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- Flags -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 sm:p-6">
          <h2 class="font-semibold text-gray-900 dark:text-neutral-100 mb-4">Product Flags</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.isFeatured" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700 dark:text-neutral-300">Featured</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.isThrift" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700 dark:text-neutral-300">Thrift</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.isAccessory" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700 dark:text-neutral-300">Accessory</span>
            </label>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex flex-col sm:flex-row gap-3">
          <NuxtLink
            :to="`/seller/${storeSlug}/products`"
            class="flex-1 py-3 text-center border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-700 dark:text-neutral-300 font-semibold hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="isLoading || isAnyUploading"
            class="flex-1 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-[#d81b36] disabled:opacity-50 transition-colors"
          >
            {{ isAnyUploading ? 'Uploading...' : isLoading ? 'Creating...' : 'Create Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProduct } from '~~/layers/commerce/app/composables/useProduct'
import { useMediaUpload } from '~~/layers/base/app/composables/useMediaUpload'

definePageMeta({ middleware: 'auth', layout: 'seller' })

const route = useRoute()
const router = useRouter()
const storeSlug = computed(() => route.params.storeSlug as string)

const { createProduct, isLoading, error } = useProduct()
const { uploadMedia } = useMediaUpload()

// ── Media state ──────────────────────────────────────────────────────────────
interface MediaItem {
  preview: string
  file: File
  uploading: boolean
  result: { url: string; public_id: string; type: string } | null
}

const mediaItems = ref<MediaItem[]>([])
const bgMusic = ref<{ name: string; file: File; result: { url: string; public_id: string } | null } | null>(null)
const bgMusicUploading = ref(false)

const isAnyUploading = computed(() =>
  mediaItems.value.some(m => m.uploading) || bgMusicUploading.value
)

const onImagesSelected = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || []).slice(0, 5 - mediaItems.value.length)
  input.value = ''

  for (const file of files) {
    const item: MediaItem = {
      preview: URL.createObjectURL(file),
      file,
      uploading: true,
      result: null
    }
    mediaItems.value.push(item)
    const idx = mediaItems.value.length - 1

    try {
      const res = await uploadMedia({ file })
      if (mediaItems.value[idx]) mediaItems.value[idx]!.result = res
    } catch {
      mediaItems.value.splice(idx, 1)
    } finally {
      if (mediaItems.value[idx]) {
        mediaItems.value[idx].uploading = false
      }
    }
  }
}

const removeMediaItem = (i: number) => {
  const item = mediaItems.value[i]
  if (item?.preview) URL.revokeObjectURL(item.preview)
  mediaItems.value.splice(i, 1)
}

const onBgMusicSelected = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  bgMusic.value = { name: file.name, file, result: null }
  bgMusicUploading.value = true

  try {
    const res = await uploadMedia({ file })
    bgMusic.value.result = res
  } catch {
    bgMusic.value = null
  } finally {
    bgMusicUploading.value = false
  }
}

const removeBgMusic = () => { bgMusic.value = null }

// ── Form state ───────────────────────────────────────────────────────────────
const form = reactive({
  title: '',
  description: '',
  price: null as number | null,
  discount: 0,
  affiliateCommission: null as number | null,
  SKU: '',
  status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
  isFeatured: false,
  isThrift: false,
  isAccessory: false,
  variants: [] as Array<{ size: string; price: number | null; stock: number }>,
  categoryIds: [] as number[],
})

// ── Categories ────────────────────────────────────────────────────────────────
const categories = ref<Array<{ id: number; name: string; slug: string }>>([])
const categoriesLoading = ref(false)

onMounted(async () => {
  categoriesLoading.value = true
  try {
    const res = await $fetch<{ success: boolean; data: any[] }>('/api/commerce/categories')
    categories.value = res.data || []
  } catch {
    // non-fatal
  } finally {
    categoriesLoading.value = false
  }
})

const toggleCategory = (id: number) => {
  const idx = form.categoryIds.indexOf(id)
  if (idx === -1) form.categoryIds.push(id)
  else form.categoryIds.splice(idx, 1)
}

const addVariant = () => {
  form.variants.push({ size: '', price: null, stock: 0 })
}

const removeVariant = (index: number) => {
  form.variants.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    const payload: any = {
      storeSlug: storeSlug.value,
      title: form.title,
      description: form.description,
      price: form.price,
      discount: form.discount || 0,
      status: form.status,
      isFeatured: form.isFeatured,
      isThrift: form.isThrift,
      isAccessory: form.isAccessory,
    }

    if (form.affiliateCommission && form.affiliateCommission > 0) payload.affiliateCommission = form.affiliateCommission
    if (form.SKU) payload.SKU = form.SKU
    if (form.categoryIds.length) payload.categoryIds = form.categoryIds

    if (form.variants.length) {
      payload.variants = form.variants
        .filter(v => v.size)
        .map(v => ({
          size: v.size,
          price: v.price ?? undefined,
          stock: v.stock,
        }))
    }

    // Attach uploaded media
    const uploaded = mediaItems.value.filter(m => m.result)
    if (uploaded.length) {
      payload.mediaItems = uploaded.map(m => ({
        url: m.result!.url,
        public_id: m.result!.public_id,
        type: m.result!.type || 'IMAGE',
      }))
    }

    if (bgMusic.value?.result) {
      payload.bgMusic = {
        url: bgMusic.value.result.url,
        public_id: bgMusic.value.result.public_id,
      }
    }

    await createProduct(payload)
    await router.push(`/seller/${storeSlug.value}/products`)
  } catch {
    // error is reactive from composable
  }
}
</script>
