import seedProgressDb from './data/userCourseProgress.json' with { type: 'json' }
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function nowIso() {
  return new Date().toISOString()
}

const memoryProgress = new Map()
const progressFilePath = resolve(dirname(fileURLToPath(import.meta.url)), 'data/userCourseProgress.json')

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

async function loadProgressRows() {
  const fromFile = await readProgressRowsFromFile()
  if (Array.isArray(fromFile)) return fromFile
  return readSeedProgress()
}

async function readProgressRowsFromFile() {
  try {
    const raw = await readFile(progressFilePath, 'utf8')
    const json = JSON.parse(raw)
    if (Array.isArray(json?.progress)) return json.progress
  } catch {
    // Ignore read/parse failures and fallback to seed data.
  }
  return null
}

async function saveProgressRowsToFile(rows) {
  const content = `${JSON.stringify({ progress: rows }, null, 2)}\n`
  try {
    await writeFile(progressFilePath, content, 'utf8')
  } catch {
    // Ignore file write failures (e.g. readonly runtime). Memory fallback still works.
  }
}

export async function getUserCourseProgress(username) {
  const rows = await loadProgressRows()
  const fromJson = rows.find((item) => item.username === username)
  if (fromJson) return fromJson
  const fromMemory = memoryProgress.get(username)
  if (fromMemory) return fromMemory
  return getSeedProgress(username)
}

export async function saveUserCourseProgress(payload) {
  const next = { ...payload, updatedAt: nowIso() }
  const rows = await loadProgressRows()
  const index = rows.findIndex((item) => item.username === payload.username)
  if (index >= 0) rows[index] = next
  else rows.push(next)
  await saveProgressRowsToFile(rows)
  memoryProgress.set(payload.username, next)
  return next
}

export async function patchUserCourseProgress(username, patch) {
  const current = await getUserCourseProgress(username)
  const merged = { ...current, ...patch, username }
  return saveUserCourseProgress(merged)
}
