<template>
  <div class="px-3 py-4 sm:px-6">
    <div class="mb-6 flex items-center gap-3">
      <NuxtLink
        :to="`/seller/${storeSlug}/products`"
        class="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        <Icon name="mdi:arrow-left" size="20" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
        New Product
      </h1>
    </div>

    <div class="max-w-3xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Error -->
        <div
          v-if="error"
          class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
        >
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Media Upload -->
        <div
          class="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h2 class="font-semibold text-gray-900 dark:text-neutral-100">
            Product Images
          </h2>
          <p class="text-xs text-gray-500 dark:text-neutral-400">
            Upload up to 5 images. First image becomes the cover.
          </p>

          <!-- Image previews grid -->
          <div class="grid grid-cols-3 gap-3 sm:grid-cols-5">
            <div
              v-for="(img, i) in mediaItems"
              :key="i"
              class="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <img :src="img.preview" class="h-full w-full object-cover" />
              <div
                v-if="img.uploading"
                class="absolute inset-0 flex items-center justify-center bg-black/50"
              >
                <Icon
                  name="mdi:loading"
                  size="20"
                  class="animate-spin text-white"
                />
              </div>
              <div
                v-if="i === 0"
                class="absolute left-1 top-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-medium text-white"
              >
                Cover
              </div>
              <button
                type="button"
                @click="removeMediaItem(i)"
                class="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <Icon name="mdi:close" size="12" />
              </button>
            </div>

            <!-- Add image button -->
            <label
              v-if="mediaItems.length < 5"
              class="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-brand hover:bg-brand/5 dark:border-neutral-600"
            >
              <Icon
                name="mdi:image-plus"
                size="24"
                class="mb-1 text-gray-400 dark:text-neutral-500"
              />
              <span class="text-xs text-gray-400 dark:text-neutral-500"
                >Add</span
              >
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                class="hidden"
                @change="onImagesSelected"
              />
            </label>
          </div>

          <!-- ✨ AI Magic Lister Banner (Shows after image upload) -->
          <div
            v-if="mediaItems.length > 0"
            class="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-brand/20 bg-gradient-to-r from-brand/10 to-purple-600/10 p-5 shadow-sm sm:flex-row sm:items-center dark:from-brand/20 dark:to-purple-600/20"
          >
            <div>
              <h3
                class="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white"
              >
                <Icon name="mdi:magic-staff" class="text-brand" size="18" />
                AI Magic Lister
              </h3>
              <p class="mt-1 max-w-sm text-xs text-gray-600 dark:text-gray-300">
                Save time! Let our AI analyze your cover image to auto-write
                your title, description, price, and social media captions.
              </p>
            </div>
            <button
              type="button"
              @click="autoFillWithAI"
              :disabled="isGeneratingAI || mediaItems[0]?.uploading"
              class="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 sm:w-auto dark:bg-white dark:text-gray-900"
            >
              <Icon
                v-if="isGeneratingAI"
                name="eos-icons:loading"
                class="animate-spin"
                size="18"
              />
              <Icon v-else name="mdi:creation" size="18" />
              {{ isGeneratingAI ? 'Generating...' : 'Auto-Fill Form' }}
            </button>
          </div>

          <!-- Background Music -->
          <div
            class="mt-4 border-t border-gray-100 pt-4 dark:border-neutral-700"
          >
            <h3
              class="mb-2 text-sm font-medium text-gray-700 dark:text-neutral-300"
            >
              Background Music (optional)
            </h3>
            <div
              v-if="bgMusic"
              class="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-neutral-900"
            >
              <Icon
                name="mdi:music-note"
                size="20"
                class="flex-shrink-0 text-brand"
              />
              <span
                class="flex-1 truncate text-sm text-gray-700 dark:text-neutral-300"
                >{{ bgMusic.name }}</span
              >
              <div v-if="bgMusicUploading" class="flex-shrink-0">
                <Icon
                  name="mdi:loading"
                  size="16"
                  class="animate-spin text-brand"
                />
              </div>
              <button
                type="button"
                @click="removeBgMusic"
                class="flex-shrink-0 text-gray-400 hover:text-red-500"
              >
                <Icon name="mdi:close" size="16" />
              </button>
            </div>
            <label
              v-else
              class="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 transition-colors hover:border-brand hover:bg-brand/5 dark:border-neutral-600"
            >
              <Icon
                name="mdi:music-plus"
                size="18"
                class="text-gray-400 dark:text-neutral-500"
              />
              <span class="text-sm text-gray-500 dark:text-neutral-400"
                >Add background music</span
              >
              <input
                type="file"
                accept="audio/*"
                class="hidden"
                @change="onBgMusicSelected"
              />
            </label>
          </div>
        </div>

        <!-- Basic Info -->
        <div
          class="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h2 class="font-semibold text-gray-900 dark:text-neutral-100">
            Basic Information
          </h2>

          <div>
            <label
              class="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300"
              >Product Title *</label
            >
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="e.g. Vintage Denim Jacket"
              class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label
              class="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300"
              >Description *</label
            >
            <textarea
              v-model="form.description"
              required
              rows="4"
              minlength="10"
              placeholder="Describe your product..."
              class="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                class="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300"
                >Price (₦) *</label
              >
              <input
                v-model.number="form.price"
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
            <div>
              <label
                class="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300"
                >Discount (%)</label
              >
              <input
                v-model.number="form.discount"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          <!-- Affiliate Commission -->
          <div
            class="rounded-lg border border-purple-100 bg-purple-50 p-4 dark:border-purple-800/30 dark:bg-purple-900/10"
          >
            <label
              class="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300"
            >
              Affiliate Commission (₦)
              <span
                class="ml-1 text-xs font-normal text-gray-400 dark:text-neutral-500"
                >— optional. Set this to let others earn by marketing your
                product.</span
              >
            </label>
            <input
              v-model.number="form.affiliateCommission"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 500"
              class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand sm:w-1/2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
            <p
              v-if="form.affiliateCommission && form.affiliateCommission > 0"
              class="mt-1.5 text-xs text-purple-600 dark:text-purple-400"
            >
              Marketers will see: "Earn ₦{{
                Number(form.affiliateCommission).toLocaleString()
              }}
              by selling this product"
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                class="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300"
                >SKU</label
              >
              <input
                v-model="form.SKU"
                type="text"
                placeholder="Optional"
                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
            <div>
              <label
                class="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300"
                >Status</label
              >
              <select
                v-model="form.status"
                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
        </div>

        <!-- ✨ AI Generated Social Posts (Only shows if AI was used) -->
        <div
          v-if="hasAiCaptions"
          class="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-[0_0_15px_rgba(240,44,86,0.05)] sm:p-6 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div class="mb-2 flex items-center gap-2">
            <Icon name="mdi:share-all-outline" size="24" class="text-brand" />
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-neutral-100">
                Social Media Posts
              </h2>
              <p class="text-xs text-gray-500 dark:text-neutral-400">
                These will automatically publish to your linked accounts when
                you create the product.
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- IG -->
            <div
              class="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <label
                class="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-neutral-300"
              >
                <Icon name="mdi:instagram" class="text-pink-600" size="16" />
                Instagram
              </label>
              <textarea
                v-model="form.socialCaptions.instagram"
                rows="4"
                class="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              ></textarea>
            </div>

            <!-- Facebook -->
            <div
              class="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <label
                class="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-neutral-300"
              >
                <Icon name="mdi:facebook" class="text-blue-600" size="16" />
                Facebook
              </label>
              <textarea
                v-model="form.socialCaptions.facebook"
                rows="3"
                class="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              ></textarea>
            </div>

            <!-- Pinterest -->
            <div
              class="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <label
                class="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-neutral-300"
              >
                <Icon name="mdi:pinterest" class="text-red-600" size="16" />
                Pinterest
              </label>
              <textarea
                v-model="form.socialCaptions.pinterest"
                rows="2"
                class="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Variants -->
        <div
          class="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-neutral-100">
                Variants
              </h2>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                Sizes, colours, or any option that changes price or stock.
              </p>
            </div>
            <button
              type="button"
              @click="addVariant"
              class="flex items-center gap-1.5 rounded-lg border border-brand/30 bg-brand/5 px-3 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/10"
            >
              <Icon name="mdi:plus" size="15" /> Add Variant
            </button>
          </div>

          <!-- Variant rows -->
          <div v-if="form.variants.length" class="space-y-2">
            <div
              v-for="(variant, i) in form.variants"
              :key="i"
              class="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div class="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label
                    class="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400"
                    >Size / Name *</label
                  >
                  <input
                    v-model="variant.size"
                    placeholder="e.g. M, Red, 42"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label
                    class="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400"
                    >Price (₦)
                    <span class="font-normal opacity-60"
                      >— blank = base price</span
                    ></label
                  >
                  <input
                    v-model.number="variant.price"
                    type="number"
                    min="0"
                    placeholder="Same as base"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label
                    class="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400"
                    >Stock</label
                  >
                  <input
                    v-model.number="variant.stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>
              <button
                type="button"
                @click="removeVariant(i)"
                class="mt-6 flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              >
                <Icon name="mdi:trash-can-outline" size="16" />
              </button>
            </div>
          </div>

          <!-- Empty state — prominent CTA -->
          <button
            v-else
            type="button"
            @click="addVariant"
            class="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-8 transition-colors hover:border-brand hover:bg-brand/5 dark:border-neutral-700"
          >
            <Icon
              name="mdi:tag-multiple-outline"
              size="28"
              class="text-gray-400 dark:text-neutral-500"
            />
            <span
              class="text-sm font-medium text-gray-500 dark:text-neutral-400"
              >Click to add your first variant</span
            >
            <span class="text-xs text-gray-400 dark:text-neutral-500"
              >e.g. Small / Medium / Large or Red / Blue</span
            >
          </button>
        </div>

        <!-- Volume Offers -->
        <div
          class="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-neutral-100">
                Volume Offers
              </h2>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                Reward buyers who purchase more. e.g. "Buy 3, get 10% off"
              </p>
            </div>
            <button
              type="button"
              @click="addOffer"
              class="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
            >
              <Icon name="mdi:plus" size="15" /> Add Offer
            </button>
          </div>

          <div v-if="form.offers.length" class="space-y-2">
            <div
              v-for="(offer, i) in form.offers"
              :key="i"
              class="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-900/40 dark:bg-emerald-900/10"
            >
              <div class="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label
                    class="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400"
                    >Min. Quantity *</label
                  >
                  <input
                    v-model.number="offer.minQuantity"
                    type="number"
                    min="2"
                    placeholder="e.g. 3"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label
                    class="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400"
                    >Discount % *</label
                  >
                  <input
                    v-model.number="offer.discount"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 10"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label
                    class="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400"
                    >Label
                    <span class="font-normal opacity-60"
                      >— shown to buyer</span
                    ></label
                  >
                  <input
                    v-model="offer.label"
                    placeholder="e.g. Bundle Deal"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>
              <!-- Preview pill -->
              <div class="flex flex-col items-end gap-1">
                <span
                  v-if="offer.minQuantity && offer.discount"
                  class="whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                >
                  Buy {{ offer.minQuantity }}+ → {{ offer.discount }}% off
                </span>
                <button
                  type="button"
                  @click="removeOffer(i)"
                  class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                >
                  <Icon name="mdi:trash-can-outline" size="16" />
                </button>
              </div>
            </div>
          </div>

          <button
            v-else
            type="button"
            @click="addOffer"
            class="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-6 transition-colors hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-neutral-700"
          >
            <Icon
              name="mdi:percent-outline"
              size="26"
              class="text-gray-400 dark:text-neutral-500"
            />
            <span
              class="text-sm font-medium text-gray-500 dark:text-neutral-400"
              >No offers yet — add a volume deal</span
            >
          </button>
        </div>

        <!-- Categories -->
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h2 class="mb-1 font-semibold text-gray-900 dark:text-neutral-100">
            Categories
          </h2>
          <p class="mb-3 text-xs text-gray-500 dark:text-neutral-400">
            Select all that apply.
          </p>
          <div
            v-if="categoriesLoading"
            class="flex items-center gap-2 text-sm text-gray-400 dark:text-neutral-500"
          >
            <Icon name="mdi:loading" size="16" class="animate-spin" /> Loading
            categories…
          </div>
          <div
            v-else-if="categories.length === 0"
            class="text-sm text-gray-400 dark:text-neutral-500"
          >
            No categories available.
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              @click="toggleCategory(cat.id)"
              class="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors"
              :class="
                form.categoryIds.includes(cat.id)
                  ? 'border-brand bg-brand text-white'
                  : 'border-gray-200 bg-gray-100 text-gray-700 hover:border-brand dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
              "
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- Tags -->
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <label
            class="mb-3 block text-sm font-semibold text-gray-900 dark:text-neutral-100"
          >
            Tags
            <span class="ml-1 font-normal text-gray-400 dark:text-neutral-500"
              >(optional, max 10)</span
            >
          </label>
          <!-- Tag pills -->
          <div v-if="form.tagNames.length" class="mb-2 flex flex-wrap gap-1.5">
            <span
              v-for="(tag, i) in form.tagNames"
              :key="i"
              class="flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand"
            >
              #{{ tag }}
              <button
                type="button"
                @click="form.tagNames.splice(i, 1)"
                class="ml-0.5 rounded-full hover:bg-brand/20"
              >
                <Icon name="mdi:close" size="13" />
              </button>
            </span>
          </div>
          <!-- Tag input -->
          <input
            v-if="form.tagNames.length < 10"
            v-model="tagInput"
            type="text"
            placeholder="Type a tag and press Enter or comma"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition-all focus:border-brand/50 focus:bg-white focus:ring-2 focus:ring-brand/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:bg-neutral-800"
            @keydown.enter.prevent="addTag"
            @keydown.188.prevent="addTag"
          />
          <p class="mt-1.5 text-xs text-gray-400 dark:text-neutral-500">
            Tags help shoppers find your product. E.g. "streetwear", "vintage",
            "summer"
          </p>
        </div>

        <!-- Flags -->
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h2 class="mb-4 font-semibold text-gray-900 dark:text-neutral-100">
            Product Flags
          </h2>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <label class="flex cursor-pointer items-center gap-2">
              <input
                v-model="form.isFeatured"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span class="text-sm text-gray-700 dark:text-neutral-300"
                >Featured</span
              >
            </label>
            <label class="flex cursor-pointer items-center gap-2">
              <input
                v-model="form.isThrift"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span class="text-sm text-gray-700 dark:text-neutral-300"
                >Thrift</span
              >
            </label>
            <label class="flex cursor-pointer items-center gap-2">
              <input
                v-model="form.isAccessory"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span class="text-sm text-gray-700 dark:text-neutral-300"
                >Accessory</span
              >
            </label>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex flex-col gap-3 sm:flex-row">
          <NuxtLink
            :to="`/seller/${storeSlug}/products`"
            class="flex-1 rounded-xl border border-gray-200 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="isLoading || isAnyUploading || isGeneratingAI"
            class="flex-1 rounded-xl bg-brand py-3 font-semibold text-white transition-colors hover:bg-[#d81b36] disabled:opacity-50"
          >
            {{
              isAnyUploading
                ? 'Uploading Media...'
                : isGeneratingAI
                  ? 'AI Processing...'
                  : isLoading
                    ? 'Creating...'
                    : 'Create Product'
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProduct } from '~~/layers/commerce/app/composables/useProduct'
import { useMediaUpload } from '~~/layers/base/app/composables/useMediaUpload'
import { useAiApi } from '~~/layers/base/app/services/ai.api'
import { notify } from '@kyvg/vue3-notification'

definePageMeta({ middleware: 'auth', layout: 'store-layout' })

const route = useRoute()
const router = useRouter()
const storeSlug = computed(
  () =>
    (route.params.storeSlug as string) || (route.params.store_slug as string),
)

const { createProduct, fetchCategories, isLoading, error } = useProduct()
const { uploadMedia } = useMediaUpload()
const aiApi = useAiApi()

// ── Media state ──────────────────────────────────────────────────────────────
interface MediaItem {
  preview: string
  file: File
  uploading: boolean
  result: { url: string; public_id: string; type: string } | null
}

const mediaItems = ref<MediaItem[]>([])
const bgMusic = ref<{
  name: string
  file: File
  result: { url: string; public_id: string } | null
} | null>(null)
const bgMusicUploading = ref(false)

const isAnyUploading = computed(
  () => mediaItems.value.some((m) => m.uploading) || bgMusicUploading.value,
)

const onImagesSelected = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || []).slice(
    0,
    5 - mediaItems.value.length,
  )
  input.value = ''

  for (const file of files) {
    const item: MediaItem = {
      preview: URL.createObjectURL(file),
      file,
      uploading: true,
      result: null,
    }
    mediaItems.value.push(item)
    const idx = mediaItems.value.length - 1

    try {
      const res = await uploadMedia({ file })
      if (mediaItems.value[idx]) {
        mediaItems.value[idx].result = res
        mediaItems.value[idx].uploading = false
      }
    } catch {
      mediaItems.value.splice(idx, 1)
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

const removeBgMusic = () => {
  bgMusic.value = null
}

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
  offers: [] as Array<{
    minQuantity: number | null
    discount: number | null
    label: string
  }>,
  categoryIds: [] as number[],
  tagNames: [] as string[],
  // Added social captions to hold AI outputs
  socialCaptions: {
    instagram: '',
    facebook: '',
    pinterest: '',
  },
})

// ── AI Magic Lister Integration ───────────────────────────────────────────────
const isGeneratingAI = ref(false)
const hasAiCaptions = computed(
  () =>
    !!(
      form.socialCaptions.instagram ||
      form.socialCaptions.facebook ||
      form.socialCaptions.pinterest
    ),
)

// Helper to convert File to Base64 for the Gemini API
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // The API expects pure base64 without the data:image prefix
      const base64Data = result.split(',')[1]
      resolve(base64Data)
    }
    reader.onerror = (error) => reject(error)
  })
}

const autoFillWithAI = async () => {
  if (!mediaItems.value.length) return

  isGeneratingAI.value = true
  try {
    // 1. Get the first image (cover image)
    const coverFile = mediaItems.value[0]?.file
    if (!coverFile) return

    const base64Image = await fileToBase64(coverFile)
    // 2. Call AI service
    const response = await aiApi.generateListing(
      base64Image,
      coverFile.type,
      form.isThrift ? 'This is a thrift/vintage item.' : '',
    )

    // 3. Populate the reactive form fields
    if (response.success && response.data) {
      const aiData = response.data

      // Only overwrite fields if they are empty, or fully overwrite if you prefer
      form.title = aiData.title || form.title
      form.description = aiData.description || form.description

      // Don't overwrite price if they already typed one
      if (!form.price && aiData.suggestedPrice) {
        // Convert suggested USD price to NGN (Rough mock conversion, adjust as needed)
        // Assuming 1 USD = ~1500 NGN for placeholder logic
        form.price = Math.round((aiData.suggestedPrice * 1500) / 100) * 100
      }

      form.socialCaptions.instagram = aiData.socialCaptions?.instagram || ''
      form.socialCaptions.facebook = aiData.socialCaptions?.facebook || ''
      form.socialCaptions.pinterest = aiData.socialCaptions?.pinterest || ''

      notify({ type: 'success', text: '✨ AI has filled out your listing!' })
    }
  } catch (err: any) {
    console.error('AI Generation Failed:', err)
    notify({
      type: 'error',
      text: 'Failed to generate listing with AI. Please try again.',
    })
  } finally {
    isGeneratingAI.value = false
  }
}

// ── Categories ────────────────────────────────────────────────────────────────
const categories = ref<Array<{ id: number; name: string; slug: string }>>([])
const categoriesLoading = ref(false)

onMounted(async () => {
  categoriesLoading.value = true
  try {
    categories.value = await fetchCategories()
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

const tagInput = ref('')
const addTag = () => {
  const name = tagInput.value.trim().toLowerCase().replace(/,/g, '')
  if (
    name &&
    name.length <= 50 &&
    !form.tagNames.includes(name) &&
    form.tagNames.length < 10
  ) {
    form.tagNames.push(name)
  }
  tagInput.value = ''
}

const addVariant = () => {
  form.variants.push({ size: '', price: null, stock: 0 })
}

const removeVariant = (index: number) => {
  form.variants.splice(index, 1)
}

const addOffer = () => {
  form.offers.push({ minQuantity: null, discount: null, label: '' })
}

const removeOffer = (index: number) => {
  form.offers.splice(index, 1)
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
      // Include the social captions in the payload to save them to the DB
      socialCaptions: form.socialCaptions,
    }

    if (form.affiliateCommission && form.affiliateCommission > 0)
      payload.affiliateCommission = form.affiliateCommission
    if (form.SKU) payload.SKU = form.SKU
    if (form.categoryIds.length) payload.categoryIds = form.categoryIds
    if (form.tagNames.length) payload.tagNames = form.tagNames

    if (form.variants.length) {
      payload.variants = form.variants
        .filter((v) => v.size)
        .map((v) => ({
          size: v.size,
          price: v.price ?? undefined,
          stock: v.stock,
        }))
    }

    const validOffers = form.offers.filter(
      (o) =>
        o.minQuantity && o.minQuantity >= 2 && o.discount && o.discount > 0,
    )
    if (validOffers.length) {
      payload.offers = validOffers.map((o) => ({
        minQuantity: o.minQuantity!,
        discount: o.discount!,
        label: o.label || undefined,
      }))
    }

    // Attach uploaded media
    const uploaded = mediaItems.value.filter((m) => m.result)
    if (uploaded.length) {
      payload.mediaItems = uploaded.map((m) => ({
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
    notify({ type: 'success', text: 'Product created successfully!' })
    await router.push(`/seller/${storeSlug.value}/products`)
  } catch {
    // error is reactive from composable
    notify({ type: 'error', text: 'Failed to create product' })
  }
}
</script>
