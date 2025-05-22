// components/documents/DocumentTypeCard.tsx
'use client';

import Link from 'next/link';
import styles from './DocumentTypeCard.module.css';

interface DocumentType {
  id: number;
  name: string;
}

interface DocumentTypeCardProps {
  type: DocumentType;
}

export default function DocumentTypeCard({ type }: DocumentTypeCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{type.name}</h3>
      <Link
        href={`/documents?type=${type.id}`}
        className={styles.link}
      >
        Xem tài liệu →
      </Link>
    </div>
  );
}