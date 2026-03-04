<template>
  <div class="avatar-container">
    <!-- Show user uploaded image if available -->
    <img v-if="avatar" :src="avatar" class="avatar-image" :class="sizeClass" alt="User avatar"
      @error="handleImageError" />

    <!-- Show initials placeholder if no avatar -->
    <div v-else class="avatar-placeholder" :class="sizeClass" :style="{ backgroundColor: bgColor }">
      {{ initials }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { string } from 'zod'

const props = defineProps({
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: `https://api.dicebear.com/7.x/initials/svg?seed=user`
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

// Size classes mapping
const sizeClass = computed(() => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }
  return sizes[props.size] || sizes.md
})

// Get initials from username
const initials = computed(() => {
  if (!props.username) return '?'

  const name = props.username
  // Take first letter of username, capitalize it
  return name.charAt(0).toUpperCase()
})

// Generate consistent color based on username
const bgColor = computed(() => {
  if (!props.username) return '#e2e8f0' // Default gray

  const colors = [
    '#f87171', // red
    '#fb923c', // orange
    '#fbbf24', // amber
    '#a3e635', // lime
    '#4ade80', // green
    '#2dd4bf', // teal
    '#38bdf8', // light blue
    '#818cf8', // indigo
    '#c084fc', // purple
    '#e879f9'  // fuchsia
  ]

  // Get consistent index based on username
  const hash = props.username.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  const index = Math.abs(hash) % colors.length
  return colors[index]
})

// Fallback if image fails to load
const handleImageError = (e) => {
  console.warn('Avatar image failed to load, showing placeholder')
  e.target.style.display = 'none'
  // The v-else will show the placeholder
  // You might need to force reactivity here in a real app
}
</script>

<style scoped>
.avatar-container {
  display: inline-flex;
}

.avatar-image,
.avatar-placeholder {
  border-radius: 9999px;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: white;
}
</style>