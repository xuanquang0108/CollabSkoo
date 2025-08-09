// src/components/layout/Footer.tsx
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto flex items-center justify-center !p-10 w-full bg-black text-white/60 py-10 backdrop-blu min-h-[250px]">
      <div className="container mx-auto px-4 flex flex-col gap-10 md:flex-row md:justify-between md:items-start
      md:gap-16 md:px-6 lg:px-8">

        {/* Left: Logo */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="mb-4">
            <Image
              src="/assets/CollabSkoo-Logo.png"
              alt="Logo"
              width={140}
              height={70}
              priority
            />
          </Link>
        </div>

        {/* Middle: Links */}
        <div className="text-center md:text-left">
          <ul className="space-y-2">
            <li><Link href="/" className="hover:!text-white">Trang chủ</Link></li>
            <li><Link href="/upload" className="hover:!text-white">Đóng góp tài liệu</Link></li>
            <li><Link href="/documents" className="hover:!text-white">Tất cả tài liệu</Link></li>
            <li><Link href="/#faq-section" className="hover:!text-white">FAQ</Link></li>
            <li><Link href="/terms" className="hover:!text-white">Điều khoản dịch vụ</Link></li>
            <li><Link href="/privacy" className="hover:!text-white">Chính sách bảo mật</Link></li>
          </ul>
        </div>

        {/* Right: Contact */}
        <div className="text-center md:text-right text-sm">
          <p>
            <strong>Liên hệ:</strong>{' '}
            <Link href="mailto:glyphnomad28@gmail.com" className="hover:text-white">
              glyphnomad28@gmail.com
            </Link>
          </p>
          <p className="mt-2">&copy;{currentYear} CollabSkoo — Built with 💻&☕</p>
        </div>

      </div>
    </footer>
  )
}
