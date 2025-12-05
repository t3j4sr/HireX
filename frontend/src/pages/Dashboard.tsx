import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";

const Dashboard = () => {
  const [candidateCount, setCandidateCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    // Fetch real data from backend
    fetch("http://localhost:8002/api/v1/candidates")
      .then(res => res.json())
      .then(data => setCandidateCount(data.length))
      .catch(err => console.log(err));

    // For now we don't have a jobs list endpoint, showing 0
    setJobCount(0);
  }, []);

  const stats = [
    { label: "Uploaded Candidates", value: candidateCount.toString(), icon: Users, change: "" },
    { label: "Active Jobs", value: jobCount.toString(), icon: Briefcase, change: "" },
    { label: "Avg. Match Rate", value: "--", icon: TrendingUp, change: "" },
    { label: "Avg. Time to Hire", value: "--", icon: Clock, change: "" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Recruitment Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of job seekers and hiring analytics
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-foreground/80" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
