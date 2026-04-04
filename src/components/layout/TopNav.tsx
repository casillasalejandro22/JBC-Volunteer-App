"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bug,
  Menu,
  LogOut,
  ArrowLeftRight,
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Clock,
  Users,
  CheckSquare,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function TopNav() {
  const { user, switchRole, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = user?.role === "staff" ? staffNav : volunteerNav;

  const handleSwitchRole = async () => {
    const newRole = user?.role === "staff" ? "volunteer" : "staff";
    await switchRole(newRole);
    router.push("/dashboard");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden" />}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex items-center gap-2 px-6 py-5 border-b">
              <Bug className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">June Bug Center</span>
            </div>
            <nav className="px-3 py-4 space-y-1">
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
          </SheetContent>
        </Sheet>

        {/* Mobile logo */}
        <div className="flex items-center gap-2 md:hidden">
          <Bug className="h-5 w-5 text-primary" />
          <span className="font-semibold">JBC</span>
        </div>

        {/* Page title area */}
        <div className="flex-1" />

        {/* Role badge */}
        {user && (
          <span className="hidden sm:inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
            {user.role} View
          </span>
        )}

        {/* User dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                />
              }
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span className="hidden sm:inline text-sm">{user.name}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleSwitchRole}>
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Switch to {user.role === "staff" ? "Volunteer" : "Staff"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
