"use client"

import { motion, type Variants } from "framer-motion"
import {
  BarChart3,
  CheckCircle2,
  Route,
  ShieldCheck,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Feature = {
  icon: LucideIcon
  title: string
  description: string
  accent: string
  glow: string
  span: string
}

const FEATURES: Feature[] = [
  {
    icon: Route,
    title: "Smart Trip Dispatch",
    description:
      "Automatic validation for cargo capacity, license status, and vehicle availability — no manual checks needed.",
    accent: "bg-indigo-500/15 text-indigo-300",
    glow: "hover:border-indigo-500/30 hover:shadow-[0_0_50px_-12px_rgba(99,102,241,0.35)]",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    icon: Truck,
    title: "Vehicle & Driver Management",
    description:
      "Track your entire fleet and driver compliance in real time.",
    accent: "bg-rose-500/15 text-rose-300",
    glow: "hover:border-rose-500/30 hover:shadow-[0_0_40px_-12px_rgba(244,63,94,0.35)]",
    span: "",
  },
  {
    icon: Wrench,
    title: "Maintenance Tracking",
    description: "Auto status updates keep unsafe vehicles out of dispatch.",
    accent: "bg-violet-500/15 text-violet-300",
    glow: "hover:border-violet-500/30 hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.35)]",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Fuel efficiency, fleet utilization, and ROI at a glance.",
    accent: "bg-amber-500/15 text-amber-300",
    glow: "hover:border-amber-500/30 hover:shadow-[0_0_40px_-12px_rgba(245,158,11,0.35)]",
    span: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Four roles, one login — Fleet Manager, Dispatcher, Safety Officer, Financial Analyst.",
    accent: "bg-cyan-500/15 text-cyan-300",
    glow: "hover:border-cyan-500/30 hover:shadow-[0_0_40px_-12px_rgba(6,182,212,0.35)]",
    span: "",
  },
]

const MINI_BARS = [40, 70, 55, 90]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="dark scroll-mt-20 bg-[#030303] px-4 py-20 md:px-6 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Everything Your Fleet Needs
          </h2>
          <p className="mt-4 text-base text-white/40 sm:text-lg">
            One platform for vehicles, drivers, dispatch, and analytics.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-flow-row-dense lg:grid-cols-4"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={feature.span}
            >
              <Card
                className={cn(
                  "h-full border border-white/[0.08] bg-white/[0.03] ring-0 transition-colors duration-300",
                  feature.glow
                )}
              >
                <CardContent className="flex h-full flex-col gap-4">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg",
                      feature.accent
                    )}
                  >
                    <feature.icon className="size-5" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/50">
                      {feature.description}
                    </p>
                  </div>

                  {feature.title === "Smart Trip Dispatch" && (
                    <div className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0ca30c]/15 px-3 py-1 text-xs font-medium text-[#3fbf3f]">
                      <CheckCircle2 className="size-3.5" />
                      0 dispatch errors this week
                    </div>
                  )}

                  {feature.title === "Reports & Analytics" && (
                    <div className="mt-auto flex h-12 items-end gap-1.5">
                      {MINI_BARS.map((height, index) => (
                        <div
                          key={index}
                          style={{ height: `${height}%` }}
                          className="w-4 rounded-t-sm bg-amber-400/40"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
