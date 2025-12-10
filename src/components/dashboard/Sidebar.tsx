import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Zap, 
  BarChart3, 
  Settings, 
  FileText,
  Users,
  GitBranch,
  LogOut,
  Building2,
  Cpu,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { hasSimplePermission, getRoleBadgeColor } from "@/config/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const navigation = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard,
    permission: "dashboard.view" as const,
  },
  { 
    name: "Monitoring", 
    href: "/monitoring", 
    icon: Zap,
    permission: "monitoring.view" as const,
  },
  { 
    name: "Analytics", 
    href: "/analytics", 
    icon: BarChart3,
    permission: "analytics.view" as const,
  },
  { 
    name: "Reports", 
    href: "/reports", 
    icon: FileText,
    permission: "reports.view" as const,
  },
  { 
    name: "Monitoring Laporan", 
    href: "/monitoring-laporan", 
    icon: ClipboardCheck,
    permission: "monitoring-laporan.view" as const,
  },
  { 
    name: "Automation", 
    href: "/automation", 
    icon: GitBranch,
    permission: "automation.view" as const,
  },
  { 
    name: "Rooms", 
    href: "/rooms-management", 
    icon: Building2,
    permission: "users.view" as const,
  },
  { 
    name: "Devices", 
    href: "/devices-management", 
    icon: Cpu,
    permission: "users.view" as const,
  },
  { 
    name: "Users", 
    href: "/users", 
    icon: Users,
    permission: "users.view" as const,
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings,
    permission: "settings.view" as const,
  },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();

  // Dynamic menu names based on role
  const getMenuName = (item: typeof navigation[0]) => {
    if (item.href === '/reports' && user?.role === 'manajer') {
      return 'Review Reports';
    }
    return item.name;
  };
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter navigation based on user permissions
  const visibleNavigation = navigation.filter(item => 
    hasSimplePermission(user.role, item.permission)
  );

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <img 
          src="/logo-hex.svg" 
          alt="SIMEL Logo" 
          className="h-10 w-10"
        />
        <div>
          <h1 className="text-lg font-bold text-foreground">SIMEL</h1>
          <p className="text-xs text-muted-foreground">ITPLN Energy</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {visibleNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{getMenuName(item)}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
            {getInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
            <Badge 
              variant="secondary" 
              className={cn("mt-1 text-xs", getRoleBadgeColor(user.role))}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Logout Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin keluar dari sistem?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Ya, Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
