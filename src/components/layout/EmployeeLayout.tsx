import React from 'react';
import { EmployeeSidebar } from "@/components/employee-sidebar";
import { EmployeeHeader } from "@/components/employee-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useProfile } from '@/contexts/ProfileContext';

interface EmployeeProfile {
  id: string;
  headline: string;
  linkedinId?: string;
  linkedinName?: string;
  linkedinEmailVerified?: boolean;
  linkedinPicture?: string;
  linkedinProfileUrl?: string;
  isEmailVerified?: boolean;
}

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const { profile } = useProfile<EmployeeProfile>();

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <EmployeeSidebar />
      <SidebarInset>
        <EmployeeHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
} 