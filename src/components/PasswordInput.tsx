"use client"

import { useId, useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PasswordInput() {
  const id = useId()
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Mật khẩu</Label>
      <div className="relative">
        <Input
          id={id}
          placeholder="Nhập mật khẩu"
          className="p-2 block w-full rounded-md border-1 border-primary text-sm text-black placeholder-gray-400
          focus:outline-none focus:ring-2 focus:!ring-primary"
          type={isVisible ? "text" : "password"}
        />
        <button
          className="text-neutral-500/80 hover:text-neutral-950 focus-visible:border-neutral-950 focus-visible:ring-neutral-950/50
          absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow]
          outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOffIcon size={15} aria-hidden="true" />
          ) : (
            <EyeIcon size={15} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}
