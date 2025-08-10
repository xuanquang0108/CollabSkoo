// app/search/SearchClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NotFoundPage from "@/components/_components/NotFoundPage";

type Props = { initialQuery?: string };

export default function SearchClient({ initialQuery = "" }: Props) {
    const params = useSearchParams();
    const paramQ = params?.get("q") ?? "";
    const q = paramQ || initialQuery;

    const [results, setResults] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function load() {
            if (!q) {
                if (mounted) setResults([]);
                return;
            }
            window.startGlobalLoader?.();
            if (mounted) setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
                if (!res.ok) throw new Error("Fetch failed");
                const data: string[] = await res.json();
                if (mounted) setResults(data);
            } catch {
                if (mounted) setResults([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, [q]);

    if (loading || results === null) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p>Đang tìm kiếm...</p>
            </div>
        );
    }

    if (q && results.length === 0) {
        return <NotFoundPage message={`${q} không tìm thấy`} />;
    }

    return (
        <section className="flex-1 px-4">
            <ul className="max-w-2xl mx-auto space-y-2">
                {results.map((r, i) => (
                    <li key={i} className="p-3 border rounded">
                        {r}
                    </li>
                ))}
            </ul>
        </section>
    );
}