"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/_components/BackButton";
import Link from "next/link";

export default function ForgotPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/reset-password`;

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo,
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.");
                router.push("/reset-password"); // optional: create a check-email page OR change to /login
            }
        } catch (err: any) {
            toast.error(err?.message ?? "Có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full min-h-screen flex items-center justify-center py-8 px-4 bg-background">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-6">
                <div className="flex items-center justify-center">
                    <BackButton />
                </div>

                <h1 className="text-2xl font-bold text-primary uppercase flex justify-center">Quên mật khẩu</h1>

                <p className="text-sm text-gray-500 text-center">
                    Nhập email bạn đã sử dụng để đăng ký. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email đó.
                </p>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="w-full focus:!ring-primary focus:!border-primary rounded-md border border-gray-300 px-3 py-2 text-sm text-black placeholder-gray-400"
                            aria-label="Email"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
                    </button>
                </form>

                <p className="text-xs text-gray-500 text-center">
                    Nếu không nhận được email, hãy kiểm tra thư mục spam hoặc thử gửi lại sau vài phút.
                </p>
            </div>
        </main>
    );
}
