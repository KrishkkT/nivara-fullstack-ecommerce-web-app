import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ | NIVARA",
  description: "Frequently asked questions about NIVARA silver jewellery",
}

export default function FAQPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-lg">Find answers to common questions about NIVARA jewellery</p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1" className="border rounded-lg px-6 bg-card">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-medium">What is NIVARA jewellery made of?</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            All NIVARA jewellery is crafted from 925 sterling silver, which is 92.5% pure silver. This is the highest
            quality silver used in jewellery making, ensuring durability and a beautiful lustrous finish. Some pieces
            may also feature rhodium plating for added shine and protection.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border rounded-lg px-6 bg-card">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-medium">How do I determine my ring size?</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            You can measure your ring size at home using a piece of string or paper. Wrap it around your finger, mark
            where it overlaps, and measure the length in millimeters. You can also visit any jewellery store for
            professional sizing. If you're between sizes, we recommend going with the larger size for comfort.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border rounded-lg px-6 bg-card">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-medium">Do you offer gift wrapping?</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Yes! All NIVARA jewellery comes in an elegant gift box at no extra charge. We also offer premium gift
            wrapping with a personalized message card for special occasions. Select the gift wrapping option at
            checkout.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border rounded-lg px-6 bg-card">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-medium">How long does shipping take?</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            We offer free shipping on all orders. Standard delivery takes 5-7 business days within India. Express
            shipping (2-3 business days) is available for an additional fee. International shipping takes 10-15 business
            days depending on the destination.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border rounded-lg px-6 bg-card">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-medium">Can I return or exchange my jewellery?</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Yes, we offer a 30-day return and exchange policy. Items must be unworn, in original condition with all tags
            attached, and in the original packaging. Personalized or engraved items cannot be returned. Please refer to
            our Returns page for detailed information.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6" className="border rounded-lg px-6 bg-card">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-medium">Will my silver jewellery tarnish?</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Sterling silver can naturally tarnish over time when exposed to air and moisture. However, with proper care
            and storage, you can minimize tarnishing. Store your jewellery in an airtight container or anti-tarnish
            pouch when not wearing it. Regular cleaning with a soft cloth will also help maintain its shine.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7" className="border rounded-lg px-6 bg-card">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-medium">Do you offer customization or engraving?</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Yes, we offer engraving services on selected items. You can add names, dates, or short messages (up to 15
            characters). This service typically adds 3-5 business days to your order. Contact our customer service team
            for customization options.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8" className="border rounded-lg px-6 bg-card">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-medium">Is my payment information secure?</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Absolutely. We use industry-standard encryption and secure payment gateways (Razorpay) to process all
            transactions. We never store your complete credit card information on our servers. Your payment data is
            protected and encrypted at all times.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9" className="border rounded-lg px-6 bg-card">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-medium">How do I track my order?</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Once your order ships, you'll receive a tracking number via email. You can also log into your account and
            view your order status and tracking information in the "My Orders" section. If you have any questions about
            your order, our customer service team is here to help.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10" className="border rounded-lg px-6 bg-card">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="font-medium">Do you have a warranty?</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Yes, all NIVARA jewellery comes with a 1-year warranty against manufacturing defects. This covers issues
            like stone falling, clasp breaking, or plating wearing off under normal use. The warranty does not cover
            damage from misuse, accidents, or normal wear and tear. Contact us if you need to make a warranty claim.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-12 p-8 bg-muted/30 rounded-lg text-center border">
        <h2 className="text-2xl font-serif mb-3">Still have questions?</h2>
        <p className="text-muted-foreground mb-6">
          Our customer service team is here to help you with any questions or concerns.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  )
}
