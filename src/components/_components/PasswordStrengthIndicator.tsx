"use client";

import { useId, useMemo, useState, useEffect } from "react";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    value?: string;
    onChange?: (value: string) => void;
    id?: string;
    placeholder?: string;
};

export default function PasswordStrengthInput({
                                                  value,
                                                  onChange,
                                                  id,
                                                  placeholder = "Nhập mật khẩu",
                                              }: Props) {
    const autoId = useId();
    const inputId = id ?? `password-${autoId}`;

    // Support controlled (value provided) and uncontrolled (local state) modes.
    const [internal, setInternal] = useState<string>(value ?? "");
    const [isVisible, setIsVisible] = useState<boolean>(false);

    // Sync when parent-controlled value changes
    useEffect(() => {
        if (value !== undefined && value !== internal) {
            setInternal(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const toggleVisibility = () => setIsVisible((prev) => !prev);

    const handleChange = (v: string) => {
        // update internal state
        setInternal(v);
        // notify parent if provided
        if (onChange) onChange(v);
    };

    const checkStrength = (pass: string) => {
        const requirements = [
            { regex: /.{8,}/, text: "Tối thiểu 8 ký tự" },
            { regex: /[0-9]/, text: "Ít nhất 1 chữ số" },
            { regex: /[a-z]/, text: "Ít nhất 1 chữ thường" },
            { regex: /[A-Z]/, text: "Ít nhất 1 chữ in hoa" },
        ];

        return requirements.map((req) => ({
            met: req.regex.test(pass),
            text: req.text,
        }));
    };

    const strength = checkStrength(internal);

    const strengthScore = useMemo(() => strength.filter((r) => r.met).length, [strength]);

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-border";
        if (score <= 1) return "bg-red-500";
        if (score <= 2) return "bg-orange-500";
        if (score === 3) return "bg-amber-500";
        return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
        if (score === 0) return "Mật khẩu cần có:";
        if (score <= 2) return "Mật khẩu yếu";
        if (score === 3) return "Mật khẩu trung bình";
        return "Mật khẩu mạnh";
    };

    return (
        <div>
            {/* Label + input */}
            <div className="*:not-first:mt-2">
                <Label htmlFor={inputId}>Mật khẩu</Label>
                <div className="relative">
                    {/* Use your Input component for consistent UI (keeps classes minimal here) */}
                    <input
                        id={inputId}
                        className="pe-9 block w-full rounded-md border-1 border-primary
            bg-white px-3 py-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={placeholder}
                        type={isVisible ? "text" : "password"}
                        value={internal}
                        onChange={(e) => handleChange(e.target.value)}
                        aria-describedby={`${inputId}-description`}
                        autoComplete="new-password"
                    />

                    <button
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow]
            outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        aria-pressed={isVisible}
                    >
                        {isVisible ? <EyeOffIcon size={16} aria-hidden="true" /> : <EyeIcon size={16} aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {/* Strength bar */}
            <div
                className="bg-border mt-2 mb-2 h-1 w-full overflow-hidden rounded-full"
                role="progressbar"
                aria-valuenow={strengthScore}
                aria-valuemin={0}
                aria-valuemax={4}
                aria-label="Độ mạnh mật khẩu"
            >
                <div
                    className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                    style={{ width: `${(strengthScore / 4) * 100}%` }}
                />
            </div>

            {/* Strength text */}
            <p id={`${inputId}-description`} className="text-foreground mb-2 text-sm font-medium">
                {getStrengthText(strengthScore)}
            </p>

            {/* Requirement list */}
            <ul className="space-y-1.5" aria-label="Yêu cầu mật khẩu">
                {strength.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        {req.met ? (
                            <CheckIcon size={16} className="text-emerald-500" aria-hidden="true" />
                        ) : (
                            <XIcon size={16} className="text-muted-foreground/80" aria-hidden="true" />
                        )}
                        <span className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}>
              {req.text}
                            <span className="sr-only">{req.met ? " - Đã đáp ứng" : " - Chưa đáp ứng"}</span>
            </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
