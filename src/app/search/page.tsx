// src/app/search/page.tsx
import React, { Suspense } from "react";
import SearchBar from "@/components/_components/SearchBar"; // chỉnh nếu path khác
import SearchClient from "./SearchClient"; // phải là client component ("use client")

export default function SearchPage({
                                       searchParams,
                                   }: {
    searchParams?: { q?: string | string[] };
}) {
    const raw = searchParams?.q ?? "";
    const q = Array.isArray(raw) ? raw[0] : raw;

    return (
        <main className="min-h-screen flex flex-col">
            <div className="p-4">
                <SearchBar defaultValue={q} />
            </div>

            <Suspense
                fallback={
                    <div className="flex-1 flex items-center justify-center">
                        <p>Đang tải kết quả...</p>
                    </div>
                }
            >
                <SearchClient initialQuery={q ?? ""} />
            </Suspense>
        </main>
    );
}
