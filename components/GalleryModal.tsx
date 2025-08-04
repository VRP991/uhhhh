"use client"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
}

export function GalleryModal({ isOpen, onClose, images }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-black border-none overflow-hidden">
        <div className="relative w-full h-full">
          {/* Close Button */}
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            size="sm"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Main Image Container */}
          <div className="relative h-[70vh] flex items-center justify-center bg-black">
            <img
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Gallery ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Navigation Arrows */}
            <Button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-brand-beige-light/20 hover:bg-brand-beige-light/40 text-white rounded-full p-3 backdrop-blur-sm"
              disabled={images.length <= 1}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-brand-beige-light/20 hover:bg-brand-beige-light/40 text-white rounded-full p-3 backdrop-blur-sm"
              disabled={images.length <= 1}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Thumbnail Strip */}
          <div className="bg-gradient-to-t from-black to-black/80 p-4">
            <div className="flex space-x-3 overflow-x-auto justify-center pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    index === currentIndex
                      ? "border-brand-accent-black scale-110 shadow-lg"
                      : "border-transparent hover:border-brand-beige-light/50 hover:scale-105"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-brand-beige-light/20 text-white px-6 py-2 rounded-full backdrop-blur-sm">
            <span className="font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
