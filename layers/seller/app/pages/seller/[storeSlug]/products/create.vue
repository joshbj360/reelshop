<template>
  <div class="p-6">
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

        <!-- Basic Info -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6 space-y-4">
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

          <div class="grid grid-cols-2 gap-4">
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

          <div class="grid grid-cols-2 gap-4">
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
        <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-gray-900 dark:text-neutral-100">Variants</h2>
            <button type="button" @click="addVariant" class="text-sm text-brand hover:underline flex items-center gap-1">
              <Icon name="mdi:plus" size="16" /> Add Variant
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-neutral-400">Add size, color, or other options.</p>

          <div v-for="(variant, i) in form.variants" :key="i" class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
            <div class="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Name</label>
                <input v-model="variant.name" placeholder="e.g. Size M" class="w-full px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Price (₦)</label>
                <input v-model.number="variant.price" type="number" min="0" placeholder="Same as base" class="w-full px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Stock</label>
                <input v-model.number="variant.stock" type="number" min="0" placeholder="0" class="w-full px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs text-gray-500 dark:text-neutral-400 mb-1">SKU</label>
                <input v-model="variant.sku" placeholder="Optional" class="w-full px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none" />
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
            {{ isLoading ? 'Creating...' : 'Create Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProduct } from '~~/layers/commerce/app/composables/useProduct'

definePageMeta({ middleware: 'auth', layout: 'seller' })

const route = useRoute()
const router = useRouter()
const storeSlug = computed(() => route.params.storeSlug as string)

const { createProduct, isLoading, error } = useProduct()

const form = reactive({
  title: '',
  description: '',
  price: null as number | null,
  discount: 0,
  SKU: '',
  status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
  isFeatured: false,
  isThrift: false,
  isAccessory: false,
  variants: [] as Array<{ name: string; price: number | null; stock: number; sku: string }>,
})

const addVariant = () => {
  form.variants.push({ name: '', price: null, stock: 0, sku: '' })
}

const removeVariant = (index: number) => {
  form.variants.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    const payload: any = {
      title: form.title,
      description: form.description,
      price: form.price,
      discount: form.discount || 0,
      status: form.status,
      isFeatured: form.isFeatured,
      isThrift: form.isThrift,
      isAccessory: form.isAccessory,
    }
    if (form.SKU) payload.SKU = form.SKU
    if (form.variants.length) {
      payload.variants = form.variants.map(v => ({
        name: v.name,
        price: v.price ?? form.price,
        stock: v.stock,
        sku: v.sku || undefined,
      }))
    }

    const product = await createProduct(payload)
    await router.push(`/seller/${storeSlug.value}/products`)
  } catch (e) {
    // error is reactive from composable
  }
}
</script>
