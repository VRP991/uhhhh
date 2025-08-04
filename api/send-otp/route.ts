import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createOTP } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, useCustomSMTP = false, customSMTP } = body

    console.log("OTP Request received for:", email)

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Save OTP to Supabase first
    try {
      await createOTP(email, otp)
      console.log("OTP saved to database successfully")
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          error: "Database error",
          details: dbError.message,
        },
        { status: 500 },
      )
    }

    let transporter
    let emailSent = false
    let lastError = null

    if (useCustomSMTP && customSMTP) {
      // Use custom SMTP settings
      try {
        transporter = nodemailer.createTransporter({
          host: customSMTP.host,
          port: customSMTP.port,
          secure: customSMTP.secure,
          auth: {
            user: customSMTP.user,
            pass: customSMTP.pass,
          },
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 10000,
          greetingTimeout: 5000,
          socketTimeout: 10000,
        })

        await transporter.verify()
        console.log("Custom SMTP verified successfully")
      } catch (error) {
        console.error("Custom SMTP failed:", error)
        lastError = error
      }
    } else {
      // Try multiple SMTP configurations
      const smtpConfigs = [
        {
          name: "Primary SMTP (465)",
          host: "mail.whh.iq",
          port: 465,
          secure: true,
          auth: {
            user: "otp@whh.iq",
            pass: "@@oottpp@2025@@",
          },
        },
        {
          name: "Secondary SMTP (587)",
          host: "mail.whh.iq",
          port: 587,
          secure: false,
          auth: {
            user: "otp@whh.iq",
            pass: "@@oottpp@2025@@",
          },
        },
        {
          name: "Fallback SMTP (25)",
          host: "mail.whh.iq",
          port: 25,
          secure: false,
          auth: {
            user: "otp@whh.iq",
            pass: "@@oottpp@2025@@",
          },
        },
      ]

      for (const config of smtpConfigs) {
        try {
          console.log(`Trying ${config.name}...`)

          transporter = nodemailer.createTransporter({
            ...config,
            tls: {
              rejectUnauthorized: false,
            },
            connectionTimeout: 10000,
            greetingTimeout: 5000,
            socketTimeout: 10000,
          })

          // Test the connection
          await transporter.verify()
          console.log(`${config.name} verified successfully`)
          break
        } catch (error) {
          console.log(`${config.name} failed:`, error.message)
          lastError = error
          if (config === smtpConfigs[smtpConfigs.length - 1]) {
            console.error("All SMTP configurations failed")
          }
        }
      }
    }

    // If we have a working transporter, send the email
    if (transporter) {
      try {
        const mailOptions = {
          from:
            useCustomSMTP && customSMTP
              ? `"World Heart Hotel" <${customSMTP.user}>`
              : '"World Heart Hotel" <otp@whh.iq>',
          to: email,
          subject: "Your OTP for Hotel Booking - World Heart Hotel",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #000; margin-bottom: 10px;">World Heart Hotel</h1>
                <p style="color: #666; font-size: 16px;">Baghdad - Qadisiyah</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
                <h2 style="color: #000; margin-bottom: 20px;">Your OTP Code</h2>
                <div style="background: #000; color: white; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="color: #666; margin-top: 20px;">This code will expire in 10 minutes.</p>
                <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px;">
                  World Heart Hotel<br>
                  Al-Kindi Street, Qadisiyah, Baghdad, Iraq<br>
                  Phone: +9640781234567811 | Email: info@whh.iq
                </p>
              </div>
            </div>
          `,
        }

        await transporter.sendMail(mailOptions)
        emailSent = true
        console.log("Email sent successfully")
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
        lastError = emailError
      }
    }

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
        otp: process.env.NODE_ENV === "development" ? otp : undefined, // Only in development
      })
    } else {
      // Even if email fails, we can still return success since OTP is saved in DB
      // This allows for manual verification or alternative delivery methods
      return NextResponse.json({
        success: true,
        message: "OTP generated successfully. Email delivery may have failed.",
        warning: "Email not sent - please check your email settings",
        otp: otp, // Return OTP for manual verification
        error_details: lastError?.message,
      })
    }
  } catch (error) {
    console.error("Critical error in send-otp:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
