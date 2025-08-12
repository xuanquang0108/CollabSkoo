import FAQ from "@/components/FAQ/FAQ";
import CategoriesDisplay from "@/components/categories/Categories";
import { getCategories } from "@/lib/categories";

export default async function Home() {
  const categories = await getCategories();

  return (
    <section className="">
      {/* CTA Section */}
        <section className="w-screen bg-black text-white flex items-center justify-center min-h-[300px] px-5 py-16 relative left-0">
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
      <section>
        <CategoriesDisplay categories={categories ?? []} />
      </section>
      {/*  FAQ SECTION */}
      <FAQ />
    </section>
  );
}
