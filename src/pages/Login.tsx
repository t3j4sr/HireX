import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { ElegantShape } from "@/components/ui/shape-landing-hero";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Login = () => {
  const { theme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-[#030303]">
      {/* Glass Taskbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "h-16 px-6 md:px-12",
          "bg-white/[0.03] backdrop-blur-xl",
          "border-b border-white/[0.08]",
          "flex items-center justify-between"
        )}
      >
        {/* Logo Space */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="text-white font-semibold tracking-wide">HireX</span>
        </div>

        {/* Center Navigation Links */}
        <div className="flex items-center gap-8">
          {/* Add JD Dropdown */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1.5",
                "text-white/60 hover:text-white",
                "text-sm font-medium tracking-wide",
                "transition-colors duration-300",
                "outline-none"
              )}
            >
              Add JD
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className={cn(
                "bg-[#0a0a0a]/95 backdrop-blur-xl",
                "border border-white/[0.1]",
                "rounded-xl shadow-2xl",
                "min-w-[200px]"
              )}
            >
              <DropdownMenuItem
                className={cn(
                  "text-white/70 hover:text-white hover:bg-white/[0.05]",
                  "cursor-pointer px-4 py-3",
                  "focus:bg-white/[0.05] focus:text-white"
                )}
              >
                <Link to="/create-jd" className="w-full">
                  1. Create new JD
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(
                  "text-white/70 hover:text-white hover:bg-white/[0.05]",
                  "cursor-pointer px-4 py-3",
                  "focus:bg-white/[0.05] focus:text-white"
                )}
              >
                <Link to="/upload-jd" className="w-full">
                  2. Upload existing JD
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right side - Theme toggle */}
        <div className="min-w-[120px] flex justify-end">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Elegant Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center container mx-auto px-4 md:px-6 pt-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-2 md:mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                HireX
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white/60 font-light tracking-wide mb-6 md:mb-8">
              An AI-powered hiring engine
            </p>
          </motion.div>

            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <Link
                to="/dashboard"
                className={cn(
                  "inline-block px-8 py-3 rounded-full",
                  "bg-white/[0.05] backdrop-blur-md",
                  "border border-white/[0.15]",
                  "text-white font-medium tracking-wide",
                  "transition-all duration-500 ease-out",
                  "hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-rose-500",
                  "hover:border-transparent hover:shadow-lg hover:shadow-purple-500/25",
                  "hover:scale-105"
                )}
              >
                Get Started
              </Link>
            </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Transform your recruitment process with intelligent candidate matching, 
              automated screening, and data-driven insights. Find the perfect talent 
              faster than ever before.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  );
};

export default Login;
