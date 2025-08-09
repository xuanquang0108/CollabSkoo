import Footer from '@/components/layout/Footer';
import '@/styles/globals.css'
import { Roboto } from 'next/font/google'
import { getDocumentTypes } from '@/lib/documentTypes';
import Navbar from "@/components/layout/Navbar";
import {Toaster} from "sonner";
import {AuthProvider} from "@/lib/AuthProvider";

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
          <main className="mx-auto px-4 md:px6 lg:px-8 max-w-full">{children}
            <Toaster position="bottom-right" richColors closeButton />
          </main>
          <Footer />
      </AuthProvider>
      </body>
    </html>
  )
}
