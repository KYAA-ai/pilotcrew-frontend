// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Search, Bell, Settings } from '@/components/SimpleIcons';
import { NavUser } from './nav-user';

export function EmployeeHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        {/* <div className="flex items-center gap-2">
          <Search className="size-4" />
          <Input
            type="search"
            placeholder="Search jobs..."
            className="w-64"
          />
        </div> */}
      </div>
      <div className="flex items-center gap-2 px-4 ml-auto">
        {/* <Button variant="ghost" size="icon">
          <Bell className="size-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="size-4" />
        </Button> */}
        <NavUser />
      </div>
    </header>
  );
} 