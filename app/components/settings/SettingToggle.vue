<template>
    <div
        class="flex items-center justify-between px-5 py-4 transition-colors"
        :class="border ? 'border-b border-gray-100 dark:border-neutral-800' : ''"
    >
        <div class="flex items-center gap-3">
            <Icon :name="icon" size="20" class="text-gray-500 dark:text-neutral-400 shrink-0" />
            <div>
                <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">{{ label }}</p>
                <p v-if="description" class="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">{{ description }}</p>
            </div>
        </div>
        <!-- Toggle switch -->
        <button
            @click="$emit('change', !value)"
            class="relative w-11 h-6 rounded-full transition-colors shrink-0 focus:outline-none"
            :class="value ? 'bg-brand' : 'bg-gray-200 dark:bg-neutral-700'"
            :aria-checked="value"
            role="switch"
        >
            <span
                class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                :class="value ? 'translate-x-5' : 'translate-x-0'"
            />
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    icon: string
    label: string
    description?: string
    value: boolean
    border?: boolean
}>()
defineEmits<{ change: [value: boolean] }>()
</script>
