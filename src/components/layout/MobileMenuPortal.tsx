"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
    BookOpenIcon,
    Layers2Icon,
    LogOutIcon,
    UserPenIcon,
} from "lucide-react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import {router} from "next/client";

function getInitials(email: string | undefined): string {
    if (!email) return "U"
    const name = email.split("@")[0]
    return name.slice(0, 2).toUpperCase()
}

export default function MobileMenuPortal({
                                             onClose,
                                             navigationItems,
                                             user,
                                         }: {
    onClose: () => void
    navigationItems: { name: string; href: string }[]
    user: User | null
}) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.history.replaceState(null, "", window.location.pathname)
        toast.success("Đăng xuất thành công")
        window.location.replace('/');
        onClose()
    }

    if (!mounted) return null

    return createPortal(
        <div className="fixed inset-0 z-[999] bg-black text-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                {user && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-800/80 flex items-center justify-center">
              <span className="text-sm font-semibold">
                {getInitials(user.email)}
              </span>
                        </div>
                        <div>
                            <p className="font-semibold">{user.email?.split("@")[0]}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="text-white text-2xl w-5 h-5 min-h-[70px] mr-4"
                >
                    ✕
                </button>
            </div>

            {/* Navigation from props */}
            <div className="p-6 space-y-4 border-b border-white/10">
                {navigationItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="block text-lg font-medium hover:text-white"
                        onClick={onClose}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>

            {/* User specific links or login/signup */}
            <div className="flex flex-col p-6 space-y-6">
                {user ? (
                    <>
                        <Link
                            href="#"
                            className="flex items-center gap-3 hover:text-white"
                            onClick={onClose}
                        >
                            <Layers2Icon size={18} />
                            <span>Tài liệu của tôi</span>
                        </Link>
                        <Link
                            href="/leaderBoard"
                            className="flex items-center gap-3 hover:text-white"
                            onClick={onClose}
                        >
                            <BookOpenIcon size={18} />
                            <span>Bảng xếp hạng</span>
                        </Link>
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 hover:text-white"
                            onClick={onClose}
                        >
                            <UserPenIcon size={18} />
                            <span>Cập nhật hồ sơ</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="block text-lg font-medium hover:text-white"
                            onClick={onClose}
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            href="/register"
                            className="block text-lg font-medium hover:text-white"
                            onClick={onClose}
                        >
                            Đăng ký
                        </Link>
                    </>
                )}
            </div>

            {/* Logout */}
            <div className="p-6 border-t border-white/10 text-white">
                {user && (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left hover:text-white"
                    >
                        <LogOutIcon size={18} />
                        <span>Đăng xuất</span>
                    </button>
                )}
            </div>
        </div>,
        document.body
    )
}
