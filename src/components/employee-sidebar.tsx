import {
    Bookmark,
    CirclePlusFilled,
    Search
} from "@/components/SimpleIcons"
import * as React from "react"
import { Link, useLocation } from "react-router-dom"

import logo from '@/assets/logo.png'
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useProfile } from '@/contexts/ProfileContext'
import { useState } from 'react'
import { EmployeeProfileModal } from './EmployeeProfileModal'

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  headline: string;
  linkedinId?: string;
  linkedinName?: string;
  linkedinEmailVerified?: boolean;
  linkedinPicture?: string;
  linkedinProfileUrl?: string;
  isEmailVerified?: boolean;
}

const employeeNavItems = [
  {
    title: "Recommended Jobs",
    url: "/employee/recommended-jobs",
    icon: Search,
  },
  {
    title: "In Progress Jobs",
    url: "/employee/in-progress-jobs",
    icon: Bookmark,
  },
  {
    title: "Completed Jobs",
    url: "/employee/completed-jobs",
    icon: CirclePlusFilled,
  },
  // {
  //   title: "My Applications",
  //   url: "/employee/applications",
  //   icon: Briefcase,
  // },
  // {
  //   title: "Saved Jobs",
  //   url: "/employee/saved",
  //   icon: Bookmark,
  // },
]

const employeeSecondaryItems: Array<{
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  // {
  //   title: "Profile",
  //   url: "/employee/profile",
  //   icon: User,
  // },
  // {
  //   title: "Settings",
  //   url: "/employee/settings",
  //   icon: Settings,
  // },
]

export function EmployeeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useProfile<EmployeeProfile>()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const location = useLocation()

  // Helper function to check if a URL is active
  const isActive = (url: string) => {
    if (url === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(url)
  }

  // Show loading state if profile is not loaded
  if (!profile) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader className="pt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <Link to="/" className="flex items-center">
                  <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
                  <span className="font-eudoxus-medium text-white text-lg tracking-wide">
                    Pilotcrew.ai
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" disabled>
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">...</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Loading...</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Loading profile...
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader className="pt-6">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="data-[slot=sidebar-menu-button]:!p-1.5"
                >
                  <Link to="/" className="flex items-center">
                    <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
                    <span className="font-eudoxus-medium text-white text-lg tracking-wide">
                      Pilotcrew.ai
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-4 pt-1">
              <SidebarMenu className="space-y-2">
                {employeeNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={isActive(item.url) ? "bg-primary text-primary-foreground" : ""}
                    >
                      <Link to={item.url}>
                        <item.icon className="size-3" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter>
          <SidebarMenu>
            {employeeSecondaryItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={isActive(item.url) ? "bg-primary text-primary-foreground" : ""}
                >
                  <Link to={item.url}>
                    <item.icon className="size-3" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
        {/* <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg grayscale">
                      <AvatarFallback className="rounded-lg">
                        {getInitials(profile.linkedinName || profile.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {profile.linkedinName || profile.name || 'User'}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {profile.headline || profile.email || 'User'}
                      </span>
                    </div>
                    <DotsVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          {getInitials(profile.linkedinName || profile.name || 'User')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {profile.linkedinName || profile.name || 'User'}
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {profile.headline || profile.email || 'User'}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleAccountClick}>
                      <UserCircle />
                      Account
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <Logout />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter> */}
      </Sidebar>

      <EmployeeProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  )
} 