import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css'
import { Roboto } from 'next/font/google'

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

export default function RootLayout({ children,}: {children: React.ReactNode}) {
  return (
    <html lang="vi" className={roboto.variable}>
      <body className="font-sans">
        <Header documentTypes={[{id:1, name:'Giáo trình'}, {id:2, name:'Bài giảng'}]}/>
          <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
