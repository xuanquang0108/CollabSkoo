import { Suspense } from "react"
import ResetPasswordPageClient from "./ResetPasswordPageClient"

export default function Page() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <ResetPasswordPageClient />
        </Suspense>
    )
}
