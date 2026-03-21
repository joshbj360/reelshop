<template>
  <div
    class="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-black/50"
    @click="$emit('open-detail', product)"
  >
    <!-- ─── MEDIA BLOCK (Single Relative Container) ───────────────────── -->
    <div
      class="relative aspect-[4/5] w-full overflow-hidden bg-gray-50 dark:bg-neutral-800"
    >
      <!-- 0 Images: Placeholder -->
      <div
        v-if="!imageItems.length"
        class="absolute inset-0 flex items-center justify-center"
      >
        <Icon
          name="mdi:image-outline"
          size="48"
          class="text-gray-300 dark:text-neutral-700"
        />
      </div>

      <!-- 1 Image -->
      <img
        v-else-if="imageItems.length === 1"
        :src="imageItems[0]!.url"
        :alt="product.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- 2 Images: Side by side -->
      <div
        v-else-if="imageItems.length === 2"
        class="absolute inset-0 grid grid-cols-2 gap-0.5"
      >
        <div v-for="item in imageItems" :key="item.id" class="overflow-hidden">
          <img
            :src="item.url"
            :alt="product.title"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <!-- 3+ Images: Collage -->
      <div v-else class="absolute inset-0 grid grid-cols-2 gap-0.5">
        <div class="overflow-hidden">
          <img
            :src="imageItems[0]!.url"
            :alt="product.title"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div class="grid grid-rows-2 gap-0.5">
          <div class="overflow-hidden">
            <img
              :src="imageItems[1]!.url"
              :alt="product.title"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div class="relative overflow-hidden">
            <img
              :src="imageItems[2]!.url"
              :alt="product.title"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <!-- +N Overlay -->
            <div
              v-if="imageItems.length > 3"
              class="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <span class="text-lg font-bold text-white"
                >+{{ imageItems.length - 3 }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- ─── OVERLAYS (Positioned over the entire media block) ──────── -->

      <!-- Top Left: Badges -->
      <div
        v-if="product.isThrift || discountPercent > 0"
        class="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5"
      >
        <span
          v-if="product.isThrift"
          class="rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm"
        >
          Thrift
        </span>
        <span
          v-if="discountPercent > 0"
          class="rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm"
        >
          −{{ discountPercent }}%
        </span>
      </div>

      <!-- Top Right: Music Indicator -->
      <span
        v-if="hasBgMusic"
        class="absolute right-2.5 top-2.5 z-10 rounded-full bg-black/50 p-1.5 text-[12px] leading-none text-white backdrop-blur-md"
      >
        <Icon name="mdi:music" size="14" />
      </span>

      <!-- Bottom Left: Stock Indicator -->
      <div
        v-if="lowestStock === 0"
        class="absolute bottom-2.5 left-2.5 z-10 rounded-full bg-gray-900/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md"
      >
        Sold out
      </div>
      <div
        v-else-if="lowestStock !== null && lowestStock <= 5"
        class="absolute bottom-2.5 left-2.5 z-10 rounded-full bg-amber-500/95 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md"
      >
        Only {{ lowestStock }} left
      </div>
    </div>

    <!-- ─── INFO BLOCK ────────────────────────────────────────────────── -->
    <div class="flex flex-1 flex-col justify-between px-3.5 pb-2 pt-3">
      <div>
        <h3
          class="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900 transition-colors group-hover:text-brand dark:text-neutral-100"
        >
          {{ product.title }}
        </h3>
        <NuxtLink
          v-if="product.seller?.store_name"
          :to="`/sellers/profile/${product.seller.store_slug}`"
          class="mt-1 flex items-center gap-1 truncate text-[11px] text-gray-500 dark:text-neutral-400"
        >
          <Icon name="mdi:storefront-outline" size="12" />
          {{ product.seller.store_name }}
        </NuxtLink>
      </div>

      <div class="mt-2 flex items-baseline gap-2">
        <span
          class="text-[15px] font-bold text-gray-900 dark:text-neutral-100"
          >{{ formatPrice(discountedPrice) }}</span
        >
        <span
          v-if="discountPercent > 0"
          class="text-[11px] text-gray-400 line-through dark:text-neutral-500"
          >{{ formatPrice(product.price) }}</span
        >
      </div>
    </div>

    <!-- ─── ACTION BAR ────────────────────────────────────────────────── -->
    <div
      class="flex items-center justify-between px-2.5 pb-2.5 pt-1"
      @click.stop
    >
      <div class="flex items-center gap-1">
        <!-- Like -->
        <div
          class="flex items-center rounded-lg transition-colors"
          :class="
            localLiked
              ? 'bg-brand/5 text-brand'
              : 'text-gray-500 hover:bg-brand/5 hover:text-brand dark:text-neutral-400 dark:hover:bg-brand/10'
          "
        >
          <button
            @click="handleLike"
            class="flex items-center px-2 py-1.5 text-[11px] font-medium"
            aria-label="Like"
          >
            <Icon
              :name="localLiked ? 'mdi:heart' : 'mdi:heart-outline'"
              size="16"
              :class="localLiked ? 'scale-110' : ''"
              class="transition-transform"
            />
          </button>
          <button
            v-if="localLikeCount > 0"
            @click="showLikes = true"
            class="pr-2 text-[11px] font-medium leading-none"
          >{{ localLikeCount }}</button>
          <span v-else class="pr-2 text-[11px] font-medium leading-none">0</span>
        </div>

        <!-- Comment -->
        <button
          @click="$emit('open-comments', product)"
          class="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:text-neutral-400 dark:hover:bg-blue-500/10"
        >
          <Icon name="mdi:comment-outline" size="16" />
          <span>{{ product._count?.comments ?? 0 }}</span>
        </button>

        <!-- Share -->
        <button
          @click="handleShare"
          class="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-gray-500 transition-colors hover:bg-green-50 hover:text-green-500 dark:text-neutral-400 dark:hover:bg-green-500/10"
        >
          <Icon name="mdi:share-outline" size="16" />
        </button>
      </div>

      <div class="flex items-center gap-1">
        <!-- Market -->
        <button
          v-if="product.affiliateCommission && product.affiliateCommission > 0"
          @click="$emit('market', product)"
          class="flex items-center justify-center rounded-full bg-purple-50 p-1.5 text-purple-500 transition-colors hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20"
          title="Market this product and earn commission"
        >
          <Icon name="mdi:bullhorn-outline" size="16" />
        </button>

        <!-- Add to Cart -->
        <button
          @click="handleAddToCart"
          :disabled="lowestStock === 0 || !product.variants?.length"
          class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
          :class="
            cartAdded
              ? 'scale-105 bg-green-500 text-white'
              : lowestStock === 0 || !product.variants?.length
                ? 'bg-gray-100 text-gray-400 dark:bg-neutral-800'
                : 'bg-brand text-white hover:bg-[#d81b36] hover:shadow-md hover:shadow-brand/20 active:scale-95'
          "
        >
          <Icon :name="cartAdded ? 'mdi:check' : 'mdi:cart-plus'" size="14" />
          <span class="xs:inline hidden">{{
            !product.variants?.length
              ? 'N/A'
              : lowestStock === 0
                ? 'Sold out'
                : cartAdded
                  ? 'Added'
                  : 'Cart'
          }}</span>
        </button>
      </div>
    </div>
  </div>

  <ModalsLikesModal
    :is-open="showLikes"
    type="product"
    :target-id="product.id"
    @close="showLikes = false"
  />
</template>

<script setup lang="ts">
import type { IProduct } from '~~/layers/commerce/app/types/commerce.types'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { notify } from '@kyvg/vue3-notification'
import { imgThumb } from '~/utils/cloudinary'

const props = defineProps<{ product: IProduct }>()
const emit = defineEmits<{
  'open-detail': [product: IProduct]
  'open-comments': [product: IProduct]
  'quick-add': [product: IProduct]
  market: [product: IProduct]
  share: [product: IProduct]
}>()

const profileStore = useProfileStore()
const { addToCart } = useCart()
const { openShare } = useShareModal()
const { likeProduct, unlikeProduct } = useProduct()

// ── Media ────────────────────────────────────────────────────────────────────
const imageItems = computed(() =>
  (props.product.media ?? [])
    .filter((m) => !m.isBgMusic && (m.type === 'IMAGE' || m.type === 'VIDEO'))
    .map((m) => ({ ...m, url: imgThumb(m.url) ?? m.url })),
)
const hasBgMusic = computed(() =>
  (props.product.media ?? []).some((m) => m.isBgMusic || m.type === 'AUDIO'),
)

// ── Pricing ──────────────────────────────────────────────────────────────────
const { formatPrice } = useCurrency()
const discountPercent = computed(() => props.product.discount ?? 0)
const discountedPrice = computed(() =>
  discountPercent.value > 0
    ? Math.round(props.product.price * (1 - discountPercent.value / 100))
    : props.product.price,
)

// ── Stock / Variant ──────────────────────────────────────────────────────────
const lowestStock = computed(() => {
  const v = props.product.variants
  if (!v?.length) return null
  return Math.min(...v.map((x) => x.stock))
})
const firstVariantId = computed(() => props.product.variants?.[0]?.id ?? null)
const isSingleVariant = computed(
  () => (props.product.variants?.length ?? 0) <= 1,
)

// ── Like ─────────────────────────────────────────────────────────────────────
const localLiked = ref(false)
const localLikeCount = ref(props.product._count?.likes ?? 0)
const showLikes = ref(false)

const handleLike = async () => {
  if (!profileStore.isLoggedIn) {
    notify({ type: 'warn', text: 'Sign in to like products' })
    return
  }
  const wasLiked = localLiked.value
  localLiked.value = !wasLiked
  localLikeCount.value += wasLiked ? -1 : 1

  try {
    if (wasLiked) await unlikeProduct(props.product.id)
    else await likeProduct(props.product.id)
  } catch (err: any) {
    // Rollback optimistic update
    localLiked.value = wasLiked
    localLikeCount.value += wasLiked ? 1 : -1

    const status = err?.response?.status ?? err?.statusCode
    if (status === 401 || status === 403) {
      notify({ type: 'warn', text: 'Sign in to like products' })
    } else {
      notify({ type: 'error', text: 'Could not like product' })
    }
  }
}

// ── Share ────────────────────────────────────────────────────────────────────
const handleShare = () => {
  const url = `${import.meta.client ? window.location.origin : ''}/product/${props.product.slug}`
  if (navigator.share) {
    navigator
      .share({ title: props.product.title, url })
      .catch(() => openShare(url, props.product.title))
  } else {
    openShare(url, props.product.title)
  }
}

// ── Cart ──────────────────────────────────────────────────────────────────────
const cartAdded = ref(false)

const handleAddToCart = async () => {
  // Multi-variant: open detail modal to pick a variant
  if (!isSingleVariant.value || !firstVariantId.value) {
    return emit('open-detail', props.product)
  }
  try {
    await addToCart(firstVariantId.value, 1)
    cartAdded.value = true
    // Allow parent component to also trigger side effects (like opening a cart drawer)
    emit('quick-add', props.product)

    setTimeout(() => {
      cartAdded.value = false
    }, 2000)
  } catch {}
}
</script>
