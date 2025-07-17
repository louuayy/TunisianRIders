import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Moon, Sun, Search, Menu } from "lucide-react";

interface NavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navigation({ searchQuery, onSearchChange }: NavigationProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/motorcycles", label: "Motorcycles" },
    { href: "/articles", label: "Articles" },
    { href: "/admin", label: "Admin" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-orange-500">Moto Tunisia</h1>
            </Link>
            
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
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
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
                  
                  {navItems.map((item) => (
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
    </nav>
  );
}
