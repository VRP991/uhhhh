import { type NextRequest, NextResponse } from "next/server"
import { createContact } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json()

    // Save to Supabase
    const contact = await createContact(contactData)

    // Send notification email to admin (optional)
    try {
      await fetch(`${request.nextUrl.origin}/api/send-contact-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError)
      // Don't fail the contact creation if email fails
    }

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    console.error("Contact creation error:", error)
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}
