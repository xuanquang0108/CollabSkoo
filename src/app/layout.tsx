import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css'
import { Roboto } from 'next/font/google'
import { getDocumentTypes } from '@/lib/documentTypes';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700', '500', '600'], // tùy nhu cầu
  variable: '--font', // tên biến CSS
})

export const metadata = {
  title: 'CollabSkoo',
  description: 'Chia sẻ tài liệu học tập',
  icons: {
    icon: '/myFavicon.ico',
  },
}

export default async function RootLayout({ children,}: {children: React.ReactNode}) {
  const documentTypes = await getDocumentTypes();
  return (
    <html lang="vi" className={roboto.variable}>
      <body className="font-sans">
        <Header documentTypes={documentTypes}/>
          <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
