"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { HomeIcon, KeyIcon, Edit2Icon, SaveIcon } from "lucide-react"
import PasswordInput from "@/components/_components/PasswordInput";

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
    const [coverImage, setCoverImage] = useState(
        "https://res.cloudinary.com/demo/image/upload/v1/samples/cloudinary-group.jpg"
    )
    const [password, setPassword] = useState({ current: "", new: "", confirm: "" })
    const [documents, setDocuments] = useState<any[]>([])

    const passwordRef = useRef<HTMLDivElement | null>(null)
    const myDocsRef = useRef<HTMLDivElement | null>(null)

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
                setUsername(
                    profile.username ||
                    (currentUser.email ? currentUser.email.split("@")[0] : "")
                )
                setPoints(profile.points || 0)
                setRank(profile.rank || "Chưa xếp hạng")
            } else {
                setUsername(
                    currentUser.email ? currentUser.email.split("@")[0] : ""
                )
            }

            const { count } = await supabase
                .from("documents")
                .select("id", { count: "exact", head: true })
                .eq("user_id", currentUser.id)

            setDocCount(count || 0)

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

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const formData = new FormData()
            formData.append("file", file)
            formData.append("upload_preset", "YOUR_UNSIGNED_UPLOAD_PRESET")

            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                )
                const data = await response.json()
                if (data.secure_url) {
                    setCoverImage(data.secure_url)
                    toast("Cover updated successfully!")
                    await supabase
                        .from("profiles")
                        .update({ cover_url: data.secure_url })
                        .eq("id", user.id)
                }
            } catch {
                toast("Failed to upload cover")
            }
        }
    }

    if (loading)
        return (
            <div className="h-screen flex justify-center items-center p-6 text-xl">
                Đang tải...
            </div>
        )

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="bg-red-500 rounded-lg shadow-lg w-full max-w-5xl overflow-hidden">
                {/* Cover Image Section */}
                <div className="relative h-48">
                    <img
                        src={coverImage}
                        alt="Cover"
                        className="h-full w-full object-cover"
                    />
                    <label
                        htmlFor="cover-upload"
                        className="absolute top-2 right-2 text-white bg-black/50 rounded-full px-3 py-1 text-xs cursor-pointer"
                    >
                        Đổi ảnh bìa
                        <Input
                            id="cover-upload"
                            type="file"
                            className="hidden"
                            onChange={handleCoverChange}
                            accept="image/*"
                        />
                    </label>
                </div>

                {/* Profile Content */}
                <div className="bg-white dark:bg-gray-800 p-6 space-y-6">
                    {/* Avatar + Info */}
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-lg -mt-16">
                            <AvatarImage
                                src={
                                    user?.user_metadata?.avatar_url || user?.avatar_url || ""
                                }
                            />
                            <AvatarFallback>
                                {((username || "?")[0] || "?").toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            {!editing ? (
                                <div className="flex items-center gap-5 mt-1 flex-wrap">
                                    <p className="flex-justify text-lg font-bold">{username}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditing(true)}
                                        className="flex gap-1 border-1 border-gray-500 text-gray-500 hover:bg-primary hover:border-primary hover:text-white transition-colors"
                                    >
                                        <Edit2Icon size={14} />
                                        <span className="text-sm">Đổi tên</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2 mt-2 max-w-md flex-col sm:flex-row">
                                    <Input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <Button>
                                        <SaveIcon size={14} />
                                        <span>Lưu</span>
                                    </Button>
                                    <Button variant="ghost" onClick={() => setEditing(false)} className="text-gray-500 border-1 border-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-colors">
                                        Hủy
                                    </Button>
                                </div>
                            )}
                            <p className="font-regular text-sm text-gray-500">{user?.email ?? ""}</p>

                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-gray-100 dark:bg-gray-900 rounded-md p-3 text-center">
                            <div className="text-xs text-gray-500">Tài liệu đã tải lên</div>
                            <div className="text-2xl font-medium">{docCount}</div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-900 rounded-md p-3 text-center">
                            <div className="text-xs text-gray-500">Điểm hiện tại</div>
                            <div className="text-2xl font-medium text-green-600">
                                {points}
                            </div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-900 rounded-md p-3 text-center">
                            <div className="text-xs text-gray-500">Xếp hạng</div>
                            <div className="text-2xl font-medium">{rank}</div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <section id="password" ref={passwordRef}>
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="text-sm font-medium text-gray-700">
                                    Đổi mật khẩu
                                </h3>
                                <div className="space-y-2 mt-2 text-sm">
                                    <PasswordInput label="Mật khẩu hiện tại" placeholder=""></PasswordInput>
                                    <PasswordInput label="Mật khẩu mới" placeholder=""></PasswordInput>
                                    <PasswordInput label="Xác nhận mật khẩu mới" placeholder=""></PasswordInput>
                                    <Button className="w-full">Lưu mật khẩu</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* My Documents */}
                    <section id="myDocs" ref={myDocsRef}>
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="text-sm font-medium text-gray-700">
                                    Tài liệu của tôi
                                </h3>
                                <div className="mt-2 space-y-2">
                                    {documents.length > 0 ? (
                                        documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex justify-between items-center border-b pb-2"
                                            >
                                                <span>{doc.title || "Untitled"}</span>
                                                <Button variant="link" asChild>
                                                    <a href={doc.url} download>
                                                        Tải xuống
                                                    </a>
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500">
                                            Chưa có tài liệu nào.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Delete Account */}
                    <div className="mt-6">
                        <Button variant="destructive" className="w-full">
                            Xóa tài khoản
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
