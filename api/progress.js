import { kv } from '@vercel/kv'
import seedProgressDb from './data/userCourseProgress.json' with { type: 'json' }

function nowIso() {
  return new Date().toISOString()
}

const memoryProgress = new Map()

async function getSeedProgress(username) {
  const seed = readSeedProgress()
  const found = seed.find((item) => item.username === username)
  if (found) return found
  return {
    username,
    currentCourseId: 'hanzi',
    activeLessonId: null,
    questionIndex: 0,
    completedLessonIds: [],
    xp: 0,
    lives: 5,
    updatedAt: nowIso(),
  }
}

function readSeedProgress() {
  return Array.isArray(seedProgressDb.progress) ? seedProgressDb.progress : []
}

async function readFromKv(username) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  return kv.get(`progress:${username}`)
}

async function saveToKv(username, payload) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return false
  await kv.set(`progress:${username}`, payload)
  return true
}

export async function getUserCourseProgress(username) {
  const fromKv = await readFromKv(username)
  if (fromKv) return fromKv
  const fromMemory = memoryProgress.get(username)
  if (fromMemory) return fromMemory
  return getSeedProgress(username)
}

export async function saveUserCourseProgress(payload) {
  const next = { ...payload, updatedAt: nowIso() }
  const persisted = await saveToKv(payload.username, next)
  if (!persisted) {
    memoryProgress.set(payload.username, next)
  }
  return next
}
