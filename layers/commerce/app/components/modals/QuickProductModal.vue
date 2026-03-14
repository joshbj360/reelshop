<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="$emit('close')"
    >
      <div
        class="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-neutral-900"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-neutral-800"
        >
          <button @click="$emit('close')">
            <Icon name="mdi:arrow-left" size="24" />
          </button>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-neutral-100">
            List Product
          </h2>
          <button class="font-semibold text-brand">Publish</button>
        </div>

        <!-- Content -->
        <div class="p-6 text-center text-gray-500 dark:text-neutral-400">
          <Icon name="mdi:shopping-outline" size="64" class="mx-auto mb-4" />
          <p>Product Upload UI Coming Soon</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits(['close', 'posted'])
</script>
