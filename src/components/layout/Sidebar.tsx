"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Clock,
  Users,
  CheckSquare,
  PlusCircle,
  Bug,
} from "lucide-react";
import { cn } from "@/lib/utils";

const volunteerNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Available Shifts", href: "/shifts", icon: CalendarDays },
  { label: "My Schedule", href: "/schedule", icon: ClipboardList },
  { label: "Hours History", href: "/hours", icon: Clock },
];

const staffNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Manage Shifts", href: "/shifts", icon: PlusCircle },
  { label: "Approvals", href: "/approvals", icon: CheckSquare },
  { label: "Attendance", href: "/attendance", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = user?.role === "staff" ? staffNav : volunteerNav;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <Bug className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">June Bug Center</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info footer */}
      {user && (
        <div className="border-t px-4 py-3">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {user.role}
          </p>
        </div>
      )}
    </aside>
  );
}
