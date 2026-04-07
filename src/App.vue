<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import LessonPath from './components/LessonPath.vue'
import PracticeQuestionCard from './components/PracticeQuestionCard.vue'
import LoginPage from './components/LoginPage.vue'
import {
  getCourseLessions,
  getCurrentUser,
  patchUserCourseProgress,
  getUserCourseProgress,
  login,
  register,
  logout,
  saveUserCourseProgress,
} from './components/api'

const courseTabs = [
  { id: 'hanzi', label: '识字', enabled: true },
  { id: 'pinyin', label: '拼音', enabled: false },
  { id: 'math', label: '数学', enabled: false },
  { id: 'english', label: '英语', enabled: false },
  { id: 'fun', label: '娱乐', enabled: false },
]

const lessons = [
  {
    id: 1,
    title: '基础汉字 1',
    chars: ['妈', '明', '休'],
    questions: [
      {
        type: 'builder',
        prompt: '请用下方部件拼出“妈”',
        targetChar: '妈',
        answerParts: ['女', '马'],
        partsPool: ['女', '马', '木', '口'],
      },
      {
        type: 'builder',
        prompt: '请用下方部件拼出“明”',
        targetChar: '明',
        answerParts: ['日', '月'],
        partsPool: ['日', '月', '田', '目'],
      },
      {
        type: 'builder',
        prompt: '请用下方部件拼出“休”',
        targetChar: '休',
        answerParts: ['亻', '木'],
        partsPool: ['亻', '木', '人', '本'],
      },
      {
        type: 'meaningTap',
        prompt: '含义点选：图片中是“山”，请选择对应汉字',
        scene: '⛰️',
        answer: '山',
        options: ['山', '火', '人'],
      },
      {
        type: 'flashcard',
        prompt: '闪卡配对：请选择和“shuǐ”匹配的汉字',
        hint: 'shuǐ',
        answer: '水',
        options: ['木', '水', '口'],
      },
      {
        type: 'audioToHanzi',
        prompt: '听力题：点击播放后，选择你听到的汉字',
        audioText: '山',
        answer: '山',
        options: ['山', '出', '火'],
      },
      {
        type: 'toneBalloon',
        prompt: '声调气球：播放后戳破正确声调',
        audioText: 'mǎ',
        answer: 'mǎ',
        answerTone: 'mǎ',
        options: ['mā', 'má', 'mǎ', 'mà'],
      },
      {
        type: 'cloze',
        prompt: '词组填空：我今天喝了一杯___。',
        answer: '水',
        options: ['水', '火', '木'],
      },
      {
        type: 'sentenceBuilder',
        prompt: '汉字拼图：请组成“我吃苹果”。',
        answerSentence: '我吃苹果',
        tokens: ['我', '喝', '吃', '苹果'],
      },
      {
        type: 'errorFinder',
        prompt: '汉字挑错：找出句子里的错字并修正',
        wrongSentence: '我的再见很整洁。',
        answer: '房间',
        options: ['房间', '再见', '整理'],
      },
      {
        type: 'guidedTracing',
        prompt: '轨迹描红：按正确笔顺点击描写“木”',
        targetChar: '木',
        strokeOrder: ['横', '竖', '撇', '捺'],
      },
      {
        type: 'ghostWriting',
        prompt: '盲写挑战：不看提示，写出“山”',
        answer: '山',
      },
    ],
  },
  {
    id: 2,
    title: '基础汉字 2',
    chars: ['林', '好', '看'],
    questions: [
      {
        type: 'builder',
        prompt: '请用下方部件拼出“林”',
        targetChar: '林',
        answerParts: ['木', '木'],
        partsPool: ['木', '木', '火', '水'],
      },
      {
        type: 'builder',
        prompt: '请用下方部件拼出“好”',
        targetChar: '好',
        answerParts: ['女', '子'],
        partsPool: ['女', '子', '了', '马'],
      },
      {
        type: 'builder',
        prompt: '请用下方部件拼出“看”',
        targetChar: '看',
        answerParts: ['龵', '目'],
        partsPool: ['龵', '目', '日', '手'],
      },
      {
        type: 'meaningTap',
        prompt: '含义点选：图中是“火焰”，请选择对应汉字',
        scene: '🔥',
        answer: '火',
        options: ['水', '火', '木'],
      },
      {
        type: 'flashcard',
        prompt: '闪卡配对：请选择和“rén”匹配的汉字',
        hint: 'rén',
        answer: '人',
        options: ['口', '人', '门'],
      },
      {
        type: 'audioToHanzi',
        prompt: '听力题：点击播放后，选择你听到的汉字',
        audioText: '火',
        answer: '火',
        options: ['木', '火', '水'],
      },
      {
        type: 'toneBalloon',
        prompt: '声调气球：播放后戳破正确声调',
        audioText: 'mén',
        answer: 'mén',
        answerTone: 'mén',
        options: ['mēn', 'mén', 'měn', 'mèn'],
      },
      {
        type: 'cloze',
        prompt: '词组填空：妈妈在厨房生___。',
        answer: '火',
        options: ['木', '火', '水'],
      },
      {
        type: 'sentenceBuilder',
        prompt: '汉字拼图：请组成“我看山”。',
        answerSentence: '我看山',
        tokens: ['我', '听', '看', '山'],
      },
      {
        type: 'errorFinder',
        prompt: '汉字挑错：找出句子里的错字并修正',
        wrongSentence: '我在门口看到了伙。',
        answer: '火',
        options: ['火', '伙', '灯'],
      },
      {
        type: 'guidedTracing',
        prompt: '轨迹描红：按正确笔顺点击描写“火”',
        targetChar: '火',
        strokeOrder: ['点', '撇', '撇', '捺'],
      },
      {
        type: 'ghostWriting',
        prompt: '盲写挑战：不看提示，写出“人”',
        answer: '人',
      },
    ],
  },
  {
    id: 3,
    title: '基础汉字 3',
    chars: ['河', '问', '们'],
    questions: [
      {
        type: 'builder',
        prompt: '请用下方部件拼出“河”',
        targetChar: '河',
        answerParts: ['氵', '可'],
        partsPool: ['氵', '可', '口', '丁'],
      },
      {
        type: 'builder',
        prompt: '请用下方部件拼出“问”',
        targetChar: '问',
        answerParts: ['门', '口'],
        partsPool: ['门', '口', '日', '月'],
      },
      {
        type: 'builder',
        prompt: '请用下方部件拼出“们”',
        targetChar: '们',
        answerParts: ['亻', '门'],
        partsPool: ['亻', '门', '木', '口'],
      },
      {
        type: 'meaningTap',
        prompt: '含义点选：图中是“月亮”，请选择对应汉字',
        scene: '🌙',
        answer: '月',
        options: ['日', '月', '目'],
      },
      {
        type: 'flashcard',
        prompt: '闪卡配对：请选择和“mén”匹配的汉字',
        hint: 'mén',
        answer: '门',
        options: ['问', '门', '们'],
      },
      {
        type: 'audioToHanzi',
        prompt: '听力题：点击播放后，选择你听到的汉字',
        audioText: '月',
        answer: '月',
        options: ['日', '月', '目'],
      },
      {
        type: 'toneBalloon',
        prompt: '声调气球：播放后戳破正确声调',
        audioText: 'shuǐ',
        answer: 'shuǐ',
        answerTone: 'shuǐ',
        options: ['shuī', 'shuí', 'shuǐ', 'shuì'],
      },
      {
        type: 'cloze',
        prompt: '词组填空：河里有很多___。',
        answer: '水',
        options: ['水', '火', '山'],
      },
      {
        type: 'sentenceBuilder',
        prompt: '汉字拼图：请组成“我们进门”。',
        answerSentence: '我们进门',
        tokens: ['我们', '进', '门', '问'],
      },
      {
        type: 'errorFinder',
        prompt: '汉字挑错：找出句子里的错字并修正',
        wrongSentence: '请你把门文关上。',
        answer: '问',
        options: ['问', '文', '们'],
      },
      {
        type: 'guidedTracing',
        prompt: '轨迹描红：按正确笔顺点击描写“水”',
        targetChar: '水',
        strokeOrder: ['竖钩', '横撇', '撇', '捺'],
      },
      {
        type: 'ghostWriting',
        prompt: '盲写挑战：不看提示，写出“门”',
        answer: '门',
      },
    ],
  },
]

const selectedCourse = ref('hanzi')
const lives = ref(5)
const xp = ref(0)
const completedLessonIds = ref([])
const activeLessonId = ref(null)
const questionIndex = ref(0)
const selectedAnswer = ref('')
const builtParts = ref([])
const sentenceBuilt = ref([])
const tracingStep = ref(0)
const tracingMistake = ref(false)
const checking = ref(false)
const feedback = ref('')
const showResult = ref(false)
const lessonRightCount = ref(0)
const currentUser = ref(null)
const loginLoading = ref(false)
const loginError = ref('')
const progressReady = ref(false)
const currentTopPage = ref('home')
const homeLessions = ref([])

const topTabs = [
  { id: 'home', label: '首页', icon: '🏠' },
  { id: 'practice', label: '竞技场', icon: '⚔️' },
  { id: 'profile', label: '个人中心', icon: '👤' },
]

const homeTrailNodes = computed(() => {
  return lessons.map((lesson, idx) => ({
    id: lesson.id,
    title: homeLessions.value[idx]?.name || lesson.title,
    icon: completedLessonIds.value.includes(lesson.id) ? '★' : idx % 2 === 0 ? '✦' : '◉',
    completed: completedLessonIds.value.includes(lesson.id),
    locked: isLocked(lesson.id),
    offset: idx % 2 === 1,
  }))
})

const currentLesson = computed(() =>
  lessons.find((lesson) => lesson.id === activeLessonId.value),
)

const currentQuestion = computed(() => {
  if (!currentLesson.value) return null
  return currentLesson.value.questions[questionIndex.value]
})

const progressPercent = computed(() => {
  if (!currentLesson.value) return 0
  return (
    ((questionIndex.value + (checking.value ? 1 : 0)) /
      currentLesson.value.questions.length) *
    100
  )
})

const completionRate = computed(() => {
  if (!lessons.length) return 0
  return Math.round((completedLessonIds.value.length / lessons.length) * 100)
})

const canSubmit = computed(() => {
  if (!currentQuestion.value) return false
  if (currentQuestion.value.type === 'builder') {
    return builtParts.value.length === currentQuestion.value.answerParts.length
  }
  if (currentQuestion.value.type === 'sentenceBuilder') return sentenceBuilt.value.length > 0
  if (currentQuestion.value.type === 'guidedTracing') {
    return tracingStep.value === currentQuestion.value.strokeOrder.length
  }
  return Boolean(selectedAnswer.value)
})

function openLesson(lessonId) {
  const previousLessonId = lessonId - 1
  if (lessonId > 1 && !completedLessonIds.value.includes(previousLessonId)) return
  activeLessonId.value = lessonId
  questionIndex.value = 0
  selectedAnswer.value = ''
  builtParts.value = []
  sentenceBuilt.value = []
  tracingStep.value = 0
  tracingMistake.value = false
  checking.value = false
  feedback.value = ''
  lessonRightCount.value = 0
}

function isLocked(lessonId) {
  return lessonId > 1 && !completedLessonIds.value.includes(lessonId - 1)
}

function chooseAnswer(option) {
  if (checking.value) return
  selectedAnswer.value = option
}

function updateGhostAnswer(value) {
  selectedAnswer.value = value
}

function addPart(part) {
  if (!currentQuestion.value || checking.value) return
  if (currentQuestion.value.type !== 'builder') return
  if (builtParts.value.length >= currentQuestion.value.answerParts.length) return
  builtParts.value.push(part)
}

function removePart(index) {
  if (checking.value) return
  builtParts.value.splice(index, 1)
}

function addSentenceToken(token) {
  if (!currentQuestion.value || checking.value) return
  if (currentQuestion.value.type !== 'sentenceBuilder') return
  if (sentenceBuilt.value.length >= currentQuestion.value.answerSentence.length) return
  sentenceBuilt.value.push(token)
}

function popSentenceToken() {
  if (checking.value) return
  sentenceBuilt.value.pop()
}

const builtSentenceText = computed(() => sentenceBuilt.value.join(''))

function tapStroke(index) {
  if (!currentQuestion.value || checking.value) return
  if (currentQuestion.value.type !== 'guidedTracing') return
  if (index === tracingStep.value) {
    tracingStep.value += 1
    tracingMistake.value = false
    return
  }
  tracingMistake.value = true
  tracingStep.value = 0
}

function playAudioForQuestion() {
  if (!currentQuestion.value || !('speechSynthesis' in window)) return
  if (
    currentQuestion.value.type !== 'audioToHanzi' &&
    currentQuestion.value.type !== 'toneBalloon'
  ) {
    return
  }
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(currentQuestion.value.audioText)
  utter.lang = 'zh-CN'
  utter.rate = 0.8
  utter.pitch = 1
  window.speechSynthesis.speak(utter)
}

function submitAnswer() {
  if (!currentQuestion.value || checking.value) return
  let isRight = false
  if (currentQuestion.value.type === 'builder') {
    if (builtParts.value.length !== currentQuestion.value.answerParts.length) return
    isRight = builtParts.value.every(
      (part, index) => part === currentQuestion.value.answerParts[index],
    )
  } else if (currentQuestion.value.type === 'sentenceBuilder') {
    if (!sentenceBuilt.value.length) return
    isRight = builtSentenceText.value === currentQuestion.value.answerSentence
  } else if (currentQuestion.value.type === 'guidedTracing') {
    isRight = tracingStep.value === currentQuestion.value.strokeOrder.length
  } else if (currentQuestion.value.type === 'ghostWriting') {
    if (!selectedAnswer.value) return
    isRight = selectedAnswer.value.trim() === currentQuestion.value.answer
  } else {
    if (!selectedAnswer.value) return
    isRight = selectedAnswer.value === currentQuestion.value.answer
  }
  checking.value = true
  if (isRight) {
    feedback.value = '回答正确 +10 XP'
    xp.value += 10
    lessonRightCount.value += 1
  } else {
    const correctText =
      currentQuestion.value.type === 'builder'
        ? currentQuestion.value.answerParts.join(' + ')
        : currentQuestion.value.type === 'toneBalloon'
          ? currentQuestion.value.answerTone
        : currentQuestion.value.type === 'sentenceBuilder'
          ? currentQuestion.value.answerSentence
        : currentQuestion.value.answer
    feedback.value = `回答错误，正确答案是：${correctText}`
    lives.value = Math.max(0, lives.value - 1)
  }
}

function nextQuestion() {
  if (!currentLesson.value) return
  checking.value = false
  feedback.value = ''
  selectedAnswer.value = ''
  builtParts.value = []
  sentenceBuilt.value = []
  tracingStep.value = 0
  tracingMistake.value = false

  const isLast = questionIndex.value >= currentLesson.value.questions.length - 1
  if (!isLast) {
    questionIndex.value += 1
    return
  }

  if (!completedLessonIds.value.includes(currentLesson.value.id)) {
    completedLessonIds.value.push(currentLesson.value.id)
  }
  showResult.value = true
  void persistProgressPatch({
    currentCourseId: selectedCourse.value,
    activeLessonId: null,
    questionIndex: 0,
    completedLessonIds: completedLessonIds.value,
    xp: xp.value,
    lives: lives.value,
  })
}

function closeResult() {
  showResult.value = false
  activeLessonId.value = null
}

function backToPath() {
  activeLessonId.value = null
}

function applyProgress(progress) {
  selectedCourse.value = progress.currentCourseId || 'hanzi'
  activeLessonId.value = progress.activeLessonId ?? null
  questionIndex.value = Number.isInteger(progress.questionIndex) ? progress.questionIndex : 0
  completedLessonIds.value = Array.isArray(progress.completedLessonIds)
    ? progress.completedLessonIds
    : []
  xp.value = Number.isFinite(progress.xp) ? progress.xp : 0
  lives.value = Number.isFinite(progress.lives) ? progress.lives : 5
}

async function loadProgressForUser(user) {
  if (!user?.username) return
  const progress = await getUserCourseProgress(user.username)
  applyProgress(progress)
  progressReady.value = true
}

async function loadHomeLessions(courseId) {
  if (!currentUser.value?.username) {
    homeLessions.value = []
    return
  }
  try {
    const data = await getCourseLessions(courseId, currentUser.value.username)
    homeLessions.value = Array.isArray(data.lessions) ? data.lessions : []
  } catch {
    homeLessions.value = []
  }
}

async function persistProgressPatch(patch) {
  if (!currentUser.value?.username || !progressReady.value) return
  try {
    await patchUserCourseProgress(currentUser.value.username, patch)
  } catch {
    // keep UI interactive even if persistence temporarily fails
  }
}

async function handleLogin(payload) {
  loginError.value = ''
  loginLoading.value = true
  try {
    currentUser.value = await login(payload)
    await loadProgressForUser(currentUser.value)
  } catch (error) {
    loginError.value = error instanceof Error ? error.message : '登录失败'
  } finally {
    loginLoading.value = false
  }
}

async function handleRegister(payload) {
  loginError.value = ''
  loginLoading.value = true
  try {
    currentUser.value = await register(payload)
    await loadProgressForUser(currentUser.value)
  } catch (error) {
    loginError.value = error instanceof Error ? error.message : '注册失败'
  } finally {
    loginLoading.value = false
  }
}

function enterPractice(courseId) {
  selectedCourse.value = courseId
  activeLessonId.value = null
  currentTopPage.value = 'practice'
  void persistProgressPatch({
    currentCourseId: courseId,
    activeLessonId: null,
    questionIndex: 0,
  })
}

function startLessonFromHome(lessonId) {
  enterPractice('hanzi')
  openLesson(lessonId)
}

function handleLogout() {
  logout()
  currentUser.value = null
  progressReady.value = false
  loginError.value = ''
  loginLoading.value = false
  currentTopPage.value = 'home'
}

onMounted(() => {
  currentUser.value = getCurrentUser()
  if (currentUser.value) {
    loadProgressForUser(currentUser.value)
    void loadHomeLessions(selectedCourse.value)
  }
})

watch([selectedCourse, currentUser], ([nextCourseId, user]) => {
  if (!user?.username) return
  void loadHomeLessions(nextCourseId)
})

watch(
  [selectedCourse, activeLessonId, questionIndex, completedLessonIds, xp, lives, currentUser],
  async () => {
    if (!currentUser.value?.username || !progressReady.value) return
    await saveUserCourseProgress({
      username: currentUser.value.username,
      currentCourseId: selectedCourse.value,
      activeLessonId: activeLessonId.value,
      questionIndex: questionIndex.value,
      completedLessonIds: completedLessonIds.value,
      xp: xp.value,
      lives: lives.value,
    })
  },
  { deep: true },
)
</script>

<template>
  <main v-if="!currentUser" class="shell auth-shell">
    <LoginPage
      :loading="loginLoading"
      :error="loginError"
      @login="handleLogin"
      @register="handleRegister"
    />
  </main>

  <main v-else class="shell">
    <AppHeader
      :lives="lives"
      :xp="xp"
      :course-tabs="courseTabs"
      :selected-course="selectedCourse"
      @select-course="selectedCourse = $event"
    />
    <div v-if="currentTopPage !== 'home'" class="auth-bar">
      <span class="auth-user">当前用户：{{ currentUser.name }}</span>
    </div>

    <section v-if="currentTopPage === 'home'" class="home-screen">
      <article class="home-hero">
        <p class="hero-kicker">SECTION 1, UNIT {{ completedLessonIds.length + 1 }}</p>
        <h2>识字进阶：完成一课再进入下一课</h2>
      </article>

      <div class="home-path">
        <div
          v-for="node in homeTrailNodes"
          :key="node.id"
          class="path-row"
          :class="{ offset: node.offset }"
        >
          <button
            class="path-node-circle"
            :class="{
              done: node.completed,
              locked: node.locked,
            }"
            :disabled="node.locked"
            @click="startLessonFromHome(node.id)"
          >
            <span class="node-icon">{{ node.icon }}</span>
          </button>
          <p class="node-title">{{ node.title }}</p>

        </div>
      </div>
    </section>

    <section v-else-if="currentTopPage === 'profile'" class="page-card">
      <h2>个人中心</h2>
      <p class="page-desc">查看你的学习档案与当前进度。</p>
      <ul class="profile-list">
        <li><span>用户名</span><strong>{{ currentUser.username }}</strong></li>
        <li><span>昵称</span><strong>{{ currentUser.name }}</strong></li>
        <li><span>生命值</span><strong>{{ lives }}</strong></li>
        <li><span>累计 XP</span><strong>{{ xp }}</strong></li>
        <li><span>课程完成率</span><strong>{{ completionRate }}%</strong></li>
      </ul>
      <button class="link-btn profile-logout-btn" @click="handleLogout">退出登录</button>
    </section>

    <section v-else>
      <LessonPath
        v-if="selectedCourse === 'hanzi' && !activeLessonId"
        :lessons="lessons"
        :completed-lesson-ids="completedLessonIds"
        :is-locked="isLocked"
        @open-lesson="openLesson"
      />

      <section v-else-if="selectedCourse === 'hanzi' && activeLessonId" class="practice-view">
        <div class="practice-head">
          <button class="link-btn" @click="backToPath">返回路径</button>
          <div class="progress-bar" role="progressbar" :aria-valuenow="progressPercent">
            <span :style="{ width: `${progressPercent}%` }"></span>
          </div>
        </div>

        <PracticeQuestionCard
          v-if="currentLesson && currentQuestion"
          :current-lesson="currentLesson"
          :current-question="currentQuestion"
          :selected-answer="selectedAnswer"
          :built-parts="builtParts"
          :built-sentence-text="builtSentenceText"
          :sentence-built="sentenceBuilt"
          :tracing-step="tracingStep"
          :tracing-mistake="tracingMistake"
          :checking="checking"
          :feedback="feedback"
          :can-submit="canSubmit"
          @choose-answer="chooseAnswer"
          @add-part="addPart"
          @remove-part="removePart"
          @play-audio="playAudioForQuestion"
          @add-token="addSentenceToken"
          @pop-token="popSentenceToken"
          @tap-stroke="tapStroke"
          @update-ghost="updateGhostAnswer"
          @submit="submitAnswer"
          @next="nextQuestion"
        />
      </section>

      <section v-else class="placeholder">
        <h2>课程开发中</h2>
        <p>当前版本仅开放识字课程。</p>
      </section>
    </section>

    <nav class="top-page-tabs" aria-label="主导航">
      <button
        v-for="tab in topTabs"
        :key="tab.id"
        class="top-page-tab"
        :class="{ active: currentTopPage === tab.id }"
        @click="currentTopPage = tab.id"
      >
        <span class="top-page-tab-icon">{{ tab.icon }}</span>
        <span class="top-page-tab-label">{{ tab.label }}</span>
      </button>
    </nav>

    <div v-if="showResult" class="result-mask" @click.self="closeResult">
      <div class="result-panel">
        <h3>关卡完成</h3>
        <p>本关答对 {{ lessonRightCount }} / {{ currentLesson?.questions.length }}</p>
        <p>累计 XP：{{ xp }}</p>
        <button class="primary" @click="closeResult">继续闯关</button>
      </div>
    </div>
  </main>
</template>
