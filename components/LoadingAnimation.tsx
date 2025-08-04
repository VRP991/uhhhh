"use client"
import { useEffect, useState } from "react"

interface LoadingAnimationProps {
  onComplete: () => void
}

export function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    // Phase 1: Logo entrance (0-1.5s)
    const phase1Timer = setTimeout(() => {
      setAnimationPhase(1)
    }, 1500)

    // Phase 2: Text appearance (1.5-2.5s)
    const phase2Timer = setTimeout(() => {
      setAnimationPhase(2)
    }, 2500)

    // Phase 3: Final glow and fade out (3.5-4.5s)
    const phase3Timer = setTimeout(() => {
      setAnimationPhase(3)
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 800) // Wait for fade out animation
      }, 1000)
    }, 3500)

    return () => {
      clearTimeout(phase1Timer)
      clearTimeout(phase2Timer)
      clearTimeout(phase3Timer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[9999] loading-background flex items-center justify-center transition-opacity duration-800 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center relative">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Logo Container with Enhanced Animation */}
        <div className="relative mb-12 logo-container">
          <div className="logo-glow-ring"></div>
          <div className="logo-spin-container">
            <img
              src="/images/logo-new.png"
              alt="World Heart Hotel"
              className={`logo-main ${animationPhase >= 0 ? "logo-entrance" : ""}`}
            />
          </div>
          <div className="logo-pulse-ring"></div>
        </div>

        {/* Hotel Name with Staggered Animation */}
        <div className={`hotel-names ${animationPhase >= 1 ? "names-visible" : ""}`}>
          <h1 className="hotel-name-en">World Heart Hotel</h1>
          <h2 className="hotel-name-ar">فندق قلب العالم</h2>
          <div className="name-divider"></div>
          <p className="hotel-tagline-en">Where the Elite Belong</p>
          <p className="hotel-tagline-ar">حيث تنتمي النخبة</p>
        </div>

        {/* Enhanced Loading Indicator */}
        <div className={`loading-indicator ${animationPhase >= 2 ? "indicator-visible" : ""}`}>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <div className="loading-dots">
            <div className="loading-dot dot-1"></div>
            <div className="loading-dot dot-2"></div>
            <div className="loading-dot dot-3"></div>
          </div>
        </div>

        {/* Final Glow Effect */}
        <div className={`final-glow ${animationPhase >= 3 ? "glow-active" : ""}`}></div>
      </div>

      <style jsx>{`
        .loading-background {
          background: linear-gradient(135deg, #d6b49e 0%, #c1afa5 25%, #b9b0ad 50%, #939598 75%, #58595b 100%);
          background-size: 400% 400%;
          animation: gradientShift 4s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(214, 214, 5, 0.6);
          border-radius: 50%;
          animation: particleFloat infinite ease-in-out;
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0px) scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
        }

        .logo-container {
          position: relative;
          width: 160px;
          height: 160px;
          margin: 0 auto;
        }

        .logo-glow-ring {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          border: 2px solid rgba(214, 214, 5, 0.3);
          border-radius: 50%;
          animation: ringPulse 3s ease-in-out infinite;
        }

        .logo-pulse-ring {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 1px solid rgba(214, 180, 158, 0.4);
          border-radius: 50%;
          animation: ringPulse 2s ease-in-out infinite reverse;
        }

        @keyframes ringPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .logo-spin-container {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: 1000px;
        }

        .logo-main {
          width: 160px;
          height: 160px;
          object-fit: contain;
          filter: drop-shadow(0 8px 16px rgba(88, 89, 91, 0.3));
          opacity: 0;
          transform: rotateY(-180deg) translateZ(-100px) scale(0.5);
          transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .logo-entrance {
          opacity: 1;
          transform: rotateY(0deg) translateZ(0px) scale(1);
          animation: logoGlow 2s ease-in-out infinite alternate;
        }

        @keyframes logoGlow {
          0% {
            filter: drop-shadow(0 8px 16px rgba(88, 89, 91, 0.3));
          }
          100% {
            filter: drop-shadow(0 12px 24px rgba(214, 214, 5, 0.4)) drop-shadow(0 0 20px rgba(214, 180, 158, 0.6));
          }
        }

        .hotel-names {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s ease-out;
        }

        .names-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hotel-name-en {
          font-size: 3.5rem;
          font-weight: 800;
          color: #58595b;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          animation: textShimmer 3s ease-in-out infinite;
        }

        .hotel-name-ar {
          font-size: 3rem;
          font-weight: 800;
          color: #58595b;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          animation: textShimmer 3s ease-in-out infinite 0.5s;
        }

        .name-divider {
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #d6d605, transparent);
          margin: 1rem auto;
          animation: dividerGlow 2s ease-in-out infinite;
        }

        .hotel-tagline-en, .hotel-tagline-ar {
          font-size: 1.25rem;
          color: #939598;
          margin-bottom: 0.25rem;
          font-weight: 300;
          letter-spacing: 1px;
        }

        @keyframes textShimmer {
          0%, 100% {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          }
          50% {
            text-shadow: 2px 2px 8px rgba(214, 214, 5, 0.3), 0 0 10px rgba(214, 180, 158, 0.2);
          }
        }

        @keyframes dividerGlow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(214, 214, 5, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(214, 214, 5, 0.8);
          }
        }

        .loading-indicator {
          margin-top: 3rem;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out;
        }

        .indicator-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .loading-bar {
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          margin: 0 auto 2rem;
          overflow: hidden;
        }

        .loading-progress {
          height: 100%;
          background: linear-gradient(90deg, #d6d605, #d6b49e, #d6d605);
          background-size: 200% 100%;
          border-radius: 2px;
          animation: progressFlow 2s ease-in-out infinite;
        }

        @keyframes progressFlow {
          0% {
            width: 0%;
            background-position: 0% 50%;
          }
          50% {
            width: 70%;
            background-position: 100% 50%;
          }
          100% {
            width: 100%;
            background-position: 0% 50%;
          }
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
        }

        .loading-dot {
          width: 12px;
          height: 12px;
          background: #d6d605;
          border-radius: 50%;
          animation: dotBounce 1.4s ease-in-out infinite both;
        }

        .dot-1 { animation-delay: 0s; }
        .dot-2 { animation-delay: 0.2s; }
        .dot-3 { animation-delay: 0.4s; }

        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0.8) translateY(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2) translateY(-10px);
            opacity: 1;
          }
        }

        .final-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(214, 214, 5, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition: all 1s ease-out;
        }

        .glow-active {
          width: 800px;
          height: 800px;
          opacity: 1;
        }

        @media (max-width: 768px) {
          .hotel-name-en {
            font-size: 2.5rem;
          }
          .hotel-name-ar {
            font-size: 2rem;
          }
          .logo-main {
            width: 120px;
            height: 120px;
          }
          .logo-container {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </div>
  )
}
