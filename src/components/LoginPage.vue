<script setup>
import { ref } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['login'])

const username = ref('')
const password = ref('')

function submit() {
  emit('login', {
    username: username.value.trim(),
    password: password.value,
  })
}
</script>

<template>
  <section class="login-card">
    <h1>登录 Bingo</h1>
    <p class="login-sub">登录后进入课程学习。</p>

    <label class="login-label">
      账号
      <input v-model="username" class="login-input" placeholder="请输入账号" type="text" />
    </label>

    <label class="login-label">
      密码
      <input v-model="password" class="login-input" placeholder="请输入密码" type="password" />
    </label>

    <button class="primary" :disabled="loading || !username || !password" @click="submit">
      {{ loading ? '登录中...' : '登录' }}
    </button>

    <p v-if="error" class="login-error">{{ error }}</p>
    <p class="login-hint">当前有效账号：`Harry / poter`</p>
  </section>
</template>
