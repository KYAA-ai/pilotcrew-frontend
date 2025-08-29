import {
    Briefcase
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

interface EmployerProfile {
  id: string;
  email: string;
  name: string;
  companyName: string;
  companyWebsite?: string;
  isEmailVerified: boolean;
  userType: string;
}

const employerNavItems = [
  {
    title: "Posted Jobs",
    url: "/employer/jobs",
    icon: Briefcase,
  },
  // {
  //   title: "Applications",
  //   url: "/employer/applications",
  //   icon: Users,
  // },
  // {
  //   title: "Analytics",
  //   url: "/employer/analytics",
  //   icon: BarChart,
  // },
]

const employerSecondaryItems: Array<{
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  // {
  //   title: "Profile",
  //   url: "/employer/profile",
  //   icon: User,
  // },
  // {
  //   title: "Settings",
  //   url: "/employer/settings",
  //   icon: Settings,
  // },
]

export function EmployerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useProfile<EmployerProfile>()
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
          <SidebarGroupContent className="flex flex-col gap-2 pt-1">
            <SidebarMenu>
              {employerNavItems.map((item) => (
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
          {employerSecondaryItems.map((item) => (
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
    </Sidebar>
  )
} 