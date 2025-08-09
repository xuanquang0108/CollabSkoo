"use client"
import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function MobileMenuPortal({
  onClose,
  navigationItems,
}: {
  onClose: () => void
  navigationItems: { name: string; href: string }[]
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[999] bg-[#09090a] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image
            src="/avatar.jpg"
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold">Tên bạn</p>
            <p className="text-sm text-gray-400">email@example.com</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white text-2xl">✕</button>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="block text-lg font-medium hover:text-white"
            onClick={onClose}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>,
    document.body
  )
}
