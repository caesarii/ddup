import { getCourseFlow } from '../../courseGenerator.js'
import { getUserCourseProgress } from '../../progress.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  const selectedCourseId = decodeURIComponent(req.query.courseId)
  const userId = req.query.userId || req.query.username
  if (!userId) {
    res.status(400).json({ message: '缺少 userId 或 username' })
    return
  }

  const progress = await getUserCourseProgress(String(userId))
  const learningCourseId = progress?.currentCourseId
  if (!learningCourseId || learningCourseId !== selectedCourseId) {
    res.status(200).json({
      courseId: selectedCourseId,
      learningCourseId: learningCourseId || null,
      lessions: [],
    })
    return
  }

  const course = getCourseFlow(learningCourseId)
  if (!course) {
    res.status(404).json({ message: '课程不存在' })
    return
  }

  const lessions = Array.isArray(course.units)
    ? course.units.flatMap((unit) => (Array.isArray(unit.lessions) ? unit.lessions : []))
    : []

  res.status(200).json({
    courseId: selectedCourseId,
    learningCourseId,
    lessions,
  })
}
