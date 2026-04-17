export const ADMIN_EMAILS = [
  'admin@gmail.com',
]

export function isAdminEmail(email) {
  if (!email) return false
  return ADMIN_EMAILS.includes(String(email).toLowerCase())
}
