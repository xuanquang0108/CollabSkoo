// app/search/page.tsx
import React, { Suspense } from "react";
import SearchBar from "@/components/_components/SearchBar";
import SearchClient from "./SearchClient";

type Props = { searchParams?: { q?: string | string[] } };

export default function SearchPage({ searchParams }: Props) {
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