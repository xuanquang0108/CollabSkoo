// File: app/search/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SearchBar from '@/components/_components/SearchBar'
import NotFoundPage from '@/components/_components/NotFoundPage'

export default function SearchPage() {
    const params = useSearchParams()
    const q = params?.get('q') || ''
    const [results, setResults] = useState<string[] | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function load() {
            if (!q) {
                setResults([])
                return
            }
            setLoading(true)
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
                const data: string[] = await res.json()
                setResults(data)
            } catch {
                setResults([])
            }
            setLoading(false)
        }
        load()
    }, [q])

    // loading state or initial
    if (loading || results === null) {
        return (
            <main className="min-h-screen flex flex-col">
                <div className="p-4">
                    <SearchBar />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <p>Đang tìm kiếm...</p>
                </div>
            </main>
        )
    }

    // no results
    if (q && results.length === 0) {
        return <NotFoundPage message={`${q} không tìm thấy`} />
    }

    // show results
    return (
        <main className="min-h-screen flex flex-col">
            <div className="p-4">
                <SearchBar />
            </div>
            <section className="flex-1 px-4">
                <ul className="max-w-2xl mx-auto space-y-2">
                    {results.map((r, i) => (
                        <li key={i} className="p-3 border rounded">
                            {r}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    )
}