import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ElegantShape } from "@/components/ui/shape-landing-hero";
import logo from "@/assets/logo.jpeg";

const Login = () => {
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
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="HireX Logo" className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-white font-semibold tracking-wide">HireX</span>
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
                  "bg-white text-[#030303]",
                  "border border-white",
                  "font-medium tracking-wide",
                  "transition-all duration-300 ease-out",
                  "hover:bg-[#030303] hover:text-white",
                  "hover:border-white",
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