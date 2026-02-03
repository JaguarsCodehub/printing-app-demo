
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { 
  LayoutDashboard, 
  Palette, 
  Printer, 
  Hammer, 
  Truck, 
  Package, 
  Users,
  LogOut,
  Settings,
  ChevronLeft, 
  ChevronRight,
  Menu,
  Tag,
  Contact,
  Store
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Changed clsx to cn if available, or just stick to clsx but cn is better

interface NavItem {
  label: string;
  href: string;
  icon: any;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: LayoutDashboard, roles: ["Admin", "Designer", "Printer", "Fabricator", "Vendor", "Dispatcher"] },
  { label: "Jobs", href: "/jobs", icon: Package, roles: ["Admin", "Designer", "Printer", "Fabricator", "Vendor", "Dispatcher"] },
  { label: "Products", href: "/products", icon: Tag, roles: ["Admin"] },
  { label: "Customers", href: "/customers", icon: Contact, roles: ["Admin", "Designer"] },
  { label: "Vendors", href: "/vendors", icon: Store, roles: ["Admin"] },
  { label: "Users", href: "/users", icon: Users, roles: ["Admin"] },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const { userRole, logout } = useAuth();
  const pathname = usePathname();

  if (!userRole) return null;

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside 
      className={cn(
        "bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 transition-all duration-300 z-50 overflow-x-hidden",
        isCollapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className={cn("p-4 border-b border-slate-200 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <h1 className="text-xl font-black flex items-center gap-2 text-slate-800 tracking-tight">
            <Printer className="text-blue-600 w-6 h-6" />
            PrintFlow
          </h1>
        )}
        {isCollapsed && (
           <Printer className="text-blue-600 w-8 h-8" />
        )}
        
        <button 
            onClick={toggleSidebar} 
            className={cn(
                "p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors",
                isCollapsed ? "hidden" : "block"
            )}
        >
            <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      
      {/* Collapsed Toggle Button (Only visible when collapsed to expand back) */}
       {isCollapsed && (
          <div className="w-full flex justify-center py-2 border-b border-slate-100">
            <button 
                onClick={toggleSidebar} 
                 className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
          </div>
       )}

      <nav className={cn(
          "flex-1 p-3 space-y-1",
          isCollapsed ? "overflow-hidden" : "overflow-y-auto custom-scrollbar"
        )}>
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : ""}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
              
              {!isCollapsed && <span>{item.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {item.label}
                  </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <button 
          onClick={() => logout()}
          title="Logout"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group",
             isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
