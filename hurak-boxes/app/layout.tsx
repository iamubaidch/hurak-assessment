import "./globals.css";

export const metadata = {
    title: "Hurak Assessment",
    description: "Box Doubling Task",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true} className="site-body">
                <header className="site-header">
                    <div style={{ width: "100%", textAlign: "center" }}>
                        <h1 style={{ margin: 0, fontSize: 18 }}>
                            Hurak Assessment
                        </h1>
                        <div style={{ fontSize: 12, opacity: 0.9 }}>
                            Box Doubling Task
                        </div>
                    </div>
                </header>

                <main className="site-main">{children}</main>

                <footer className="site-footer">
                    &copy; 2025 Muhammad Ubaidullah
                </footer>
            </body>
        </html>
    );
}
