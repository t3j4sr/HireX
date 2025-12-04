import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ThumbsUp, 
  ThumbsDown, 
  ChevronDown,
  Briefcase,
  MapPin,
  Sparkles,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

interface Candidate {
  id: number;
  name: string;
  avatar: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  matchScore: number;
  aiAnalysis: string;
}

const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Linda Wu",
    avatar: "LW",
    title: "Staff Software Engineer",
    company: "BigTech Co",
    location: "San Jose, CA",
    experience: "12y exp",
    skills: ["React", "Redux", "Architecture", "Team Leadership"],
    matchScore: 95,
    aiAnalysis: "Linda Wu presents an exceptional fit for the Senior React Engineer role. Her 12 years of experience includes extensive work with React at scale, leading architecture decisions for complex applications."
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "SC",
    title: "Senior Frontend Engineer",
    company: "TechFlow Solutions",
    location: "San Francisco, CA",
    experience: "6y exp",
    skills: ["React", "TypeScript", "Tailwind", "Performance"],
    matchScore: 85,
    aiAnalysis: "Sarah Chen presents a strong technical fit for the Senior React Engineer role, directly aligning with requirements for React, TypeScript, Tailwind CSS."
  },
  {
    id: 3,
    name: "Michael Torres",
    avatar: "MT",
    title: "Frontend Developer",
    company: "StartupXYZ",
    location: "Austin, TX",
    experience: "4y exp",
    skills: ["React", "Next.js", "GraphQL", "Testing"],
    matchScore: 78,
    aiAnalysis: "Michael Torres shows solid React fundamentals with growing experience in modern frameworks. His work with Next.js and GraphQL demonstrates adaptability."
  },
  {
    id: 4,
    name: "Emily Johnson",
    avatar: "EJ",
    title: "React Developer",
    company: "Digital Agency Pro",
    location: "New York, NY",
    experience: "5y exp",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    matchScore: 72,
    aiAnalysis: "Emily Johnson brings full-stack capabilities with React expertise. Her agency background means exposure to diverse projects and fast-paced delivery."
  },
];

// Check if a JD has been created (simulated with localStorage)
const hasActiveJD = () => {
  return localStorage.getItem("activeJD") !== null;
};

const Candidates = () => {
  const [expandedCandidate, setExpandedCandidate] = useState<number | null>(null);
  const hasJD = hasActiveJD();

  const toggleExpand = (id: number) => {
    setExpandedCandidate(expandedCandidate === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        {!hasJD ? (
          // No JD state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No Job Description Yet
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Create or upload a job description to see AI-matched candidates with compatibility scores.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link to="/create-jd">Create New JD</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/upload-jd">Upload Existing JD</Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          // Has JD - show candidates
          <>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
                  Top Candidates for{" "}
                  <span className="text-muted-foreground">Senior React Engineer</span>
                </h1>
                <p className="text-muted-foreground">
                  Based on 6 key skills and experience requirements.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card">
                <span className="text-foreground font-medium">{mockCandidates.length}</span>
                <span className="text-muted-foreground">Candidates Found</span>
              </div>
            </div>

            <div className="space-y-4">
              {mockCandidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  layout
                  className="border border-border rounded-xl p-6 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-lg font-medium text-muted-foreground flex-shrink-0">
                      {candidate.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {candidate.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <Briefcase className="w-4 h-4" />
                              {candidate.title} at {candidate.company}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              {candidate.location} • {candidate.experience}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <button className="p-2 text-muted-foreground hover:text-green-600 transition-colors">
                            <ThumbsUp className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
                            <ThumbsDown className="w-5 h-5" />
                          </button>
                          <div className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-semibold",
                            candidate.matchScore >= 90 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {candidate.matchScore}% Match
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        {candidate.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => toggleExpand(candidate.id)}
                        className="flex items-center justify-center w-full mt-4 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronDown 
                          className={cn(
                            "w-5 h-5 transition-transform duration-200",
                            expandedCandidate === candidate.id && "rotate-180"
                          )} 
                        />
                      </button>

                      <AnimatePresence>
                        {expandedCandidate === candidate.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-muted-foreground">AI ANALYSIS</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {candidate.aiAnalysis}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Candidates;
