"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import Image from "next/image"

import PasswordInput from "@/components/_components/PasswordInput"
import BackButton from "@/components/_components/BackButton"
import {Input} from "@/components/ui/input";
import PasswordStrengthInput from "@/components/_components/PasswordStrengthIndicator";

/* Small 6-digit OTP input inline component (numeric only, paste supported) */
function OTPInput({
                      value,
                      onChange,
                      autoFocus = false,
                      disabled = false,
                  }: {
    value: string
    onChange: (v: string) => void
    autoFocus?: boolean
    disabled?: boolean
}) {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([])
    const digits = value.split("").slice(0, 6)
    const padded = [...Array(6)].map((_, i) => digits[i] ?? "")

    useEffect(() => {
        if (autoFocus && inputsRef.current[0]) inputsRef.current[0]!.focus()
    }, [autoFocus])

    function handleChange(i: number, raw: string) {
        if (disabled) return
        const cleaned = raw.replace(/\D/g, "").slice(0, 1)
        const arr = padded.slice()
        arr[i] = cleaned
        onChange(arr.join(""))
        if (cleaned && inputsRef.current[i + 1]) {
            inputsRef.current[i + 1]!.focus()
        }
    }

    function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (disabled) return
        if (e.key === "Backspace") {
            if (!padded[i] && inputsRef.current[i - 1]) {
                inputsRef.current[i - 1]!.focus()
                const arr = padded.slice()
                arr[i - 1] = ""
                onChange(arr.join(""))
            }
        } else if (e.key === "ArrowLeft" && inputsRef.current[i - 1]) {
            inputsRef.current[i - 1]!.focus()
        } else if (e.key === "ArrowRight" && inputsRef.current[i + 1]) {
            inputsRef.current[i + 1]!.focus()
        }
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        if (disabled) return
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        if (!text) return
        const arr = text.split("").concat(Array(6).fill("")).slice(0, 6)
        onChange(arr.join(""))
        const focusIndex = Math.min(5, text.length - 1)
        setTimeout(() => inputsRef.current[focusIndex]?.focus(), 0)
        e.preventDefault()
    }

    return (
        <div className="flex gap-2">
            {padded.map((d, i) => (
                <input
                    key={i}
                    ref={(el) => {inputsRef.current[i] = el}}
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    aria-label={`OTP digit ${i + 1}`}
                    className="w-11 h-11 text-center rounded-md border border-neutral-200 focus:border-primary focus:shadow-sm text-lg outline-none"
                />
            ))}
        </div>
    )
}

export default function ResetPasswordPage() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [resendCountdown, setResendCountdown] = useState(0)
    const countdownRef = useRef<number | null>(null)

    // countdown tick
    useEffect(() => {
        if (!resendCountdown) {
            if (countdownRef.current) {
                window.clearInterval(countdownRef.current)
                countdownRef.current = null
            }
            return
        }
        if (!countdownRef.current) {
            countdownRef.current = window.setInterval(() => {
                setResendCountdown((v) => {
                    if (v <= 1) {
                        if (countdownRef.current) {
                            window.clearInterval(countdownRef.current)
                            countdownRef.current = null
                        }
                        return 0
                    }
                    return v - 1
                })
            }, 1000)
        }
        return () => {
            if (countdownRef.current) {
                window.clearInterval(countdownRef.current)
                countdownRef.current = null
            }
        }
    }, [resendCountdown])

    // Auto-verify when user fills 6 digits
    useEffect(() => {
        if (otp.length === 6 && otpSent && !otpVerified) {
            (async () => {
                await verifyOtp(otp)
            })()
        }
    }, [otp])

    /* --- Handlers --- */
    const sendOtp = async () => {
        if (!email) {
            toast.error("Vui lòng nhập email.")
            return
        }
        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${location.origin}/reset-password`,
        })

        setLoading(false)
        if (error) {
            toast.error("Mật khẩu phải có ít nhất 8 ký tự, bao gồm số, chữ hoa và chữ thường.")
            return
        }

        toast.success("Mã OTP đã gửi. Kiểm tra mail (hộp chính / spam).")
        setOtpSent(true)
        setResendCountdown(60)
    }

    async function verifyOtp(manualToken?: string) {
        const tokenRaw = (manualToken ?? otp).replace(/\D/g, "").slice(0, 6)
        if (!email || tokenRaw.length !== 6) {
            toast.error("Vui lòng nhập email và mã 6 chữ số.")
            return
        }

        setLoading(true)
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: tokenRaw,
            type: "recovery",
        })
        setLoading(false)

        if (error) {
            toast.error("Mã không hợp lệ hoặc đã hết hạn.")
            return
        }

        toast.success("Xác thực OTP thành công. Nhập mật khẩu mới.")
        setOtpVerified(true)
    }

    const changePassword = async () => {
        if (newPassword.length < 8) {
            toast.error("Mật khẩu phải có ít nhất 8 ký tự.")
            return
        }
        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        setLoading(false)
        if (error) {
            console.error("updateUser error:", error)
            toast.error(error.message || "Không thể cập nhật mật khẩu.")
            return
        }
        toast.success("Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.")
        await supabase.auth.signOut()
        router.push("/login")
    }

    const resend = async () => {
        if (resendCountdown > 0) return
        await sendOtp()
    }

    return (
        <main className="w-full min-h-screen flex items-center justify-center py-8 px-4 bg-background">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-6">
                <div className="flex w-full justify-center items-center space-y-4">
                    {/* optional BackButton component */}
                    {typeof BackButton !== "undefined" ? <BackButton /> : null}
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <Image src="/assets/Blue-CollabSkoo-Logo.png" alt="logo" width={120} height={120} />
                    <h1 className="text-2xl font-bold text-primary uppercase">Quên mật khẩu</h1>
                </div>

                {/* email */}
                <label className="w-full">
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
                        className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm text-black placeholder-gray-400
                                focus:!outline-none focus:ring-2 focus:!ring-primary focus:!border-primary"
                        aria-label="Email"
                    />
                </label>

                {/* send OTP */}
                {!otpSent && (
                    <button
                        onClick={sendOtp}
                        disabled={loading}
                        className="w-full bg-primary text-white py-2 rounded-md hover:opacity-95 disabled:opacity-50"
                    >
                        {loading ? "Đang gửi..." : "Gửi mã OTP"}
                    </button>
                )}

                {/* otp input */}
                {otpSent && !otpVerified && (
                    <>
                        <div>
                            <span className="text-sm text-black font-medium">Nhập mã OTP (6 chữ số)</span>
                            <div className="mt-2 flex justify-center">
                                <OTPInput value={otp} onChange={setOtp} autoFocus disabled={loading} />
                            </div>
                        </div>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => verifyOtp()}
                                disabled={loading}
                                className="flex-1 bg-primary text-white py-2 rounded-md disabled:opacity-50 hover:bg-blue-600"
                            >
                                {loading ? "Đang xác thực..." : "Xác thực"}
                            </button>
                            <button
                                onClick={resend}
                                disabled={loading || resendCountdown > 0}
                                className="flex-1 border border-neutral-200 py-2 rounded-md hover:bg-primary hover:text-white"
                            >
                                {resendCountdown > 0 ? `Gửi lại (${resendCountdown}s)` : "Gửi lại"}
                            </button>
                        </div>

                        <p className="text-xs text-neutral-500 text-center">
                            Nếu không thấy email, kiểm tra spam. Mã có thời hạn ngắn.
                        </p>
                    </>
                )}

                {/* change password */}
                {otpVerified && (
                    <>
                        <label className="w-full">
                            {typeof PasswordInput !== "undefined" ? (
                                <PasswordStrengthInput value={newPassword} onChange={setNewPassword}/>
                            ) : (
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Ít nhất 8 ký tự"
                                    className="w-full mt-1 px-3 py-2 rounded-md border border-neutral-200 outline-none focus:ring-1 focus:ring-primary"
                                />
                            )}
                        </label>

                        <button
                            onClick={changePassword}
                            disabled={loading}
                            className="w-full bg-primary text-white py-2 rounded-md hover:opacity-95 disabled:opacity-50"
                        >
                            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                        </button>
                    </>
                )}
            </div>
        </main>
    )
}
