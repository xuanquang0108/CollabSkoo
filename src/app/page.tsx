import Link from 'next/link';
import homeStyles from '@/styles/home.module.css';
import FAQ from "@/components/FAQ/FAQ";
import categoriesStyles from "@/components/categories/Categories.module.css";
import CategoriesDisplay from "@/components/categories/Categories";
import { getCategories } from "@/lib/categories";
import { getDocumentTypes } from '@/lib/documentTypes';

// interface DocumentType {
//   id: number;
//   name: string;
// }

export default async function Home() {
  const documentTypes = await getDocumentTypes();
  const categories = await getCategories();

  return (
    <section className={homeStyles.homepage}>
      {/* Hero Section */}
      <section className={homeStyles.heroImage}>
        <div className={homeStyles.heroContent}>
          <h1>
            Chào mừng đến với{' '}
            <span className={homeStyles.brand}>
              <br />
              <strong>CollabSkoo</strong>
            </span>
          </h1>
          <p>Kho tài liệu sinh viên — Chia sẻ là cách học tốt nhất!</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`${homeStyles.cta} ${homeStyles.dark}`}>
        <div className={homeStyles.ctaContent}>
          <h2>Chia sẻ tài liệu. Giúp đỡ cộng đồng.</h2>
          <p>
            <strong>Share the wealth of knowledge</strong> — mỗi tài liệu bạn
            đăng là một cánh cửa mở ra cho người khác.
          </p>
          <a href="/upload" className={homeStyles.btn}>
            Đóng góp tài liệu
          </a>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className={categoriesStyles.categoriesContainer}>
        <CategoriesDisplay categories={categories ?? []} />
      </section>

      <FAQ />
    </section>
  );
}
