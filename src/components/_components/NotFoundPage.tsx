// File: components/NotFoundPage.tsx
'use client'

import Link from 'next/link'

interface NotFoundPageProps {
    message: string
}

export default function NotFoundPage({ message }: NotFoundPageProps) {
    return (
        <main
            className="w-screen h-screen bg-cover bg-center bg-no-repeat
                        -mx-6 md:-mx-8 lg:-mx-16"
            style={{ backgroundImage: "url('/assets/404-error.png')" }}
        >
            <div className="flex flex-col items-center justify-center w-full h-full bg-black/50 text-white text-center px-4">
                <div className="space-y-4">
                    <p className="text-3xl font-medium">{message}</p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-2 bg-primary
                        text-white rounded-full hover:bg-blue-600 transition font-medium"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </main>
    )
}
