import { Calendar, Home, Inbox, Search, Settings, Users, FileText, Lock, Package } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { PrivateRoutesAdmin } from "@/routes/routes";
import { title } from "process";

// Menu items por rol
const menuItems = {
  admin: [
    {
      title: "Panel Principal",
      url: `${PrivateRoutesAdmin.DASHBOARD}`,
      icon: Home,
    },
    {
      title: "Usuarios",
      url: `${PrivateRoutesAdmin.USERS}`,
      icon: Users,
    },
    {
      title: "Noticias",
      url: `${PrivateRoutesAdmin.NEWS}`,
      icon: FileText,
    },
    {
      title: "Eventos",
        url: `${PrivateRoutesAdmin.EVENTS}`,
        icon: Calendar,
    },
    {
        title: "Historias",
        url: `${PrivateRoutesAdmin.HISTORY}`,
        icon: FileText,
    },
    {
      title: "Biblioteca",
      url: `${PrivateRoutesAdmin.BIBLIOTHECA}`,
      icon: Package,
    },
    {
      title: "Presidentes",
      url: `${PrivateRoutesAdmin.PRESIDENTES}`,
      icon: FileText,
    },
    {
      title : "Etnias",
      url: `${PrivateRoutesAdmin.CULTURA}`,
      icon: FileText,
    },
    {
      title: "Comentarios",
      url: `${PrivateRoutesAdmin.COMENTARIOS}`,
      icon: FileText,
    },
    {
      title: "Estadisticas",
      url: `${PrivateRoutesAdmin.ESTADISTICAS}`,
      icon: FileText,
    }
  ],
  user: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    }
  ],
  manager: [
    {
      title: "Overview",
      url: "/manager",
      icon: Home,
    },
    {
      title: "Inventory",
      url: "/manager/inventory",
      icon: Package,
    },
    {
      title: "Reports",
      url: "/manager/reports",
      icon: FileText,
    },
    {
      title: "Admin",
      url: "/manager/admin",
      icon: Lock,
    }
  ]
};

interface AppSidebarProps {
  role?: string;
}

export function AppSidebar({ role = 'user' }: AppSidebarProps) {
  const items = menuItems[role as keyof typeof menuItems] || menuItems.user;
  
  return (
    <Sidebar className="hidden md:flex"> 
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === 'admin' ? 'Admin Panel' : 
             role === 'manager' ? 'Management' : 'Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}