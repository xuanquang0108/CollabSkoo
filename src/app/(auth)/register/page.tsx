"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BackButton from "@/components/_components/BackButton";
import { Input } from "@/components/ui/input";
import PasswordStrengthInput from "@/components/_components/PasswordStrengthIndicator";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Check password format
        const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRequirements.test(password)) {
            toast.error(
                "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường và 1 số."
            );
            setLoading(false);
            return;
        }

        // 1. Register in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
                data: {
                    username: userName,
                },
            },
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }

        if(error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }

        // 3. Done
        toast.success(
            "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
        );
        setLoading(false);
        router.push("/login");
    };

    return (
        <main className="w-full min-h-screen flex items-center justify-center py-8 px-4 bg-background">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col items-center justify-center">
                    <BackButton />
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
                    <h1 className="text-2xl font-bold text-center uppercase text-primary">
                        Đăng ký tài khoản
                    </h1>
                    <p className="text-sm text-gray-500 text-center mt-1">
                        Vui lòng nhập thông tin của bạn để đăng ký tài khoản.
                    </p>
                </div>

                {/* Form */}
                <form className="w-full mt-2" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Tên người dùng
                            </label>
                            <Input
                                id="userName"
                                required
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Nhập tên người dùng"
                            />

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
                            />
                        </div>

                        <div>
                            <PasswordStrengthInput value={password} onChange={setPassword} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-2 rounded-md text-md font-medium hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {loading ? "Đang xử lý..." : "Đăng ký"}
                        </button>
                    </div>
                </form>

                {/* Bottom links */}
                <div className="w-full flex items-center justify-center gap-2 pt-1">
                    <p className="text-sm text-gray-500">Bạn đã có tài khoản?</p>
                    <Link href="/login" className="text-primary hover:underline text-sm">
                        Đăng nhập!
                    </Link>
                </div>

                <p className="text-xs text-center text-gray-500 mt-1 max-w-[90%] leading-relaxed">
                    Bằng cách đăng ký tài khoản, bạn đồng ý với{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                        Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                        Chính sách bảo mật
                    </Link>
                    .
                </p>
            </div>
        </main>
    );
}
