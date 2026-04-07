import usersDb from './data/users.json' with { type: 'json' }
import { createHash, timingSafeEqual } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { customAlphabet } from 'nanoid'

const memoryUsers = Array.isArray(usersDb.users) ? [...usersDb.users] : []
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 12)
const usersFilePath = resolve(dirname(fileURLToPath(import.meta.url)), 'data/users.json')

function toSafeUser(user) {
  return {
    userId: user.userId,
    username: user.username,
    name: user.name,
    role: user.role,
  }
}

export async function loginByPassword({ username, password }) {
  const users = await loadUsers()
  const user = users.find((item) => item.username === username)
  const ok = user ? verifyPassword(user, password) : false
  if (!ok) {
    throw new Error('账号或密码错误')
  }
  return toSafeUser(user)
}

export async function registerByPassword({ username, password, name }) {
  const normalizedUsername = typeof username === 'string' ? username.trim() : ''
  const normalizedPassword = typeof password === 'string' ? password : ''
  if (!normalizedUsername || !normalizedPassword) {
    throw new Error('账号和密码不能为空')
  }

  const users = await loadUsers()
  const exists = users.some((item) => item.username.toLowerCase() === normalizedUsername.toLowerCase())
  if (exists) {
    throw new Error('账号已存在')
  }

  const userId = await generateUniqueUserId(users)
  const user = {
    userId,
    username: normalizedUsername,
    passwordHash: hashPassword(normalizedUsername, normalizedPassword),
    name: typeof name === 'string' && name.trim() ? name.trim() : normalizedUsername,
    role: 'student',
  }
  users.push(user)
  await saveUsers(users)
  return toSafeUser(user)
}

function hashPassword(username, password) {
  return createHash('sha256').update(`${username}:${password}`).digest('hex')
}

function safeEqualHex(a, b) {
  const aa = Buffer.from(a, 'hex')
  const bb = Buffer.from(b, 'hex')
  if (aa.length !== bb.length) return false
  return timingSafeEqual(aa, bb)
}

function verifyPassword(user, inputPassword) {
  if (typeof inputPassword !== 'string' || !inputPassword) return false
  if (typeof user.passwordHash === 'string' && user.passwordHash) {
    const computed = hashPassword(user.username, inputPassword)
    return safeEqualHex(computed, user.passwordHash)
  }
  // Backward compatibility for legacy users not migrated yet.
  if (typeof user.password === 'string' && user.password) {
    return user.password === inputPassword
  }
  return false
}

export function buildPasswordHash(username, password) {
  return hashPassword(username, password)
}

async function loadUsers() {
  const fromFile = await loadUsersFromLocalFile()
  if (Array.isArray(fromFile)) {
    memoryUsers.splice(0, memoryUsers.length, ...fromFile)
    return memoryUsers
  }
  return [...memoryUsers]
}

async function saveUsers(users) {
  memoryUsers.splice(0, memoryUsers.length, ...users)
  await saveUsersToLocalFile(users)
}

async function loadUsersFromLocalFile() {
  try {
    const raw = await readFile(usersFilePath, 'utf8')
    const json = JSON.parse(raw)
    if (Array.isArray(json?.users)) return json.users
  } catch {
    // Ignore read/parse failures and use in-memory fallback.
  }
  return null
}

async function saveUsersToLocalFile(users) {
  const content = `${JSON.stringify({ users }, null, 2)}\n`
  try {
    await writeFile(usersFilePath, content, 'utf8')
  } catch {
    // Ignore file write failures (e.g. readonly runtime). Memory fallback still works.
  }
}

async function generateUniqueUserId(users) {
  const used = new Set(users.map((item) => item.userId).filter(Boolean))
  let next = `user_${nanoid()}`
  while (used.has(next)) {
    next = `user_${nanoid()}`
  }
  return next
}
