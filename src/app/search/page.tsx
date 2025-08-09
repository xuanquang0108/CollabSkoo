// app/search/page.tsx
import React, { Suspense } from "react";
import SearchBar from "@/components/_components/SearchBar";
import NotFoundPage from "@/components/_components/NotFoundPage";
import dynamic from "next/dynamic";

// load client component (dynamic import ensures it's client-side)
const SearchClient = dynamic(() => import("./SearchClient"), { ssr: false });

type Props = { searchParams?: { q?: string | string[] } };

export default function SearchPage({ searchParams }: Props) {
    // lấy q từ server-provided searchParams (an toàn cho prerender)
    const raw = searchParams?.q ?? "";
    const q = Array.isArray(raw) ? raw[0] : raw;

    return (
        <main className="min-h-screen flex flex-col">
            <div className="p-4">
                {/* bạn có thể cung cấp giá trị mặc định cho SearchBar */}
                <SearchBar defaultValue={q} />
            </div>

            {/* bọc client component bằng Suspense để tránh cảnh báo khi CSR bailout */}
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center">
                    <p>Đang tải kết quả...</p>
                </div>
            }>
                <SearchClient initialQuery={q ?? ""} />
            </Suspense>
        </main>
    );
}
