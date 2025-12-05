import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Settings,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import hxLogo from "@/assets/hx-logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GradualSpacing } from "@/components/ui/gradual-spacing";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const NavLinks = ({ className, onClick }: { className?: string, onClick?: () => void }) => (
    <>
      <Link
        to="/dashboard"
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 text-sm transition-colors",
          isActive("/dashboard")
            ? "text-foreground font-medium"
            : "text-muted-foreground hover:text-foreground",
          className
        )}
      >
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </Link>

      <Link
        to="/create-jd"
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 text-sm transition-colors",
          isActive("/create-jd")
            ? "text-foreground font-medium"
            : "text-muted-foreground hover:text-foreground",
          className
        )}
      >
        <Briefcase className="w-4 h-4" />
        Create JD
      </Link>

      <Link
        to="/candidates"
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 text-sm transition-colors",
          isActive("/candidates")
            ? "text-foreground font-medium"
            : "text-muted-foreground hover:text-foreground",
          className
        )}
      >
        <Users className="w-4 h-4" />
        Candidates
      </Link>
    </>
  );

  return (
    <header className={cn(
      "h-24 px-4 md:px-12",
      "bg-background border-b border-border",
      "flex items-center justify-between",
      "sticky top-0 z-50"
    )}>
      <div className="flex items-center gap-4 md:gap-8">
        {/* Logo - Left Side */}
        <Link to="/" className="flex items-center gap-2">
          <div className="overflow-hidden rounded-lg w-14 h-14 md:w-16 md:h-16">
            <img src={hxLogo} alt="HireX Logo" className="w-full h-full object-cover scale-150" />
          </div>
          <div className="hidden md:block">
            <GradualSpacing
              className="font-display text-2xl font-bold -tracking-widest text-foreground"
              text="HireX"
            />
          </div>
        </Link>

        {/* Mobile Menu - Beside Logo */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-8 mt-8">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <div className="overflow-hidden rounded-lg w-12 h-12">
                    <img src={hxLogo} alt="HireX Logo" className="w-full h-full object-cover scale-150" />
                  </div>
                  <GradualSpacing
                    className="font-display text-xl font-bold -tracking-widest text-foreground"
                    text="HireX"
                  />
                </Link>
                <nav className="flex flex-col gap-4">
                  <NavLinks className="text-base" onClick={() => setIsOpen(false)} />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "user@email.com"}</p>
            </div>
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                {user?.name ? getInitials(user.name) : "U"}
              </div>
            )}
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
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
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive"
            >
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