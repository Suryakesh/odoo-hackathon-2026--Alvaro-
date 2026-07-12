"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, Truck, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GITHUB_REPO_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Features", href: "#features", external: false },
  { label: "Pricing", href: "#pricing", external: false },
  { label: "FAQ", href: "#faq", external: false },
  { label: "GitHub", href: GITHUB_REPO_URL, external: true },
] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "dark fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#030303]/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-blue-500/15 text-blue-400">
            <Truck className="size-4" />
          </div>
          <span className="font-heading text-sm font-semibold tracking-tight text-white">
            TransitOps
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        <div className="hidden md:block">
          <Button
            className="rounded-full bg-white px-6 text-black hover:bg-white/90"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Sign In
          </Button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex size-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/5 hover:text-white md:hidden"
        >
          {mobileOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#030303]/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              )
            )}
            <Button
              className="mt-2 w-full rounded-full bg-white text-black hover:bg-white/90"
              nativeButton={false}
              render={<Link href="/login" onClick={() => setMobileOpen(false)} />}
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
