"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { toast } from "sonner"
import {
    HomeIcon,
    KeyIcon,
    MenuIcon,
    Edit2Icon,
    SaveIcon,
} from "lucide-react"

type NavItem = {
    id: string
    label: string
    icon: React.ComponentType<any>
}

export default function ProfileDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [username, setUsername] = useState("")
    const [editing, setEditing] = useState(false)
    const [docCount, setDocCount] = useState(0)
    const [points, setPoints] = useState(0)
    const [rank, setRank] = useState("Chưa xếp hạng")
    const [mobileOpen, setMobileOpen] = useState(false)
    const [activeId, setActiveId] = useState<string>("profile")
    const [coverImage, setCoverImage] = useState("https://res.cloudinary.com/demo/image/upload/v1/samples/cloudinary-group.jpg") // Default cover
    const [password, setPassword] = useState({ current: "", new: "", confirm: "" })
    const [documents, setDocuments] = useState<any[]>([]) // For My Documents

    const profileRef = useRef<HTMLDivElement | null>(null)
    const passwordRef = useRef<HTMLDivElement | null>(null)
    const myDocsRef = useRef<HTMLDivElement | null>(null)

    const navItems: NavItem[] = [
        { id: "password", label: "Đổi mật khẩu", icon: KeyIcon },
        { id: "myDocs", label: "Tài liệu của tôi", icon: HomeIcon },
    ]

    useEffect(() => {
        const fetchData = async () => {
            const {
                data: { user: currentUser },
            } = await supabase.auth.getUser()

            if (!currentUser) {
                router.push("/login")
                return
            }

            setUser(currentUser)

            const { data: profile } = await supabase
                .from("profiles")
                .select("username, points, rank, avatar_url")
                .eq("id", currentUser.id)
                .single()

            if (profile) {
                setUsername(profile.username || (currentUser.email ? currentUser.email.split("@")[0] : ""))
                setPoints(profile.points || 0)
                setRank(profile.rank || "Chưa xếp hạng")
            } else {
                setUsername(currentUser.email ? currentUser.email.split("@")[0] : "")
            }

            const { count } = await supabase
                .from("documents")
                .select("id", { count: "exact", head: true })
                .eq("user_id", currentUser.id)

            setDocCount(count || 0)

            // Fetch user's documents for new section
            const { data: docs } = await supabase
                .from("documents")
                .select("*")
                .eq("user_id", currentUser.id)
                .order("created_at", { ascending: false })
            setDocuments(docs || [])

            setLoading(false)
        }

        fetchData()
    }, [router])

    useEffect(() => {
        const sections = [
            { id: "profile", ref: profileRef },
            { id: "password", ref: passwordRef },
            { id: "myDocs", ref: myDocsRef },
        ]

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { root: null, rootMargin: "0px 0px -60% 0px", threshold: 0.3 }
        )

        sections.forEach((s) => {
            if (s.ref.current) observer.observe(s.ref.current)
        })

        return () => observer.disconnect()
    }, [])

    const scrollTo = (id: string) => {
        setActiveId(id)
        setMobileOpen(false)
        const map: Record<string, React.RefObject<HTMLDivElement | null>> = {
            profile: profileRef,
            password: passwordRef,
            myDocs: myDocsRef,
        }
        const ref = map[id]
        if (ref?.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    const saveUsername = async () => {
        const newName = username?.trim()
        if (!newName) {
            toast("Tên người dùng không được để trống")
            return
        }
        if (!user?.id) {
            toast("Không tìm thấy người dùng")
            return
        }

        const { error } = await supabase
            .from("profiles")
            .upsert({ id: user.id, username: newName }, { onConflict: "id" })

        if (error) {
            toast("Cập nhật thất bại", { description: error.message })
        } else {
            toast("Cập nhật thành công")
            setEditing(false)
        }
    }

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', 'YOUR_UNSIGNED_UPLOAD_PRESET') // Replace with your preset

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, { // Replace YOUR_CLOUD_NAME
                    method: 'POST',
                    body: formData
                })
                const data = await response.json()
                if (data.secure_url) {
                    setCoverImage(data.secure_url)
                    toast("Cover updated successfully!")
                    // Optionally save to Supabase profile
                    await supabase.from("profiles").update({ cover_url: data.secure_url }).eq("id", user.id)
                }
            } catch (error) {
                toast("Failed to upload cover")
            }
        }
    }

    const savePassword = async () => {
        if (!password.current || !password.new || !password.confirm) {
            toast("Vui lòng điền đầy đủ thông tin")
            return
        }
        if (password.new !== password.confirm) {
            toast("Mật khẩu mới và xác nhận không khớp")
            return
        }

        const { error } = await supabase.auth.updateUser({
            password: password.new,
        })

        if (error) {
            toast("Đổi mật khẩu thất bại", { description: error.message })
        } else {
            toast("Đổi mật khẩu thành công")
            setPassword({ current: "", new: "", confirm: "" })
        }
    }

    const deleteAccount = async () => {
        if (confirm("Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.")) {
            const { error } = await supabase.auth.admin.deleteUser(user.id)
            if (error) {
                toast("Xóa tài khoản thất bại", { description: error.message })
            } else {
                toast("Tài khoản đã được xóa")
                router.push("/login")
            }
        }
    }

    if (loading) return <div className="h-screen flex justify-center items-center p-6 text-center text-xl">Đang tải...</div>

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col sm:flex-row">
            <aside
                className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-200 flex flex-col fixed inset-y-0 left-0 z-30 transform ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                } sm:translate-x-0 sm:static sm:inset-auto w-64 md:w-64`}
            >
                <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/assets/TradeMark-Logo.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            style={{ objectFit: "cover" }}
                            className="h-9 w-9 rounded-lg ml-1"
                        />
                        <span className="font-medium">CollabSkoo</span>
                    </div>

                    <button
                        className="sm:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Open menu"
                        aria-expanded={mobileOpen}
                    >
                        <MenuIcon size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-1 py-2 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeId === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => scrollTo(item.id)}
                                className={`group w-full flex items-center gap-3 text-sm px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                    isActive ? "bg-gray-100 dark:bg-gray-900" : ""
                                }`}
                                aria-current={isActive ? "true" : undefined}
                            >
                                <Icon className="opacity-90" size={18} />
                                <span className="font-normal">{item.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </aside>

            {mobileOpen && <div className="fixed inset-0 bg-black/50 z-20 sm:hidden" onClick={() => setMobileOpen(false)} />}

            <div className="flex-1 overflow-y-auto pt-16 sm:pt-0 sm:ml-0 md:ml-64">
                <button
                    className="sm:hidden fixed top-4 left-4 z-30 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                >
                    <MenuIcon size={24} />
                </button>
                <div className="max-w-5xl mx-auto p-4 sm:p-6">
                    <div className="relative">
                        <div className="h-40 rounded-lg overflow-hidden">
                            <img src={coverImage} alt="Cover" className="h-40 w-full object-cover" />
                            <label htmlFor="cover-upload" className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 cursor-pointer">
                                Change Cover
                                <Input id="cover-upload" type="file" className="hidden" onChange={handleCoverChange} accept="image/*" />
                            </label>
                        </div>
                        <div className="relative -mt-14 sm:-mt-16">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 pt-16">
                                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                    <div className="flex-shrink-0 relative -mt-14 sm:-mt-16">
                                        <div className="w-28 h-28 rounded-full ring-4 ring-white dark:ring-gray-800 overflow-hidden bg-gray-100 shadow flex items-center justify-center">
                                            <Avatar className="w-24 h-24">
                                                <AvatarImage src={user?.user_metadata?.avatar_url || user?.avatar_url || ""} />
                                                <AvatarFallback>{((username || "?")[0] || "?").toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="text-base font-normal break-all">{user?.email ?? ""}</p>

                                                <p className="text-sm text-gray-400 mt-2">Tên người dùng</p>
                                                {!editing ? (
                                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                        <p className="text-lg font-medium">{username}</p>
                                                        <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="flex items-center gap-2">
                                                            <Edit2Icon size={14} />
                                                            <span className="text-sm">Đổi tên</span>
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2 mt-2 max-w-md flex-col sm:flex-row">
                                                        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                                                        <Button onClick={saveUsername} className="flex items-center gap-2">
                                                            <SaveIcon size={14} />
                                                            <span>Lưu</span>
                                                        </Button>
                                                        <Button variant="ghost" onClick={() => setEditing(false)}>
                                                            Hủy
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-2 sm:mt-0">
                                                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md px-3 py-2 text-center">
                                                    <div className="text-xs text-gray-500">Xếp hạng</div>
                                                    <div className="text-lg font-medium">{rank}</div>
                                                    <div className="text-xs text-gray-400 mt-1">{points} điểm</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-white dark:bg-gray-900 border rounded-md p-3 text-center">
                                        <div className="text-xs text-gray-500">Tài liệu đã tải lên</div>
                                        <div className="text-2xl font-medium">{docCount}</div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-900 border rounded-md p-3 text-center">
                                        <div className="text-xs text-gray-500">Điểm hiện tại</div>
                                        <div className="text-2xl font-medium text-green-600">{points}</div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-900 border rounded-md p-3 text-center">
                                        <div className="text-xs text-gray-500">Xếp hạng</div>
                                        <div className="text-2xl font-medium">{rank}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-6">
                        <section id="password" ref={passwordRef}>
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="text-sm font-medium text-gray-700">Đổi mật khẩu</h3>
                                    <div className="space-y-4 mt-2">
                                        <Input
                                            type="password"
                                            placeholder="Mật khẩu hiện tại"
                                            value={password.current}
                                            onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Mật khẩu mới"
                                            value={password.new}
                                            onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Xác nhận mật khẩu mới"
                                            value={password.confirm}
                                            onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                        />
                                        <Button onClick={savePassword} className="w-full">Lưu mật khẩu</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        <section id="myDocs" ref={myDocsRef}>
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="text-sm font-medium text-gray-700">Tài liệu của tôi</h3>
                                    <div className="mt-2 space-y-2">
                                        {documents.length > 0 ? (
                                            documents.map((doc) => (
                                                <div key={doc.id} className="flex justify-between items-center border-b pb-2">
                                                    <span>{doc.title || "Untitled"}</span>
                                                    <Button variant="link" asChild>
                                                        <a href={doc.url} download>Tải xuống</a>
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-500">Chưa có tài liệu nào.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        <div className="mt-6">
                            <Button variant="destructive" onClick={deleteAccount} className="w-full">
                                Xóa tài khoản
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}