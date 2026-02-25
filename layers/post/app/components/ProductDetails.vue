<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Image Gallery -->
    <div class="bg-gray-100 dark:bg-neutral-900 shrink-0 relative" style="aspect-ratio: 1/1; max-height: 40vh;">
      <!-- Images -->
      <template v-if="product.media && product.media.length">
        <img
          :src="product.media[activeImageIndex]?.url"
          :alt="product.title"
          class="w-full h-full object-cover"
        />
        <!-- Dot indicators -->
        <div v-if="product.media.length > 1" class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          <button
            v-for="(_, i) in product.media"
            :key="i"
            @click="activeImageIndex = i"
            :class="[
              'w-1.5 h-1.5 rounded-full transition-colors',
              i === activeImageIndex ? 'bg-white' : 'bg-white/50'
            ]"
          />
        </div>
        <!-- Prev/Next -->
        <button
          v-if="product.media.length > 1 && activeImageIndex > 0"
          @click="activeImageIndex--"
          class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center"
        >
          <Icon name="mdi:chevron-left" size="20" class="text-white" />
        </button>
        <button
          v-if="product.media.length > 1 && activeImageIndex < product.media.length - 1"
          @click="activeImageIndex++"
          class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center"
        >
          <Icon name="mdi:chevron-right" size="20" class="text-white" />
        </button>
      </template>
      <!-- No media -->
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="mdi:package-variant-closed" size="64" class="text-gray-300 dark:text-neutral-600" />
      </div>
    </div>

    <!-- Scrollable Product Info -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <div class="p-4 space-y-4">
        <!-- Title + Price -->
        <div>
          <div class="flex items-start justify-between gap-2">
            <h2 class="text-lg font-bold text-gray-900 dark:text-neutral-100 leading-tight">
              {{ product.title }}
            </h2>
            <div class="text-right shrink-0">
              <p class="text-xl font-bold text-brand">{{ formatPrice(product.price) }}</p>
              <span
                v-if="product.discount && product.discount > 0"
                class="inline-block text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5 rounded-full"
              >
                {{ product.discount }}% OFF
              </span>
            </div>
          </div>
          <!-- Stock indicator -->
          <div class="flex items-center gap-2 mt-2">
            <span
              :class="[
                'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                product.status === 'PUBLISHED'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-400'
              ]"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              {{ product.status === 'PUBLISHED' ? 'In Stock' : product.status }}
            </span>
            <span v-if="product.isThrift" class="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              Thrift
            </span>
          </div>
        </div>

        <!-- Seller info -->
        <NuxtLink
          :to="`/seller/${sellerStore?.store_slug}`"
          class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <div class="w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-700 shrink-0">
            <img
              v-if="sellerStore?.store_logo"
              :src="sellerStore.store_logo"
              :alt="sellerStore?.store_name"
              class="w-full h-full object-cover"
            />
            <Icon v-else name="mdi:store-outline" size="20" class="text-gray-400 mt-2 ml-2" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">
              {{ sellerStore?.store_name || 'View Store' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">@{{ sellerStore?.store_slug }}</p>
          </div>
          <Icon name="mdi:chevron-right" size="18" class="text-gray-400 shrink-0" />
        </NuxtLink>

        <!-- Description -->
        <div v-if="product.description">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-1">Description</h3>
          <p class="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">{{ product.description }}</p>
        </div>

        <!-- Variants -->
        <div v-if="product.variants && product.variants.length > 0">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">Options</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="variant in product.variants"
              :key="variant.id"
              @click="selectedVariant = variant"
              :disabled="variant.stock === 0"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                selectedVariant?.id === variant.id
                  ? 'bg-brand text-white border-brand'
                  : variant.stock === 0
                    ? 'bg-gray-50 text-gray-300 border-gray-200 dark:bg-neutral-800 dark:text-neutral-600 dark:border-neutral-700 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 hover:border-brand'
              ]"
            >
              {{ variant.name }}
              <span v-if="variant.stock === 0" class="text-xs"> (sold out)</span>
            </button>
          </div>
          <!-- Variant price override -->
          <p v-if="selectedVariant?.price && selectedVariant.price !== product.price" class="text-sm text-gray-500 dark:text-neutral-400 mt-2">
            Variant price: <span class="font-semibold text-brand">{{ formatPrice(selectedVariant.price) }}</span>
          </p>
        </div>

        <!-- Stats row -->
        <div class="flex items-center gap-5 py-2 border-t border-gray-100 dark:border-neutral-800">
          <div class="flex items-center gap-1.5 text-gray-500 dark:text-neutral-400 text-sm">
            <Icon name="mdi:heart-outline" size="18" />
            <span>{{ product._count?.likes ?? 0 }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-gray-500 dark:text-neutral-400 text-sm">
            <Icon name="mdi:chat-outline" size="18" />
            <span>{{ product._count?.comments ?? 0 }}</span>
          </div>
          <button @click="shareProduct" class="flex items-center gap-1.5 text-gray-500 dark:text-neutral-400 text-sm hover:text-brand transition-colors">
            <Icon name="mdi:share-variant-outline" size="18" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Add to Cart CTA (pinned bottom) -->
    <div class="p-4 border-t border-gray-200 dark:border-neutral-800 shrink-0 bg-white dark:bg-neutral-900">
      <div v-if="addedToCart" class="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-sm">
        <Icon name="mdi:check-circle" size="20" />
        Added to Cart
      </div>
      <button
        v-else
        @click="handleAddToCart"
        :disabled="isAddingToCart || (product.variants?.length > 0 && !selectedVariant) || needsVariantSelection"
        class="w-full py-3 bg-brand text-white rounded-xl font-semibold text-sm hover:bg-[#d81b36] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        <Icon v-if="isAddingToCart" name="eos-icons:loading" size="18" />
        <Icon v-else name="mdi:cart-plus" size="18" />
        {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
      </button>
      <p v-if="needsVariantSelection" class="text-xs text-center text-amber-600 dark:text-amber-400 mt-2">
        Please select an option above
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~~/layers/commerce/app/composables/useCart'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { notify } from '@kyvg/vue3-notification'

const props = defineProps<{
  product: any
  sellerStore: any
}>()

const { addToCart } = useCart()
const profileStore = useProfileStore()

const activeImageIndex = ref(0)
const selectedVariant = ref<any>(props.product.variants?.[0] ?? null)
const isAddingToCart = ref(false)
const addedToCart = ref(false)

const needsVariantSelection = computed(
  () => props.product.variants?.length > 0 && !selectedVariant.value
)

const formatPrice = (price: number | string) => {
  const num = Number(price)
  if (isNaN(num)) return '₦0.00'
  // Price is stored in kobo (smallest unit) if > 1000 and looks like it, otherwise assume naira directly
  // Use Intl.NumberFormat for NGN
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num)
}

const handleAddToCart = async () => {
  if (!profileStore.userId) {
    notify({ type: 'warn', text: 'Please log in to add items to cart' })
    return
  }

  // If product has variants, need one selected
  const variantId = selectedVariant.value?.id
  if (props.product.variants?.length > 0 && !variantId) {
    notify({ type: 'warn', text: 'Please select an option' })
    return
  }

  // If no variants at all, we can't add to cart without a variantId — show appropriate message
  if (!variantId) {
    notify({ type: 'warn', text: 'This product has no purchasable variants yet' })
    return
  }

  isAddingToCart.value = true
  try {
    await addToCart(variantId, 1)
    addedToCart.value = true
    notify({ type: 'success', text: 'Added to cart!' })
    // Reset after 2s
    setTimeout(() => { addedToCart.value = false }, 2000)
  } catch (e: any) {
    notify({ type: 'error', text: e?.message || 'Failed to add to cart' })
  } finally {
    isAddingToCart.value = false
  }
}

const shareProduct = async () => {
  const shareUrl = `${window.location.origin}/products/${props.product.id}`
  try {
    if (navigator.share) {
      await navigator.share({ url: shareUrl, title: props.product.title })
    } else {
      await navigator.clipboard.writeText(shareUrl)
      notify({ type: 'success', text: 'Link copied!' })
    }
  } catch {}
}
</script>
