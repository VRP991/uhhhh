import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, message } = await request.json()

    // Create transporter with multiple options
    const transporter = nodemailer.createTransporter({
      host: "mail.whh.iq",
      port: 465,
      secure: true,
      auth: {
        user: "otp@whh.iq",
        pass: "@@oottpp@2025@@",
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Email to admin
    const mailOptions = {
      from: '"World Heart Hotel Contact" <otp@whh.iq>',
      to: "ahmedali@whh.iq",
      subject: `New Contact Message - ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; margin-bottom: 10px;">World Heart Hotel</h1>
            <p style="color: #666; font-size: 16px;">New Contact Message</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #000; margin-bottom: 20px;">Contact Details</h2>
            
            <div style="margin-bottom: 15px;">
              <strong>Name:</strong> ${firstName} ${lastName}
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Email:</strong> ${email}
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Phone:</strong> ${phone}
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Message:</strong><br>
              <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
                ${message}
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              World Heart Hotel Admin Panel<br>
              This message was sent from the hotel website contact form.
            </p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending contact notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
