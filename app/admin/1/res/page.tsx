"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, X, RefreshCw } from "lucide-react"
// أضف import للـ contacts
import { getBookings, updateBookingStatus, getContacts, updateContactStatus } from "@/lib/supabase"

interface Booking {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  room_type: string
  guests: number
  check_in: string
  check_out: string
  special_requests: string
  status: string
  created_at: string
}

export default function AdminReservations() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  // أضف state للـ contacts
  const [contacts, setContacts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"bookings" | "contacts">("bookings")
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    // Simple authentication check
    if (email === "ahmedali@whh.iq" && password === "@@aahhmm@@") {
      setIsAuthenticated(true)
      loadBookings()
      // في handleLogin، أضف loadContacts
      loadContacts()
    } else {
      alert("Invalid credentials")
    }
    setAuthLoading(false)
  }

  const loadBookings = async () => {
    setLoading(true)
    try {
      const data = await getBookings()
      setBookings(data)
    } catch (error) {
      console.error("Error loading bookings:", error)
      alert("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  // أضف دالة loadContacts
  const loadContacts = async () => {
    setLoading(true)
    try {
      const data = await getContacts()
      setContacts(data)
    } catch (error) {
      console.error("Error loading contacts:", error)
      alert("Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateBookingStatus(id, status)
      loadBookings() // Refresh the list
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-black-100 text-black-800"
      case "new":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-purple-100 text-purple-800"
      case "replied":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRoomTypeName = (roomType: string) => {
    const roomNames = {
      royal: "Royal Suite",
      executive: "Executive Room",
      classic: "Classic Room",
    }
    return roomNames[roomType as keyof typeof roomNames] || roomType
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Admin Login</CardTitle>
            <p className="text-center text-gray-600">World Heart Hotel - Reservations</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmedali@whh.iq"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* أضف tabs في الواجهة بعد العنوان الرئيسي: */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hotel Management</h1>
            <p className="text-gray-600">World Heart Hotel - Admin Panel</p>
          </div>
          <div className="flex gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === "bookings" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
              >
                Reservations ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("contacts")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === "contacts" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
              >
                Messages ({contacts.length})
              </button>
            </div>
            <Button
              onClick={activeTab === "bookings" ? loadBookings : loadContacts}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsAuthenticated(false)} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* استبدل محتوى العرض بـ: */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6">
            {activeTab === "bookings" ? (
              bookings.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500 text-lg">No reservations found</p>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            {booking.first_name} {booking.last_name}
                          </CardTitle>
                          <p className="text-gray-600">Booking ID: {booking.id}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>{booking.status.toUpperCase()}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                          <p className="text-sm text-gray-600">Email: {booking.email}</p>
                          <p className="text-sm text-gray-600">Phone: {booking.phone}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Booking Details</h4>
                          <p className="text-sm text-gray-600">Room: {getRoomTypeName(booking.room_type)}</p>
                          <p className="text-sm text-gray-600">Guests: {booking.guests}</p>
                          <p className="text-sm text-gray-600">Check-in: {formatDate(booking.check_in)}</p>
                          <p className="text-sm text-gray-600">Check-out: {formatDate(booking.check_out)}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Additional Info</h4>
                          <p className="text-sm text-gray-600">Created: {formatDate(booking.created_at)}</p>
                          {booking.special_requests && (
                            <p className="text-sm text-gray-600">Special Requests: {booking.special_requests}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6 pt-4 border-t">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Confirm
                            </Button>
                            <Button
                              onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                              size="sm"
                              variant="destructive"
                            >
                              <X className="mr-1 h-4 w-4" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <Button
                            onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                            size="sm"
                            variant="destructive"
                          >
                            <X className="mr-1 h-4 w-4" />
                            Cancel
                          </Button>
                        )}
                        {booking.status === "cancelled" && (
                          <Button
                            onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )
            ) : contacts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 text-lg">No messages found</p>
                </CardContent>
              </Card>
            ) : (
              contacts.map((contact) => (
                <Card key={contact.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          {contact.first_name} {contact.last_name}
                        </CardTitle>
                        <p className="text-gray-600">Message ID: {contact.id}</p>
                      </div>
                      <Badge className={getStatusColor(contact.status)}>{contact.status.toUpperCase()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                        <p className="text-sm text-gray-600">Email: {contact.email}</p>
                        <p className="text-sm text-gray-600">Phone: {contact.phone}</p>
                        <p className="text-sm text-gray-600">Date: {formatDate(contact.created_at)}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{contact.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6 pt-4 border-t">
                      {contact.status === "new" && (
                        <>
                          <Button
                            onClick={() => updateContactStatus(contact.id, "read").then(loadContacts)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mark as Read
                          </Button>
                          <Button
                            onClick={() => updateContactStatus(contact.id, "replied").then(loadContacts)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark as Replied
                          </Button>
                        </>
                      )}
                      {contact.status === "read" && (
                        <Button
                          onClick={() => updateContactStatus(contact.id, "replied").then(loadContacts)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark as Replied
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
