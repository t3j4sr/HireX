import { useState } from "react";
import { 
  ThumbsUp, 
  ThumbsDown, 
  ChevronDown,
  Briefcase,
  MapPin,
  Sparkles,
  Mail,
  Phone,
  Linkedin,
  Github,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";

interface Candidate {
  id: number;
  name: string;
  avatar: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  aiAnalysis: string;
  availability: "immediate" | "2-weeks" | "1-month" | "passive";
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  education: string;
  certifications: string[];
  projects: string[];
  languages: string[];
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
    skills: ["React", "Redux", "Architecture", "Team Leadership", "System Design", "TypeScript"],
    aiAnalysis: "Linda Wu presents an exceptional fit for senior engineering roles. Her 12 years of experience includes extensive work with React at scale, leading architecture decisions for complex applications.",
    availability: "immediate",
    email: "linda.wu@email.com",
    phone: "+1 (555) 123-4567",
    linkedin: "linkedin.com/in/lindawu",
    github: "github.com/lindawu",
    education: "MS Computer Science, Stanford University",
    certifications: ["AWS Solutions Architect", "Google Cloud Professional"],
    projects: ["Led migration of monolith to microservices serving 10M users", "Built real-time collaboration platform"],
    languages: ["English", "Mandarin"]
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "SC",
    title: "Senior Frontend Engineer",
    company: "TechFlow Solutions",
    location: "San Francisco, CA",
    experience: "6y exp",
    skills: ["React", "TypeScript", "Tailwind", "Performance", "Testing", "GraphQL"],
    aiAnalysis: "Sarah Chen presents a strong technical fit with direct alignment on React, TypeScript, and Tailwind CSS. Her performance optimization expertise is valuable.",
    availability: "2-weeks",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 234-5678",
    linkedin: "linkedin.com/in/sarahchen",
    github: "github.com/sarahchen",
    education: "BS Computer Science, UC Berkeley",
    certifications: ["React Advanced Patterns", "Performance Web Developer"],
    projects: ["Reduced load time by 60% for e-commerce platform", "Built component library used by 50+ developers"],
    languages: ["English", "Cantonese"]
  },
  {
    id: 3,
    name: "Michael Torres",
    avatar: "MT",
    title: "Frontend Developer",
    company: "StartupXYZ",
    location: "Austin, TX",
    experience: "4y exp",
    skills: ["React", "Next.js", "GraphQL", "Testing", "CI/CD", "Node.js"],
    aiAnalysis: "Michael Torres shows solid React fundamentals with growing experience in modern frameworks. His work with Next.js and GraphQL demonstrates adaptability.",
    availability: "immediate",
    email: "michael.torres@email.com",
    phone: "+1 (555) 345-6789",
    linkedin: "linkedin.com/in/michaeltorres",
    github: "github.com/mtorres",
    education: "BS Software Engineering, UT Austin",
    certifications: ["Meta Frontend Developer", "AWS Cloud Practitioner"],
    projects: ["Built SaaS dashboard with 99.9% uptime", "Open source contributor to Next.js"],
    languages: ["English", "Spanish"]
  },
  {
    id: 4,
    name: "Emily Johnson",
    avatar: "EJ",
    title: "React Developer",
    company: "Digital Agency Pro",
    location: "New York, NY",
    experience: "5y exp",
    skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "Agile"],
    aiAnalysis: "Emily Johnson brings full-stack capabilities with React expertise. Her agency background means exposure to diverse projects and fast-paced delivery.",
    availability: "1-month",
    email: "emily.johnson@email.com",
    phone: "+1 (555) 456-7890",
    linkedin: "linkedin.com/in/emilyjohnson",
    education: "BA Computer Science, NYU",
    certifications: ["Certified Scrum Master", "MongoDB Developer"],
    projects: ["Delivered 20+ client projects on time", "Built real-time chat application"],
    languages: ["English"]
  },
  {
    id: 5,
    name: "David Kim",
    avatar: "DK",
    title: "Full Stack Engineer",
    company: "FinTech Innovations",
    location: "Seattle, WA",
    experience: "8y exp",
    skills: ["React", "Python", "PostgreSQL", "Kubernetes", "Machine Learning", "Security"],
    aiAnalysis: "David Kim offers strong backend expertise combined with React skills. His fintech background brings valuable security and compliance knowledge.",
    availability: "passive",
    email: "david.kim@email.com",
    phone: "+1 (555) 567-8901",
    linkedin: "linkedin.com/in/davidkim",
    github: "github.com/dkim",
    education: "MS Computer Science, University of Washington",
    certifications: ["CISSP", "Kubernetes Administrator"],
    projects: ["Built fraud detection system processing $1B+ transactions", "Led platform modernization initiative"],
    languages: ["English", "Korean"]
  },
  {
    id: 6,
    name: "Jessica Martinez",
    avatar: "JM",
    title: "UI/UX Developer",
    company: "Creative Studio",
    location: "Los Angeles, CA",
    experience: "5y exp",
    skills: ["React", "Figma", "CSS", "Animation", "Accessibility", "Design Systems"],
    aiAnalysis: "Jessica Martinez combines design sensibility with strong React implementation skills. Her accessibility expertise ensures inclusive product development.",
    availability: "2-weeks",
    email: "jessica.martinez@email.com",
    phone: "+1 (555) 678-9012",
    linkedin: "linkedin.com/in/jessicamartinez",
    education: "BFA Digital Design, UCLA",
    certifications: ["Certified Web Accessibility Specialist", "Google UX Design"],
    projects: ["Redesigned app increasing user engagement by 40%", "Created design system adopted company-wide"],
    languages: ["English", "Spanish"]
  },
];

const getAvailabilityBadge = (availability: Candidate["availability"]) => {
  const config = {
    immediate: { label: "Available Now", variant: "default" as const, icon: CheckCircle2 },
    "2-weeks": { label: "2 Weeks Notice", variant: "secondary" as const, icon: Clock },
    "1-month": { label: "1 Month Notice", variant: "outline" as const, icon: Calendar },
    passive: { label: "Open to Offers", variant: "outline" as const, icon: Briefcase },
  };
  return config[availability];
};

const Candidates = () => {
  const [expandedCandidate, setExpandedCandidate] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const toggleExpand = (id: number) => {
    setExpandedCandidate(expandedCandidate === id ? null : id);
  };

  const handleFileUpload = (files: File[]) => {
    console.log("Uploaded files:", files);
    // Handle file upload logic here
  };

  const filteredCandidates = mockCandidates.filter((candidate) => {
    const query = searchQuery.toLowerCase();
    return (
      candidate.name.toLowerCase().includes(query) ||
      candidate.title.toLowerCase().includes(query) ||
      candidate.company.toLowerCase().includes(query) ||
      candidate.location.toLowerCase().includes(query) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
                All Candidates
              </h1>
              <p className="text-muted-foreground">
                Browse all available candidates and their qualifications
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card">
              <span className="text-foreground font-medium">{filteredCandidates.length}</span>
              <span className="text-muted-foreground">Candidates Available</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, title, company, location, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Resume
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Resume</DialogTitle>
              </DialogHeader>
              <div className="border border-dashed border-border rounded-lg bg-background">
                <FileUpload onChange={handleFileUpload} />
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="space-y-4">
          {filteredCandidates.map((candidate, index) => {
            const availabilityConfig = getAvailabilityBadge(candidate.availability);
            const AvailabilityIcon = availabilityConfig.icon;

            return (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
                className="border border-border rounded-xl p-6 bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium text-primary flex-shrink-0">
                    {candidate.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-foreground">
                            {candidate.name}
                          </h3>
                          <Badge variant={availabilityConfig.variant} className="flex items-center gap-1">
                            <AvailabilityIcon className="w-3 h-3" />
                            {availabilityConfig.label}
                          </Badge>
                        </div>
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
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      {candidate.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 5 && (
                        <span className="text-sm text-muted-foreground">
                          +{candidate.skills.length - 5} more
                        </span>
                      )}
                    </div>

                    {/* Key Projects Preview */}
                    <div className="mt-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Recent: </span>
                      {candidate.projects[0]}
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
                          <div className="mt-4 pt-4 border-t border-border space-y-4">
                            {/* Contact Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <a href={`mailto:${candidate.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{candidate.email}</span>
                              </a>
                              <a href={`tel:${candidate.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                <Phone className="w-4 h-4" />
                                <span>{candidate.phone}</span>
                              </a>
                              {candidate.linkedin && (
                                <a href={`https://${candidate.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                  <Linkedin className="w-4 h-4" />
                                  <span>LinkedIn</span>
                                </a>
                              )}
                              {candidate.github && (
                                <a href={`https://${candidate.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                  <Github className="w-4 h-4" />
                                  <span>GitHub</span>
                                </a>
                              )}
                            </div>

                            {/* Education & Certifications */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-foreground mb-1">Education</p>
                                <p className="text-sm text-muted-foreground">{candidate.education}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground mb-1">Certifications</p>
                                <div className="flex flex-wrap gap-1">
                                  {candidate.certifications.map((cert) => (
                                    <Badge key={cert} variant="outline" className="text-xs">
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Projects */}
                            <div>
                              <p className="text-sm font-medium text-foreground mb-2">Notable Projects</p>
                              <ul className="space-y-1">
                                {candidate.projects.map((project, i) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    {project}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Languages */}
                            <div>
                              <p className="text-sm font-medium text-foreground mb-1">Languages</p>
                              <p className="text-sm text-muted-foreground">{candidate.languages.join(", ")}</p>
                            </div>

                            {/* AI Analysis */}
                            <div className="pt-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-muted-foreground">AI ANALYSIS</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {candidate.aiAnalysis}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Candidates;