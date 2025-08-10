import Footer from '@/components/layout/Footer';
import '@/styles/globals.css'
import { Roboto } from 'next/font/google'
import { getDocumentTypes } from '@/lib/documentTypes';
import Navbar from "@/components/layout/Navbar";
import {Toaster} from "sonner";
import {AuthProvider} from "@/lib/AuthProvider";
import AppWrapper from "@/components/_components/AppWrapper";
import GlobalLoader from "@/components/_components/GlobalLoader";

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
                      <GlobalLoader />
                      <main className="mx-auto">{children}
                          <Toaster
                              position="bottom-right"
                              richColors
                              closeButton
                              duration={3000}
                              theme="dark"
                              toastOptions={{
                                  style: {
                                      background: "#09090a", // dark flat background
                                      color: "#fff",
                                      borderRadius: "8px",
                                      padding: "12px 16px",
                                      fontSize: "14px",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      fontWeight: "regular",
                                  },
                              }}
                          />

                      </main>
                  </AppWrapper>
              <Footer />
          </AuthProvider>
      </body>
    </html>
  )
}
