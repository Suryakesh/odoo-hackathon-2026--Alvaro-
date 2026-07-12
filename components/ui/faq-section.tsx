import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
  {
    question: "How does trip validation work?",
    answer:
      "TransitOps automatically checks cargo weight against vehicle capacity, driver license validity, and availability before allowing dispatch.",
  },
  {
    question: "Can I track maintenance and fuel costs?",
    answer:
      "Yes, maintenance logs and fuel/expense tracking automatically calculate total operational cost per vehicle.",
  },
  {
    question: "Does it support multiple user roles?",
    answer:
      "Yes, Fleet Manager, Dispatcher, Safety Officer, and Financial Analyst each get role-based access.",
  },
  {
    question: "Can I export reports?",
    answer: "Yes, reports support CSV export.",
  },
  {
    question: "Is my fleet data secure?",
    answer:
      "Yes, authentication and role-based access control protect all fleet data.",
  },
] as const

export function FAQSection() {
  return (
    <section
      id="faq"
      className="dark scroll-mt-20 bg-[#030303] px-4 py-20 md:px-6 md:py-28"
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h2>

        <Accordion className="mt-12">
          {FAQS.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="border-white/10"
            >
              <AccordionTrigger className="text-white hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/50">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
