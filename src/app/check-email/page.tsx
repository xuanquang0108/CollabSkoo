export default function CheckEmailPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-card text-center">
                <h1 className="text-xl font-bold mb-2">Check Your Email</h1>
                <p className="text-sm text-muted-foreground">
                    We sent you a confirmation link. You can open it on **any device**.
                    Once confirmed, you can log in from anywhere.
                </p>
            </div>
        </div>
    );
}
