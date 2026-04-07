<script setup>
defineProps({
  lessons: {
    type: Array,
    required: true,
  },
  completedLessonIds: {
    type: Array,
    required: true,
  },
  isLocked: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['open-lesson'])
</script>

<template>
  <section class="path-view">
    <div class="path-header">
      <h1>识字课程路径</h1>
      <p>按顺序完成关卡，解锁后续学习内容。</p>
    </div>

    <div class="path-nodes">
      <article
        v-for="(lesson, idx) in lessons"
        :key="lesson.id"
        class="lesson-card"
        :class="{
          done: completedLessonIds.includes(lesson.id),
          locked: isLocked(lesson.id),
          offset: idx % 2 === 1,
        }"
      >
        <p class="lesson-order">关卡 {{ lesson.id }}</p>
        <h3>{{ lesson.title }}</h3>
        <p class="chars">{{ lesson.chars.join(' · ') }}</p>
        <button
          class="start-btn"
          :disabled="isLocked(lesson.id)"
          @click="emit('open-lesson', lesson.id)"
        >
          {{ completedLessonIds.includes(lesson.id) ? '复习' : '开始学习' }}
        </button>
      </article>
    </div>
  </section>
</template>
