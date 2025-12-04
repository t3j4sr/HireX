import { DottedSurface } from "@/components/ui/dotted-surface";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const Index = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <DottedSurface className="min-h-screen w-full">
      {/* Floating Buttons */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center justify-center w-12 h-12",
            "bg-foreground/5 backdrop-blur-md",
            "border border-foreground/10",
            "rounded-full",
            "text-foreground",
            "transition-all duration-300 ease-out",
            "hover:bg-foreground/10 hover:border-foreground/20",
            "hover:shadow-lg hover:shadow-foreground/5",
            "hover:rotate-12"
          )}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Login Button */}
        <Link
          to="/login"
          className={cn(
            "flex items-center gap-2 px-6 py-3",
            "bg-foreground/5 backdrop-blur-md",
            "border border-foreground/10",
            "rounded-full",
            "text-foreground font-medium",
            "transition-all duration-300 ease-out",
            "hover:bg-foreground/10 hover:border-foreground/20",
            "hover:shadow-lg hover:shadow-foreground/5",
            "group"
          )}
        >
          <span>Login</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full",
            "bg-[radial-gradient(ellipse_at_center,hsl(var(--foreground)/0.1),transparent_50%)]",
            "blur-[30px]"
          )}
        />
        <h1 className="font-display text-7xl md:text-9xl font-bold tracking-tight text-foreground">
          HireX
        </h1>
      </div>
    </DottedSurface>
  );
};

export default Index;
