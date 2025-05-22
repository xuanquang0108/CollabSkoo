// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

interface DocumentType {
  id: number;
  name: string;
}

export default function Header({ documentTypes }: { documentTypes: DocumentType[] }) {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const toggleMenu = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.getElementById('side-panel');
      const hamburger = document.querySelector(`.${styles.hamburger}`);

      if (panel && hamburger && isSidePanelOpen) {
        if (!panel.contains(event.target as Node) && !hamburger.contains(event.target as Node)) {
          setIsSidePanelOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSidePanelOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.navDiv}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/images/Logo-without_bg-02.png"
              alt="Logo"
              width={200}
              height={70}
              priority
              style={{ width: 'auto', height: 'auto'}}
            />
          </Link>
        </div>

        <form
          className={styles.searchHeader}
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              router.push(`/documents?q=${encodeURIComponent(searchQuery)}`);
            }
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tài liệu..."
          />
        </form>

        <nav className={styles.menu}>
          <Link href="/" className={styles.menuItem}>Trang Chủ</Link>
          <Link href="/src/app/upload" className={styles.menuItem}>Đóng góp tài liệu</Link>
          <div className={styles.dropdownContainer}>
            <button className={`${styles.menuItem} ${styles.dropdownTrigger}`}>
              Phân loại tài liệu
              <span className={styles.dropdownArrow}>▾</span>
            </button>
            <ul className={styles.dropdownMenu}>
              {documentTypes.map((type) => (
                <li key={type.id}>
                  <Link
                    href={`/documents?doc_type=${type.id}`}
                    className={styles.dropdownItem}
                  >
                    {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/documents" className={styles.menuItem}>Kho tài liệu</Link>
        </nav>

        <button
          className={styles.hamburger}
          onClick={toggleMenu}
        >
          {isSidePanelOpen ? '×' : '☰'}
        </button>
      </div>

      {/* Mobile Side Panel */}
      <div
        id="side-panel"
        className={`${styles.sidePanel} ${isSidePanelOpen ? styles.sidePanelOpen : ''}`}
      >
        <button className={styles.closeButton}
        onClick={() => setIsSidePanelOpen(false)}
      >
        x
        </button>
        <nav className={styles.mobilePanelNav}>
          <ul className={styles.mobilePanelList}>
            <li><Link href="/" onClick={() => setIsSidePanelOpen(false)}>Trang Chủ</Link></li>
            {documentTypes.map((type) => (
              <li key={type.id}>
                <Link
                  href={`/documents?doc_type=${type.id}`}
                  onClick={() => setIsSidePanelOpen(false)}
                >
                  {type.name}
                </Link>
              </li>
            ))}
            <li><Link href="/documents" onClick={() => setIsSidePanelOpen(false)}>Kho tài liệu</Link></li>
            <li><Link href="/src/app/upload" onClick={() => setIsSidePanelOpen(false)}>Đóng góp tài liệu</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}