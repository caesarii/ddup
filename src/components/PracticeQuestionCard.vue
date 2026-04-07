<script setup>
defineProps({
  currentLesson: {
    type: Object,
    required: true,
  },
  currentQuestion: {
    type: Object,
    required: true,
  },
  selectedAnswer: {
    type: String,
    required: true,
  },
  builtParts: {
    type: Array,
    required: true,
  },
  builtSentenceText: {
    type: String,
    required: true,
  },
  sentenceBuilt: {
    type: Array,
    required: true,
  },
  tracingStep: {
    type: Number,
    required: true,
  },
  tracingMistake: {
    type: Boolean,
    required: true,
  },
  checking: {
    type: Boolean,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  canSubmit: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'choose-answer',
  'add-part',
  'remove-part',
  'play-audio',
  'add-token',
  'pop-token',
  'tap-stroke',
  'update-ghost',
  'submit',
  'next',
])
</script>

<template>
  <article class="question-card">
    <h2>{{ currentLesson.title }}</h2>
    <p class="question">{{ currentQuestion.prompt }}</p>

    <div v-if="currentQuestion.type === 'builder'" class="builder-box">
      <p class="target-char">目标字：{{ currentQuestion.targetChar }}</p>
      <div class="build-slots">
        <button
          v-for="(part, index) in currentQuestion.answerParts"
          :key="`${part}-${index}`"
          class="slot"
          :class="{ filled: Boolean(builtParts[index]) }"
          @click="emit('remove-part', index)"
        >
          {{ builtParts[index] || '＋' }}
        </button>
      </div>
      <p class="tips">点击下方部件填入，点击上方方块可撤销。</p>
      <div class="parts-pool">
        <button
          v-for="(part, index) in currentQuestion.partsPool"
          :key="`${part}-${index}`"
          class="part-btn"
          @click="emit('add-part', part)"
        >
          {{ part }}
        </button>
      </div>
    </div>

    <div v-else-if="currentQuestion.type === 'meaningTap'" class="recognition-box">
      <div class="scene">{{ currentQuestion.scene }}</div>
      <p class="tips">看图识字，点击正确汉字。</p>
      <div class="options">
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          class="option-btn"
          :class="{ selected: selectedAnswer === option }"
          @click="emit('choose-answer', option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div v-else-if="currentQuestion.type === 'flashcard'" class="recognition-box">
      <p class="flash-hint">{{ currentQuestion.hint }}</p>
      <p class="tips">根据提示选择匹配的汉字。</p>
      <div class="options">
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          class="option-btn"
          :class="{ selected: selectedAnswer === option }"
          @click="emit('choose-answer', option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div v-else-if="currentQuestion.type === 'audioToHanzi'" class="recognition-box">
      <button class="audio-btn" @click="emit('play-audio')">🔊 播放读音</button>
      <p class="tips">听读音后，选择正确汉字。</p>
      <div class="options">
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          class="option-btn"
          :class="{ selected: selectedAnswer === option }"
          @click="emit('choose-answer', option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div v-else-if="currentQuestion.type === 'toneBalloon'" class="recognition-box">
      <button class="audio-btn" @click="emit('play-audio')">🔊 播放读音</button>
      <p class="tips">根据读音选择正确声调。</p>
      <div class="balloons">
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          class="balloon-btn"
          :class="{ selected: selectedAnswer === option }"
          @click="emit('choose-answer', option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div v-else-if="currentQuestion.type === 'cloze'" class="recognition-box">
      <p class="cloze-sentence">
        {{ currentQuestion.prompt.replace('___', selectedAnswer || '___') }}
      </p>
      <div class="options">
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          class="option-btn"
          :class="{ selected: selectedAnswer === option }"
          @click="emit('choose-answer', option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div v-else-if="currentQuestion.type === 'sentenceBuilder'" class="recognition-box">
      <p class="flash-hint">
        目标语义：{{ currentQuestion.prompt.replace('汉字拼图：请组成“', '').replace('”。', '') }}
      </p>
      <div class="build-line">{{ builtSentenceText || '请按顺序点击下方词块' }}</div>
      <p class="tips">点击词块组句，可撤销最后一步。</p>
      <div class="token-pool">
        <button
          v-for="(token, idx) in currentQuestion.tokens"
          :key="`${token}-${idx}`"
          class="token-btn"
          @click="emit('add-token', token)"
        >
          {{ token }}
        </button>
      </div>
      <button class="undo-btn" @click="emit('pop-token')">撤销上一步</button>
    </div>

    <div v-else-if="currentQuestion.type === 'errorFinder'" class="recognition-box">
      <p class="error-sentence">{{ currentQuestion.wrongSentence }}</p>
      <p class="tips">请选择正确替换词。</p>
      <div class="options">
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          class="option-btn"
          :class="{ selected: selectedAnswer === option }"
          @click="emit('choose-answer', option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div v-else-if="currentQuestion.type === 'guidedTracing'" class="recognition-box">
      <div class="trace-board">
        <span>{{ currentQuestion.targetChar }}</span>
      </div>
      <p class="tips">请按笔顺点击：{{ currentQuestion.strokeOrder.join(' -> ') }}</p>
      <div class="stroke-steps">
        <button
          v-for="(stroke, index) in currentQuestion.strokeOrder"
          :key="`${stroke}-${index}`"
          class="stroke-btn"
          :class="{
            active: index === tracingStep,
            done: index < tracingStep,
          }"
          @click="emit('tap-stroke', index)"
        >
          {{ index + 1 }}. {{ stroke }}
        </button>
      </div>
      <p v-if="tracingMistake" class="trace-error">笔顺错误，已重置，请重新描写。</p>
    </div>

    <div v-else-if="currentQuestion.type === 'ghostWriting'" class="recognition-box">
      <p class="tips">请在下方输入你记忆中的汉字。</p>
      <input
        :value="selectedAnswer"
        class="ghost-input"
        maxlength="2"
        placeholder="在此写字"
        type="text"
        @input="emit('update-ghost', $event.target.value)"
      />
    </div>

    <div class="actions">
      <button v-if="!checking" class="primary" :disabled="!canSubmit" @click="emit('submit')">
        检查
      </button>
      <button v-else class="primary" @click="emit('next')">继续</button>
    </div>

    <p v-if="feedback" class="feedback" :class="{ right: feedback.includes('正确') }">
      {{ feedback }}
    </p>
  </article>
</template>
