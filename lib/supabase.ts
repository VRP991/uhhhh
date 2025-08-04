import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://jlrmwxtsndihqupkeyop.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impscm13eHRzbmRpaHF1cGtleW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTM2NDUsImV4cCI6MjA2ODY2OTY0NX0.GXl9JgTnpiX55CxNA81kx2tDsZzunY5nM3rH6N8tRck"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface BookingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  roomType: string
  guests: string
  checkIn: string
  checkOut: string
  specialRequests: string
}

export interface ContactData {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

export interface Room {
  id: string
  name_en: string
  name_ar: string
  type: string
  price_per_night: number
  description_en?: string
  description_ar?: string
  about_en?: string
  about_ar?: string
  features_en: string[]
  features_ar: string[]
  max_guests: number
  size_sqm?: number
  view_type?: string
  is_active: boolean
  sort_order: number
  images?: ImageRecord[]
}

export interface Apartment {
  id: string
  name_en: string
  name_ar: string
  type: string
  price_per_night: number
  description_en?: string
  description_ar?: string
  about_en?: string
  about_ar?: string
  features_en: string[]
  features_ar: string[]
  bedrooms: number
  bathrooms: number
  max_guests: number
  size_sqm?: number
  view_type?: string
  is_active: boolean
  sort_order: number
  images?: ImageRecord[]
}

export interface Hall {
  id: string
  name_en: string
  name_ar: string
  type: string
  capacity: number
  price_per_hour: number
  description_en?: string
  description_ar?: string
  about_en?: string
  about_ar?: string
  features_en: string[]
  features_ar: string[]
  size_sqm?: number
  is_active: boolean
  sort_order: number
  images?: ImageRecord[]
}

export interface ImageRecord {
  id: string
  entity_type: string
  entity_id: string
  image_url: string
  alt_text_en?: string
  alt_text_ar?: string
  is_primary: boolean
  sort_order: number
}

export interface SiteSetting {
  setting_key: string
  setting_value: string
  setting_type: string
}

export async function createBooking(data: BookingData) {
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert([
      {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        room_type: data.roomType,
        guests: Number.parseInt(data.guests),
        check_in: data.checkIn,
        check_out: data.checkOut,
        special_requests: data.specialRequests,
        status: "pending",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) throw error
  return booking
}

export async function createContact(data: ContactData) {
  const { data: contact, error } = await supabase
    .from("contacts")
    .insert([
      {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        status: "new",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) throw error
  return contact
}

export async function getBookings() {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return bookings
}

export async function getContacts() {
  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return contacts
}

export async function updateBookingStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateContactStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("contacts")
    .update({ status })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPublicRooms(): Promise<Room[]> {
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching rooms:", error)
    return []
  }

  const roomsWithImages = await Promise.all(
    (rooms || []).map(async (room) => {
      const images = await getRoomImages(room.id)
      return { ...room, images }
    })
  )

  return roomsWithImages
}

export async function getPublicApartments(): Promise<Apartment[]> {
  const { data: apartments, error } = await supabase
    .from("apartments")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching apartments:", error)
    return []
  }

  const apartmentsWithImages = await Promise.all(
    (apartments || []).map(async (apartment) => {
      const images = await getApartmentImages(apartment.id)
      return { ...apartment, images }
    })
  )

  return apartmentsWithImages
}

export async function getPublicHalls(): Promise<Hall[]> {
  const { data: halls, error } = await supabase
    .from("halls")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching halls:", error)
    return []
  }

  const hallsWithImages = await Promise.all(
    (halls || []).map(async (hall) => {
      const images = await getHallImages(hall.id)
      return { ...hall, images }
    })
  )

  return hallsWithImages
}

export async function getPublicSiteSettings(): Promise<Record<string, string>> {
  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("setting_key, setting_value")
    .eq("is_public", true)

  if (error) {
    console.error("Error fetching site settings:", error)
    return {}
  }

  const settingsObject: Record<string, string> = {}
  settings?.forEach((setting) => {
    settingsObject[setting.setting_key] = setting.setting_value
  })

  return settingsObject
}

export async function getRoomImages(roomId: string): Promise<ImageRecord[]> {
  const { data: images, error } = await supabase
    .from("images")
    .select("*")
    .eq("entity_type", "room")
    .eq("entity_id", roomId)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching room images:", error)
    return []
  }

  return images || []
}

export async function getApartmentImages(apartmentId: string): Promise<ImageRecord[]> {
  const { data: images, error } = await supabase
    .from("images")
    .select("*")
    .eq("entity_type", "apartment")
    .eq("entity_id", apartmentId)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching apartment images:", error)
    return []
  }

  return images || []
}

export async function getHallImages(hallId: string): Promise<ImageRecord[]> {
  const { data: images, error } = await supabase
    .from("images")
    .select("*")
    .eq("entity_type", "hall")
    .eq("entity_id", hallId)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching hall images:", error)
    return []
  }

  return images || []
}

export function getPrimaryImage(images?: ImageRecord[]): string {
  if (!images || images.length === 0) {
    return "/placeholder.svg?height=400&width=600&text=No Image"
  }

  const primaryImage = images.find((img) => img.is_primary)
  return primaryImage?.image_url || images[0]?.image_url || "/placeholder.svg?height=400&width=600&text=No Image"
}

export function getAllImages(images?: ImageRecord[]): string[] {
  if (!images || images.length === 0) {
    return ["/placeholder.svg?height=400&width=600&text=No Image"]
  }

  return images.map((img) => img.image_url)
}
