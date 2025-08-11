"use client";

import { ChangeEvent, useId, useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    id?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    name?: string;
    autoComplete?: string;
    className?: string;
    label?: string | null; // <-- added here
};

export default function PasswordInput({
                                          id,
                                          value,
                                          onChange,
                                          placeholder = "Nhập mật khẩu",
                                          name = "password",
                                          autoComplete,
                                          className,
                                          label = "Mật khẩu", // <-- default label
                                      }: Props) {
    const autoDd = useId();
    const inputId = id ?? `password-${autoDd}`;

    const [internal, setInternal] = useState<string>(value ?? "");
    const [isVisible, setIsVisible] = useState<boolean>(false);

    // sync with parent
    useEffect(() => {
        if (value !== undefined && value !== internal) {
            setInternal(value);
        }
    }, [value, internal]);

    const toggleVisibility = () => setIsVisible((prev) => !prev);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setInternal(v);
        if (onChange) onChange(v);
    };

    return (
        <div className="*:not-first:mt-2">
            {label && <Label htmlFor={inputId}>{label}</Label>} {/* only render if label is not null */}
            <div className="relative">
                <Input
                    id={inputId}
                    name={name}
                    placeholder={placeholder}
                    className={
                        className ??
                        "p-2 block w-full rounded-md border-1 border-primary text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:!ring-primary focus:!border-primary"
                    }
                    type={isVisible ? "text" : "password"}
                    value={value !== undefined ? value : internal}
                    onChange={handleChange}
                    autoComplete={autoComplete}
                />
                <button
                    className="text-neutral-500/80 hover:text-neutral-950 focus-visible:border-neutral-950 focus-visible:ring-neutral-950/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={isVisible}
                    aria-controls={inputId}
                >
                    {isVisible ? (
                        <EyeOffIcon size={15} aria-hidden="true" />
                    ) : (
                        <EyeIcon size={15} aria-hidden="true" />
                    )}
                </button>
            </div>
        </div>
    );
}
