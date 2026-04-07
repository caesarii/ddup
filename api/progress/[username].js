import { getUserCourseProgress, patchUserCourseProgress, saveUserCourseProgress } from '../progress.js'

export default async function handler(req, res) {
  const username = decodeURIComponent(req.query.username)

  try {
    if (req.method === 'GET') {
      const progress = await getUserCourseProgress(username)
      res.status(200).json(progress)
      return
    }

    if (req.method === 'PUT') {
      const payload = { ...(req.body || {}), username }
      const next = await saveUserCourseProgress(payload)
      res.status(200).json(next)
      return
    }

    if (req.method === 'PATCH') {
      const next = await patchUserCourseProgress(username, req.body || {})
      res.status(200).json(next)
      return
    }

    res.setHeader('Allow', 'GET, PUT, PATCH')
    res.status(405).json({ message: 'Method Not Allowed' })
  } catch (error) {
    const message = error instanceof Error ? error.message : '服务器错误'
    res.status(400).json({ message })
  }
}
