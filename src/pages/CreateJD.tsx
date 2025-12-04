import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/Header";

const CreateJD = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    location: "",
    experienceLevel: "",
    requirements: "",
    responsibilities: "",
    skills: "",
    additionalNotes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.jobTitle || !formData.requirements) {
      toast.error("Please fill in the job title and requirements");
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store that a JD was created
    localStorage.setItem("activeJD", JSON.stringify(formData));
    
    toast.success("Job description created! Finding matching candidates...");
    setIsProcessing(false);
    
    // Navigate to candidates page with matches
    navigate("/candidates");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-3xl">
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
            Enter the job requirements and our AI will find the best matching candidates.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Senior React Engineer"
                value={formData.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g. Engineering"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, CA (Remote)"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Input
                id="experienceLevel"
                placeholder="e.g. 5+ years"
                value={formData.experienceLevel}
                onChange={(e) => handleChange("experienceLevel", e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Key Requirements *</Label>
            <Textarea
              id="requirements"
              placeholder="Describe the must-have qualifications, technical requirements, and experience needed for this role..."
              value={formData.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <Textarea
              id="responsibilities"
              placeholder="List the main duties and responsibilities for this position..."
              value={formData.responsibilities}
              onChange={(e) => handleChange("responsibilities", e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Required Skills</Label>
            <Textarea
              id="skills"
              placeholder="List specific skills separated by commas (e.g. React, TypeScript, Node.js, AWS, Team Leadership)"
              value={formData.skills}
              onChange={(e) => handleChange("skills", e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any other preferences or nice-to-haves for the ideal candidate..."
              value={formData.additionalNotes}
              onChange={(e) => handleChange("additionalNotes", e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="pt-4">
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
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Our AI will analyze your requirements and rank candidates by match score
          </p>
        </motion.form>
      </main>
    </div>
  );
};

export default CreateJD;
