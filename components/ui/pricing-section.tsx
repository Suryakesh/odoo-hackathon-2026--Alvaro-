import Link from "next/link"
import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GITHUB_REPO_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"

type Plan = {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  href: string
  external?: boolean
  highlighted?: boolean
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    period: "/mo",
    description: "For small fleets",
    features: ["Up to 5 vehicles", "Basic dispatch", "Manual reports"],
    cta: "Get Started",
    href: "/dashboard",
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/mo",
    description: "For growing operations",
    features: [
      "Unlimited vehicles",
      "Automated validations",
      "Real-time analytics",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/dashboard",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large fleets",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    href: GITHUB_REPO_URL,
    external: true,
  },
]

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="dark scroll-mt-20 bg-[#030303] px-4 py-20 md:px-6 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Simple, Transparent Pricing
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative border bg-white/[0.03] ring-0 transition-all duration-300",
                plan.highlighted
                  ? "border-blue-500/40 bg-white/[0.05] shadow-[0_0_50px_-12px_rgba(59,130,246,0.4)] md:scale-105"
                  : "border-white/10"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 border-transparent bg-blue-500 text-white">
                  Most Popular
                </Badge>
              )}
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-medium text-white/60">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-white/40">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/40">{plan.description}</p>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-white/70"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-blue-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full rounded-full",
                    plan.highlighted
                      ? "bg-white text-black hover:bg-white/90"
                      : "border-white/20 bg-transparent text-white hover:bg-white/10"
                  )}
                  variant={plan.highlighted ? "default" : "outline"}
                  nativeButton={false}
                  render={
                    plan.external ? (
                      <a
                        href={plan.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ) : (
                      <Link href={plan.href} />
                    )
                  }
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
