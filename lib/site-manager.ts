import { supabase } from "./supabase"

// Types
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
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
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
  created_at: string
}

export interface SiteSetting {
  id: string
  setting_key: string
  setting_value: string
  setting_type: string
  description_en?: string
  description_ar?: string
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  last_login?: string
  created_at: string
}

// Room functions
export async function getRooms(): Promise<Room[]> {
  const { data, error } = await supabase.from("rooms").select("*").order("sort_order", { ascending: true })

  if (error) throw error
  return data || []
}

export async function getRoom(id: string): Promise<Room | null> {
  const { data, error } = await supabase.from("rooms").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function createRoom(room: Omit<Room, "id" | "created_at" | "updated_at">): Promise<Room> {
  const { data, error } = await supabase
    .from("rooms")
    .insert([{ ...room, updated_at: new Date().toISOString() }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRoom(id: string, updates: Partial<Room>): Promise<Room> {
  const { data, error } = await supabase
    .from("rooms")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRoom(id: string): Promise<void> {
  const { error } = await supabase.from("rooms").delete().eq("id", id)
  if (error) throw error
}

// Apartment functions
export async function getApartments(): Promise<Apartment[]> {
  const { data, error } = await supabase.from("apartments").select("*").order("sort_order", { ascending: true })

  if (error) throw error
  return data || []
}

export async function getApartment(id: string): Promise<Apartment | null> {
  const { data, error } = await supabase.from("apartments").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function createApartment(
  apartment: Omit<Apartment, "id" | "created_at" | "updated_at">,
): Promise<Apartment> {
  const { data, error } = await supabase
    .from("apartments")
    .insert([{ ...apartment, updated_at: new Date().toISOString() }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateApartment(id: string, updates: Partial<Apartment>): Promise<Apartment> {
  const { data, error } = await supabase
    .from("apartments")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteApartment(id: string): Promise<void> {
  const { error } = await supabase.from("apartments").delete().eq("id", id)
  if (error) throw error
}

// Hall functions
export async function getHalls(): Promise<Hall[]> {
  const { data, error } = await supabase.from("halls").select("*").order("sort_order", { ascending: true })

  if (error) throw error
  return data || []
}

export async function getHall(id: string): Promise<Hall | null> {
  const { data, error } = await supabase.from("halls").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function createHall(hall: Omit<Hall, "id" | "created_at" | "updated_at">): Promise<Hall> {
  const { data, error } = await supabase
    .from("halls")
    .insert([{ ...hall, updated_at: new Date().toISOString() }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateHall(id: string, updates: Partial<Hall>): Promise<Hall> {
  const { data, error } = await supabase
    .from("halls")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteHall(id: string): Promise<void> {
  const { error } = await supabase.from("halls").delete().eq("id", id)
  if (error) throw error
}

// Image functions
export async function getImages(entityType: string, entityId?: string): Promise<ImageRecord[]> {
  let query = supabase.from("images").select("*").eq("entity_type", entityType).order("sort_order", { ascending: true })

  if (entityId) {
    query = query.eq("entity_id", entityId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createImage(image: Omit<ImageRecord, "id" | "created_at">): Promise<ImageRecord> {
  const { data, error } = await supabase.from("images").insert([image]).select().single()

  if (error) throw error
  return data
}

export async function updateImage(id: string, updates: Partial<ImageRecord>): Promise<ImageRecord> {
  const { data, error } = await supabase.from("images").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteImage(id: string): Promise<void> {
  const { error } = await supabase.from("images").delete().eq("id", id)
  if (error) throw error
}

// Site settings functions
export async function getSiteSettings(): Promise<SiteSetting[]> {
  const { data, error } = await supabase.from("site_settings").select("*").order("setting_key", { ascending: true })

  if (error) throw error
  return data || []
}

export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("setting_key", key).single()

  if (error) throw error
  return data
}

export async function updateSiteSetting(key: string, value: string): Promise<SiteSetting> {
  const { data, error } = await supabase
    .from("site_settings")
    .upsert(
      [
        {
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "setting_key" } // This ensures it updates if key exists
    )
    .select()
    .single()

  if (error) throw error
  return data
}

// Admin authentication
export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  // Simple authentication for demo - in production, use proper password hashing
  if (email === "ahmedali@whh.iq" && password === "@@aahhmm@@") {
    const { data, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

    if (error) {
      // Create admin user if doesn't exist
      const { data: newUser, error: createError } = await supabase
        .from("admin_users")
        .insert([
          {
            email,
            password_hash: "hashed_password", // In production, hash the password
            full_name: "Ahmed Ali",
            role: "super_admin",
            last_login: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (createError) throw createError
      return newUser
    }

    // Update last login
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", data.id)

    return data
  }

  return null
}

// Get public data for frontend
export async function getPublicRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) throw error
  return data || []
}

export async function getPublicApartments(): Promise<Apartment[]> {
  const { data, error } = await supabase
    .from("apartments")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) throw error
  return data || []
}

export async function getPublicHalls(): Promise<Hall[]> {
  const { data, error } = await supabase
    .from("halls")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) throw error
  return data || []
}
