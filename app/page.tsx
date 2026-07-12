import type { Metadata } from "next"

import { HeroGeometric } from "@/components/ui/shape-landing-hero"

export const metadata: Metadata = {
  title: "TransitOps · Fleet Management",
}

export default function Home() {
  return <HeroGeometric />
}
