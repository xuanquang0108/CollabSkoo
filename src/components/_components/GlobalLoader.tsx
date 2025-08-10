"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export default function GlobalLoader() {
    const [loading, setLoading] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Show loader with delay (prevents flashing)
        window.startGlobalLoader = () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => setLoading(true), 400) // Delay before showing
        }

        // Hide loader instantly
        window.stopGlobalLoader = () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            setLoading(false)
        }
    }, [])

    if (!loading) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 transition-opacity duration-300">
            {/* Fancy pulse background */}
            <div className="absolute w-32 h-32 rounded-full bg-white/10 animate-ping" />

            {/* Logo with spin animation */}
            <div className="relative flex flex-col items-center">
                <Image
                    src="/assets/CollabSkoo-Logo.png" // Your logo path
                    alt="Loading..."
                    width={180}
                    height={180}
                    className="animate-spin-slow"
                />
                <p className="mt-3 text-white text-sm animate-pulse">Đang tải...</p>
            </div>
        </div>
    )
}

// Add custom animation for slower spin in globals.css or tailwind config
/*
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}
*/

// Extend Window type for TS
declare global {
    interface Window {
        startGlobalLoader: () => void
        stopGlobalLoader: () => void
    }
}
