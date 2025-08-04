"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Globe,
  Award,
  Shield,
  Heart,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useScrollLockedVideo } from "@/hooks/useScrollLockedVideo"
import { BookingModal } from "@/components/BookingModal"
import { LoadingAnimation } from "@/components/LoadingAnimation"
import { GalleryModal } from "@/components/GalleryModal"
import {
  getPublicRooms,
  getPublicApartments,
  getPublicHalls,
  getPublicSiteSettings,
  getPrimaryImage,
  getAllImages,
  type Room,
  type Apartment,
  type Hall,
} from "@/lib/supabase"

export default function WorldHeartHotel() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<"ar" | "en">("en")
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [contactLoading, setContactLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [expandedRooms, setExpandedRooms] = useState<{ [key: string]: boolean }>({})
  const [expandedApartments, setExpandedApartments] = useState<{ [key: string]: boolean }>({})
  const [expandedHalls, setExpandedHalls] = useState<{ [key: string]: boolean }>({})

  // Dynamic data states
  const [rooms, setRooms] = useState<Room[]>([])
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [halls, setHalls] = useState<Hall[]>([])
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({})
  const [dataLoading, setDataLoading] = useState(true)

  // Initialize scroll-locked video
  const { videoRef, iframeRef, isVideoMode, videoProgress, isVideoLoaded, handleVideoLoaded, resetVideo } =
    useScrollLockedVideo({
      playbackSpeed: 1,
      scrollSensitivity: 1.5,
      minScrollDelta: 1,
      enableEasing: true,
    })

  // Load dynamic data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true)
        const [roomsData, apartmentsData, hallsData, settingsData] = await Promise.all([
          getPublicRooms(),
          getPublicApartments(),
          getPublicHalls(),
          getPublicSiteSettings(),
        ])

        setRooms(roomsData)
        setApartments(apartmentsData)
        setHalls(hallsData)
        setSiteSettings(settingsData)

        console.log("Loaded data:", {
          rooms: roomsData.length,
          apartments: apartmentsData.length,
          halls: hallsData.length,
          settings: Object.keys(settingsData).length,
        })
      } catch (error) {
        console.error("Error loading dynamic data:", error)
      } finally {
        setDataLoading(false)
      }
    }

    loadData()
  }, [])

  const scrollToSection = (sectionId: string) => {
    if (isVideoMode) return
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === "ar" ? "en" : "ar"))
  }

  const handleBookRoom = (roomType: string) => {
    setSelectedRoom(roomType)
    setIsBookingOpen(true)
  }

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setContactLoading(true)

    const formData = new FormData(e.currentTarget)
    const contactData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })

      if (response.ok) {
        alert(currentLang === "ar" ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!")
        e.currentTarget.reset()
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Contact error:", error)
      alert(currentLang === "ar" ? "فشل في إرسال الرسالة" : "Failed to send message")
    } finally {
      setContactLoading(false)
    }
  }

  const openGallery = (images: string[]) => {
    setGalleryImages(images)
    setIsGalleryOpen(true)
  }

  const toggleRoomGallery = (roomId: string) => {
    setExpandedRooms((prev) => ({ ...prev, [roomId]: !prev[roomId] }))
  }

  const toggleApartmentGallery = (apartmentId: string) => {
    setExpandedApartments((prev) => ({ ...prev, [apartmentId]: !prev[apartmentId] }))
  }

  const toggleHallGallery = (hallId: string) => {
    setExpandedHalls((prev) => ({ ...prev, [hallId]: !prev[hallId] }))
  }

  // Get dynamic content with fallbacks
  const getHeroVideoUrl = () => {
    return siteSettings.hero_video_url || "https://streamable.com/e/xltjoh?autoplay=1&muted=1&nocontrols=1"
  }

  const getHotelName = (lang: "ar" | "en") => {
    return lang === "ar"
      ? siteSettings.hotel_name_ar || "فندق قلب العالم"
      : siteSettings.hotel_name_en || "World Heart Hotel"
  }

  const getHotelTagline = (lang: "ar" | "en") => {
    return lang === "ar"
      ? siteSettings.hotel_tagline_ar || "حيث تنتمي النخبة"
      : siteSettings.hotel_tagline_en || "Where the Elite Belong"
  }

  const getContactInfo = () => {
    return {
      phone: siteSettings.hotel_phone_main || "+9640781234567811",
      phoneSecondary: siteSettings.hotel_phone_secondary || "7377",
      email: siteSettings.hotel_email_main || "info@whh.iq",
      address:
        currentLang === "ar"
          ? siteSettings.hotel_address_ar || "شارع الكندي، القادسية، بغداد، العراق"
          : siteSettings.hotel_address_en || "Al-Kindi Street, Qadisiyah, Baghdad, Iraq",
    }
  }

  const content = {
    en: {
      siteName: getHotelName("en"),
      nav: {
        home: "Home",
        about: "About",
        rooms: "Rooms",
        apartments: "Apartments",
        halls: "Halls",
        cafes: "Cafes & Restaurants",
        contact: "Contact",
      },
      hero: {
        title: getHotelName("en"),
        subtitle: getHotelTagline("en"),
        description: "Experience unparalleled comfort in the heart of Baghdad's prestigious Qadisiyah district",
        bookNow: "Reserve Your Stay",
        discover: "Explore Our World",
      },
      rooms: {
        title: "Luxury Accommodations",
        viewGallery: "View Gallery",
        hideGallery: "Hide Gallery",
      },
      apartments: {
        title: "Luxury Apartments",
        subtitle: "Spacious apartments for extended stays",
        viewGallery: "View Gallery",
        hideGallery: "Hide Gallery",
      },
      halls: {
        title: "Event Halls",
        subtitle: "Perfect venues for your special occasions",
        viewGallery: "View Gallery",
        hideGallery: "Hide Gallery",
      },
      services: {
        title: "Premium Hotel Services",
        subtitle: "Discover our comprehensive range of world-class amenities and services",
        items: [
          { title: "High-Speed WiFi", desc: "Complimentary internet throughout the property" },
          { title: "Valet Parking", desc: "Secure parking with professional valet service" },
          { title: "24/7 Café Lounge", desc: "Authentic Iraqi coffee and international beverages" },
          { title: "Fine Dining", desc: "Exquisite Iraqi and international cuisine" },
          { title: "Fitness Center", desc: "State-of-the-art equipment and personal training" },
          { title: "Wellness Spa", desc: "Rejuvenating treatments and relaxation therapies" },
        ],
      },
      about: {
        title: "About World Heart Hotel",
        story: "Our Heritage",
        mission: "Our Mission",
        vision: "Our Vision",
        gallery: "Our Gallery",
        storyText:
          "Nestled in Baghdad's prestigious Qadisiyah district, World Heart Hotel stands as a beacon of luxury and authentic Iraqi hospitality. Since our establishment in 2010, we have been dedicated to creating unforgettable experiences for discerning travelers.",
        missionText:
          "To provide exceptional hospitality experiences that celebrate Iraqi culture while meeting international luxury standards, ensuring every guest feels welcomed, valued, and inspired.",
        visionText:
          "To be recognized as the premier luxury hotel in Iraq, setting new standards for hospitality excellence and cultural authenticity in the region.",
        stats: [
          { number: "150+", label: "Luxury Rooms & Suites" },
          { number: "15+", label: "Years of Excellence" },
          { number: "8000+", label: "Satisfied Guests" },
          { number: "50+", label: "Dedicated Staff" },
        ],
        viewGallery: "View Full Gallery",
      },
      cafes: {
        title: "Dining Excellence",
        allDayDining: {
          title: "All Day Dining",
          subtitle: "Fine dining experience with Iraqi and international cuisine",
        },
        lotusCafe: {
          title: "Lotus Café",
          subtitle: "Relaxing atmosphere with premium coffee and light meals",
        },
      },
      contact: {
        title: "Get In Touch",
        subtitle: "Our dedicated team is available 24/7 to assist with your inquiries and reservations",
        phone: "Phone",
        email: "Email",
        address: "Address",
        form: {
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email Address",
          phone: "Phone Number",
          message: "Your Message",
          send: "Send Message",
        },
      },
      footer: {
        description: "Luxury hospitality in the heart of Baghdad, where tradition meets modern elegance",
        quickLinks: "Quick Links",
        services: "Our Services",
        servicesList: ["Room Reservations", "Event Planning", "Concierge Services", "Spa & Wellness"],
        contactUs: "Contact Information",
        copyright: "All Rights Reserved",
      },
    },
    ar: {
      siteName: getHotelName("ar"),
      nav: {
        home: "الرئيسية",
        about: "عن الفندق",
        rooms: "الغرف",
        apartments: "الشقق",
        halls: "القاعات",
        cafes: "المقاهي والمطاعم",
        contact: "اتصل بنا",
      },
      hero: {
        title: getHotelName("ar"),
        subtitle: getHotelTagline("ar"),
        description: "استمتع بتجربة راحة لا مثيل لها في قلب منطقة القادسية المرموقة في بغداد",
        bookNow: "احجز إقامتك",
        discover: "اكتشف عالمنا",
      },
      rooms: {
        title: "أجنحة فاخرة",
        viewGallery: "عرض المعرض",
        hideGallery: "إخفاء المعرض",
      },
      apartments: {
        title: "شقق فاخرة",
        subtitle: "شقق واسعة للإقامات الطويلة",
        viewGallery: "عرض المعرض",
        hideGallery: "إخفاء المعرض",
      },
      halls: {
        title: "قاعات الفعاليات",
        subtitle: "أماكن مثالية لمناسباتك الخاصة",
        viewGallery: "عرض المعرض",
        hideGallery: "إخفاء المعرض",
      },
      services: {
        title: "خدمات الفندق المميزة",
        subtitle: "اكتشف مجموعتنا الشاملة من المرافق والخدمات عالمية المستوى",
        items: [
          { title: "واي فاي عالي السرعة", desc: "إنترنت مجاني في جميع أنحاء الفندق" },
          { title: "خدمة صف السيارات", desc: "موقف آمن مع خدمة صف احترافية" },
          { title: "صالة مقهى 24/7", desc: "قهوة عراقية أصيلة ومشروبات عالمية" },
          { title: "مطعم فاخر", desc: "مأكولات عراقية وعالمية رائعة" },
          { title: "مركز اللياقة", desc: "معدات حديثة وتدريب شخصي" },
          { title: "سبا العافية", desc: "علاجات منعشة وعلاجات استرخاء" },
        ],
      },
      about: {
        title: "عن فندق قلب العالم",
        story: "تراثنا",
        mission: "رسالتنا",
        vision: "رؤيتنا",
        gallery: "معرض الصور",
        storyText:
          "يقع فندق قلب العالم في منطقة القادسية المرموقة في بغداد، ويقف كمنارة للفخامة والضيافة العراقية الأصيلة. منذ تأسيسنا في عام 2010، كرسنا جهودنا لخلق تجارب لا تُنسى للمسافرين المميزين.",
        missionText:
          "تقديم تجارب ضيافة استثنائية تحتفي بالثقافة العراقية مع تلبية معايير الفخامة العالمية، مما يضمن شعور كل ضيف بالترحيب والتقدير والإلهام.",
        visionText:
          "أن نكون معترف بنا كالفندق الفاخر الرائد في العراق، ونضع معايير جديدة للتميز في الضيافة والأصالة الثقافية في المنطقة.",
        stats: [
          { number: "150+", label: "غرفة وجناح فاخر" },
          { number: "15+", label: "سنة من التميز" },
          { number: "8000+", label: "ضيف راضٍ" },
          { number: "50+", label: "موظف مخلص" },
        ],
        viewGallery: "عرض المعرض الكامل",
      },
      cafes: {
        title: "تميز الطعام",
        allDayDining: {
          title: "تناول الطعام طوال اليوم",
          subtitle: "تجربة طعام راقية مع المأكولات العراقية والعالمية",
        },
        lotusCafe: {
          title: "مقهى لوتس",
          subtitle: "أجواء مريحة مع قهوة مميزة ووجبات خفيفة",
        },
      },
      contact: {
        title: "تواصل معنا",
        subtitle: "فريقنا المخصص متاح على مدار الساعة للمساعدة في استفساراتك وحجوزاتك",
        phone: "الهاتف",
        email: "البريد الإلكتروني",
        address: "العنوان",
        form: {
          firstName: "الاسم الأول",
          lastName: "الاسم الأخير",
          email: "عنوان البريد الإلكتروني",
          phone: "رقم الهاتف",
          message: "رسالتك",
          send: "إرسال الرسالة",
        },
      },
      footer: {
        description: "ضيافة فاخرة في قلب بغداد، حيث يلتقي التقليد بالأناقة الحديثة",
        quickLinks: "روابط سريعة",
        services: "خدماتنا",
        servicesList: ["حجز الغرف", "تخطيط الفعاليات", "خدمات الكونسيرج", "السبا والعافية"],
        contactUs: "معلومات الاتصال",
        copyright: "جميع الحقوق محفوظة",
      },
    },
  }

  const t = content[currentLang]
  const contactInfo = getContactInfo()

  // Show loading animation initially
  if (isLoading) {
    return <LoadingAnimation onComplete={() => setIsLoading(false)} />
  }

  return (
    <div
      className={`min-h-screen bg-white text-brand-gray-dark font-['Cairo',sans-serif] ${
        currentLang === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isVideoMode ? "opacity-0 pointer-events-none" : "opacity-100"
        } brand-nav shadow-lg`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="brand-logo-container">
            <img src="/images/logo-new.png" alt="World Heart Hotel Logo" className="brand-logo" />
            <div className="text-xl font-bold text-brand-gray-dark">{t.siteName}</div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8 rtl:space-x-reverse">
            {Object.entries(t.nav).map(([key, value]) => (
              <button
                key={key}
                onClick={() => scrollToSection(key === "home" ? "home" : key)}
                className="brand-nav-link"
              >
                {value}
              </button>
            ))}
          </div>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-full bg-brand-beige-light hover:bg-brand-beige-medium transition-colors"
            >
              <Globe size={16} className="text-brand-gray-dark" />
              <span className="text-sm font-medium text-brand-gray-dark">{currentLang === "ar" ? "EN" : "AR"}</span>
            </button>

            <button className="lg:hidden text-brand-gray-dark" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t-2 border-brand-beige-light shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {Object.entries(t.nav).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => scrollToSection(key === "home" ? "home" : key)}
                  className="block w-full text-left brand-nav-link"
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Dynamic Video */}
      <section id="home" className="relative h-screen overflow-hidden">
        {/* Video Container */}
        <div className="absolute inset-0">
          <div style={{ position: "relative", width: "100%", height: "100%", paddingBottom: "56.250%" }}>
            <iframe
              ref={iframeRef}
              allow="fullscreen;autoplay"
              allowFullScreen
              height="100%"
              src={getHeroVideoUrl()}
              width="100%"
              style={{
                border: "none",
                width: "100%",
                height: "100%",
                position: "absolute",
                left: "0px",
                top: "0px",
                overflow: "hidden",
                objectFit: "cover",
                transform: "scale(1.1)",
              }}
              title="World Heart Hotel - Luxury Experience"
            />
          </div>
        </div>

        {/* Fallback Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={handleVideoLoaded}
          style={{ display: "none" }}
        >
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          />
        </video>

        {/* Hero Overlay */}
        <div className={`absolute inset-0 brand-hero-overlay`}>
          <div className="absolute inset-0 flex items-center justify-center text-center text-white">
            <div className="max-w-6xl mx-auto px-4 brand-fade-in">
              <div className="mb-8 brand-float">
                <img src="/images/logo-new.png" alt="World Heart Hotel" className="w-24 h-24 mx-auto mb-6 brand-glow" />
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-white via-brand-beige-light to-white bg-clip-text text-transparent">
                  {t.hero.title}
                </span>
              </h1>

              <p className="text-2xl md:text-3xl mb-4 font-light text-brand-beige-light">{t.hero.subtitle}</p>

              <p className="text-lg md:text-xl mb-12 opacity-90 max-w-3xl mx-auto">{t.hero.description}</p>

              {!isVideoMode && (
                <div className="space-y-4 md:space-y-0 md:space-x-6 rtl:md:space-x-reverse md:flex md:justify-center brand-fade-in delay-600">
                  <Button
                    onClick={() => handleBookRoom("")}
                    className="brand-button-primary px-12 py-4 text-xl font-semibold rounded-full"
                  >
                    {t.hero.bookNow}
                  </Button>
                  <Button
                    onClick={() => scrollToSection("about")}
                    className="brand-button-secondary px-12 py-4 text-xl font-semibold rounded-full"
                  >
                    {t.hero.discover}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={`transition-all duration-1000 ${isVideoMode ? "opacity-0" : "opacity-100"}`}>
        {/* About Section */}
        <section id="about" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 brand-slide-up">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-brand-gray-dark">{t.about.title}</h2>
              <div className="w-24 h-1 bg-brand-beige-light mx-auto mb-6"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 mb-20">
              <div className="text-center brand-slide-up">
                <div className="w-20 h-20 bg-brand-beige-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-10 h-10 text-brand-gray-dark" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-brand-gray-dark">{t.about.story}</h3>
                <p className="text-brand-gray-medium leading-relaxed">{t.about.storyText}</p>
              </div>

              <div className="text-center brand-slide-up delay-200">
                <div className="w-20 h-20 bg-brand-beige-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-10 h-10 text-brand-gray-dark" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-brand-gray-dark">{t.about.mission}</h3>
                <p className="text-brand-gray-medium leading-relaxed">{t.about.missionText}</p>
              </div>

              <div className="text-center brand-slide-up delay-400">
                <div className="w-20 h-20 bg-brand-beige-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="w-10 h-10 text-brand-gray-dark" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-brand-gray-dark">{t.about.vision}</h3>
                <p className="text-brand-gray-medium leading-relaxed">{t.about.visionText}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center mb-20">
              {t.about.stats.map((stat, index) => (
                <div key={index} className="brand-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="text-4xl md:text-5xl font-bold text-brand-beige-light mb-2">{stat.number}</div>
                  <div className="text-brand-gray-dark text-lg">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Enhanced Gallery Section in About */}
            <div className="text-center brand-slide-up">
              <h3 className="text-3xl font-bold mb-8 text-brand-gray-dark">{t.about.gallery}</h3>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-8 gallery-preview-container">
                <img
                  src="/placeholder.svg?height=500&width=800&text=Hotel Gallery Preview"
                  alt="Hotel Gallery"
                  className="w-full h-96 object-cover gallery-preview-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-dark/30 to-transparent gallery-overlay" />
              </div>
              <Button
                onClick={() =>
                  openGallery(
                    Array.from({ length: 12 }, (_, i) => `/placeholder.svg?height=400&width=600&text=Gallery ${i + 1}`),
                  )
                }
                className="brand-button-primary px-8 py-3 rounded-full gallery-button"
              >
                {t.about.viewGallery}
              </Button>
            </div>
          </div>
        </section>

        {/* Dynamic Rooms Section */}
        <section id="rooms" className="py-24 brand-gradient-primary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 brand-slide-up">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-brand-gray-dark">{t.rooms.title}</h2>
              <div className="w-24 h-1 bg-brand-beige-light mx-auto mb-6"></div>
            </div>

            {dataLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-10">
                {rooms.map((room, index) => (
                  <Card
                    key={room.id}
                    className="brand-card overflow-hidden shadow-xl brand-slide-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={getPrimaryImage(room.images) || "/placeholder.svg"}
                        alt={currentLang === "ar" ? room.name_ar : room.name_en}
                        className="w-full h-80 object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-dark/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-6 right-6 bg-brand-beige-light text-brand-gray-dark px-4 py-2 rounded-full font-bold text-lg">
                        ${room.price_per_night}/{currentLang === "ar" ? "ليلة" : "night"}
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <h3 className="text-3xl font-bold mb-6 text-brand-gray-dark">
                        {currentLang === "ar" ? room.name_ar : room.name_en}
                      </h3>

                      {room.description_en && (
                        <p className="text-brand-gray-medium mb-4">
                          {currentLang === "ar" ? room.description_ar : room.description_en}
                        </p>
                      )}

                      <ul className="space-y-3 mb-8">
                        {(currentLang === "ar" ? room.features_ar : room.features_en).map((feature, idx) => (
                          <li key={idx} className="flex items-center text-brand-gray-dark text-lg">
                            <span className="brand-circle"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Room Gallery Toggle */}
                      {room.images && room.images.length > 0 && (
                        <Button
                          onClick={() => toggleRoomGallery(room.id)}
                          className="w-full mb-4 brand-button-secondary py-3 text-lg font-semibold rounded-full flex items-center justify-center"
                        >
                          {expandedRooms[room.id] ? (
                            <>
                              <ChevronUp className="mr-2 h-4 w-4" />
                              {t.rooms.hideGallery}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="mr-2 h-4 w-4" />
                              {t.rooms.viewGallery}
                            </>
                          )}
                        </Button>
                      )}

                      {/* Room Gallery */}
                      {expandedRooms[room.id] && room.images && (
                        <div className="grid grid-cols-2 gap-2 mb-6 animate-slide-down">
                          {room.images.slice(0, 6).map((image, i) => (
                            <div key={i} className="relative overflow-hidden rounded-lg">
                              <img
                                src={image.image_url || "/placeholder.svg"}
                                alt={currentLang === "ar" ? image.alt_text_ar : image.alt_text_en}
                                className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                                onClick={() => openGallery(getAllImages(room.images))}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        onClick={() => handleBookRoom(room.type)}
                        className="w-full brand-button-primary py-4 text-lg font-semibold rounded-full"
                      >
                        {t.hero.bookNow}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Apartments Section */}
        <section id="apartments" className="py-24 brand-gradient-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white brand-slide-up">{t.apartments.title}</h2>
              <div className="w-24 h-1 bg-brand-beige-light mx-auto mb-6"></div>
              <p className="text-xl md:text-2xl text-brand-beige-light max-w-3xl mx-auto leading-relaxed brand-slide-up delay-300">
                {t.apartments.subtitle}
              </p>
            </div>

            {dataLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-10">
                {apartments.map((apartment, index) => (
                  <Card
                    key={apartment.id}
                    className="brand-card overflow-hidden shadow-2xl brand-slide-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={getPrimaryImage(apartment.images) || "/placeholder.svg"}
                        alt={currentLang === "ar" ? apartment.name_ar : apartment.name_en}
                        className="w-full h-80 object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute top-6 right-6 bg-brand-beige-light text-brand-gray-dark px-4 py-2 rounded-full font-bold text-lg">
                        ${apartment.price_per_night}/{currentLang === "ar" ? "ليلة" : "night"}
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <h3 className="text-3xl font-bold mb-6 text-brand-gray-dark">
                        {currentLang === "ar" ? apartment.name_ar : apartment.name_en}
                      </h3>

                      {apartment.description_en && (
                        <p className="text-brand-gray-medium mb-4">
                          {currentLang === "ar" ? apartment.description_ar : apartment.description_en}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-brand-gray-medium">
                        <div>Bedrooms: {apartment.bedrooms}</div>
                        <div>Bathrooms: {apartment.bathrooms}</div>
                        <div>Max Guests: {apartment.max_guests}</div>
                        <div>Size: {apartment.size_sqm} sqm</div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {(currentLang === "ar" ? apartment.features_ar : apartment.features_en).map((feature, idx) => (
                          <li key={idx} className="flex items-center text-brand-gray-dark text-lg">
                            <span className="brand-circle"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {apartment.images && apartment.images.length > 0 && (
                        <Button
                          onClick={() => toggleApartmentGallery(apartment.id)}
                          className="w-full mb-4 brand-button-secondary py-3 text-lg font-semibold rounded-full flex items-center justify-center"
                        >
                          {expandedApartments[apartment.id] ? (
                            <>
                              <ChevronUp className="mr-2 h-4 w-4" />
                              {t.apartments.hideGallery}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="mr-2 h-4 w-4" />
                              {t.apartments.viewGallery}
                            </>
                          )}
                        </Button>
                      )}

                      {expandedApartments[apartment.id] && apartment.images && (
                        <div className="grid grid-cols-2 gap-2 mb-6 animate-slide-down">
                          {apartment.images.slice(0, 6).map((image, i) => (
                            <div key={i} className="relative overflow-hidden rounded-lg">
                              <img
                                src={image.image_url || "/placeholder.svg"}
                                alt={currentLang === "ar" ? image.alt_text_ar : image.alt_text_en}
                                className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                                onClick={() => openGallery(getAllImages(apartment.images))}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        onClick={() => handleBookRoom(apartment.type)}
                        className="w-full brand-button-primary py-4 text-lg font-semibold rounded-full"
                      >
                        {t.hero.bookNow}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Halls Section */}
        <section id="halls" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 brand-slide-up">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-brand-gray-dark">{t.halls.title}</h2>
              <div className="w-24 h-1 bg-brand-beige-light mx-auto mb-6"></div>
              <p className="text-xl md:text-2xl text-brand-gray-medium max-w-3xl mx-auto leading-relaxed">
                {t.halls.subtitle}
              </p>
            </div>

            {dataLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {halls.map((hall, index) => (
                  <Card
                    key={hall.id}
                    className="brand-card overflow-hidden shadow-xl brand-slide-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={getPrimaryImage(hall.images) || "/placeholder.svg"}
                        alt={currentLang === "ar" ? hall.name_ar : hall.name_en}
                        className="w-full h-60 object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-brand-beige-light text-brand-gray-dark px-3 py-1 rounded-full font-bold text-sm">
                        ${hall.price_per_hour}/hr
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 text-brand-gray-dark text-center">
                        {currentLang === "ar" ? hall.name_ar : hall.name_en}
                      </h3>

                      <div className="text-center mb-4">
                        <p className="text-brand-gray-medium">Capacity: {hall.capacity} people</p>
                        {hall.size_sqm && <p className="text-brand-gray-medium">Size: {hall.size_sqm} sqm</p>}
                      </div>

                      {hall.images && hall.images.length > 0 && (
                        <Button
                          onClick={() => toggleHallGallery(hall.id)}
                          className="w-full mb-4 brand-button-secondary py-2 text-sm font-semibold rounded-full flex items-center justify-center"
                        >
                          {expandedHalls[hall.id] ? (
                            <>
                              <ChevronUp className="mr-2 h-3 w-3" />
                              {t.halls.hideGallery}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="mr-2 h-3 w-3" />
                              {t.halls.viewGallery}
                            </>
                          )}
                        </Button>
                      )}

                      {expandedHalls[hall.id] && hall.images && (
                        <div className="grid grid-cols-2 gap-2 animate-slide-down">
                          {hall.images.slice(0, 4).map((image, i) => (
                            <div key={i} className="relative overflow-hidden rounded-lg">
                              <img
                                src={image.image_url || "/placeholder.svg"}
                                alt={currentLang === "ar" ? image.alt_text_ar : image.alt_text_en}
                                className="w-full h-24 object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                                onClick={() => openGallery(getAllImages(hall.images))}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Cafes & Restaurants Section */}
        <section id="cafes" className="py-24 brand-gradient-primary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 brand-slide-up">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-brand-gray-dark">{t.cafes.title}</h2>
              <div className="w-24 h-1 bg-brand-beige-light mx-auto mb-6"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 relative">
              {/* All Day Dining */}
              <div className="brand-slide-up">
                <Card className="brand-card overflow-hidden shadow-2xl">
                  <div className="relative overflow-hidden">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=All Day Dining"
                      alt="All Day Dining"
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-dark/70 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-3xl font-bold mb-2">{t.cafes.allDayDining.title}</h3>
                      <div className="w-16 h-1 bg-brand-beige-light mb-2"></div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <p className="text-brand-gray-medium text-lg leading-relaxed">{t.cafes.allDayDining.subtitle}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Divider Line */}
              <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-64 bg-brand-beige-light"></div>

              {/* Lotus Café */}
              <div className="brand-slide-up delay-300">
                <Card className="brand-card overflow-hidden shadow-2xl">
                  <div className="relative overflow-hidden">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Lotus Café"
                      alt="Lotus Café"
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-dark/70 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-3xl font-bold mb-2">{t.cafes.lotusCafe.title}</h3>
                      <div className="w-16 h-1 bg-brand-beige-light mb-2"></div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <p className="text-brand-gray-medium text-lg leading-relaxed">{t.cafes.lotusCafe.subtitle}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section with Dynamic Data */}
        <section id="contact" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 brand-slide-up">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-brand-gray-dark">{t.contact.title}</h2>
              <div className="w-24 h-1 bg-brand-beige-light mx-auto mb-6"></div>
              <p className="text-xl md:text-2xl text-brand-gray-medium max-w-3xl mx-auto leading-relaxed">
                {t.contact.subtitle}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              <div className="brand-slide-up">
                <div className="space-y-10">
                  <div className="flex items-center space-x-6 rtl:space-x-reverse group">
                    <div className="w-16 h-16 bg-brand-beige-light rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Phone className="w-8 h-8 text-brand-gray-dark" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-2 text-brand-gray-dark">{t.contact.phone}</h3>
                      <p className="text-brand-gray-medium text-lg">{contactInfo.phone}</p>
                      <p className="text-brand-gray-medium text-lg">{contactInfo.phoneSecondary}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 rtl:space-x-reverse group">
                    <div className="w-16 h-16 bg-brand-beige-light rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Mail className="w-8 h-8 text-brand-gray-dark" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-2 text-brand-gray-dark">{t.contact.email}</h3>
                      <p className="text-brand-gray-medium text-lg">{contactInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 rtl:space-x-reverse group">
                    <div className="w-16 h-16 bg-brand-beige-light rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <MapPin className="w-8 h-8 text-brand-gray-dark" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-2 text-brand-gray-dark">{t.contact.address}</h3>
                      <p className="text-brand-gray-medium text-lg">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="brand-card p-8 shadow-2xl brand-slide-up delay-300">
                <CardContent className="space-y-6">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        name="firstName"
                        placeholder={t.contact.form.firstName}
                        className="brand-input py-4 text-lg"
                        required
                      />
                      <Input
                        name="lastName"
                        placeholder={t.contact.form.lastName}
                        className="brand-input py-4 text-lg"
                        required
                      />
                    </div>
                    <Input
                      name="email"
                      placeholder={t.contact.form.email}
                      type="email"
                      className="brand-input py-4 text-lg"
                      required
                    />
                    <Input
                      name="phone"
                      placeholder={t.contact.form.phone}
                      className="brand-input py-4 text-lg"
                      required
                    />
                    <Textarea
                      name="message"
                      placeholder={t.contact.form.message}
                      rows={5}
                      className="brand-input text-lg"
                      required
                    />
                    <Button
                      type="submit"
                      className="w-full brand-button-primary py-4 text-lg font-semibold rounded-full"
                      disabled={contactLoading}
                    >
                      {contactLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {t.contact.form.send}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer with Dynamic Data */}
        <footer className="brand-gradient-secondary text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-12">
              <div className="brand-fade-in">
                <div className="brand-logo-container mb-6">
                  <img src="/images/logo-new.png" alt="World Heart Hotel Logo" className="brand-logo" />
                  <h3 className="text-2xl font-bold text-white">{t.siteName}</h3>
                </div>
                <p className="text-brand-beige-light text-lg leading-relaxed">{t.footer.description}</p>
              </div>

              <div className="brand-fade-in delay-200">
                <h4 className="font-bold text-xl mb-6 text-brand-beige-light">{t.footer.quickLinks}</h4>
                <ul className="space-y-3 text-brand-beige-light">
                  {Object.entries(t.nav).map(([key, value]) => (
                    <li key={key}>
                      <button
                        onClick={() => scrollToSection(key === "home" ? "home" : key)}
                        className="hover:text-white transition-colors text-lg hover:translate-x-1 rtl:hover:-translate-x-1 transform duration-200"
                      >
                        <span className="brand-circle mr-2"></span>
                        {value}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="brand-fade-in delay-400">
                <h4 className="font-bold text-xl mb-6 text-brand-beige-light">{t.footer.services}</h4>
                <ul className="space-y-3 text-brand-beige-light text-lg">
                  {t.footer.servicesList.map((service, index) => (
                    <li key={index} className="flex items-center">
                      <span className="brand-circle mr-2"></span>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="brand-fade-in delay-600">
                <h4 className="font-bold text-xl mb-6 text-brand-beige-light">{t.footer.contactUs}</h4>
                <div className="space-y-3 text-brand-beige-light text-lg">
                  <p className="flex items-center">
                    <span className="brand-circle mr-2"></span>
                    {contactInfo.phone}
                  </p>
                  <p className="flex items-center">
                    <span className="brand-circle mr-2"></span>
                    {contactInfo.phoneSecondary}
                  </p>
                  <p className="flex items-center">
                    <span className="brand-circle mr-2"></span>
                    {contactInfo.email}
                  </p>
                  <p className="flex items-center">
                    <span className="brand-circle mr-2"></span>
                    {contactInfo.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="brand-divider"></div>

            <div className="text-center text-brand-beige-light">
              <p className="text-lg">
                &copy; 2025 Ahmed Ali, {t.siteName}. {t.footer.copyright}
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedRoom={selectedRoom}
        currentLang={currentLang}
      />

      <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} images={galleryImages} />
    </div>
  )
}
