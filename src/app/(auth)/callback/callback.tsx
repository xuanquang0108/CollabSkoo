'use client'

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams?.get("code");

    useEffect(() => {
        const handleAuth = async () => {
            if (!code) return;

            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (!error && data.session) {
                toast.success("Đăng nhập thành công!");
                router.replace("/"); // back to home or dashboard
            } else {
                toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
                router.replace("/login");
            }
        };

        handleAuth();
    }, [code, router]);

    return <p>Đang xác thực...</p>;
}
