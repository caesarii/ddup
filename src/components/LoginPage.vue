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

const emit = defineEmits(['login', 'register'])

const username = ref('')
const password = ref('')
const name = ref('')
const mode = ref('login')

function submit() {
  const payload = {
    username: username.value.trim(),
    password: password.value,
    name: name.value.trim(),
  }
  if (mode.value === 'register') {
    emit('register', payload)
    return
  }
  emit('login', payload)
}
</script>

<template>
  <section class="login-card">
    <h1>{{ mode === 'register' ? '注册 Bingo' : '登录 Bingo' }}</h1>
    <p class="login-sub">
      {{ mode === 'register' ? '注册后自动登录，默认角色为学生。' : '登录后进入课程学习。' }}
    </p>

    <label v-if="mode === 'register'" class="login-label">
      昵称
      <input v-model="name" class="login-input" placeholder="请输入昵称（可选）" type="text" />
    </label>

    <label class="login-label">
      账号
      <input v-model="username" class="login-input" placeholder="请输入账号" type="text" />
    </label>

    <label class="login-label">
      密码
      <input v-model="password" class="login-input" placeholder="请输入密码" type="password" />
    </label>

    <button class="primary" :disabled="loading || !username || !password" @click="submit">
      {{ loading ? (mode === 'register' ? '注册中...' : '登录中...') : mode === 'register' ? '注册并登录' : '登录' }}
    </button>

    <p v-if="error" class="login-error">{{ error }}</p>
    <button class="link-btn switch-mode-btn" @click="mode = mode === 'login' ? 'register' : 'login'">
      {{ mode === 'login' ? '没有账号？去注册' : '已有账号？去登录' }}
    </button>
  </section>
</template>
