"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import PasswordInput from "@/components/_components/PasswordInput";

/**
 * ResetPassword page:
 * - Tries multiple ways to restore session in this tab:
 *   1) supabase.auth.getSessionFromUrl({ storeSession: true }) if available
 *   2) supabase.auth.exchangeCodeForSession(code) if ?code=...
 *   3) parse fragment (#access_token=...&refresh_token=...) and call supabase.auth.setSession(...)
 *
 * - Once session is restored in this tab, user can submit new password with supabase.auth.updateUser({ password })
 */

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);
    const [restoring, setRestoring] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            setRestoring(true);
            try {
                const authAny = (supabase.auth as any);

                // 1) getSessionFromUrl (some supabase client versions)
                if (typeof authAny.getSessionFromUrl === "function") {
                    try {
                        const res = await authAny.getSessionFromUrl({ storeSession: true });
                        if (!res?.error) {
                            setSessionReady(true);
                            setRestoring(false);
                            return;
                        }
                    } catch (err) {
                        // continue to next fallback
                        console.debug("getSessionFromUrl err:", err);
                    }
                }

                // 2) exchangeCodeForSession if code present in query
                const code = searchParams?.get("code");
                if (code) {
                    try {
                        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                        if (!error) {
                            setSessionReady(true);
                            setRestoring(false);
                            return;
                        }
                    } catch (err) {
                        console.debug("exchangeCodeForSession err:", err);
                    }
                }

                // 3) parse hash fragment for access_token & refresh_token
                if (typeof window !== "undefined") {
                    const hash = window.location.hash || "";
                    const fragment = new URLSearchParams(hash.replace(/^#/, ""));
                    const access_token = fragment.get("access_token");
                    const refresh_token = fragment.get("refresh_token");
                    if (access_token && refresh_token) {
                        try {
                            const setRes = await (supabase.auth as any).setSession({
                                access_token,
                                refresh_token,
                            });
                            if (!setRes?.error) {
                                setSessionReady(true);
                                setRestoring(false);
                                return;
                            }
                        } catch (err) {
                            console.debug("setSession err:", err);
                        }
                    }
                }
            } catch (err) {
                console.debug("restoreSession fallback error:", err);
            } finally {
                setRestoring(false);
            }
        };

        restoreSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams?.toString()]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // simple validation
        if (newPassword.length < 8) {
            toast.error("Mật khẩu phải có ít nhất 8 ký tự.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) {
                toast.error(error.message);
                setLoading(false);
                return;
            }

            toast.success("Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.");
            // sign out (clear session in this tab) and redirect to login
            await supabase.auth.signOut();
            router.push("/login");
        } catch (err: any) {
            toast.error(err?.message ?? "Có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full min-h-screen flex items-center justify-center py-8 px-4 bg-background">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-6">
                <h1 className="text-2xl font-bold text-primary">Đặt mật khẩu mới</h1>

                <p className="text-sm text-gray-500">
                    Nếu bạn mở trang này từ liên kết trong email đặt lại mật khẩu, hãy nhập mật khẩu mới ở dưới.
                </p>

                {restoring && (
                    <p className="text-sm text-gray-500">Đang chuẩn bị... Vui lòng chờ trong giây lát.</p>
                )}

                {!restoring && !sessionReady && (
                    <div className="text-sm text-gray-600">
                        <p>Không tìm thấy phiên phục hồi trong tab này.</p>
                        <p className="mt-2">
                            Hãy mở lại <strong>liên kết trong email</strong> (bấm vào “Reset Password” trong email) để truy cập trang này.
                        </p>
                        <p className="mt-2 text-xs text-gray-500">Nếu bạn đã mở link và vẫn lỗi, thử mở link trong trình duyệt khác hoặc gửi lại email đặt lại.</p>
                    </div>
                )}

                {/* show form only if session ready */}
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
    );
}
