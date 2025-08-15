/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  Package,
  DollarSign,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { useState, type FC } from "react";
import { useAuthStore, type Role } from "../../stores/auth.store";
import { useThemeStore } from "../../stores/theme.store";
import { useRouterStore } from "../../stores/router.store";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
interface MenuItem{
  id: string;
  label: string;
  icon: React.ReactNode | any;
  href: string;
  roles: Role[];
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
}) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useThemeStore();
  const { currentRoute, navigate } = useRouterStore();

  
  const menuItems:MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "dashboard",
      roles: ["administrator", "employee"],
    },
    {
      id: "patients",
      label: "Pacientes",
      icon: Users,
      href: "patients",
      roles: ["administrator", "employee"],
    },
    {
      id: "medical-records",
      label: "Historiales Médicos",
      icon: FileText,
      href: "medical-records",
      roles: ["administrator", "employee"],
    },
    {
      id: "sales",
      label: "Ventas",
      icon: ShoppingCart,
      href: "sales",
      roles: ["administrator", "employee"],
    },
    {
      id: "inventory",
      label: "Inventario",
      icon: Package,
      href: "inventory",
      roles: ["administrator", "employee"],
    },
    {
      id: "cash-close",
      label: "Cierre de Caja",
      icon: DollarSign,
      href: "cash-close",
      roles: ["administrator"],
    },
    {
      id: "employees",
      label: "Empleados",
      icon: UserCheck,
      href: "employees",
      roles: ["administrator"],
    },
    {
      id: "reports",
      label: "Reportes",
      icon: BarChart3,
      href: "reports",
      roles: ["administrator"],
    },
    {
      id: "settings",
      label: "Configuraciones",
      icon: Settings,
      href: "settings",
      roles: ["administrator"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "employee")
  );

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (route: string) => {
    navigate(route as any);
    setSidebarOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 z-40 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-goodent-primary to-goodent-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-goodent-primary">
                Goodent
              </h2>
              <p className="text-xs text-muted-foreground">
                Sistema Odontológico
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.href;

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive
                    ? "bg-goodent-primary hover:bg-goodent-primary/90 text-white"
                    : "hover:bg-goodent-light"
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-goodent-accent text-goodent-primary">
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <Badge variant="secondary" className="text-xs">
                {user?.role === "administrator" ? "Admin" : "Empleado"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="lg:hidden w-10" />{" "}
              {/* Spacer for mobile menu button */}
              <h1 className="text-2xl font-semibold capitalize">
                {filteredMenuItems.find((item) => item.href === currentRoute)
                  ?.label || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-goodent-accent text-goodent-primary">
                        {user?.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("my-sales")}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>Mis Ventas</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
