import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthDialog } from "@/components/auth-dialog";
import { Moon, Sun, Search, Menu, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navigation({ searchQuery, onSearchChange }: NavigationProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: authData } = useQuery({
    queryKey: ["/api/auth/check"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/check"] });
      toast({ title: "Logged out successfully" });
    },
  });

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/motorcycles", label: "Motorcycles" },
    { href: "/articles", label: "Articles" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const isAdminPage = location === "/admin";

  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {isAdminPage ? (
              <h1 className="text-2xl font-bold text-orange-500">Moto Tunisia</h1>
            ) : (
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-orange-500">Moto Tunisia</h1>
              </Link>
            )}

            {!isAdminPage && (
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span className={`px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-gray-900 dark:text-white hover:text-orange-500"
                          : "text-gray-700 dark:text-gray-300 hover:text-orange-500"
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar - Only show on non-admin pages */}
            {!isAdminPage && (
              <div className="relative hidden sm:block">
                <Input
                  type="text"
                  placeholder="Search motorcycles..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-64 pr-10"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            )}

            {/* Authentication */}
            {authData?.authenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {authData.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {authData.user?.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthOpen(true)}
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {!isAdminPage && (
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search motorcycles..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pr-10"
                      />
                      <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  )}

                  {!isAdminPage && navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span
                        className={`block px-3 py-2 text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["/api/auth/check"] });
        }}
      />
    </nav>
  );
}