import usersDb from './data/users.json' with { type: 'json' }
import { createHash, timingSafeEqual } from 'node:crypto'

function toSafeUser(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  }
}

export function loginByPassword({ username, password }) {
  const user = usersDb.users.find((item) => item.username === username)
  const ok = user ? verifyPassword(user, password) : false
  if (!ok) {
    throw new Error('账号或密码错误')
  }
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
