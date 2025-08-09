// File: components/Navbar.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import SearchBar from '@/components/_components/SearchBar'
import MobileMenuPortal from '@/components/layout/MobileMenuPortal'
import { useAuth } from '@/lib/AuthProvider'
import UserDropDown from '@/components/UserDropDown'

export interface DocumentType {
  id: string
  name: string
  slug: string
}

export function useDocumentTypes() {
  const [types, setTypes] = useState<DocumentType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTypes() {
      const { data, error } = await supabase.from('document_types').select('*')
      if (data && !error) setTypes(data)
      setLoading(false)
    }
    fetchTypes()
  }, [])

  return { types, loading }
}

const navigationItems = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Đóng góp tài liệu', href: '/upload' },
  { name: 'Kho tài liệu', href: '/documents' },
]

export default function Navbar() {
  const router = useRouter()
  const { user } = useAuth()
  const { types } = useDocumentTypes()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-black text-white/70 sticky top-0 z-50 backdrop-blur-sm border-b border-white p-2">
      <div className="flex items-center mx-auto max-w-screen-xl px-4 py-3 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <div className="w-32 h-16 relative">
              <Image
                  src="/assets/CollabSkoo-Logo.png"
                  alt="Skoo Logo"
                  fill
                  className="object-contain"
              />
          </div>
        </Link>

        {/* Search bar takes remaining space */}
        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2 font-medium uppercase text-sm">
          {navigationItems.map((item) =>
            item.name === 'Kho tài liệu' ? (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="px-4 py-3
                  bg-transparent
                  rounded-lg
                  transition-colors
                  duration-200
                  hover:bg-neutral-800/60
                  hover:text-white"
                >
                  {item.name}
                </Link>
                <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-neutral-800/60
                 rounded-lg shadow-lg overflow-hidden">
                  <ul>
                    {types.map((type) => (
                      <li key={type.id}>
                        <Link
                          href={`/documents?type=${type.slug}`}
                          className="block px-4 py-3 text-white hover:bg-white hover:text-black transition"
                        >
                          {type.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="px-2 py-3 rounded-lg hover:bg-neutral-800/60 hover:text-white transition"
              >
                {item.name}
              </Link>
            )
          )}
        </nav>

        {/* User / Auth */}
      <div className="hidden md:flex items-center gap-4">
          {user ? (
              <UserDropDown user={user} />
          ) : (
              <>
                  <Link
                      href="/login"
                      className="px-4 py-1.5 bg-white text-black rounded-full hover:bg-primary hover:text-white transition"
                  >
                      Đăng nhập
                  </Link>
                  <Link
                      href="/register"
                      className="px-4 py-1.5 border-2 border-white text-white rounded-full
                      hover:bg-primary hover:text-white hover:border-primary transition"
                  >
                      Đăng ký
                  </Link>
              </>
          )}
      </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile menu portal */}
          {mobileMenuOpen && (
              <MobileMenuPortal
                  onClose={() => setMobileMenuOpen(false)}
                  navigationItems={navigationItems}
                  user={user}   // <--- add this line
              />
          )}
      </div>
    </header>
  )
}
