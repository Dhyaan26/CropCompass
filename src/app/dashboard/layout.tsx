
"use client"

import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarTrigger,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarInset,
} from "@/components/ui/sidebar"
import { BarChartBig, Droplets, Home, Landmark, Leaf, LineChart, Trees, Download } from "lucide-react";
import LanguageSwitcher from "@/components/language-switcher";
import { useTranslation } from "@/hooks/use-translation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { t } = useTranslation();
    const pathname = usePathname();

    const handleDownload = () => {
        try {
            window.print();
        } catch (error) {
            console.error("Print failed:", error);
            alert("Could not open print dialog. Please try again or use your browser's print function.");
        }
    };


    const menuItems = [
        { href: "/dashboard", icon: Home, label: t('tabs.dashboard') },
        { href: "/dashboard/crop-suggestions", icon: Trees, label: t('tabs.cropSuggestions') },
        { href: "/dashboard/irrigation-plan", icon: Droplets, label: t('tabs.irrigationPlan') },
        { href: "/dashboard/yield-prediction", icon: LineChart, label: t('tabs.yieldPrediction') },
        { href: "/dashboard/govt-schemes", icon: Landmark, label: t('tabs.govtSchemes') },
        { href: "/dashboard/data-insights", icon: BarChartBig, label: t('tabs.dataInsights') },
    ];

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2">
                             <Leaf className="h-8 w-8 text-primary" />
                             <h1 className="text-xl font-semibold text-primary font-headline">AgroGPT</h1>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <Link href={item.href} legacyBehavior passHref>
                                        <SidebarMenuButton isActive={pathname === item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <LanguageSwitcher />
                    </SidebarFooter>
                </Sidebar>
                <SidebarInset>
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 print:hidden">
                        <SidebarTrigger className="sm:hidden" />
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
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
