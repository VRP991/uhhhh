import { type NextRequest, NextResponse } from "next/server"
import { createContact } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  console.log("=== Contact API Route Called ===")

  try {
    const contactData = await request.json()
    console.log("Contact data received:", {
      email: contactData.email,
      name: `${contactData.firstName} ${contactData.lastName}`,
    })

    // Save to Supabase
    const contact = await createContact(contactData)
    console.log("Contact saved to database:", contact.id)

    // Send notification email to admin (optional)
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/send-contact-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })

      if (response.ok) {
        console.log("Notification email sent successfully")
      } else {
        console.log("Notification email failed, but contact saved")
      }
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError)
      // Don't fail the contact creation if email fails
    }

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    console.error("Contact creation error:", error)
    return NextResponse.json({ error: "Failed to create contact", details: error.message }, { status: 500 })
  }
}

// Add GET method for testing
export async function GET() {
  console.log("=== Contact API GET Test ===")
  return NextResponse.json({
    success: true,
    message: "Contact API is working",
    timestamp: new Date().toISOString(),
  })
}
