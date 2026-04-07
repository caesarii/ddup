<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  lives: {
    type: Number,
    required: true,
  },
  xp: {
    type: Number,
    required: true,
  },
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
const showCoursePicker = ref(false)

const courseIconMap = {
  hanzi: '🀄',
  pinyin: '🔤',
  math: '🧮',
  english: '🇬🇧',
  fun: '🎮',
}

const courseSubtitleMap = {
  hanzi: 'SECTION 1, UNIT 1',
  pinyin: 'SECTION 2',
  math: 'SECTION 3',
  english: 'SECTION 4',
  fun: 'SECTION 5',
}

const currentCourse = computed(() => {
  return props.courseTabs.find((item) => item.id === props.selectedCourse) || props.courseTabs[0]
})

function pickCourse(courseId) {
  emit('select-course', courseId)
  showCoursePicker.value = false
}
</script>

<template>
  <header class="topbar">
    <div class="brand">
      <button class="course-switcher" @click="showCoursePicker = true">
        <span class="course-switcher-icon">{{ courseIconMap[currentCourse?.id] || '📘' }}</span>
        <span class="course-switcher-label">{{ currentCourse?.label || '课程' }}</span>
      </button>
    </div>
    <div class="stats">
      <span class="badge">💎 {{ xp }} XP</span>
    </div>
  </header>

  <div v-if="showCoursePicker" class="course-picker-mask" @click.self="showCoursePicker = false">
    <section class="course-picker-panel">
      <p class="course-picker-title">切换课程</p>
      <div class="course-picker-list">
        <button
          v-for="course in courseTabs"
          :key="course.id"
          class="course-picker-item"
          :class="{ active: selectedCourse === course.id, disabled: !course.enabled }"
          :disabled="!course.enabled"
          @click="pickCourse(course.id)"
        >
          <div class="course-picker-main">
            <small class="course-picker-subtitle">{{ courseSubtitleMap[course.id] || 'SECTION' }}</small>
            <span class="course-picker-label">{{ course.label }}课程</span>
          </div>
          <span class="course-picker-icon">{{ courseIconMap[course.id] || '📘' }}</span>
          <small v-if="!course.enabled">开发中</small>
        </button>
      </div>
    </section>
  </div>
</template>
