import { kv } from '@vercel/kv'
import usersDb from '../api/data/users.json' with { type: 'json' }
import courseCatalog from '../api/data/courseCatalog.json' with { type: 'json' }
import progressDb from '../api/data/userCourseProgress.json' with { type: 'json' }

function assertKvEnv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error(
      '缺少 KV 环境变量：请先执行 `npx vercel env pull .env.local`，然后使用 `node --env-file=.env.local scripts/seed_kv.mjs`',
    )
  }
}

async function seedUsers() {
  const users = Array.isArray(usersDb.users) ? usersDb.users : []
  await kv.set('users', users)
  return users.length
}

async function seedCourseCatalog() {
  await kv.set('course:catalog', courseCatalog)
  return Array.isArray(courseCatalog.courses) ? courseCatalog.courses.length : 0
}

async function seedProgress() {
  const rows = Array.isArray(progressDb.progress) ? progressDb.progress : []
  let written = 0
  for (const row of rows) {
    if (!row?.username) continue
    await kv.set(`progress:${row.username}`, row)
    written += 1
  }
  return written
}

async function main() {
  assertKvEnv()
  const userCount = await seedUsers()
  const courseCount = await seedCourseCatalog()
  const progressCount = await seedProgress()

  console.log('KV 初始化完成')
  console.log(`users: ${userCount}`)
  console.log(`courses: ${courseCount}`)
  console.log(`progress: ${progressCount}`)
}

main().catch((error) => {
  console.error('KV 初始化失败:', error.message)
  process.exit(1)
})
