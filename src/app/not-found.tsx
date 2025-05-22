// src/app/not-found.tsx

import Link from 'next/link';
import styles from '@/styles/not-found.module.css';

export default function NotFound() {
  return (
    <main>
      <div className={styles.page404}>
        <div className={styles.page404Content}>
          <p>Trang bạn đang tìm kiếm không tồn tại</p>
          <Link href="/static" className={styles.backToHome}>
            Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
