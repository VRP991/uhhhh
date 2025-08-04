"use client"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-beige-light via-white to-brand-beige-medium flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}

          <img src="/images/logo-new.png" alt="World Heart Hotel" className="w-24 h-24 mx-auto mb-6 brand-glow" />
        </div>
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-brand-accent-black mb-4 animate-bounce">404</h1>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-2xl text-brand-gray-dark">Page Not Found</span>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12 brand-fade-in">
          <h2 className="text-3xl font-bold text-brand-gray-dark mb-4">Oops! This page seems to have checked out</h2>
          <h3 className="text-2xl font-bold text-brand-gray-dark mb-6">عذراً! يبدو أن هذه الصفحة قد غادرت</h3>
          <p className="text-xl text-brand-gray-medium mb-4 leading-relaxed">
            The page you're looking for might have been moved, deleted, or never existed.
          </p>
          <p className="text-xl text-brand-gray-medium mb-8 leading-relaxed">
            الصفحة التي تبحث عنها قد تكون نُقلت أو حُذفت أو لم تكن موجودة أصلاً.
          </p>
        </div>

        {/* Elegant Decoration */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-px bg-brand-accent-black"></div>
            <div className="w-4 h-4 bg-brand-accent-black rounded-full animate-pulse"></div>
            <div className="w-16 h-px bg-brand-accent-black"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center brand-fade-in delay-600">
          <Link href="/">
            <Button className="brand-button-primary px-8 py-4 text-lg font-semibold rounded-full flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Back to Home | العودة للرئيسية
            </Button>
          </Link>
          <Button
            onClick={() => window.history.back()}
            className="brand-button-secondary px-8 py-4 text-lg font-semibold rounded-full flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back | العودة
          </Button>
        </div>

        {/* Hotel Info */}
        <div className="mt-16 p-8 bg-white/80 rounded-2xl shadow-lg brand-fade-in delay-800">
          <h3 className="text-2xl font-bold text-brand-gray-dark mb-4">World Heart Hotel | فندق قلب العالم</h3>
          <p className="text-brand-gray-medium mb-4">Where the Elite Belong | حيث تنتمي النخبة</p>
          <div className="flex items-center justify-center space-x-6 text-brand-gray-medium">
            <span>📞 +9647878666660</span>
            <span>✉️ info@whh.iq</span>
          </div>
        </div>
      </div>
  )
}
