// app/profile/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UploadIcon } from "lucide-react"

export default function ProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState("")
    const [rank, setRank] = useState("")
    const [docCount, setDocCount] = useState(0)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
                return
            }
            setUser(user)

            const { data: profile } = await supabase
                .from("profiles")
                .select("username, rank, avatar_url")
                .eq("id", user.id)
                .single()

            if (profile) {
                setUsername(profile.username)
                setRank(profile.rank)
            }

            const { count } = await supabase
                .from("documents")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id)

            setDocCount(count || 0)
            setLoading(false)
        }

        fetchProfile()
    }, [router])

    const handleUpdateUsername = async () => {
        if (!username.trim()) {
            toast("Tên người dùng không được để trống")
            return
        }

        const { error } = await supabase
            .from("profiles")
            .update({ username })
            .eq("id", user.id)

        if (error) {
            toast("Cập nhật thất bại", {description: error.message})
        } else {
            toast( "Cập nhật thành công" )
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-lg">Đang tải hồ sơ...</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 sm:p-8">

            {/* Header Profile */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8">
                <Avatar className="w-20 h-20 border-4 border-white shadow-md shrink-0">
                    <AvatarImage src={user.avatar_url || ""} alt={username} />
                    <AvatarFallback>{username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl font-bold">{username}</h1>
                    <p className="text-sm text-muted-foreground break-all">{user.email}</p>
                    <div className="mt-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-2 mx-auto sm:mx-0">
                            <UploadIcon size={16} />
                            Đổi ảnh đại diện
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <Card className="p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-all">
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-1">Tài liệu đã tải lên</p>
                        <p className="text-2xl sm:text-3xl font-bold">{docCount}</p>
                    </CardContent>
                </Card>
                <Card className="p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-all">
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-1">Xếp hạng hiện tại</p>
                        <p className="text-2xl sm:text-3xl font-bold">{rank || "Chưa xếp hạng"}</p>
                    </CardContent>
                </Card>
                <Card className="p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-all">
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-1">Điểm tích luỹ</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">1,250</p>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Profile */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Chỉnh sửa thông tin</h2>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Input
                        placeholder="Nhập tên người dùng mới..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button onClick={handleUpdateUsername}>Cập nhật</Button>
                </div>
            </div>

        </div>
    )
}
