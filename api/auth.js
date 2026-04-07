import usersDb from './data/users.json' with { type: 'json' }

function toSafeUser(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  }
}

export function loginByPassword({ username, password }) {
  const user = usersDb.users.find(
    (item) => item.username === username && item.password === password,
  )
  if (!user) {
    throw new Error('账号或密码错误')
  }
  return toSafeUser(user)
}
