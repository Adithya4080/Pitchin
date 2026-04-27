import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, ExternalLink, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";

interface LearnMoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceProfileId: string;
  onContinueViewing: () => void;
}

const VISITOR_ROLES = [
  { value: "investor", label: "Investor" },
  { value: "ecosystem_partner", label: "Ecosystem partner (accelerator, incubator, program)" },
  { value: "founder_innovator", label: "Founder / Innovator" },
  { value: "consultant_advisor", label: "Consultant / Advisor" },
  { value: "exploring", label: "Just exploring" },
];

const USEFULNESS_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "not_sure", label: "Not sure" },
  { value: "no", label: "No" },
];

const CONTACT_EMAIL = "pitche.saas@gmail.com";

export function LearnMoreModal({ 
  open, 
  onOpenChange, 
  sourceProfileId,
  onContinueViewing 
}: LearnMoreModalProps) {
  const [step, setStep] = useState(1);
  const [visitorRole, setVisitorRole] = useState<string>("");
  const [usefulnessResponse, setUsefulnessResponse] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmitFeedback = async () => {
    // Only submit if there's any data to submit
    if (!visitorRole && !usefulnessResponse && !feedbackText.trim()) {
      handleContinue();
      return;
    }

    setIsSubmitting(true);
    try {      
      setHasSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    onOpenChange(false);
    onContinueViewing();
    // Reset state for next time
    setTimeout(() => {
      setStep(1);
      setVisitorRole("");
      setUsefulnessResponse("");
      setFeedbackText("");
      setHasSubmitted(false);
    }, 300);
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=Pitchin Platform Inquiry`;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Section 1: Context */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Why you're seeing this profile on Pitchin
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Pitchin helps innovators and startups present their ideas and work in a 
                  structured, professional way — similar to a digital CV for ideas and ventures.
                </p>
                <p>
                  You're currently viewing a shared profile. Some interactions are intentionally 
                  limited in this view.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} className="gap-2">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Section 2: Quick Understanding */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Quick Understanding
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep(3)}
                  className="text-muted-foreground"
                >
                  Skip
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-foreground">Which best describes you?</Label>
                  <RadioGroup value={visitorRole} onValueChange={setVisitorRole}>
                    {VISITOR_ROLES.map((role) => (
                      <div key={role.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={role.value} id={role.value} />
                        <Label 
                          htmlFor={role.value} 
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          {role.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-foreground">
                    Would a platform like Pitchin be useful for you?
                    <span className="text-muted-foreground ml-1">(optional)</span>
                  </Label>
                  <RadioGroup value={usefulnessResponse} onValueChange={setUsefulnessResponse}>
                    {USEFULNESS_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={`useful-${option.value}`} />
                        <Label 
                          htmlFor={`useful-${option.value}`} 
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="gap-2">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Section 3: Share Your Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Share Your Experience
              </h3>
              <p className="text-muted-foreground text-sm">
                Have thoughts, feedback, or suggestions?
              </p>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us what you liked, what confused you, or what you'd expect from a platform like this…"
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="gap-2">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Section 4: Contact Pitchin */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Contact Pitchin
              </h3>
              <p className="text-muted-foreground">
                Want to speak with the team or share something directly?
              </p>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm select-all">{CONTACT_EMAIL}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleEmailClick}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Email us
                </Button>
              </div>
            </div>

            {/* Section 5: Exit Actions */}
            <div className="space-y-3 pt-4 border-t border-border">
              {hasSubmitted ? (
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Check className="h-5 w-5" />
                  <span>Thank you for your feedback!</span>
                </div>
              ) : null}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || hasSubmitted}
                  className="flex-1"
                >
                  {isSubmitting ? "Submitting..." : hasSubmitted ? "Submitted" : "Submit & Continue viewing"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleContinue}
                  className="flex-1"
                >
                  {hasSubmitted ? "Continue viewing profile" : "Skip & Close"}
                </Button>
              </div>
            </div>

            <div className="flex justify-start">
              <Button variant="ghost" onClick={() => setStep(3)} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Learn more about Pitchin</DialogTitle>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
