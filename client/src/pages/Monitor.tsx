import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Monitor as MonitorIcon,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  Camera,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageTransition from "@/components/PageTransition";
import { useToast } from "@/hooks/use-toast";
import { useMediaPermissionsContext } from "@/contexts/MediaPermissionsContext";
import MediaPermissionsDialog from "@/components/MediaPermissionsDialog";

type ThreatLevel = "low" | "medium" | "high";

interface Alert {
  id: string;
  time: Date;
  type: "microphone" | "screen";
  description: string;
  level: ThreatLevel;
  transcript?: string;
}

const levelConfig: Record<
  ThreatLevel,
  { icon: React.ElementType; className: string }
> = {
  low: { icon: AlertCircle, className: "bg-success/10 text-success" },
  medium: { icon: AlertTriangle, className: "bg-warning/10 text-warning" },
  high: { icon: ShieldAlert, className: "bg-destructive/10 text-destructive" },
};

const Monitor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    permissions,
    hasAllPermissions,
    setShowPermissionsDialog,
    startStreams,
    stopStreams,
    streams,
    error: permissionsError,
  } = useMediaPermissionsContext();

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // Start monitoring when permissions are available
  useEffect(() => {
    if (hasAllPermissions && !isMonitoring) {
      startMonitoring();
    }
  }, [hasAllPermissions]);

  const startMonitoring = async () => {
    if (!hasAllPermissions) {
      setShowPermissionsDialog(true);
      return;
    }

    const success = await startStreams();
    if (success) {
      setIsMonitoring(true);
      toast({
        title: "Monitoring Started",
        description: "SnapGuard is now actively monitoring for threats.",
      });
    } else {
      toast({
        title: "Failed to Start Monitoring",
        description: "Unable to access camera and microphone.",
        variant: "destructive",
      });
    }
  };

  // Simulate receiving alerts
  useEffect(() => {
    if (!isMonitoring) return;

    const alertTypes = [
      {
        type: "microphone",
        descriptions: [
          "Suspicious keyword detected in conversation",
          "Potential phishing attempt in audio",
          "Social engineering pattern identified",
          "Sensitive information mentioned in call",
        ],
      },
      {
        type: "screen",
        descriptions: [
          "Suspicious URL detected on screen",
          "Potential malware signature identified",
          "Unauthorized access attempt captured",
          "Screen showed sensitive document",
        ],
      },
    ];

    const levels: ThreatLevel[] = ["low", "medium", "high"];

    const alertInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const typeIndex = Math.floor(Math.random() * 2);
        const selectedType = alertTypes[typeIndex];
        const descIndex = Math.floor(
          Math.random() * selectedType.descriptions.length
        );
        const levelIndex = Math.floor(Math.random() * levels.length);

        const newAlert: Alert = {
          id: Date.now().toString(),
          time: new Date(),
          type: selectedType.type as "microphone" | "screen",
          description: selectedType.descriptions[descIndex],
          level: levels[levelIndex],
          transcript:
            selectedType.type === "microphone"
              ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              : undefined,
        };

        setAlerts((prev) => [newAlert, ...prev].slice(0, 50));

        if (newAlert.level === "high") {
          toast({
            title: "Critical Threat Detected!",
            description: newAlert.description,
            variant: "destructive",
          });
        } else if (newAlert.level === "medium") {
          toast({
            title: "Warning Alert",
            description: newAlert.description,
            variant: "default",
          });
        }
      }
    }, 3000);

    return () => clearInterval(alertInterval);
  }, [isMonitoring, toast]);

  const stopMonitoring = () => {
    setIsMonitoring(false);
    stopStreams();
    toast({
      title: "Monitoring Stopped",
      description: "Threat detection has been disabled",
    });

    // Store the alerts in session storage for the summary page
    sessionStorage.setItem("threatAlerts", JSON.stringify(alerts));

    // Navigate to summary page
    setTimeout(() => {
      navigate("/summary");
    }, 1000);
  };

  const handleAlertClick = (alert: Alert) => {
    // Store the current alert in session storage
    sessionStorage.setItem("currentThreat", JSON.stringify(alert));
    navigate(`/threat/${alert.id}`);
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Threat Monitoring
          </h1>
          <p className="text-muted-foreground">
            Real-time analysis of microphone and screen activity for potential
            threats.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Microphone Status */}
          <Card
            className={
              permissions.microphone === "granted" && streams.microphone
                ? "border-success/50 glow"
                : "border-destructive/50"
            }
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Microphone</CardTitle>
              <CardDescription>Audio threat detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">
                    {permissions.microphone === "granted"
                      ? streams.microphone
                        ? "Active"
                        : "Ready"
                      : permissions.microphone === "denied"
                      ? "Denied"
                      : "Pending"}
                  </span>
                </div>
                <Badge
                  variant={
                    permissions.microphone === "granted"
                      ? streams.microphone
                        ? "default"
                        : "secondary"
                      : permissions.microphone === "denied"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {permissions.microphone === "granted"
                    ? "✓"
                    : permissions.microphone === "denied"
                    ? "✗"
                    : "?"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Camera Status */}
          <Card
            className={
              permissions.camera === "granted" && streams.camera
                ? "border-success/50 glow"
                : "border-destructive/50"
            }
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Camera</CardTitle>
              <CardDescription>Visual threat monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">
                    {permissions.camera === "granted"
                      ? streams.camera
                        ? "Active"
                        : "Ready"
                      : permissions.camera === "denied"
                      ? "Denied"
                      : "Pending"}
                  </span>
                </div>
                <Badge
                  variant={
                    permissions.camera === "granted"
                      ? streams.camera
                        ? "default"
                        : "secondary"
                      : permissions.camera === "denied"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {permissions.camera === "granted"
                    ? "✓"
                    : permissions.camera === "denied"
                    ? "✗"
                    : "?"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Overall Status */}
          <Card
            className={isMonitoring ? "border-success/50 glow" : "border-muted"}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Monitoring Status
              </CardTitle>
              <CardDescription>Real-time protection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MonitorIcon className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">
                    {isMonitoring ? "Active" : "Inactive"}
                  </span>
                </div>
                {isMonitoring && (
                  <div className="relative h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-success"></span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!hasAllPermissions && (
            <Button
              onClick={() => setShowPermissionsDialog(true)}
              className="flex-1"
              variant="outline"
            >
              <Settings className="mr-2 h-4 w-4" />
              Grant Permissions
            </Button>
          )}

          {hasAllPermissions && !isMonitoring && (
            <Button onClick={startMonitoring} className="flex-1">
              Start Monitoring
            </Button>
          )}

          {isMonitoring && (
            <Button
              onClick={stopMonitoring}
              variant="destructive"
              className="flex-1"
            >
              Stop Monitoring
            </Button>
          )}
        </div>

        {permissionsError && (
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Permission Error</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {permissionsError}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Alerts Feed */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Live Alerts</h2>
            <div className="text-sm text-muted-foreground">
              {alerts.length} {alerts.length === 1 ? "alert" : "alerts"}{" "}
              detected
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {alerts.map((alert) => {
                const { icon: Icon, className } = levelConfig[alert.level];
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <Card
                      className="overflow-hidden cursor-pointer card-hover"
                      onClick={() => handleAlertClick(alert)}
                    >
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4 p-4">
                          <div
                            className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${className}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{alert.description}</p>
                              <time className="text-xs text-muted-foreground">
                                {alert.time.toLocaleTimeString()}
                              </time>
                            </div>
                            <div className="flex items-center text-xs">
                              <div
                                className={`mr-2 h-2 w-2 rounded-full ${
                                  alert.level === "high"
                                    ? "bg-destructive"
                                    : alert.level === "medium"
                                    ? "bg-warning"
                                    : "bg-success"
                                }`}
                              />
                              <span className="capitalize">
                                {alert.level} Risk
                              </span>
                              <span className="mx-2">•</span>
                              <span>
                                {alert.type === "microphone"
                                  ? "Microphone"
                                  : "Screen"}{" "}
                                Alert
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {alerts.length === 0 && (
              <Card className="animate-pulse-subtle">
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">
                    Monitoring active... No threats detected yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <MediaPermissionsDialog
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        onPermissionsGranted={() => {
          setShowPermissionsModal(false);
          startMonitoring();
        }}
      />
    </PageTransition>
  );
};

export default Monitor;
