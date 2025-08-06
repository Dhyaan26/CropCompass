
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChartBig,
  Bug,
  Droplets,
  Home,
  Landmark,
  Leaf,
  LineChart,
  MessageSquare,
  Trees,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppHeader from "@/components/header";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

const ChatWidget = dynamic(() => import('@/components/chat-widget'), { ssr: false });


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: t("tabs.dashboard"),
    },
    {
      href: "/dashboard/crop-suggestions",
      icon: Trees,
      label: t("tabs.cropSuggestions"),
    },
    {
      href: "/dashboard/irrigation-plan",
      icon: Droplets,
      label: t("tabs.irrigationPlan"),
    },
    {
      href: "/dashboard/yield-prediction",
      icon: LineChart,
      label: t("tabs.yieldPrediction"),
    },
    {
      href: "/dashboard/govt-schemes",
      icon: Landmark,
      label: t("tabs.govtSchemes"),
    },
    {
      href: "/dashboard/farm-data-analytics",
      icon: BarChartBig,
      label: t("tabs.dataInsights"),
    },
    {
      href: "/dashboard/pest-disease-detection",
      icon: Bug,
      label: t("tabs.pestDetection"),
    },
    {
      href: "/dashboard/ai-assistant",
      icon: MessageSquare,
      label: t("tabs.aiAssistant"),
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1">
          <Sidebar>
            <SidebarContent>
              <SidebarHeader>
                <SidebarTrigger />
              </SidebarHeader>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                      <SidebarMenuButton
                        isActive={pathname === item.href}
                        tooltip={item.label}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
        <ChatWidget />
      </div>
    </SidebarProvider>
  );
}
