import {ReactNode} from "react";

export default function AuthLayout({children}: {children: ReactNode}) {
    return (
        <div className="relative flex min-h-[650px] flex-col items-center justify-center">
            <div className="flex w-full max-w-screen-xl flex-col gap-6">{children}</div>
        </div>
    )
}
