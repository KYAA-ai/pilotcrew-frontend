// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Search, Bell, Settings } from '@/components/SimpleIcons';
import { useLocation } from 'react-router-dom';
import { NavUser } from './nav-user';
import { SidebarTrigger } from './ui/sidebar';

export function EmployeeHeader() {
  const location = useLocation();
  const hideNavUser = location.pathname === '/employee/agentic-dashboard';

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="flex items-center gap-2 px-4 ml-auto">
        {!hideNavUser && <NavUser />}
      </div>
    </header>
  );
} 