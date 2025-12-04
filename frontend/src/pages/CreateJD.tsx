import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Header from "@/components/Header";

interface SavedJD {
  id: string;
  content: string;
  createdAt: string;
  title: string;
}

const CreateJD = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [savedJDs, setSavedJDs] = useState<SavedJD[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    // Load saved JDs from localStorage
    const stored = localStorage.getItem("savedJDs");
    if (stored) {
      setSavedJDs(JSON.parse(stored));
    }
  }, []);

  const extractTitleFromJD = (content: string): string => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
    }
    return "Untitled JD";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save this JD to the list
    const newJD: SavedJD = {
      id: Date.now().toString(),
      content: jobDescription,
      createdAt: new Date().toISOString(),
      title: extractTitleFromJD(jobDescription)
    };

    const updatedJDs = [newJD, ...savedJDs].slice(0, 10); // Keep last 10
    setSavedJDs(updatedJDs);
    localStorage.setItem("savedJDs", JSON.stringify(updatedJDs));
    localStorage.setItem("activeJD", jobDescription);
    
    toast.success("Job description created! Finding matching candidates...");
    setIsProcessing(false);
    
    navigate("/candidates");
  };

  const loadTemplate = (jd: SavedJD) => {
    setJobDescription(jd.content);
    setShowTemplates(false);
    toast.success("Template loaded!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Dashboard</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Create New Job Description
          </h1>
          <p className="text-muted-foreground">
            Enter your complete job description and our AI will find the best matching candidates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Textarea
                  id="jobDescription"
                  placeholder={`Enter your complete job description here...

Example:
Senior React Engineer - San Francisco, CA (Remote)

About the Role:
We're looking for a Senior React Engineer to join our growing team...

Requirements:
• 5+ years of experience with React
• Strong TypeScript skills
• Experience with state management (Redux, Zustand)
• Familiarity with testing frameworks

Responsibilities:
• Build and maintain web applications
• Mentor junior developers
• Participate in code reviews

Skills: React, TypeScript, Node.js, AWS, Team Leadership`}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[400px] resize-none text-base leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className={cn(
                  "w-full h-12 text-base font-medium",
                  "transition-all duration-300"
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    AI is finding candidates...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Find Matching Candidates
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Our AI will analyze your requirements and rank candidates by match score
              </p>
            </form>
          </motion.div>

          {/* Saved Templates Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="border border-border rounded-xl p-4 bg-card">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Recent JDs</h3>
              </div>

              {savedJDs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No saved job descriptions yet. Create your first one!
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {savedJDs.map((jd) => (
                    <button
                      key={jd.id}
                      onClick={() => loadTemplate(jd)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground truncate">
                        {jd.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(jd.createdAt)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreateJD;