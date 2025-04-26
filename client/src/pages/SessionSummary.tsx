
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Shield, 
  Download, 
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
  Mic,
  Monitor as MonitorIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const SessionSummary = () => {
  const navigate = useNavigate();
  const [threats, setThreats] = useState<Threat[]>([]);
  const [selectedTab, setSelectedTab] = useState<"all" | "high" | "medium" | "low">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get threats from sessionStorage
    const storedThreats = sessionStorage.getItem("threatAlerts");
    if (storedThreats) {
      const parsedThreats = JSON.parse(storedThreats);
      // Convert string times back to Date objects
      const formattedThreats = parsedThreats.map((threat: any) => ({
        ...threat,
        time: new Date(threat.time)
      }));
      setThreats(formattedThreats);
    }
    setLoading(false);
  }, []);

  const filteredThreats = selectedTab === "all" 
    ? threats 
    : threats.filter(threat => threat.level === selectedTab);

  const threatCounts = {
    all: threats.length,
    high: threats.filter(threat => threat.level === "high").length,
    medium: threats.filter(threat => threat.level === "medium").length,
    low: threats.filter(threat => threat.level === "low").length
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "high":
        return <Shield className="h-4 w-4 text-destructive" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "low":
        return <ShieldCheck className="h-4 w-4 text-success" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleDownloadReport = () => {
    // Generate a report string
    const timestamp = new Date().toLocaleString();
    let reportContent = `CyberSentinel Threat Report - Generated ${timestamp}\n\n`;
    reportContent += `Session Summary:\n`;
    reportContent += `Total Threats: ${threats.length}\n`;
    reportContent += `Critical Threats: ${threatCounts.high}\n`;
    reportContent += `Warning Threats: ${threatCounts.medium}\n`;
    reportContent += `Low Risk Alerts: ${threatCounts.low}\n\n`;
    
    reportContent += `Detailed Threat List:\n\n`;
    
    threats.forEach((threat, index) => {
      reportContent += `${index + 1}. ${threat.description}\n`;
      reportContent += `   Time: ${threat.time.toLocaleString()}\n`;
      reportContent += `   Type: ${threat.type === "microphone" ? "Audio" : "Visual"}\n`;
      reportContent += `   Risk Level: ${threat.level}\n`;
      if (threat.transcript) {
        reportContent += `   Transcript: "${threat.transcript}"\n`;
      }
      reportContent += `\n`;
    });
    
    // Create and download the file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber-sentinel-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const viewThreatDetail = (threat: Threat) => {
    sessionStorage.setItem("currentThreat", JSON.stringify(threat));
    navigate(`/threat/${threat.id}`);
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

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
            aria-label="Go home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Session Summary</h1>
        </div>

        {threats.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 md:grid-cols-4"
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Total Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{threats.length}</div>
                </CardContent>
              </Card>
              
              <Card className="border-destructive/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Critical</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{threatCounts.high}</div>
                </CardContent>
              </Card>
              
              <Card className="border-warning/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Warnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{threatCounts.medium}</div>
                </CardContent>
              </Card>
              
              <Card className="border-success/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Low Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{threatCounts.low}</div>
                </CardContent>
              </Card>
            </motion.div>

            <Tabs defaultValue="all" className="space-y-4" onValueChange={(value) => setSelectedTab(value as any)}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All ({threatCounts.all})</TabsTrigger>
                  <TabsTrigger value="high">Critical ({threatCounts.high})</TabsTrigger>
                  <TabsTrigger value="medium">Warning ({threatCounts.medium})</TabsTrigger>
                  <TabsTrigger value="low">Low Risk ({threatCounts.low})</TabsTrigger>
                </TabsList>
                <Button variant="outline" onClick={handleDownloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
              
              <TabsContent value="all" className="space-y-4">
                <AnimatePresence>
                  {filteredThreats.length > 0 ? (
                    filteredThreats.map((threat) => (
                      <motion.div
                        key={threat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <Card 
                          className="overflow-hidden cursor-pointer card-hover"
                          onClick={() => viewThreatDetail(threat)}
                        >
                          <CardContent className="p-0">
                            <div className="flex items-center p-4">
                              <div className="mr-3">
                                {getLevelIcon(threat.level)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{threat.description}</p>
                                  <Badge variant={
                                    threat.level === "high" 
                                      ? "destructive" 
                                      : threat.level === "medium" 
                                        ? "default" 
                                        : "outline"
                                  } className="ml-auto">
                                    {threat.level}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <time>{threat.time.toLocaleString()}</time>
                                  <span>•</span>
                                  <div className="flex items-center">
                                    {threat.type === "microphone" ? (
                                      <><Mic className="h-3 w-3 mr-1" /> Audio</>
                                    ) : (
                                      <><MonitorIcon className="h-3 w-3 mr-1" /> Visual</>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-6 text-center">
                        <p className="text-muted-foreground">No threats found in this category.</p>
                      </CardContent>
                    </Card>
                  )}
                </AnimatePresence>
              </TabsContent>
              
              <TabsContent value="high" className="space-y-4">
                <AnimatePresence>
                  {filteredThreats.length > 0 ? (
                    filteredThreats.map((threat) => (
                      <motion.div
                        key={threat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <Card 
                          className="overflow-hidden cursor-pointer card-hover"
                          onClick={() => viewThreatDetail(threat)}
                        >
                          <CardContent className="p-0">
                            <div className="flex items-center p-4">
                              <div className="mr-3">
                                {getLevelIcon(threat.level)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{threat.description}</p>
                                  <Badge variant="destructive" className="ml-auto">
                                    {threat.level}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <time>{threat.time.toLocaleString()}</time>
                                  <span>•</span>
                                  <div className="flex items-center">
                                    {threat.type === "microphone" ? (
                                      <><Mic className="h-3 w-3 mr-1" /> Audio</>
                                    ) : (
                                      <><MonitorIcon className="h-3 w-3 mr-1" /> Visual</>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-6 text-center">
                        <p className="text-muted-foreground">No critical threats found.</p>
                      </CardContent>
                    </Card>
                  )}
                </AnimatePresence>
              </TabsContent>
              
              <TabsContent value="medium" className="space-y-4">
                <AnimatePresence>
                  {filteredThreats.length > 0 ? (
                    filteredThreats.map((threat) => (
                      <motion.div
                        key={threat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <Card 
                          className="overflow-hidden cursor-pointer card-hover"
                          onClick={() => viewThreatDetail(threat)}
                        >
                          <CardContent className="p-0">
                            <div className="flex items-center p-4">
                              <div className="mr-3">
                                {getLevelIcon(threat.level)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{threat.description}</p>
                                  <Badge variant="default" className="ml-auto">
                                    {threat.level}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <time>{threat.time.toLocaleString()}</time>
                                  <span>•</span>
                                  <div className="flex items-center">
                                    {threat.type === "microphone" ? (
                                      <><Mic className="h-3 w-3 mr-1" /> Audio</>
                                    ) : (
                                      <><MonitorIcon className="h-3 w-3 mr-1" /> Visual</>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-6 text-center">
                        <p className="text-muted-foreground">No warning threats found.</p>
                      </CardContent>
                    </Card>
                  )}
                </AnimatePresence>
              </TabsContent>
              
              <TabsContent value="low" className="space-y-4">
                <AnimatePresence>
                  {filteredThreats.length > 0 ? (
                    filteredThreats.map((threat) => (
                      <motion.div
                        key={threat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <Card 
                          className="overflow-hidden cursor-pointer card-hover"
                          onClick={() => viewThreatDetail(threat)}
                        >
                          <CardContent className="p-0">
                            <div className="flex items-center p-4">
                              <div className="mr-3">
                                {getLevelIcon(threat.level)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{threat.description}</p>
                                  <Badge variant="outline" className="ml-auto">
                                    {threat.level}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <time>{threat.time.toLocaleString()}</time>
                                  <span>•</span>
                                  <div className="flex items-center">
                                    {threat.type === "microphone" ? (
                                      <><Mic className="h-3 w-3 mr-1" /> Audio</>
                                    ) : (
                                      <><MonitorIcon className="h-3 w-3 mr-1" /> Visual</>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-6 text-center">
                        <p className="text-muted-foreground">No low risk alerts found.</p>
                      </CardContent>
                    </Card>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 space-y-4"
          >
            <Shield className="h-16 w-16 mx-auto text-primary opacity-70" />
            <h2 className="text-2xl font-bold">No Threats Detected</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              No security threats were detected during your monitoring session. Your digital space is secure.
            </p>
            <Button 
              className="mt-4"
              onClick={() => navigate("/monitor")}
            >
              Start New Monitoring Session
            </Button>
          </motion.div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Return Home
          </Button>
          <Button onClick={() => navigate("/monitor")}>
            New Monitoring Session
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default SessionSummary;
