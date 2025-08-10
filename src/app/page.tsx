import homeStyles from '@/styles/home.module.css';
import FAQ from "@/components/FAQ/FAQ";
import categoriesStyles from "@/components/categories/Categories.module.css";
import CategoriesDisplay from "@/components/categories/Categories";
import { getCategories } from "@/lib/categories";
import { getDocumentTypes } from '@/lib/documentTypes';


export default async function Home() {
  const documentTypes = await getDocumentTypes();
  const categories = await getCategories();

  return (
    <section className={homeStyles.homepage}>
      {/* CTA Section */}
        <section className="w-screen bg-black text-white flex items-center justify-center min-h-[300px] px-0 py-16 relative left-0">
            <div className="max-w-3xl text-center space-y-6">
                <h2 className="text-5xl font-bold">CollabSkoo</h2>
                <p className="text-lg">
                    Chia sẻ tài liệu, giúp đỡ cộng đồng.
                    <br />
                    <span className="font-semibold">Share the wealth of knowledge</span> - mỗi tài liệu bạn đóng góp là một cánh cửa mở ra cho người khác.
                </p>
                <a
                    href="/upload"
                    className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition"
                >
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
