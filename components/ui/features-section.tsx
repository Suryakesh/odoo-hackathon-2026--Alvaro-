"use client"

import { motion, type Variants } from "framer-motion"
import {
  BarChart3,
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
  highlighted?: boolean
}

const FEATURES: Feature[] = [
  {
    icon: Route,
    title: "Smart Trip Dispatch",
    description:
      "Automatic validation for cargo capacity, license status, and vehicle availability — no manual checks needed.",
    highlighted: true,
  },
  {
    icon: Truck,
    title: "Vehicle & Driver Management",
    description:
      "Track your entire fleet and driver compliance in real time.",
  },
  {
    icon: Wrench,
    title: "Maintenance Tracking",
    description: "Auto status updates keep unsafe vehicles out of dispatch.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Fuel efficiency, fleet utilization, and ROI at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Four roles, one login — Fleet Manager, Dispatcher, Safety Officer, Financial Analyst.",
  },
]

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

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon

  return (
    <Card
      className={cn(
        "h-full rounded-2xl ring-0 transition-all duration-300",
        feature.highlighted
          ? "border-transparent bg-indigo-600 text-white shadow-[0_18px_60px_-28px_rgba(99,102,241,0.75)]"
          : "border border-white/[0.08] bg-white/[0.03] text-white hover:border-white/[0.14]"
      )}
    >
      <CardContent className="flex h-full flex-col gap-5 p-8">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full",
            feature.highlighted ? "bg-white/[0.15]" : "bg-white/[0.08]"
          )}
        >
          <Icon
            className={cn(
              "size-5",
              feature.highlighted ? "text-white" : "text-white/80"
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-white">{feature.title}</h3>
          <p
            className={cn(
              "text-sm leading-relaxed",
              feature.highlighted ? "text-white/85" : "text-white/45"
            )}
          >
            {feature.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function FeaturesSection() {
  const primaryFeatures = FEATURES.slice(0, 4)
  const roleFeature = FEATURES[4]

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
          className="mt-14 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {primaryFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mx-auto mt-4 grid max-w-xl grid-cols-1 items-stretch md:max-w-none md:grid-cols-2 lg:max-w-3xl"
        >
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="md:col-span-2"
          >
            <FeatureCard feature={roleFeature} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
