
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  ArrowLeft, 
  ChevronDown, 
  ShieldCheck, 
  Shield, 
  Terminal, 
  FileText,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import PageTransition from "@/components/PageTransition";

interface Threat {
  id: string;
  time: Date;
  type: "microphone" | "screen";
  description: string;
  level: "low" | "medium" | "high";
  transcript?: string;
}

const ThreatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [threat, setThreat] = useState<Threat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the threat from sessionStorage
    const storedThreat = sessionStorage.getItem("currentThreat");
    if (storedThreat) {
      const parsedThreat = JSON.parse(storedThreat);
      // Convert string time back to Date object
      parsedThreat.time = new Date(parsedThreat.time);
      setThreat(parsedThreat);
    }
    setLoading(false);
  }, [id]);

  const getRecommendedAction = (level: string) => {
    switch (level) {
      case "high":
        return "Immediate action required. Terminate the session and review all recent activities.";
      case "medium":
        return "Monitor closely and be cautious about sharing sensitive information.";
      case "low":
        return "Be aware but continue with normal operations.";
      default:
        return "Unknown threat level. Review with caution.";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "high":
        return <Shield className="h-5 w-5 text-destructive" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "low":
        return <ShieldCheck className="h-5 w-5 text-success" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-warning";
      case "low":
        return "text-success";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse space-y-2 text-center">
          <div className="h-8 w-48 bg-muted rounded mx-auto"></div>
          <div className="h-4 w-64 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!threat) {
    return (
      <PageTransition>
        <div className="space-y-6 text-center py-12">
          <h1 className="text-3xl font-bold">Threat Not Found</h1>
          <p className="text-muted-foreground">
            The specified threat could not be found or has expired.
          </p>
          <Button onClick={() => navigate("/monitor")}>
            Return to Monitor
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Threat Details</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`border-${threat.level === "high" ? "destructive" : threat.level === "medium" ? "warning" : "success"}/40 ${threat.level === "high" ? "danger-glow" : threat.level === "medium" ? "warning-glow" : "glow"}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getLevelIcon(threat.level)}
                  <CardTitle className={`${getLevelColor(threat.level)}`}>
                    {threat.level.charAt(0).toUpperCase() + threat.level.slice(1)} Risk Threat
                  </CardTitle>
                </div>
                <Badge variant={threat.level === "high" ? "destructive" : threat.level === "medium" ? "default" : "outline"}>
                  {threat.type === "microphone" ? "Audio" : "Visual"} Threat
                </Badge>
              </div>
              <CardDescription>
                Detected at {threat.time.toLocaleTimeString()} on {threat.time.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p>{threat.description}</p>
              </div>

              <Separator />

              {threat.transcript && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Transcript</h3>
                  </div>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 text-sm">
                      <p className="italic">"{threat.transcript}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">AI Analysis</h3>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="confidence">
                    <AccordionTrigger>Confidence Level</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Detection Confidence</span>
                          <span className="font-semibold">
                            {threat.level === "high" 
                              ? "92%" 
                              : threat.level === "medium" 
                                ? "78%" 
                                : "65%"}
                          </span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div 
                            className={`absolute h-full rounded-full ${
                              threat.level === "high" 
                                ? "bg-destructive w-[92%]" 
                                : threat.level === "medium" 
                                  ? "bg-warning w-[78%]" 
                                  : "bg-success w-[65%]"
                            }`}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="details">
                    <AccordionTrigger>Technical Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Detection Method</span>
                          <span className="font-mono">
                            {threat.type === "microphone" ? "NLP Pattern Analysis" : "Visual Recognition"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pattern ID</span>
                          <span className="font-mono">{`THR${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Signature Match</span>
                          <span className="font-mono">
                            {threat.level === "high" 
                              ? "Strong" 
                              : threat.level === "medium" 
                                ? "Moderate" 
                                : "Weak"}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Recommended Action</h3>
                </div>
                <Card className={`
                  ${threat.level === "high" 
                    ? "bg-destructive/10 border-destructive/50" 
                    : threat.level === "medium" 
                      ? "bg-warning/10 border-warning/50" 
                      : "bg-success/10 border-success/50"
                  }`}>
                  <CardContent className="p-4">
                    <p>{getRecommendedAction(threat.level)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button onClick={() => navigate("/summary")}>
            View All Threats
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default ThreatDetail;
