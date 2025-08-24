import { SiteHeader } from "@/components/employer-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router-dom";
import { AutoEvalSidebar } from "./AutoEvalSidebar";

export default function AutoEvalLayout() {
  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AutoEvalSidebar collapsible="offcanvas" />
      <SidebarInset>
        <SiteHeader />
        <div className="autoeval-page h-[calc(100vh-var(--header-height))] bg-[var(--background)] flex flex-col overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
