// File: components/NotFoundPage.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'

interface NotFoundPageProps {
    message: string
}

export default function NotFoundPage({ message }: NotFoundPageProps) {
    return (
        <main className="relative flex items-center justify-center w-screen h-screen overflow-hidden bg-white">
            {/* Background Images */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 flex justify-center items-center max-w-xs mx-auto">
                    <Image
                        src="/assets/404.png"
                        alt="404"
                        width={300}
                        height={300}
                        className="w-full h-auto object-contain"
                        priority
                    />
                </div>

                <div className="absolute right-0 bottom-0 w-[150px] h-[150px] md:w-[250px] md:h-[250px]">
                    <Image
                        src="/assets/404-mascot.png"
                        alt="404 mascot"
                        width={250}
                        height={250}
                        className="w-full h-full object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Foreground Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 text-white">
                <p className="mb-4 text-3xl font-semibold">{message}</p>
                <Link
                    href="/"
                    className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors font-medium"
                >
                    Về trang chủ
                </Link>
            </div>
        </main>
    )
}
