"use client"

import { useEffect, useState, ReactNode } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabaseClient"
import MobileMenuPortal from "@/components/layout/MobileMenuPortal"

export default function AppWrapper({
                                       children,
                                       navigationItems,
                                   }: {
    children: ReactNode
    navigationItems: { name: string; href: string }[]
}) {
    const [user, setUser] = useState<User | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        // Get current user on mount
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
        })

        // Listen for auth changes (login/logout)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            listener?.subscription.unsubscribe()
        }
    }, [])

    return (
        <>
            {/* Your normal app UI */}
            {children}

            {/* Mobile menu portal */}
            {mobileMenuOpen && (
                <MobileMenuPortal
                    onClose={() => setMobileMenuOpen(false)}
                    navigationItems={navigationItems}
                    user={user}
                />
            )}
        </>
    )
}
