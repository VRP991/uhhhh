"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, CheckCircle, Heart } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createBooking, getPublicRooms, getPublicApartments, type Room, type Apartment } from "@/lib/supabase"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRoom: string
  currentLang: "ar" | "en"
}

export function BookingModal({ isOpen, onClose, selectedRoom, currentLang }: BookingModalProps) {
  const [step, setStep] = useState<"booking" | "success">("booking")
  const [loading, setLoading] = useState(false)
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [bookingId, setBookingId] = useState("")
  const [rooms, setRooms] = useState<Room[]>([])
  const [apartments, setApartments] = useState<Apartment[]>([])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roomType: selectedRoom,
    guests: "1",
    specialRequests: "",
  })

  // Load available rooms and apartments
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [roomsData, apartmentsData] = await Promise.all([getPublicRooms(), getPublicApartments()])
        setRooms(roomsData)
        setApartments(apartmentsData)
      } catch (error) {
        console.error("Error loading booking options:", error)
      }
    }

    if (isOpen) {
      loadOptions()
    }
  }, [isOpen])

  // Update form when selectedRoom changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, roomType: selectedRoom }))
  }, [selectedRoom])

  const content = {
    en: {
      title: "Reserve Your Stay",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      roomType: "Room Type",
      guests: "Number of Guests",
      checkIn: "Check-in Date",
      checkOut: "Check-out Date",
      specialRequests: "Special Requests",
      bookNow: "Confirm Reservation",
      success: "Booking Confirmed!",
      successMessage:
        "Your reservation at World Heart Hotel has been confirmed. Our team will contact you shortly to finalize the details.",
      close: "Close",
    },
    ar: {
      title: "احجز إقامتك",
      firstName: "الاسم الأول",
      lastName: "الاسم الأخير",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      roomType: "نوع الغرفة",
      guests: "عدد النزلاء",
      checkIn: "تاريخ الوصول",
      checkOut: "تاريخ المغادرة",
      specialRequests: "طلبات خاصة",
      bookNow: "تأكيد الحجز",
      success: "تم تأكيد الحجز!",
      successMessage: "تم تأكيد حجزك في فندق قلب العالم. سيتواصل معك فريقنا قريباً لإنهاء التفاصيل.",
      close: "إغلاق",
    },
  }

  const t = content[currentLang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkIn || !checkOut) return

    setLoading(true)
    try {
      // Create booking in Supabase directly
      const booking = await createBooking({
        ...formData,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      })

      setBookingId(booking.id)

      // Go directly to success step
      setStep("success")
    } catch (error) {
      console.error("Booking error:", error)
      alert(`Booking failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep("booking")
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roomType: selectedRoom,
      guests: "1",
      specialRequests: "",
    })
    setCheckIn(undefined)
    setCheckOut(undefined)
    setBookingId("")
    onClose()
  }

  // Get room/apartment name for display
  const getRoomName = (type: string) => {
    const room = rooms.find((r) => r.type === type)
    const apartment = apartments.find((a) => a.type === type)

    if (room) {
      return currentLang === "ar" ? room.name_ar : room.name_en
    }
    if (apartment) {
      return currentLang === "ar" ? apartment.name_ar : apartment.name_en
    }
    return type
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white border-2 border-brand-beige-light">
        <DialogHeader className="text-center border-b border-brand-beige-light pb-4">
          <div className="flex items-center justify-center mb-4">
            <img src="/images/logo-new.png" alt="World Heart Hotel Logo" className="w-12 h-12 mr-3" />
          </div>
          <DialogTitle className="text-2xl font-bold text-brand-gray-dark">{t.title}</DialogTitle>
          <p className="text-sm text-brand-gray-medium">Baghdad - Qadisiyah | بغداد - القادسية</p>
        </DialogHeader>

        {step === "booking" && (
          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-brand-gray-dark font-medium">
                  {t.firstName}
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="brand-input mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-brand-gray-dark font-medium">
                  {t.lastName}
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="brand-input mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-brand-gray-dark font-medium">
                {t.email}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="brand-input mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-brand-gray-dark font-medium">
                {t.phone}
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="brand-input mt-1"
              />
            </div>

            <div>
              <Label className="text-brand-gray-dark font-medium">{t.roomType}</Label>
              <Select
                value={formData.roomType}
                onValueChange={(value) => setFormData({ ...formData, roomType: value })}
              >
                <SelectTrigger className="brand-input mt-1">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-brand-beige-light">
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.type}>
                      {currentLang === "ar" ? room.name_ar : room.name_en} - ${room.price_per_night}/night
                    </SelectItem>
                  ))}
                  {apartments.map((apartment) => (
                    <SelectItem key={apartment.id} value={apartment.type}>
                      {currentLang === "ar" ? apartment.name_ar : apartment.name_en} - ${apartment.price_per_night}
                      /night
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-brand-gray-dark font-medium">{t.guests}</Label>
              <Select value={formData.guests} onValueChange={(value) => setFormData({ ...formData, guests: value })}>
                <SelectTrigger className="brand-input mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-brand-beige-light">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-brand-gray-dark font-medium">{t.checkIn}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal brand-input",
                        !checkIn && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-brand-beige-light">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-brand-gray-dark font-medium">{t.checkOut}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal brand-input",
                        !checkOut && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-brand-beige-light">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequests" className="text-brand-gray-dark font-medium">
                {t.specialRequests}
              </Label>
              <Input
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="brand-input mt-1"
                placeholder={currentLang === "ar" ? "أي طلبات خاصة..." : "Any special requests..."}
              />
            </div>

            <Button type="submit" className="w-full brand-button-primary py-4 text-lg font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t.bookNow}
            </Button>
          </form>
        )}

        {step === "success" && (
          <div className="space-y-6 text-center py-8">
            <div className="text-brand-accent-black">
              <div className="w-20 h-20 bg-brand-beige-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-10 h-10 text-brand-gray-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-brand-gray-dark flex items-center justify-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                {t.success}
              </h3>
              <p className="text-brand-gray-medium text-lg leading-relaxed mb-4">{t.successMessage}</p>

              <div className="bg-brand-beige-light p-4 rounded-lg border border-brand-beige-medium">
                <p className="text-sm text-brand-gray-dark mb-2">
                  <strong>Booking ID:</strong> {bookingId}
                </p>
                <p className="text-sm text-brand-gray-dark mb-2">
                  <strong>Room:</strong> {getRoomName(formData.roomType)}
                </p>
                <div className="flex items-center justify-center mb-2">
                  <img src="/images/logo-new.png" alt="World Heart Hotel" className="w-8 h-8 mr-2" />
                  <p className="text-xs text-brand-gray-dark font-medium">World Heart Hotel - فندق قلب العالم</p>
                </div>
                <p className="text-xs text-brand-gray-medium">
                  {currentLang === "ar" ? "سيتم التواصل معك خلال 24 ساعة" : "We will contact you within 24 hours"}
                </p>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full brand-button-primary py-4 text-lg">
              {t.close}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
