"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  ImageIcon,
  Settings,
  Home,
  Building,
  Calendar,
  Video,
  Save,
  Upload,
  X,
} from "lucide-react"
import {
  getRooms,
  getApartments,
  getHalls,
  getSiteSettings,
  createRoom,
  updateRoom,
  deleteRoom,
  createApartment,
  updateApartment,
  deleteApartment,
  createHall,
  updateHall,
  deleteHall,
  updateSiteSetting,
  getImages,
  createImage,
  deleteImage,
  authenticateAdmin,
  type Room,
  type Apartment,
  type Hall,
  type SiteSetting,
  type ImageRecord,
} from "@/lib/site-manager"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function SiteManagerDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data states
  const [rooms, setRooms] = useState<Room[]>([])
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [halls, setHalls] = useState<Hall[]>([])
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [images, setImages] = useState<ImageRecord[]>([])

  // Modal states
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null)
  const [editingHall, setEditingHall] = useState<Hall | null>(null)
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [showApartmentModal, setShowApartmentModal] = useState(false)
  const [showHallModal, setShowHallModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<{ type: string; id: string; name: string } | null>(null)

  // Form states
  const [roomForm, setRoomForm] = useState<Partial<Room>>({
    name_en: "",
    name_ar: "",
    type: "",
    price_per_night: 0,
    description_en: "",
    description_ar: "",
    about_en: "",
    about_ar: "",
    features_en: [],
    features_ar: [],
    max_guests: 2,
    size_sqm: 0,
    view_type: "",
    is_active: true,
    sort_order: 0,
  })

  const [apartmentForm, setApartmentForm] = useState<Partial<Apartment>>({
    name_en: "",
    name_ar: "",
    type: "",
    price_per_night: 0,
    description_en: "",
    description_ar: "",
    about_en: "",
    about_ar: "",
    features_en: [],
    features_ar: [],
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 4,
    size_sqm: 0,
    view_type: "",
    is_active: true,
    sort_order: 0,
  })

  const [hallForm, setHallForm] = useState<Partial<Hall>>({
    name_en: "",
    name_ar: "",
    type: "",
    capacity: 50,
    price_per_hour: 0,
    description_en: "",
    description_ar: "",
    about_en: "",
    about_ar: "",
    features_en: [],
    features_ar: [],
    size_sqm: 0,
    is_active: true,
    sort_order: 0,
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    try {
      const user = await authenticateAdmin(email, password)
      if (user) {
        setIsAuthenticated(true)
        loadAllData()
      } else {
        alert("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed")
    } finally {
      setAuthLoading(false)
    }
  }

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [roomsData, apartmentsData, hallsData, settingsData] = await Promise.all([
        getRooms(),
        getApartments(),
        getHalls(),
        getSiteSettings(),
      ])

      setRooms(roomsData)
      setApartments(apartmentsData)
      setHalls(hallsData)
      setSettings(settingsData)
    } catch (error) {
      console.error("Error loading data:", error)
      alert("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const loadImages = async (entityType: string, entityId: string) => {
    try {
      const imagesData = await getImages(entityType, entityId)
      setImages(imagesData)
    } catch (error) {
      console.error("Error loading images:", error)
    }
  }

  // Room handlers
  const handleSaveRoom = async () => {
    setLoading(true)
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, roomForm)
      } else {
        await createRoom(roomForm as Omit<Room, "id" | "created_at" | "updated_at">)
      }
      await loadAllData()
      setShowRoomModal(false)
      setEditingRoom(null)
      resetRoomForm()
    } catch (error) {
      console.error("Error saving room:", error)
      alert("Failed to save room")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return

    setLoading(true)
    try {
      await deleteRoom(id)
      await loadAllData()
    } catch (error) {
      console.error("Error deleting room:", error)
      alert("Failed to delete room")
    } finally {
      setLoading(false)
    }
  }

  const resetRoomForm = () => {
    setRoomForm({
      name_en: "",
      name_ar: "",
      type: "",
      price_per_night: 0,
      description_en: "",
      description_ar: "",
      about_en: "",
      about_ar: "",
      features_en: [],
      features_ar: [],
      max_guests: 2,
      size_sqm: 0,
      view_type: "",
      is_active: true,
      sort_order: 0,
    })
  }

  // Apartment handlers
  const handleSaveApartment = async () => {
    setLoading(true)
    try {
      if (editingApartment) {
        await updateApartment(editingApartment.id, apartmentForm)
      } else {
        await createApartment(apartmentForm as Omit<Apartment, "id" | "created_at" | "updated_at">)
      }
      await loadAllData()
      setShowApartmentModal(false)
      setEditingApartment(null)
      resetApartmentForm()
    } catch (error) {
      console.error("Error saving apartment:", error)
      alert("Failed to save apartment")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteApartment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this apartment?")) return

    setLoading(true)
    try {
      await deleteApartment(id)
      await loadAllData()
    } catch (error) {
      console.error("Error deleting apartment:", error)
      alert("Failed to delete apartment")
    } finally {
      setLoading(false)
    }
  }

  const resetApartmentForm = () => {
    setApartmentForm({
      name_en: "",
      name_ar: "",
      type: "",
      price_per_night: 0,
      description_en: "",
      description_ar: "",
      about_en: "",
      about_ar: "",
      features_en: [],
      features_ar: [],
      bedrooms: 1,
      bathrooms: 1,
      max_guests: 4,
      size_sqm: 0,
      view_type: "",
      is_active: true,
      sort_order: 0,
    })
  }

  // Hall handlers
  const handleSaveHall = async () => {
    setLoading(true)
    try {
      if (editingHall) {
        await updateHall(editingHall.id, hallForm)
      } else {
        await createHall(hallForm as Omit<Hall, "id" | "created_at" | "updated_at">)
      }
      await loadAllData()
      setShowHallModal(false)
      setEditingHall(null)
      resetHallForm()
    } catch (error) {
      console.error("Error saving hall:", error)
      alert("Failed to save hall")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteHall = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hall?")) return

    setLoading(true)
    try {
      await deleteHall(id)
      await loadAllData()
    } catch (error) {
      console.error("Error deleting hall:", error)
      alert("Failed to delete hall")
    } finally {
      setLoading(false)
    }
  }

  const resetHallForm = () => {
    setHallForm({
      name_en: "",
      name_ar: "",
      type: "",
      capacity: 50,
      price_per_hour: 0,
      description_en: "",
      description_ar: "",
      about_en: "",
      about_ar: "",
      features_en: [],
      features_ar: [],
      size_sqm: 0,
      is_active: true,
      sort_order: 0,
    })
  }

  // Settings handlers
  const handleUpdateSetting = async (key: string, value: string) => {
    setLoading(true)
    try {
      await updateSiteSetting(key, value)
      await loadAllData()
    } catch (error) {
      console.error("Error updating setting:", error)
      alert("Failed to update setting")
    } finally {
      setLoading(false)
    }
  }

  // Image handlers
  const handleAddImage = async (imageUrl: string, altTextEn: string, altTextAr: string) => {
    if (!selectedEntity) return

    setLoading(true)
    try {
      await createImage({
        entity_type: selectedEntity.type,
        entity_id: selectedEntity.id,
        image_url: imageUrl,
        alt_text_en: altTextEn,
        alt_text_ar: altTextAr,
        is_primary: images.length === 0,
        sort_order: images.length,
      })
      await loadImages(selectedEntity.type, selectedEntity.id)
    } catch (error) {
      console.error("Error adding image:", error)
      alert("Failed to add image")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    setLoading(true)
    try {
      await deleteImage(id)
      if (selectedEntity) {
        await loadImages(selectedEntity.type, selectedEntity.id)
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Failed to delete image")
    } finally {
      setLoading(false)
    }
  }

  // Utility functions
  const addFeature = (type: "room" | "apartment" | "hall", lang: "en" | "ar", feature: string) => {
    if (!feature.trim()) return

    if (type === "room") {
      const key = lang === "en" ? "features_en" : "features_ar"
      setRoomForm((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), feature],
      }))
    } else if (type === "apartment") {
      const key = lang === "en" ? "features_en" : "features_ar"
      setApartmentForm((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), feature],
      }))
    } else if (type === "hall") {
      const key = lang === "en" ? "features_en" : "features_ar"
      setHallForm((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), feature],
      }))
    }
  }

  const removeFeature = (type: "room" | "apartment" | "hall", lang: "en" | "ar", index: number) => {
    if (type === "room") {
      const key = lang === "en" ? "features_en" : "features_ar"
      setRoomForm((prev) => ({
        ...prev,
        [key]: prev[key]?.filter((_, i) => i !== index) || [],
      }))
    } else if (type === "apartment") {
      const key = lang === "en" ? "features_en" : "features_ar"
      setApartmentForm((prev) => ({
        ...prev,
        [key]: prev[key]?.filter((_, i) => i !== index) || [],
      }))
    } else if (type === "hall") {
      const key = lang === "en" ? "features_en" : "features_ar"
      setHallForm((prev) => ({
        ...prev,
        [key]: prev[key]?.filter((_, i) => i !== index) || [],
      }))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Site Manager Login</CardTitle>
            <p className="text-center text-gray-600">World Heart Hotel - Dashboard</p>
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
                Login to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/images/logo-new.png" alt="World Heart Hotel" className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Site Manager</h1>
              <p className="text-gray-600">World Heart Hotel Dashboard</p>
            </div>
          </div>
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="rooms" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="apartments" className="flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>Apartments</span>
            </TabsTrigger>
            <TabsTrigger value="halls" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Halls</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>Video</span>
            </TabsTrigger>
          </TabsList>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Manage Rooms</h2>
              <Button
                onClick={() => {
                  resetRoomForm()
                  setEditingRoom(null)
                  setShowRoomModal(true)
                }}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Room</span>
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-6">
                {rooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl flex items-center space-x-2">
                            <span>{room.name_en}</span>
                            <Badge variant={room.is_active ? "default" : "secondary"}>
                              {room.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </CardTitle>
                          <p className="text-gray-600">{room.name_ar}</p>
                          <p className="text-lg font-semibold text-green-600">${room.price_per_night}/night</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEntity({ type: "room", id: room.id, name: room.name_en })
                              loadImages("room", room.id)
                              setShowImageModal(true)
                            }}
                          >
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingRoom(room)
                              setRoomForm(room)
                              setShowRoomModal(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteRoom(room.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Details</h4>
                          <p className="text-sm text-gray-600 mb-1">Type: {room.type}</p>
                          <p className="text-sm text-gray-600 mb-1">Max Guests: {room.max_guests}</p>
                          <p className="text-sm text-gray-600 mb-1">Size: {room.size_sqm} sqm</p>
                          <p className="text-sm text-gray-600">View: {room.view_type}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {room.features_en.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      {room.description_en && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-sm text-gray-600">{room.description_en}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Apartments Tab */}
          <TabsContent value="apartments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Manage Apartments</h2>
              <Button
                onClick={() => {
                  resetApartmentForm()
                  setEditingApartment(null)
                  setShowApartmentModal(true)
                }}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Apartment</span>
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-6">
                {apartments.map((apartment) => (
                  <Card key={apartment.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl flex items-center space-x-2">
                            <span>{apartment.name_en}</span>
                            <Badge variant={apartment.is_active ? "default" : "secondary"}>
                              {apartment.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </CardTitle>
                          <p className="text-gray-600">{apartment.name_ar}</p>
                          <p className="text-lg font-semibold text-green-600">${apartment.price_per_night}/night</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEntity({ type: "apartment", id: apartment.id, name: apartment.name_en })
                              loadImages("apartment", apartment.id)
                              setShowImageModal(true)
                            }}
                          >
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingApartment(apartment)
                              setApartmentForm(apartment)
                              setShowApartmentModal(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteApartment(apartment.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Details</h4>
                          <p className="text-sm text-gray-600 mb-1">Type: {apartment.type}</p>
                          <p className="text-sm text-gray-600 mb-1">Bedrooms: {apartment.bedrooms}</p>
                          <p className="text-sm text-gray-600 mb-1">Bathrooms: {apartment.bathrooms}</p>
                          <p className="text-sm text-gray-600 mb-1">Max Guests: {apartment.max_guests}</p>
                          <p className="text-sm text-gray-600">Size: {apartment.size_sqm} sqm</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {apartment.features_en.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Halls Tab */}
          <TabsContent value="halls" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Manage Halls</h2>
              <Button
                onClick={() => {
                  resetHallForm()
                  setEditingHall(null)
                  setShowHallModal(true)
                }}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hall</span>
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-6">
                {halls.map((hall) => (
                  <Card key={hall.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl flex items-center space-x-2">
                            <span>{hall.name_en}</span>
                            <Badge variant={hall.is_active ? "default" : "secondary"}>
                              {hall.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </CardTitle>
                          <p className="text-gray-600">{hall.name_ar}</p>
                          <p className="text-lg font-semibold text-green-600">${hall.price_per_hour}/hour</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEntity({ type: "hall", id: hall.id, name: hall.name_en })
                              loadImages("hall", hall.id)
                              setShowImageModal(true)
                            }}
                          >
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingHall(hall)
                              setHallForm(hall)
                              setShowHallModal(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteHall(hall.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Details</h4>
                          <p className="text-sm text-gray-600 mb-1">Type: {hall.type}</p>
                          <p className="text-sm text-gray-600 mb-1">Capacity: {hall.capacity} people</p>
                          <p className="text-sm text-gray-600">Size: {hall.size_sqm} sqm</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {hall.features_en.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Site Settings</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-6">
                {settings.map((setting) => (
                  <Card key={setting.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{setting.setting_key}</CardTitle>
                      <p className="text-gray-600">{setting.description_en}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-4">
                        <Input
                          value={setting.setting_value}
                          onChange={(e) => {
                            const updatedSettings = settings.map((s) =>
                              s.id === setting.id ? { ...s, setting_value: e.target.value } : s,
                            )
                            setSettings(updatedSettings)
                          }}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => handleUpdateSetting(setting.setting_key, setting.setting_value)}
                          disabled={loading}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Video Tab */}
          <TabsContent value="video" className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Hero Video Settings</h2>

            <Card>
              <CardHeader>
                <CardTitle>Current Hero Video</CardTitle>
                <p className="text-gray-600">Manage the main hero video displayed on the homepage</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="video-url">Video URL</Label>
                  <Input
                    id="video-url"
                    value={settings.find((s) => s.setting_key === "hero_video_url")?.setting_value || ""}
                    onChange={(e) => {
                      const updatedSettings = settings.map((s) =>
                        s.setting_key === "hero_video_url" ? { ...s, setting_value: e.target.value } : s,
                      )
                      setSettings(updatedSettings)
                    }}
                    placeholder="https://streamable.com/e/xltjoh?autoplay=1&muted=1&nocontrols=1"
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={() => {
                    const videoSetting = settings.find((s) => s.setting_key === "hero_video_url")
                    if (videoSetting) {
                      handleUpdateSetting("hero_video_url", videoSetting.setting_value)
                    }
                  }}
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update Video
                </Button>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Video Preview</h4>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={settings.find((s) => s.setting_key === "hero_video_url")?.setting_value || ""}
                      className="w-full h-full"
                      allow="autoplay; muted"
                      title="Hero Video Preview"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Room Modal */}
      <Dialog open={showRoomModal} onOpenChange={setShowRoomModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room-name-en">Name (English)</Label>
                <Input
                  id="room-name-en"
                  value={roomForm.name_en || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, name_en: e.target.value })}
                  placeholder="Royal Suite"
                />
              </div>
              <div>
                <Label htmlFor="room-name-ar">Name (Arabic)</Label>
                <Input
                  id="room-name-ar"
                  value={roomForm.name_ar || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, name_ar: e.target.value })}
                  placeholder="الجناح الملكي"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="room-type">Type</Label>
                <Input
                  id="room-type"
                  value={roomForm.type || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                  placeholder="royal"
                />
              </div>
              <div>
                <Label htmlFor="room-price">Price per Night ($)</Label>
                <Input
                  id="room-price"
                  type="number"
                  value={roomForm.price_per_night || 0}
                  onChange={(e) => setRoomForm({ ...roomForm, price_per_night: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="room-guests">Max Guests</Label>
                <Input
                  id="room-guests"
                  type="number"
                  value={roomForm.max_guests || 2}
                  onChange={(e) => setRoomForm({ ...roomForm, max_guests: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room-size">Size (sqm)</Label>
                <Input
                  id="room-size"
                  type="number"
                  value={roomForm.size_sqm || 0}
                  onChange={(e) => setRoomForm({ ...roomForm, size_sqm: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="room-view">View Type</Label>
                <Input
                  id="room-view"
                  value={roomForm.view_type || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, view_type: e.target.value })}
                  placeholder="city, garden, pool"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room-desc-en">Description (English)</Label>
                <Textarea
                  id="room-desc-en"
                  value={roomForm.description_en || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, description_en: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="room-desc-ar">Description (Arabic)</Label>
                <Textarea
                  id="room-desc-ar"
                  value={roomForm.description_ar || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, description_ar: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room-about-en">About (English)</Label>
                <Textarea
                  id="room-about-en"
                  value={roomForm.about_en || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, about_en: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="room-about-ar">About (Arabic)</Label>
                <Textarea
                  id="room-about-ar"
                  value={roomForm.about_ar || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, about_ar: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Features (English)</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add feature in English"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addFeature("room", "en", e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addFeature("room", "en", input.value)
                        input.value = ""
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {roomForm.features_en?.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature("room", "en", idx)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label>Features (Arabic)</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add feature in Arabic"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addFeature("room", "ar", e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addFeature("room", "ar", input.value)
                        input.value = ""
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {roomForm.features_ar?.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature("room", "ar", idx)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={roomForm.is_active}
                onCheckedChange={(checked) => setRoomForm({ ...roomForm, is_active: checked })}
              />
              <Label>Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRoomModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRoom} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingRoom ? "Update Room" : "Create Room"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Apartment Modal */}
      <Dialog open={showApartmentModal} onOpenChange={setShowApartmentModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingApartment ? "Edit Apartment" : "Add New Apartment"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="apt-name-en">Name (English)</Label>
                <Input
                  id="apt-name-en"
                  value={apartmentForm.name_en || ""}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, name_en: e.target.value })}
                  placeholder="Deluxe Apartment"
                />
              </div>
              <div>
                <Label htmlFor="apt-name-ar">Name (Arabic)</Label>
                <Input
                  id="apt-name-ar"
                  value={apartmentForm.name_ar || ""}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, name_ar: e.target.value })}
                  placeholder="الشقة الفاخرة"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="apt-type">Type</Label>
                <Input
                  id="apt-type"
                  value={apartmentForm.type || ""}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, type: e.target.value })}
                  placeholder="deluxe"
                />
              </div>
              <div>
                <Label htmlFor="apt-price">Price per Night ($)</Label>
                <Input
                  id="apt-price"
                  type="number"
                  value={apartmentForm.price_per_night || 0}
                  onChange={(e) =>
                    setApartmentForm({ ...apartmentForm, price_per_night: Number.parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="apt-bedrooms">Bedrooms</Label>
                <Input
                  id="apt-bedrooms"
                  type="number"
                  value={apartmentForm.bedrooms || 1}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, bedrooms: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="apt-bathrooms">Bathrooms</Label>
                <Input
                  id="apt-bathrooms"
                  type="number"
                  value={apartmentForm.bathrooms || 1}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, bathrooms: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="apt-guests">Max Guests</Label>
                <Input
                  id="apt-guests"
                  type="number"
                  value={apartmentForm.max_guests || 4}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, max_guests: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="apt-size">Size (sqm)</Label>
                <Input
                  id="apt-size"
                  type="number"
                  value={apartmentForm.size_sqm || 0}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, size_sqm: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="apt-view">View Type</Label>
                <Input
                  id="apt-view"
                  value={apartmentForm.view_type || ""}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, view_type: e.target.value })}
                  placeholder="city, garden, panoramic"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="apt-desc-en">Description (English)</Label>
                <Textarea
                  id="apt-desc-en"
                  value={apartmentForm.description_en || ""}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, description_en: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="apt-desc-ar">Description (Arabic)</Label>
                <Textarea
                  id="apt-desc-ar"
                  value={apartmentForm.description_ar || ""}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, description_ar: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="apt-about-en">About (English)</Label>
                <Textarea
                  id="apt-about-en"
                  value={apartmentForm.about_en || ""}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, about_en: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="apt-about-ar">About (Arabic)</Label>
                <Textarea
                  id="apt-about-ar"
                  value={apartmentForm.about_ar || ""}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, about_ar: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Features (English)</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add feature in English"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addFeature("apartment", "en", e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addFeature("apartment", "en", input.value)
                        input.value = ""
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {apartmentForm.features_en?.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature("apartment", "en", idx)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label>Features (Arabic)</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add feature in Arabic"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addFeature("apartment", "ar", e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addFeature("apartment", "ar", input.value)
                        input.value = ""
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {apartmentForm.features_ar?.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature("apartment", "ar", idx)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={apartmentForm.is_active}
                onCheckedChange={(checked) => setApartmentForm({ ...apartmentForm, is_active: checked })}
              />
              <Label>Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowApartmentModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveApartment} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingApartment ? "Update Apartment" : "Create Apartment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hall Modal */}
      <Dialog open={showHallModal} onOpenChange={setShowHallModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHall ? "Edit Hall" : "Add New Hall"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hall-name-en">Name (English)</Label>
                <Input
                  id="hall-name-en"
                  value={hallForm.name_en || ""}
                  onChange={(e) => setHallForm({ ...hallForm, name_en: e.target.value })}
                  placeholder="Al-Masla Hall"
                />
              </div>
              <div>
                <Label htmlFor="hall-name-ar">Name (Arabic)</Label>
                <Input
                  id="hall-name-ar"
                  value={hallForm.name_ar || ""}
                  onChange={(e) => setHallForm({ ...hallForm, name_ar: e.target.value })}
                  placeholder="قاعة المسلة"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="hall-type">Type</Label>
                <Input
                  id="hall-type"
                  value={hallForm.type || ""}
                  onChange={(e) => setHallForm({ ...hallForm, type: e.target.value })}
                  placeholder="almasla"
                />
              </div>
              <div>
                <Label htmlFor="hall-capacity">Capacity</Label>
                <Input
                  id="hall-capacity"
                  type="number"
                  value={hallForm.capacity || 50}
                  onChange={(e) => setHallForm({ ...hallForm, capacity: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="hall-price">Price per Hour ($)</Label>
                <Input
                  id="hall-price"
                  type="number"
                  value={hallForm.price_per_hour || 0}
                  onChange={(e) => setHallForm({ ...hallForm, price_per_hour: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="hall-size">Size (sqm)</Label>
                <Input
                  id="hall-size"
                  type="number"
                  value={hallForm.size_sqm || 0}
                  onChange={(e) => setHallForm({ ...hallForm, size_sqm: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hall-desc-en">Description (English)</Label>
                <Textarea
                  id="hall-desc-en"
                  value={hallForm.description_en || ""}
                  onChange={(e) => setHallForm({ ...hallForm, description_en: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="hall-desc-ar">Description (Arabic)</Label>
                <Textarea
                  id="hall-desc-ar"
                  value={hallForm.description_ar || ""}
                  onChange={(e) => setHallForm({ ...hallForm, description_ar: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hall-about-en">About (English)</Label>
                <Textarea
                  id="hall-about-en"
                  value={hallForm.about_en || ""}
                  onChange={(e) => setHallForm({ ...hallForm, about_en: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="hall-about-ar">About (Arabic)</Label>
                <Textarea
                  id="hall-about-ar"
                  value={hallForm.about_ar || ""}
                  onChange={(e) => setHallForm({ ...hallForm, about_ar: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Features (English)</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add feature in English"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addFeature("hall", "en", e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addFeature("hall", "en", input.value)
                        input.value = ""
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hallForm.features_en?.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature("hall", "en", idx)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label>Features (Arabic)</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add feature in Arabic"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addFeature("hall", "ar", e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addFeature("hall", "ar", input.value)
                        input.value = ""
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hallForm.features_ar?.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature("hall", "ar", idx)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={hallForm.is_active}
                onCheckedChange={(checked) => setHallForm({ ...hallForm, is_active: checked })}
              />
              <Label>Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowHallModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveHall} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingHall ? "Update Hall" : "Create Hall"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Management Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Images - {selectedEntity?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Add New Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input id="image-url" placeholder="https://example.com/image.jpg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alt-text-en">Alt Text (English)</Label>
                    <Input id="alt-text-en" placeholder="Room interior view" />
                  </div>
                  <div>
                    <Label htmlFor="alt-text-ar">Alt Text (Arabic)</Label>
                    <Input id="alt-text-ar" placeholder="منظر داخلي للغرفة" />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    const urlInput = document.getElementById("image-url") as HTMLInputElement
                    const altEnInput = document.getElementById("alt-text-en") as HTMLInputElement
                    const altArInput = document.getElementById("alt-text-ar") as HTMLInputElement

                    if (urlInput.value) {
                      handleAddImage(urlInput.value, altEnInput.value, altArInput.value)
                      urlInput.value = ""
                      altEnInput.value = ""
                      altArInput.value = ""
                    }
                  }}
                  disabled={loading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </CardContent>
            </Card>

            {/* Existing Images */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Current Images</h3>
              {images.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No images uploaded yet</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={image.image_url || "/placeholder.svg"}
                          alt={image.alt_text_en || "Image"}
                          className="w-full h-32 object-cover"
                        />
                        {image.is_primary && <Badge className="absolute top-2 left-2 bg-green-600">Primary</Badge>}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <CardContent className="p-3">
                        <p className="text-xs text-gray-600 truncate">{image.alt_text_en || "No description"}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
