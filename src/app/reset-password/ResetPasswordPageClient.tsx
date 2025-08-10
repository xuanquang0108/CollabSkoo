'use client'

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import PasswordInput from "@/components/_components/PasswordInput"

export default function ResetPasswordPageClient() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [sessionReady, setSessionReady] = useState(false)
    const [restoring, setRestoring] = useState(true)

    useEffect(() => {
        const restoreSession = async () => {
            setRestoring(true)
            try {
                const authAny = (supabase.auth as any)

                if (typeof authAny.getSessionFromUrl === "function") {
                    try {
                        const res = await authAny.getSessionFromUrl({ storeSession: true })
                        if (!res?.error) {
                            setSessionReady(true)
                            setRestoring(false)
                            return
                        }
                    } catch {}
                }

                const code = searchParams?.get("code")
                if (code) {
                    try {
                        const { error } = await supabase.auth.exchangeCodeForSession(code)
                        if (!error) {
                            setSessionReady(true)
                            setRestoring(false)
                            return
                        }
                    } catch {}
                }

                if (typeof window !== "undefined") {
                    const hash = window.location.hash || ""
                    const fragment = new URLSearchParams(hash.replace(/^#/, ""))
                    const access_token = fragment.get("access_token")
                    const refresh_token = fragment.get("refresh_token")
                    if (access_token && refresh_token) {
                        try {
                            const setRes = await authAny.setSession({
                                access_token,
                                refresh_token,
                            })
                            if (!setRes?.error) {
                                setSessionReady(true)
                                setRestoring(false)
                                return
                            }
                        } catch {}
                    }
                }
            } finally {
                setRestoring(false)
            }
        }

        restoreSession()
    }, [searchParams?.toString()])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword.length < 8) {
            toast.error("Mật khẩu phải có ít nhất 8 ký tự.")
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) {
                toast.error(error.message)
                setLoading(false)
                return
            }

            toast.success("Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.")
            await supabase.auth.signOut()
            router.push("/login")
        } catch (err: any) {
            toast.error(err?.message ?? "Có lỗi xảy ra.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="w-full min-h-screen flex items-center justify-center py-8 px-4 bg-background">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-6">
                <h1 className="text-2xl font-bold text-primary">Đặt mật khẩu mới</h1>

                <p className="text-sm text-gray-500">
                    Nếu bạn mở trang này từ liên kết trong email đặt lại mật khẩu, hãy nhập mật khẩu mới ở dưới.
                </p>

                {restoring && <p className="text-sm text-gray-500">Đang chuẩn bị... Vui lòng chờ trong giây lát.</p>}

                {!restoring && !sessionReady && (
                    <div className="text-sm text-gray-600">
                        <p>Không tìm thấy phiên phục hồi trong tab này.</p>
                        <p className="mt-2">
                            Hãy mở lại <strong>liên kết trong email</strong> (bấm vào “Reset Password” trong email) để truy cập trang này.
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                            Nếu bạn đã mở link và vẫn lỗi, thử mở link trong trình duyệt khác hoặc gửi lại email đặt lại.
                        </p>
                    </div>
                )}

                {sessionReady && (
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                            <PasswordInput value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    )
}
