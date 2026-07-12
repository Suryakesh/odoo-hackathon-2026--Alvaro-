import type { Metadata } from "next"

import { BrandingPanel } from "./_components/branding-panel"
import { LoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "Sign In · TransitOps",
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <BrandingPanel />

      <div className="dark flex flex-col items-center justify-center bg-[#030303] px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col gap-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Sign in to your account
            </h2>
            <p className="text-sm text-neutral-400">
              Enter your credentials to continue
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-xs leading-relaxed text-neutral-500">
            Access is scoped by role after login: Fleet Manager → Fleet,
            Maintenance | Dispatcher → Dashboard, Trips | Safety Officer →
            Drivers, Compliance | Financial Analyst → Fuel & Expenses,
            Analytics
          </p>
        </div>
      </div>
    </div>
  )
}
