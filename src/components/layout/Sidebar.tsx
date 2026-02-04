"use client";

import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import {
  LayoutDashboard,
  Package,
  Printer,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Tag,
  Contact,
  Store,
  LogOut,
  BarChart2,
  Palette,
  Hammer,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const REPORTS_OPEN_KEY = "sidebar-reports-open";

interface NavItemLeaf {
  type: "leaf";
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

interface NavItemGroup {
  type: "group";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  children: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

type NavItem = NavItemLeaf | NavItemGroup;

const navItems: NavItem[] = [
  { type: "leaf", label: "Overview", href: "/", icon: LayoutDashboard, roles: ["Admin", "Designer", "Printer", "Fabricator", "Vendor", "Dispatcher"] },
  { type: "leaf", label: "Jobs", href: "/jobs", icon: Package, roles: ["Admin", "Designer", "Printer", "Fabricator", "Vendor", "Dispatcher"] },
  { type: "leaf", label: "Products", href: "/products", icon: Tag, roles: ["Admin"] },
  { type: "leaf", label: "Customers", href: "/customers", icon: Contact, roles: ["Admin", "Designer"] },
  { type: "leaf", label: "Vendors", href: "/vendors", icon: Store, roles: ["Admin"] },
  {
    type: "group",
    label: "Reports",
    icon: BarChart2,
    roles: ["Admin"],
    children: [
      { label: "Designer Reports", href: "/reports/designer", icon: Palette },
      { label: "Printer Reports", href: "/reports/printer", icon: Printer },
      { label: "Fabricator Reports", href: "/reports/fabricator", icon: Hammer },
      { label: "Daily Task Reports", href: "/reports/daily-tasks", icon: CalendarDays },
    ],
  },
  { type: "leaf", label: "Users", href: "/users", icon: Users, roles: ["Admin"] },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const { userRole, logout } = useAuth();
  const pathname = usePathname();

  const [isReportsOpen, setIsReportsOpen] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(REPORTS_OPEN_KEY);
      if (stored !== null) setIsReportsOpen(stored === "true");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/reports")) setIsReportsOpen(true);
  }, [pathname]);

  const setReportsOpen = (open: boolean) => {
    setIsReportsOpen(open);
    try {
      localStorage.setItem(REPORTS_OPEN_KEY, String(open));
    } catch {
      // ignore
    }
  };

  if (!userRole) return null;

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

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
        {isCollapsed && <Printer className="text-blue-600 w-8 h-8" />}

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

      {isCollapsed && (
        <div className="w-full flex justify-center py-2 border-b border-slate-100">
          <button onClick={toggleSidebar} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <nav className={cn("flex-1 p-3 space-y-1", isCollapsed ? "overflow-hidden" : "overflow-y-auto custom-scrollbar")}>
        {filteredNavItems.map((item) => {
          if (item.type === "leaf") {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : ""}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                {!isCollapsed && <span>{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          }

          if (item.type === "group" && item.label === "Reports") {
            const isReportsActive = pathname.startsWith("/reports");
            if (isCollapsed) {
              return (
                <Link
                  key="reports"
                  href="/reports"
                  title="Reports"
                  className={cn(
                    "flex items-center justify-center px-2 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                    isReportsActive ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <BarChart2 className={cn("w-5 h-5 shrink-0", isReportsActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    Reports
                  </div>
                </Link>
              );
            }
            return (
              <div key="reports-group" className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setReportsOpen(!isReportsOpen)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left",
                    isReportsActive ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <BarChart2 className={cn("w-5 h-5 shrink-0", isReportsActive ? "text-blue-600" : "text-slate-400")} />
                  <span className="flex-1">{item.label}</span>
                  <ChevronDown
                    className={cn("w-4 h-4 shrink-0 text-slate-400 transition-transform", isReportsOpen && "rotate-180")}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    isReportsOpen ? "opacity-100" : "opacity-0 max-h-0"
                  )}
                  style={isReportsOpen ? { maxHeight: item.children.length * 40 } : undefined}
                >
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2 pl-6 pr-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                          isChildActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        {ChildIcon && (
                          <ChildIcon
                            className={cn(
                              "w-4 h-4",
                              isChildActive
                                ? "text-blue-600"
                                : "text-slate-400"
                            )}
                          />
                        )}
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          return null;
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
