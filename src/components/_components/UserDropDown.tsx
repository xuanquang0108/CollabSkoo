'use client'

import {
  BoltIcon,
  BookOpenIcon,
  ChevronDownIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import Link from "next/link"

type UserDropDownProps = {
  user: User | null
}

function getInitials(email: string | undefined): string {
  if (!email) return 'U'
  const name = email.split('@')[0]
  return name.slice(0, 2).toUpperCase()
}

export default function UserDropDown({ user }: UserDropDownProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.history.replaceState(null, '', window.location.pathname);
    toast.success("Đăng xuất thành công")

    window.location.replace('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-auto inline-flex items-center gap-2">
          <Avatar>
            <AvatarImage src="./avatar.jpg" alt="Profile image" />
            <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-w-64 bg-neutral-800/80 text-white !p-2 transition-all duration-300">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-white truncate text-sm font-medium">
            {user?.email?.split('@')[0] || "Người dùng"}
          </span>
          <span className="text-white truncate text-xs font-normal">
            {user?.email || "Không rõ email"}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
            <span>Tài liệu</span>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
              <Link href="/leaderBoard">
                  <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
                  <span>Bảng xếp hạng</span>
              </Link>
          </DropdownMenuItem>

        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
                <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
                <span>Cập nhật hồ sơ</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
