// src/components/categories/Categories.tsx
'use client';

import styles from './Categories.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import categoriesStyles from "@/components/categories/Categories.module.css";

// Interface cho kiểu dữ liệu Category
interface Category {
  id: string;
  name: string;
}

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  // Theo dõi trạng thái đã được render ở client-side chưa
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Đánh dấu component đã được mount ở client
    setMounted(true);
  }, []);

  // Nếu chưa mount ở client, hiển thị skeleton loading
  if (!mounted) {
    return (
      <section className={styles.categoriesContainer}>
        <h2 className={categoriesStyles.sectionTitle}>Khám phá Danh mục</h2>
        <p className={categoriesStyles.subtitle}>Tài liệu học tập được phân loại theo chuyên ngành phổ biến</p>
        <div className={styles.categoryCardsContainer}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${styles.categoryCard} ${styles.skeleton}`}>
              <div className={`${styles.categoryIcon} ${styles.skeletonIcon}`}></div>
              <h3 className={`${styles.categoryTitle} ${styles.skeletonText}`}></h3>
              <p className={`${styles.categoryDescription} ${styles.skeletonText}`}></p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Hiển thị danh mục khi đã có dữ liệu
  return (
    <section className={styles.categoriesContainer}>
        <div className={styles.categoriesGrid}>
            <h2 className={categoriesStyles.sectionTitle}>Khám phá Danh mục</h2>
            <p className={categoriesStyles.subtitle}>Tài liệu học tập được phân loại theo chuyên ngành phổ biến</p>
            <div className={styles.categoryCardsContainer}>
              {categories.map((category) => (
                  <Link
                      key={category.id}
                      href={`/category/${category.id}`}
                      className={categoriesStyles.categoryCard}
                  >
                      <h3 className={categoriesStyles.categoryName}>{category.name}</h3>
                  </Link>
              ))}
            </div>
        </div>
    </section>
  );
}