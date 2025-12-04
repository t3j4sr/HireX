import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { 
  Briefcase, 
  Bell, 
  Moon,
  Sun,
  Users,
  LayoutDashboard,
  ChevronDown,
  LogOut,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

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

          <Link
            to="/create-jd"
            className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              isActive("/create-jd") 
                ? "text-foreground font-medium" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Briefcase className="w-4 h-4" />
            Create JD
          </Link>

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
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">Jane Doe</p>
              <p className="text-xs text-muted-foreground">Recruiter</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
              JD
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="cursor-pointer"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark Mode
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;