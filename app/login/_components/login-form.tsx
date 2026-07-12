"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const ROLE_OPTIONS = {
  "Fleet Manager": "Fleet Manager",
  Dispatcher: "Dispatcher",
  "Safety Officer": "Safety Officer",
  "Financial Analyst": "Financial Analyst",
}

type FormErrors = {
  email?: string
  password?: string
  role?: string
}

export function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    const nextErrors: FormErrors = {}
    if (!email.trim()) nextErrors.email = "Email is required"
    if (!password.trim()) nextErrors.password = "Password is required"
    if (!role) nextErrors.role = "Select a role to continue"

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    localStorage.setItem("transitops_role", role)
    localStorage.setItem("transitops_remember_me", String(rememberMe))
    router.push("/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@transitops.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setErrors((prev) => ({ ...prev, email: undefined }))
          }}
          aria-invalid={!!errors.email}
          className={cn(
            "border-white/10 bg-white/5 text-neutral-200 placeholder:text-neutral-500 focus-visible:border-white/20",
            errors.email && "border-red-500/50"
          )}
        />
        {errors.email && (
          <span className="text-xs text-red-400">{errors.email}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          aria-invalid={!!errors.password}
          className={cn(
            "border-white/10 bg-white/5 text-neutral-200 placeholder:text-neutral-500 focus-visible:border-white/20",
            errors.password && "border-red-500/50"
          )}
        />
        {errors.password && (
          <span className="text-xs text-red-400">{errors.password}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="role">Role</Label>
        <Select
          items={ROLE_OPTIONS}
          value={role || null}
          onValueChange={(value) => {
            setRole((value as string) ?? "")
            setErrors((prev) => ({ ...prev, role: undefined }))
          }}
        >
          <SelectTrigger
            id="role"
            className={cn(
              "w-full border-white/10 bg-white/5 text-neutral-200",
              errors.role && "border-red-500/50"
            )}
          >
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(ROLE_OPTIONS).map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && (
          <span className="text-xs text-red-400">{errors.role}</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label htmlFor="remember-me" className="font-normal text-neutral-400">
            Remember me
          </Label>
        </div>
        <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
          Forgot password?
        </a>
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  )
}
