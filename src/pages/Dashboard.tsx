import { motion } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock,
  UserCheck,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const jobSeekerData = [
  { month: "Jan", seekers: 1200, applications: 450 },
  { month: "Feb", seekers: 1350, applications: 520 },
  { month: "Mar", seekers: 1500, applications: 680 },
  { month: "Apr", seekers: 1420, applications: 590 },
  { month: "May", seekers: 1680, applications: 720 },
  { month: "Jun", seekers: 1820, applications: 850 },
];

const skillDemandData = [
  { skill: "React", demand: 85 },
  { skill: "Python", demand: 78 },
  { skill: "TypeScript", demand: 72 },
  { skill: "AWS", demand: 65 },
  { skill: "Node.js", demand: 60 },
];

const experienceLevelData = [
  { name: "Entry", value: 30, color: "hsl(var(--primary))" },
  { name: "Mid", value: 45, color: "hsl(var(--muted-foreground))" },
  { name: "Senior", value: 20, color: "hsl(var(--accent-foreground))" },
  { name: "Lead", value: 5, color: "hsl(var(--secondary-foreground))" },
];

const stats = [
  { label: "Active Job Seekers", value: "12,480", icon: Users, change: "+12%" },
  { label: "Open Positions", value: "342", icon: Briefcase, change: "+8%" },
  { label: "Avg. Match Rate", value: "78%", icon: TrendingUp, change: "+5%" },
  { label: "Avg. Time to Hire", value: "18 days", icon: Clock, change: "-3 days" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-7xl">
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
              className="p-6 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  stat.change.startsWith("+") || stat.change.startsWith("-3") 
                    ? "text-green-600" 
                    : "text-muted-foreground"
                )}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Job Seekers Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 rounded-xl border border-border bg-card"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Job Seeker Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={jobSeekerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="seekers" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--muted-foreground))" }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Job Seekers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                <span className="text-sm text-muted-foreground">Applications</span>
              </div>
            </div>
          </motion.div>

          {/* Skills in Demand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-6 rounded-xl border border-border bg-card"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Skills in Demand</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={skillDemandData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="skill" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="demand" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Experience Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="p-6 rounded-xl border border-border bg-card"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Experience Levels</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={experienceLevelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {experienceLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-2 justify-center">
              {experienceLevelData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="p-6 rounded-xl border border-border bg-card lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a 
                href="/create-jd"
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Create JD</p>
                  <p className="text-sm text-muted-foreground">New job posting</p>
                </div>
              </a>
              <a 
                href="/candidates"
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">View Matches</p>
                  <p className="text-sm text-muted-foreground">AI-ranked candidates</p>
                </div>
              </a>
              <a 
                href="/upload-jd"
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Upload JD</p>
                  <p className="text-sm text-muted-foreground">Import existing</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
