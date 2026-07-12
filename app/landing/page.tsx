import type { Metadata } from "next"

import { FAQSection } from "@/components/ui/faq-section"
import { FeaturesSection } from "@/components/ui/features-section"
import { Navbar } from "@/components/ui/navbar"
import { PricingSection } from "@/components/ui/pricing-section"
import { HeroGeometric } from "@/components/ui/shape-landing-hero"

export const metadata: Metadata = {
  title: "TransitOps · Fleet Management",
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroGeometric />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
    </>
  )
}
