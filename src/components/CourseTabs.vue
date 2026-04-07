<script setup>
defineProps({
  courseTabs: {
    type: Array,
    required: true,
  },
  selectedCourse: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select-course'])
</script>

<template>
  <nav class="course-tabs" aria-label="课程切换">
    <button
      v-for="course in courseTabs"
      :key="course.id"
      class="tab-btn"
      :class="{ active: selectedCourse === course.id, disabled: !course.enabled }"
      :disabled="!course.enabled"
      @click="emit('select-course', course.id)"
    >
      {{ course.label }}
      <span v-if="!course.enabled">未开放</span>
    </button>
  </nav>
</template>
