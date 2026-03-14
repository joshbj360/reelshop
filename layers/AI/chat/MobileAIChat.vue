<template>
  <div>
    <!-- Floating Button -->
    <button
      v-if="!isOpen"
      @click="$emit('open')"
      class="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg transition-transform hover:scale-110 md:hidden"
    >
      <Icon name="mdi:robot-outline" size="28" />
    </button>

    <!-- Chat Modal (Placeholder) -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-white md:hidden dark:bg-neutral-950"
      >
        <div class="flex h-full flex-col">
          <!-- Header -->
          <div
            class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-neutral-800"
          >
            <h2
              class="text-lg font-semibold text-gray-900 dark:text-neutral-100"
            >
              AI Assistant
            </h2>
            <button @click="$emit('close')" class="p-2">
              <Icon name="mdi:close" size="24" />
            </button>
          </div>

          <!-- Chat Content (Placeholder) -->
          <div
            class="flex flex-1 items-center justify-center text-gray-500 dark:text-neutral-400"
          >
            <div class="text-center">
              <Icon name="mdi:robot-outline" size="64" class="mx-auto mb-4" />
              <p>AI Chat Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits(['open', 'close'])
</script>
