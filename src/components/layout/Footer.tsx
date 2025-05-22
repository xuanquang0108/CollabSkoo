// src/components/layout/Footer.tsx
import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerLeft}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/images/Logo-without_bg-02.png"
              alt="Logo"
              width={200}
              height={250}
              // style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
              priority
            />
          </Link>
        </div>

        <div className={styles.footerMiddle}>
          <ul className={styles.footerLinks}>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/src/app/upload">Đóng góp tài liệu</Link></li>
            <li><Link href="/documents">Tất cả tài liệu</Link></li>
            <li><Link href="/#faq-section">FAQ</Link></li>
          </ul>
        </div>

        <div className={styles.footerRight}>
          <p><strong>Liên hệ:</strong> <Link href="mailto:glyphnomad28@gmail.com">glyphnomad28@gmail.com</Link></p>
          <p>&copy; {currentYear} CollabSkoo — Built with 💻 & ☕</p>
        </div>
      </div>
    </footer>
  )
}