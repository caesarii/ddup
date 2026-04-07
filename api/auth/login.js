import { loginByPassword } from '../auth.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  try {
    const user = loginByPassword(req.body || {})
    res.status(200).json(user)
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败'
    res.status(400).json({ message })
  }
}
