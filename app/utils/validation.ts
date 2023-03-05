export function validateUsername(username: string) {
  return username.length < 4 ? 'Username is too short' : null
}

export function validatePassword(password: string) {
  return password.length < 6 ? 'Password is too short' : null
}
