// src/components/categories/Categories.tsx
'use client';

import styles from './Categories.module.css';
import Link from 'next/link';
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
  // Hiển thị danh mục khi có dữ liệu
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