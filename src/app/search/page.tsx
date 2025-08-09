// src/app/search/page.tsx
import React, { Suspense } from "react";
import SearchBar from "@/components/_components/SearchBar"; // chỉnh path nếu cần
import SearchClient from "./SearchClient"; // phải bắt đầu bằng "use client"

export default function SearchPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <div className="p-4">
                <SearchBar /> {/* SearchBar có defaultValue='' nên an toàn */}
            </div>

            <Suspense
                fallback={
                    <div className="flex-1 flex items-center justify-center">
                        <p>Đang tải kết quả...</p>
                    </div>
                }
            >
                <SearchClient />
            </Suspense>
        </main>
    );
}
