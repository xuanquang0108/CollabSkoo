import Footer from '@/components/layout/Footer';
import '@/styles/globals.css'
import { Roboto } from 'next/font/google'
import { getDocumentTypes } from '@/lib/documentTypes';
import Navbar from "@/components/layout/Navbar";
import {Toaster} from "sonner";
import {AuthProvider} from "@/lib/AuthProvider";
import AppWrapper from "@/components/_components/AppWrapper";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font',
})

export const metadata = {
  title: 'CollabSkoo',
  description: 'Chia sẻ tài liệu học tập',
  icons: {
    icon: '/myFavicon.ico',
  },
}

const navigationItems = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Đóng góp tài liệu', href: '/upload' },
    { name: 'Kho tài liệu', href: '/documents' },
]


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const documentTypes = await getDocumentTypes()

  return (
    <html lang="vi" className={roboto.variable}>
      <body className="font-sans">
          <AuthProvider>
              <Navbar />
                  <AppWrapper navigationItems={navigationItems}>
                      <main className="mx-auto px-4 md:px6 lg:px-8 max-w-full">{children}
                        <Toaster position="bottom-right" richColors closeButton />
                      </main>
                  </AppWrapper>
              <Footer />
          </AuthProvider>
      </body>
    </html>
  )
}
