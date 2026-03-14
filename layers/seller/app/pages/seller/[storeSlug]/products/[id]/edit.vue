<template>
  <div class="p-6">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink :to="`/seller/${storeSlug}/products`" class="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200">
        <Icon name="mdi:arrow-left" size="20" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-neutral-100">Edit Product</h1>
    </div>

    <div class="max-w-3xl">
      <!-- Loading skeleton -->
      <div v-if="isFetching" class="space-y-6">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6 animate-pulse">
          <div class="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-4" />
          <div class="space-y-3">
            <div class="h-10 bg-gray-100 dark:bg-neutral-700 rounded-lg" />
            <div class="h-10 bg-gray-100 dark:bg-neutral-700 rounded-lg" />
          </div>
        </div>
      </div>

      <!-- Fetch Error -->
      <div v-else-if="fetchError" class="text-center py-20">
        <p class="text-red-500 dark:text-red-400 mb-3">Failed to load product.</p>
        <NuxtLink :to="`/seller/${storeSlug}/products`" class="text-brand hover:underline text-sm">Back to products</NuxtLink>
      </div>

      <template v-else>
        <!-- Tab Nav -->
        <div class="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl w-fit">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            @click="activeTab = tab.id"
            :class="[
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 shadow-sm'
                : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300'
            ]"
          >
            <Icon :name="tab.icon" size="15" />
            {{ tab.label }}
          </button>
        </div>

        <!-- ── DETAILS TAB ── -->
        <form v-show="activeTab === 'details'" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Error / Success banners -->
          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>
          <div v-if="successMsg" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p class="text-sm text-green-600 dark:text-green-400">{{ successMsg }}</p>
          </div>

          <!-- Basic Info -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6 space-y-4">
            <h2 class="font-semibold text-gray-900 dark:text-neutral-100">Basic Information</h2>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Product Title *</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Description *</label>
              <textarea
                v-model="form.description"
                required
                minlength="10"
                rows="4"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Price (₦) *</label>
                <input
                  v-model.number="form.price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Discount (%)</label>
                <input
                  v-model.number="form.discount"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                />
              </div>
            </div>

            <!-- Affiliate Commission -->
            <div class="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-lg">
              <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Affiliate Commission (₦)
                <span class="ml-1 text-xs font-normal text-gray-400 dark:text-neutral-500">— optional.</span>
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

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">SKU</label>
                <input
                  v-model="form.SKU"
                  type="text"
                  class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
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
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
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
          <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
            <h2 class="font-semibold text-gray-900 dark:text-neutral-100 mb-4">Product Flags</h2>
            <div class="grid grid-cols-3 gap-4">
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
          <div class="flex gap-3">
            <NuxtLink
              :to="`/seller/${storeSlug}/products`"
              class="flex-1 py-3 text-center border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-700 dark:text-neutral-300 font-semibold hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </NuxtLink>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-[#d81b36] disabled:opacity-50 transition-colors"
            >
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>

        <!-- ── PROMOTE TAB ── -->
        <div v-show="activeTab === 'promote'" class="space-y-4">
          <!-- AI Magic Lister trigger (when cover image exists) -->
          <div v-if="coverImageUrl" class="p-4 bg-gradient-to-r from-brand/10 to-purple-600/10 dark:from-brand/20 dark:to-purple-600/20 rounded-xl border border-brand/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Icon name="mdi:magic-staff" class="text-brand" size="18" />
                AI Magic Lister
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-sm">
                Re-analyze your cover image to regenerate all captions from scratch.
              </p>
            </div>
            <button
              type="button"
              @click="runAiMagic"
              :disabled="isGeneratingAI"
              class="w-full sm:w-auto px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-bold shadow-md hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shrink-0"
            >
              <Icon v-if="isGeneratingAI" name="eos-icons:loading" class="animate-spin" size="18" />
              <Icon v-else name="mdi:creation" size="18" />
              {{ isGeneratingAI ? 'Generating...' : 'Regenerate Captions' }}
            </button>
          </div>

          <ProductPromotePanel
            :product-id="productId"
            :initial-captions="socialCaptions"
            :cover-image-url="coverImageUrl"
            :is-generating="isGeneratingAI"
            @regenerate="runAiMagic"
            @saved="onCaptionsSaved"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'
import { useProduct } from '~~/layers/commerce/app/composables/useProduct'
import { useProductApi } from '~~/layers/commerce/app/services/product.api'
import { useAiApi } from '~~/layers/base/app/services/ai.api'

definePageMeta({ middleware: 'auth', layout: 'store-layout' })

const route = useRoute()
const storeSlug = computed(() => route.params.storeSlug as string)
const productId = computed(() => Number(route.params.id))

const { getProductById, updateProduct, isLoading, error } = useProduct()
const productApi = useProductApi()
const aiApi = useAiApi()

const tabs = [
  { id: 'details', label: 'Details', icon: 'mdi:pencil-outline' },
  { id: 'promote', label: 'Promote', icon: 'mdi:rocket-launch-outline' }
]
const activeTab = ref<'details' | 'promote'>(
  route.query.tab === 'promote' ? 'promote' : 'details'
)

const isFetching = ref(true)
const fetchError = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const coverImageUrl = ref<string | null>(null)

const form = reactive({
  title: '',
  description: '',
  price: 0,
  discount: 0,
  affiliateCommission: null as number | null,
  SKU: '',
  status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
  isFeatured: false,
  isThrift: false,
  isAccessory: false,
  categoryIds: [] as number[],
})

const socialCaptions = reactive({
  instagram: '',
  facebook: '',
  pinterest: ''
})

const categories = ref<Array<{ id: number; name: string; slug: string }>>([])
const categoriesLoading = ref(false)

const toggleCategory = (id: number) => {
  const idx = form.categoryIds.indexOf(id)
  if (idx === -1) form.categoryIds.push(id)
  else form.categoryIds.splice(idx, 1)
}

onMounted(async () => {
  categoriesLoading.value = true
  const [, catRes] = await Promise.allSettled([
    (async () => {
      try {
        const product = await getProductById(productId.value)
        if (product) {
          form.title = product.title || ''
          form.description = product.description || ''
          form.price = Number(product.price) || 0
          form.discount = Number(product.discount) || 0
          form.SKU = product.SKU || ''
          form.status = product.status || 'DRAFT'
          form.isFeatured = product.isFeatured ?? false
          form.isThrift = product.isThrift ?? false
          form.isAccessory = product.isAccessory ?? false
          form.affiliateCommission = product.affiliateCommission ?? null
          form.categoryIds = (product.category || []).map((c: any) => c.category.id)

          // Load cover image
          const firstMedia = product.media?.find((m: any) => !m.isBgMusic)
          if (firstMedia?.url) coverImageUrl.value = firstMedia.url

          // Load saved social captions
          const sc = product.socialCaptions as any
          if (sc) {
            socialCaptions.instagram = sc.instagram || ''
            socialCaptions.facebook = sc.facebook || ''
            socialCaptions.pinterest = sc.pinterest || ''
          }
        }
      } catch (e: any) {
        fetchError.value = e.message || 'Failed to load product'
      } finally {
        isFetching.value = false
      }
    })(),
    productApi.getCategories()
  ])
  if (catRes.status === 'fulfilled') categories.value = (catRes.value as any).data || []
  categoriesLoading.value = false
})

const handleSubmit = async () => {
  successMsg.value = null
  try {
    const payload: any = {
      title: form.title,
      description: form.description,
      price: form.price,
      discount: form.discount,
      status: form.status,
      isFeatured: form.isFeatured,
      isThrift: form.isThrift,
      isAccessory: form.isAccessory,
    }
    if (form.SKU) payload.SKU = form.SKU
    payload.affiliateCommission = (form.affiliateCommission && form.affiliateCommission > 0) ? form.affiliateCommission : null
    payload.categoryIds = form.categoryIds

    await updateProduct(productId.value, payload)
    successMsg.value = 'Product updated successfully!'
    setTimeout(() => { successMsg.value = null }, 3000)
  } catch (e) {
    // error is reactive from composable
  }
}

// ── AI Magic on the Promote tab ─────────────────────────────────────────────
const isGeneratingAI = ref(false)

const fileToBase64 = (url: string): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(r => r.blob())
      .then(blob => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = () => {
          const result = reader.result as string
          resolve({ base64: result.split(',')[1], mimeType: blob.type })
        }
        reader.onerror = reject
      })
      .catch(reject)
  })
}

const runAiMagic = async () => {
  if (!coverImageUrl.value) return
  isGeneratingAI.value = true
  try {
    const { base64, mimeType } = await fileToBase64(coverImageUrl.value)
    const response = await aiApi.generateListing(base64, mimeType, form.isThrift ? 'This is a thrift/vintage item.' : '')

    if (response.success && response.data?.socialCaptions) {
      const sc = response.data.socialCaptions
      socialCaptions.instagram = sc.instagram || ''
      socialCaptions.facebook = sc.facebook || ''
      socialCaptions.pinterest = sc.pinterest || ''
      notify({ type: 'success', text: '✨ Captions regenerated! Review and save.' })
    }
  } catch (err) {
    notify({ type: 'error', text: 'AI generation failed. Please try again.' })
  } finally {
    isGeneratingAI.value = false
  }
}

const onCaptionsSaved = (captions: any) => {
  socialCaptions.instagram = captions.instagram
  socialCaptions.facebook = captions.facebook
  socialCaptions.pinterest = captions.pinterest
}
</script>
