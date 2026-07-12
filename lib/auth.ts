export const SESSION_COOKIE_NAME = "transitops_session"

export type UserRole =
  | "Fleet Manager"
  | "Dispatcher"
  | "Safety Officer"
  | "Financial Analyst"

export type MockUser = {
  email: string
  password: string
  role: UserRole
}

export type AuthSession = {
  email: string
  role: UserRole
}

export const MOCK_USERS: MockUser[] = [
  {
    email: "manager@transitops.com",
    password: "demo123",
    role: "Fleet Manager",
  },
  {
    email: "dispatcher@transitops.com",
    password: "demo123",
    role: "Dispatcher",
  },
  {
    email: "safety@transitops.com",
    password: "demo123",
    role: "Safety Officer",
  },
  {
    email: "finance@transitops.com",
    password: "demo123",
    role: "Financial Analyst",
  },
]

export function authenticateMockUser(
  email: string,
  password: string
): AuthSession | null {
  const user = MOCK_USERS.find(
    (candidate) =>
      candidate.email.toLowerCase() === email.trim().toLowerCase() &&
      candidate.password === password
  )

  return user ? { email: user.email, role: user.role } : null
}

export function serializeSession(session: AuthSession): string {
  return encodeURIComponent(JSON.stringify(session))
}

export function parseSessionCookie(value?: string | null): AuthSession | null {
  if (!value) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<AuthSession>
    if (!parsed.email || !parsed.role) return null
    return { email: parsed.email, role: parsed.role }
  } catch {
    return null
  }
}

export function getDisplayName(email: string): string {
  const [name] = email.split("@")
  return name
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function getInitials(email: string): string {
  return getDisplayName(email)
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
