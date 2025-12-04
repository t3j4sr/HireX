import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { 
  Briefcase, 
  Bell, 
  Moon,
  Sun,
  ChevronDown,
  Users,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isJDDropdownOpen, setIsJDDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={cn(
      "h-16 px-6 md:px-12",
      "bg-background border-b border-border",
      "flex items-center justify-between",
      "sticky top-0 z-50"
    )}>
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link to="/login" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
          <span className="text-foreground font-semibold tracking-wide">HireX</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              isActive("/dashboard") 
                ? "text-foreground font-medium" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          {/* Add JD Dropdown */}
          <DropdownMenu open={isJDDropdownOpen} onOpenChange={setIsJDDropdownOpen}>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1.5",
                "text-muted-foreground hover:text-foreground",
                "text-sm transition-colors",
                "outline-none",
                (isActive("/create-jd") || isActive("/upload-jd")) && "text-foreground font-medium"
              )}
            >
              <Briefcase className="w-4 h-4" />
              Add JD
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isJDDropdownOpen && "rotate-180"
                )}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-popover border-border min-w-[200px]"
            >
              <DropdownMenuItem asChild>
                <Link to="/create-jd" className="w-full cursor-pointer">
                  Create new JD
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/upload-jd" className="w-full cursor-pointer">
                  Upload existing JD
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/candidates"
            className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              isActive("/candidates") 
                ? "text-foreground font-medium" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="w-4 h-4" />
            Candidates
          </Link>
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">Jane Doe</p>
            <p className="text-xs text-muted-foreground">Recruiter</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
