import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { ClipboardList, Activity, Trophy } from "lucide-react"

import logo from '@/assets/logo.png'
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

const autoEvalNavItems: Array<{
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    title: "Create Evaluation",
    url: "/autoeval/dashboard",
    icon: ClipboardList,
  },
  {
    title: "Run and Monitor Evaluations",
    url: "",
    icon: Activity,
  },
  {
    title: "Evaluation Leaderboard",
    url: "",
    icon: Trophy,
  },
]

const autoEvalSecondaryItems: Array<{
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}> = []

export function AutoEvalSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
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
              {autoEvalNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.url ||
                      (item.title === 'Create Evaluation' && location.pathname.startsWith('/autoeval/dashboard'))
                    }
                    tooltip={item.title}
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
          {autoEvalSecondaryItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
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

