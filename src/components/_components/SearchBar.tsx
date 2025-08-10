// File: components/SearchBar.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCcw, Search } from 'lucide-react'

interface SearchBarProps {
    defaultValue?: string
    onSubmit?: (q: string) => void
}

export default function SearchBar({ defaultValue = '', onSubmit }: SearchBarProps) {
    const router = useRouter()
    const [query, setQuery] = useState<string>(defaultValue)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    // useReturnType để tương thích cả browser & node typings
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // nếu parent truyền defaultValue thay đổi (ví dụ redirect), sync lại state
    useEffect(() => {
        setQuery(defaultValue)
    }, [defaultValue])

    const fetchSuggestions = async (q: string) => {
        if (!q || q.length < 3) {
            setSuggestions([])
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
            if (!res.ok) throw new Error('Fetch error')
            const data = await res.json()
            setSuggestions(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Search fetch error:', error)
            setSuggestions([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => fetchSuggestions(val), 300)
    }

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        const q = query.trim()
        if (!q) return

        if (onSubmit) {
            onSubmit(q)
        } else {
            router.push(`/search?q=${encodeURIComponent(q)}`)
        }
        setSuggestions([])
        setQuery('')
    }

    const handleSelect = (term: string) => {
        setQuery(term)
        if (onSubmit) {
            onSubmit(term)
        } else {
            router.push(`/search?q=${encodeURIComponent(term)}`)
        }
        setSuggestions([])
        setQuery('')
    }

    return (
        <form onSubmit={handleSubmit} className="relative flex-1">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Tìm kiếm..."
                className="w-full rounded-full border-2 border-white bg-transparent px-4 py-2 pr-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                {isLoading ? (
                    <RefreshCcw className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                    <Search className="w-5 h-5 text-gray-400" />
                )}
            </button>

            {suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-[#1a1a1a] mt-1 rounded-md border border-white/10 max-h-60 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                        <li
                            key={idx}
                            className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer whitespace-nowrap"
                            onClick={() => {
                                if (!item.endsWith('không tìm thấy')) {
                                    handleSelect(item)
                                }
                            }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    )
}
