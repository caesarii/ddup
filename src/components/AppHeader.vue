<script setup>
defineProps({
  lives: {
    type: Number,
    required: true,
  },
  xp: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <header class="topbar">
    <div class="brand">
      <span class="owl">🦉</span>
      <div>
        <p class="brand-title">学习小队</p>
        <p class="brand-subtitle">儿童识字练习</p>
      </div>
    </div>
    <div class="stats">
      <span class="badge">❤️ {{ lives }}</span>
      <span class="badge">⭐ {{ xp }} XP</span>
    </div>
  </header>
</template>
