'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'

export default function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={handleToggle}
      className="w-10 h-10 flex items-center justify-center relative"
    >
      <div className="absolute inset-0 rounded-xl hover:bg-neutral-800 transition-all duration-300
      flex items-center justify-center">
        <MoonIcon
        className={`
          absolute w-6 h-6 text-white/60 transition-all duration-300
          ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          hover:text-white
        `}
      />
      <SunIcon
        className={`
          absolute w-6 h-6 text-white/60 transition-all duration-300
          ${!isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          hover:text-white
        `}
      />
      </div>
    </button>
  )
}
