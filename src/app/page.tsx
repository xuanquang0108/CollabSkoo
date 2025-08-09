import homeStyles from '@/styles/home.module.css';
import FAQ from "@/components/FAQ/FAQ";
import categoriesStyles from "@/components/categories/Categories.module.css";
import CategoriesDisplay from "@/components/categories/Categories";
import { getCategories } from "@/lib/categories";
import { getDocumentTypes } from '@/lib/documentTypes';
import SearchBar from "@/components/_components/SearchBar";

// interface DocumentType {
//   id: number;
//   name: string;
// }

export default async function Home() {
  const documentTypes = await getDocumentTypes();
  const categories = await getCategories();

  return (
    <section className={homeStyles.homepage}>
      {/* CTA Section */}
      <section className={homeStyles.cta}>
        <div>
            <h2><strong className="text-5xl">CollabSkoo</strong><br/>Chia sẻ tài liệu, giúp đỡ cộng đồng.</h2>
          <p>
            <strong>Share the wealth of knowledge</strong> - mỗi tài liệu bạn đóng góp
              là một cánh cửa mở ra cho người khác.
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
