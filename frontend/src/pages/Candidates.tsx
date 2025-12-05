import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  Upload,
  Loader2,
  Trash
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
import { api } from "@/services/api";
import { toast } from "sonner";

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
  matchScore?: number;
}

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
  const location = useLocation();
  const [expandedCandidate, setExpandedCandidate] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const jobId = location.state?.jobId;
  const jobTitle = location.state?.jobTitle;

  useEffect(() => {
    fetchCandidates();
  }, [jobId]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      let data;
      if (jobId) {
        data = await api.getRankedCandidates(jobId);
        const mapped = data.map((item: any) => mapBackendCandidate(item.candidate, item.match_score, item.reasoning));
        setCandidates(mapped);
      } else {
        data = await api.getAllCandidates();
        const mapped = data.map((item: any) => mapBackendCandidate(item));
        setCandidates(mapped);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await api.deleteCandidate(id);
        // Update the candidates list
        const updatedCandidates = candidates.filter(c => c.id !== id);
        setCandidates(updatedCandidates);
        toast.success("Candidate deleted successfully");

        // If we're on a job-specific view, refresh the candidates
        if (jobId) {
          fetchCandidates();
        }
      } catch (error: any) {
        console.error("Delete error:", error);
        const errorMessage = error?.response?.data?.detail || error?.message || "Failed to delete candidate. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete ALL candidates? This action cannot be undone.")) {
      try {
        await api.deleteAllCandidates();
        setCandidates([]);
        toast.success("All candidates deleted successfully");
      } catch (error: any) {
        console.error("Delete all error:", error);
        toast.error("Failed to delete all candidates");
      }
    }
  };

  const generateMeaningfulAnalysis = (backendData: any, score?: number, reasoning?: string): string => {
    const parseJson = (str: string) => {
      try { return JSON.parse(str); } catch { return []; }
    };

    const skills = typeof backendData.skills === 'string' ? parseJson(backendData.skills) : (backendData.skills || []);
    const softSkills = typeof backendData.soft_skills === 'string' ? parseJson(backendData.soft_skills) : (backendData.soft_skills || []);
    const name = backendData.name || "This candidate";
    const hasProjects = backendData.projects && backendData.projects.length > 0;
    const hasCerts = backendData.certifications && backendData.certifications.length > 0;

    // If we have LLM reasoning from ranking, use it
    if (reasoning && reasoning.length > 20) {
      return reasoning;
    }

    // Generate meaningful analysis based on available data
    const lines: string[] = [];

    // Line 1: Skills overview
    if (skills.length > 0) {
      const topSkills = skills.slice(0, 3).join(", ");
      lines.push(`${name} demonstrates strong proficiency in ${topSkills}${skills.length > 3 ? ` and ${skills.length - 3} other technical skills` : ""}.`);
    }

    // Line 2: Soft skills and experience
    if (softSkills.length > 0) {
      lines.push(`Shows excellent ${softSkills.slice(0, 2).join(" and ")} capabilities, indicating strong team collaboration potential.`);
    } else if (backendData.experience_summary) {
      const expPreview = backendData.experience_summary.substring(0, 100);
      lines.push(`Career background: ${expPreview}...`);
    }

    // Line 3: Projects/Certifications highlight
    if (hasProjects || hasCerts) {
      const highlights: string[] = [];
      if (hasProjects) highlights.push("hands-on project experience");
      if (hasCerts) highlights.push("relevant certifications");
      lines.push(`Additional strengths include ${highlights.join(" and ")}, demonstrating continuous learning and practical application.`);
    }

    // Add match score context if available
    if (score && score > 0) {
      if (score >= 70) {
        lines.push(`Semantic Match: ${score.toFixed(1)}% - Highly recommended for this role.`);
      } else if (score >= 40) {
        lines.push(`Semantic Match: ${score.toFixed(1)}% - Good potential fit with some skill gaps to consider.`);
      } else {
        lines.push(`Semantic Match: ${score.toFixed(1)}% - May require additional training for this specific role.`);
      }
    }

    return lines.length > 0 ? lines.join(" ") : "Profile analysis pending. Upload additional details for comprehensive evaluation.";
  };

  const mapBackendCandidate = (backendData: any, score?: number, reasoning?: string): Candidate => {
    const parseJson = (str: string) => {
      try { return JSON.parse(str); } catch { return []; }
    };

    const skills = typeof backendData.skills === 'string' ? parseJson(backendData.skills) : (backendData.skills || []);
    const softSkills = typeof backendData.soft_skills === 'string' ? parseJson(backendData.soft_skills) : (backendData.soft_skills || []);
    const allSkills = [...skills, ...softSkills];

    return {
      id: backendData.id,
      name: backendData.name || "Unknown Candidate",
      avatar: (backendData.name || "U").substring(0, 2).toUpperCase(),
      title: "Candidate",
      company: "Unknown",
      location: "Remote",
      experience: backendData.experience_summary?.substring(0, 100) || "No summary",
      skills: allSkills.length > 0 ? allSkills : ["No skills extracted"],
      aiAnalysis: generateMeaningfulAnalysis(backendData, score, reasoning),
      availability: "immediate",
      email: backendData.email || "No email",
      phone: backendData.phone || "No phone",
      education: "Not specified",
      certifications: backendData.certifications ? [backendData.certifications] : [],
      projects: backendData.projects ? [backendData.projects] : [],
      languages: ["English"],
      matchScore: score
    };
  };

  const toggleExpand = (id: number) => {
    setExpandedCandidate(expandedCandidate === id ? null : id);
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      const results = await api.uploadResumes(files);
      console.log("Upload results:", results);

      // Check if there are any errors in the results
      const errors = results.filter((r: any) => r.status === "error");
      const successes = results.filter((r: any) => r.status === "success");

      if (errors.length > 0) {
        const errorMessages = errors.map((e: any) => `${e.filename}: ${e.detail || 'Unknown error'}`).join(", ");
        toast.error(`Some files failed: ${errorMessages}`);
      }

      if (successes.length > 0) {
        setUploadDialogOpen(false);
        fetchCandidates();
        toast.success(`${successes.length} resume(s) uploaded successfully`);
      } else {
        toast.error("Failed to upload resumes. Please check file format (PDF or DOCX) and try again.");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage = error?.response?.data?.detail || error?.message || "Failed to upload resumes. Please ensure the backend server is running.";
      toast.error(errorMessage);
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
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

      <main className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
                {jobTitle ? `Candidates for: ${jobTitle}` : "All Candidates"}
              </h1>
              <p className="text-muted-foreground">
                {jobTitle ? "Ranked by AI match score" : "Browse all available candidates"}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card">
              <span className="text-foreground font-medium">{filteredCandidates.length}</span>
              <span className="text-muted-foreground">Candidates</span>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" strokeWidth={1.5} />
            <Input
              placeholder="Search by name, title, company, location, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              className="flex items-center gap-2"
            >
              <Trash className="w-4 h-4" strokeWidth={1.5} />
              Clear All
            </Button>

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" strokeWidth={1.5} />
                  Upload Resumes
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Resumes (Bulk)</DialogTitle>
                </DialogHeader>
                <div className="border border-dashed border-border rounded-lg bg-background">
                  <FileUpload onChange={handleFileUpload} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-foreground/70" strokeWidth={1.5} />
            <span className="ml-2 text-muted-foreground">Loading candidates...</span>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No candidates found. Upload some resumes to get started!</p>
          </div>
        ) : (
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
                            {candidate.matchScore && (
                              <Badge variant="default" className="bg-green-600">
                                {candidate.matchScore.toFixed(1)}% Match
                              </Badge>
                            )}
                            <Badge variant={availabilityConfig.variant} className="flex items-center gap-1">
                              <AvailabilityIcon className="w-3 h-3" />
                              {availabilityConfig.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <Briefcase className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
                              {candidate.title} at {candidate.company}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
                              {candidate.location}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <button
                            className="p-2 text-foreground/50 hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCandidate(candidate.id);
                            }}
                            title="Delete Candidate"
                          >
                            <Trash className="w-5 h-5" strokeWidth={1.5} />
                          </button>
                          <button className="p-2 text-foreground/50 hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                            <ThumbsUp className="w-5 h-5" strokeWidth={1.5} />
                          </button>
                          <button className="p-2 text-foreground/50 hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                            <ThumbsDown className="w-5 h-5" strokeWidth={1.5} />
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
                                  <Mail className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
                                  <span className="truncate">{candidate.email}</span>
                                </a>
                                <a href={`tel:${candidate.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                  <Phone className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
                                  <span>{candidate.phone}</span>
                                </a>
                                {candidate.linkedin && (
                                  <a href={`https://${candidate.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    <Linkedin className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
                                    <span>LinkedIn</span>
                                  </a>
                                )}
                                {candidate.github && (
                                  <a href={`https://${candidate.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    <Github className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
                                    <span>GitHub</span>
                                  </a>
                                )}
                              </div>

                              {/* AI Analysis */}
                              <div className="pt-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <Sparkles className="w-4 h-4 text-foreground/70" strokeWidth={1.5} />
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
        )}
      </main>
    </div>
  );
};

export default Candidates;