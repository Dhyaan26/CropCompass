"use client"

import { BarChartBig, Droplets, Home, Landmark, Leaf, LineChart, Trees, Download, Bug, ArrowLeft } from "lucide-react";
import LanguageSwitcher from "@/components/language-switcher";
import { useTranslation } from "@/hooks/use-translation";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const router = useRouter();

    const handleDownload = () => {
        try {
            window.print();
        } catch (error) {
            console.error("Print failed:", error);
            alert("Could not open print dialog. Please try again or use your browser's print function.");
        }
    };


    return (
        <div className="flex min-h-screen flex-col">
            <AppHeader />
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 print:hidden">
                <div className="flex items-center gap-2">
                    {pathname !== '/dashboard' && (
                        <Button variant="outline" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard">
                            <Home className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        {t('header.downloadReport')}
                    </Button>
                </div>
            </header>
            <main className="flex-1 overflow-auto p-4 md:p-6 print:p-0">
                {children}
            </main>
            <footer className="mt-12 border-t py-6 print:hidden">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p>
                    &copy; {new Date().getFullYear()} {t('footer.copyright')}
                </p>
                </div>
            </footer>
        </div>
    )
}
