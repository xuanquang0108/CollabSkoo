"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams?.get("code"); // ✅ an toàn

    useEffect(() => {
        const handleAuth = async () => {
            if (code) {
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                if (!error) {
                    router.replace("/"); // Chuyển về trang chính
                } else {
                    console.error(error);
                }
            }
        };
        handleAuth();
    }, [code, router]);

    return <p>Đang xác thực...</p>;
}
