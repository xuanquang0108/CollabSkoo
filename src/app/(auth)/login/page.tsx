"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { supabase } from "@/lib/supabaseClient";
import PasswordInput from "@/components/PasswordInput";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/_components/BackButton";

export default function LoginPage() {
    // controlled state for form
    const [email, setEmail] = useState("");
    const [password] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingOAuth, setLoadingOAuth] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // you can replace with toast
                alert("Đăng nhập thất bại: " + error.message);
            } else {
                alert("Đăng nhập thành công!");
                // redirect handled by your app or you can router.push("/")
            }
        } finally {
            setLoading(false);
        }
    };

    const auth_callback_url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`;
    const handleLoginWithGoogle = async () => {
        setLoadingOAuth(true);
        try {
            await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: auth_callback_url,
                },
            });
        } finally {
            setLoadingOAuth(false);
        }
    };

    return (
        <main className="w-full min-h-screen flex items-center justify-center py-8 px-4 bg-background">
            <div
                className="relative w-full max-w-md bg-white rounded-3xl shadow-lg p-8
                   flex flex-col items-center gap-6 justify-center"
            >
                {/* Quay lại */}
                <div className="flex flex-col items-center justify-center">
                    <BackButton/>
                </div>

                {/* Logo + heading */}
                <div className="flex flex-col items-center mt-2">
                    <Image
                        src="/assets/Blue-CollabSkoo-Logo.png"
                        alt="CollabSkoo logo"
                        width={160}
                        height={160}
                        className="mb-2"
                    />
                    <h1 className="text-2xl font-bold text-center uppercase text-primary space-y-4">Đăng nhập</h1>
                    <p className="text-sm text-gray-500 text-center mt-1">
                        Vui lòng nhập thông tin của bạn để đăng nhập.
                    </p>
                </div>

                {/* Form */}
                <form className="w-full mt-2" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm text-black placeholder-gray-400
                                focus:!outline-none focus:ring-2 focus:!ring-primary"
                                aria-label="Email"
                            />
                        </div>

                        <div>
                            <PasswordInput/>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 py-1">
                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                <input type="checkbox" className="accent-primary" />
                                Ghi nhớ đăng nhập
                            </label>
                            <Link href="/forgot" className="text-primary hover:underline text-sm">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-2 rounded-md text-md font-medium hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {loading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                    </div>
                </form>

                {/* Divider */}
                <div className="w-full flex items-center gap-2 text-gray-400 text-sm">
                    <div className="h-px bg-gray-300 flex-1" />
                    <span>Hoặc</span>
                    <div className="h-px bg-gray-300 flex-1" />
                </div>

                {/* Social / Google */}
                <div className="w-full">
                    <button
                        onClick={handleLoginWithGoogle}
                        disabled={loadingOAuth}
                        className="w-full border-2 border-primary py-2 px-4 rounded-md text-md font-medium flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition text-primary"
                        aria-label="Đăng nhập với Google"
                    >
                        <Image src="/assets/google.png" alt="Google" width={18} height={18} />
                        {loadingOAuth ? "Đang chuyển..." : "Đăng nhập với Google"}
                    </button>
                </div>

                {/* Bottom links */}
                <div className="w-full flex items-center justify-center gap-2 pt-1">
                    <p className="text-sm text-gray-500">Bạn chưa có tài khoản?</p>
                    <Link href="/register" className="text-primary hover:underline text-sm">
                        Đăng ký ngay!
                    </Link>
                </div>

                <p className="text-xs text-center text-gray-500 mt-1 max-w-[90%] leading-relaxed">
                    Bằng cách đăng nhập, bạn đồng ý với{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                        Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                        Chính sách bảo mật
                    </Link>.
                </p>
            </div>
        </main>
    );
}
