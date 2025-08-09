// components/BackButton.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ href = "/" }: { href?: string }) {
    return (
        <div className="absolute">
            <Link
                href={href}
                className="flex items-center justify-center
                gap-2 text-sm px-3 py-1 text-primary border-2 border-primary rounded-full
                hover:bg-primary hover:text-white transition"
                aria-label="Quay lại"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Quay lại</span>
            </Link>
        </div>
    );
}
