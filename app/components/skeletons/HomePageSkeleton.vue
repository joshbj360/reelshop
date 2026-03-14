<template>
    <div class="w-full space-y-4 sm:space-y-6 pb-20">

        <!-- Stories skeleton -->
        <!-- Added px-2 for mobile edge breathing room, flex-nowrap to prevent wrapping bugs -->
        <div class="flex gap-3 sm:gap-4 overflow-hidden px-2 sm:px-0 flex-nowrap pointer-events-none">
            <div v-for="i in 6" :key="i" class="flex flex-col items-center gap-2 shrink-0">
                <!-- Scaled down slightly for mobile, back to 70px for tablet+ -->
                <div class="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse transform-gpu" />
                <div class="w-12 h-2.5 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse transform-gpu" />
            </div>
        </div>

        <!-- Post card skeletons -->
        <div
            v-for="i in 3"
            :key="i"
            class="bg-white dark:bg-neutral-950 sm:rounded-2xl border-y sm:border border-gray-100 dark:border-neutral-800 overflow-hidden transform-gpu"
        >
            <!-- Author header -->
            <div class="flex items-center gap-3 px-4 py-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse shrink-0 transform-gpu" />
                <div class="flex-1 space-y-2">
                    <div class="w-28 h-3 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse transform-gpu" />
                    <div class="w-16 h-2.5 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse transform-gpu" />
                </div>
                <div class="w-14 h-5 rounded-md bg-gray-100 dark:bg-neutral-800 animate-pulse shrink-0 transform-gpu" />
            </div>

            <!-- Media placeholder -->
            <!-- FIXED: Swapped inline styles for Tailwind aspect ratio classes for better iOS support -->
            <div
                class="w-full bg-gray-100 dark:bg-neutral-800 animate-pulse transform-gpu"
                :class="i % 2 === 0 ? 'aspect-square' : 'aspect-[4/5]'"
            />

            <!-- Action bar -->
            <div class="flex items-center justify-between px-4 py-3">
                <div class="flex items-center gap-5">
                    <div class="w-8 h-5 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse transform-gpu" />
                    <div class="w-8 h-5 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse transform-gpu" />
                    <div class="w-6 h-5 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse transform-gpu" />
                </div>
                <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse transform-gpu" />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
// No logic needed, purely presentational
</script>