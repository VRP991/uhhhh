"use client"

import { useEffect, useRef, useState, useCallback } from "react"

// Declare YouTube API types
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface UseScrollLockedVideoOptions {
  // Video playback speed multiplier (1 = normal, 2 = 2x faster, 0.5 = half speed)
  playbackSpeed?: number
  // Scroll sensitivity (higher = more sensitive to scroll)
  scrollSensitivity?: number
  // Minimum scroll delta to trigger video progress
  minScrollDelta?: number
  // Enable smooth easing for video progress
  enableEasing?: boolean
}

export function useScrollLockedVideo(options: UseScrollLockedVideoOptions = {}) {
  const { playbackSpeed = 1, scrollSensitivity = 1.2, minScrollDelta = 1, enableEasing = true } = options

  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isVideoMode, setIsVideoMode] = useState(true)
  const [videoProgress, setVideoProgress] = useState(0)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [scrollAccumulator, setScrollAccumulator] = useState(0)
  const [videoDuration, setVideoDuration] = useState(30) // Default duration

  // Initialize video when component mounts
  useEffect(() => {
    // Set video as loaded after a short delay to allow iframe to load
    const timer = setTimeout(() => {
      setIsVideoLoaded(true)

      // Enhanced Streamable iframe communication
      if (iframeRef.current) {
        try {
          // Send initial setup commands to Streamable
          iframeRef.current.contentWindow?.postMessage(
            {
              method: "pause",
            },
            "https://streamable.com",
          )

          // Set initial position
          iframeRef.current.contentWindow?.postMessage(
            {
              method: "setCurrentTime",
              value: 0,
            },
            "https://streamable.com",
          )

          // Request video metadata
          iframeRef.current.contentWindow?.postMessage(
            {
              method: "getDuration",
            },
            "https://streamable.com",
          )
        } catch (error) {
          console.log("Streamable communication not available, using fallback")
        }
      }
    }, 1500) // Reduced delay for faster initialization

    return () => clearTimeout(timer)
  }, [])

  // Listen for messages from Streamable iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://streamable.com") return

      try {
        const data = event.data
        if (data.duration) {
          setVideoDuration(data.duration)
        }
      } catch (error) {
        console.log("Error handling Streamable message:", error)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Smooth easing function for video progress
  const easeOutCubic = useCallback(
    (t: number): number => {
      return enableEasing ? 1 - Math.pow(1 - t, 3) : t
    },
    [enableEasing],
  )

  // Handle video metadata loaded (fallback HTML5 video)
  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoaded(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setVideoDuration(videoRef.current.duration || 30)
    }
  }, [])

  // Calculate video progress based on scroll with frame-by-frame precision
  const updateVideoProgress = useCallback(
    (deltaY: number) => {
      if (!isVideoLoaded) return

      // Accumulate scroll delta for smoother progression
      setScrollAccumulator((prev) => {
        const newAccumulator = prev + deltaY * scrollSensitivity * playbackSpeed

        // Convert accumulated scroll to video progress (0-1)
        // Reduced scroll needed for more sensitive frame-by-frame control
        const scrollNeeded = 2000 // 2000px of scroll = full video (أكثر حساسية)
        const rawProgress = Math.max(0, newAccumulator / scrollNeeded)
        const clampedProgress = Math.min(1, rawProgress)
        const easedProgress = easeOutCubic(clampedProgress)

        // Calculate target time with frame precision
        const targetTime = easedProgress * videoDuration

        // Enhanced Streamable iframe control
        if (iframeRef.current) {
          try {
            // Send more precise control commands
            iframeRef.current.contentWindow?.postMessage(
              {
                method: "setCurrentTime",
                value: targetTime,
              },
              "https://streamable.com",
            )

            // Ensure video stays paused for frame-by-frame control
            iframeRef.current.contentWindow?.postMessage(
              {
                method: "pause",
              },
              "https://streamable.com",
            )

            // Additional control for precise seeking
            iframeRef.current.contentWindow?.postMessage(
              {
                method: "seek",
                time: targetTime,
              },
              "https://streamable.com",
            )
          } catch (error) {
            // Fallback: control HTML5 video if available
            if (videoRef.current) {
              videoRef.current.currentTime = targetTime
            }
          }
        } else if (videoRef.current) {
          // Direct HTML5 video control
          videoRef.current.currentTime = targetTime
        }

        setVideoProgress(easedProgress)

        // Check if video is complete
        if (easedProgress >= 0.98) {
          // Slightly before 100% for smoother transition
          setIsVideoMode(false)
          // Smooth transition to normal scrolling
          setTimeout(() => {
            document.body.style.overflow = "auto"
            document.body.style.scrollBehavior = "smooth"
          }, 200)
        }

        return newAccumulator
      })
    },
    [isVideoLoaded, videoDuration, scrollSensitivity, playbackSpeed, easeOutCubic],
  )

  // Handle scroll events with high precision
  const handleScroll = useCallback(
    (event: WheelEvent) => {
      if (!isVideoMode) return

      // Prevent default scrolling during video mode
      event.preventDefault()
      event.stopPropagation()

      const deltaY = event.deltaY

      // Process even small scroll movements for frame-by-frame control
      if (Math.abs(deltaY) >= minScrollDelta) {
        updateVideoProgress(deltaY)
      }
    },
    [isVideoMode, minScrollDelta, updateVideoProgress],
  )

  // Handle touch events for mobile with high sensitivity
  const touchStartY = useRef<number>(0)
  const lastTouchY = useRef<number>(0)

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!isVideoMode) return
      touchStartY.current = event.touches[0].clientY
      lastTouchY.current = event.touches[0].clientY
    },
    [isVideoMode],
  )

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!isVideoMode) return

      event.preventDefault()
      const touchY = event.touches[0].clientY
      const deltaY = lastTouchY.current - touchY
      lastTouchY.current = touchY

      // High sensitivity for mobile frame-by-frame control
      if (Math.abs(deltaY) >= minScrollDelta) {
        updateVideoProgress(deltaY * 3) // Higher multiplier for touch
      }
    },
    [isVideoMode, minScrollDelta, updateVideoProgress],
  )

  // Keyboard controls for fine-tuning (optional)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isVideoMode) return

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          updateVideoProgress(50) // Small increment
          break
        case "ArrowUp":
          event.preventDefault()
          updateVideoProgress(-50) // Small decrement
          break
        case "Escape":
          // Skip video mode
          setIsVideoMode(false)
          document.body.style.overflow = "auto"
          break
      }
    },
    [isVideoMode, updateVideoProgress],
  )

  useEffect(() => {
    // Disable scrolling initially
    document.body.style.overflow = "hidden"
    document.body.style.scrollBehavior = "auto"

    // Add event listeners with high precision
    const wheelOptions = { passive: false }
    const touchOptions = { passive: false }

    window.addEventListener("wheel", handleScroll, wheelOptions)
    window.addEventListener("touchstart", handleTouchStart, touchOptions)
    window.addEventListener("touchmove", handleTouchMove, touchOptions)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      // Cleanup
      document.body.style.overflow = "auto"
      document.body.style.scrollBehavior = "smooth"
      window.removeEventListener("wheel", handleScroll)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleScroll, handleTouchStart, handleTouchMove, handleKeyDown])

  // Reset function for development/testing
  const resetVideo = useCallback(() => {
    setIsVideoMode(true)
    setVideoProgress(0)
    setScrollAccumulator(0)
    document.body.style.overflow = "hidden"

    // Reset Streamable iframe
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.postMessage(
          {
            method: "setCurrentTime",
            value: 0,
          },
          "*",
        )
        iframeRef.current.contentWindow?.postMessage(
          {
            method: "pause",
          },
          "*",
        )
      } catch (error) {
        console.log("Reset failed, reloading iframe")
        // Force reload iframe as fallback
        const src = iframeRef.current.src
        iframeRef.current.src = ""
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = src
          }
        }, 100)
      }
    }

    // Reset HTML5 video
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }, [])

  return {
    videoRef,
    iframeRef,
    isVideoMode,
    videoProgress,
    isVideoLoaded,
    handleVideoLoaded,
    resetVideo,
    videoDuration,
  }
}
