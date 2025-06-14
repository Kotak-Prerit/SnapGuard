import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Mic,
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMediaPermissions } from "@/hooks/useMediaPermissions";

interface MediaPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionsGranted: () => void;
}

const MediaPermissionsDialog = ({
  isOpen,
  onClose,
  onPermissionsGranted,
}: MediaPermissionsDialogProps) => {
  const {
    permissions,
    isLoading,
    error,
    requestPermissions,
    hasAllPermissions,
  } = useMediaPermissions();

  const [step, setStep] = useState<
    "intro" | "requesting" | "success" | "error"
  >("intro");

  useEffect(() => {
    if (hasAllPermissions && step === "requesting") {
      setStep("success");
      setTimeout(() => {
        onPermissionsGranted();
        onClose();
      }, 2000);
    }
  }, [hasAllPermissions, step, onPermissionsGranted, onClose]);

  useEffect(() => {
    if (error && step === "requesting") {
      setStep("error");
    }
  }, [error, step]);

  const handleRequestPermissions = async () => {
    setStep("requesting");
    const success = await requestPermissions();

    if (!success) {
      setStep("error");
    }
  };

  const getPermissionIcon = (state: PermissionState) => {
    switch (state) {
      case "granted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "denied":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPermissionText = (state: PermissionState) => {
    switch (state) {
      case "granted":
        return "Granted";
      case "denied":
        return "Denied";
      default:
        return "Pending";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/60 bg-card/95 backdrop-blur">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold">
                {step === "intro" && "Media Access Required"}
                {step === "requesting" && "Requesting Permissions..."}
                {step === "success" && "Access Granted!"}
                {step === "error" && "Permission Denied"}
              </CardTitle>
              <CardDescription>
                {step === "intro" &&
                  "SnapGuard needs access to your camera and microphone to provide real-time threat detection and monitoring."}
                {step === "requesting" &&
                  "Please allow access to your camera and microphone in the browser popup."}
                {step === "success" &&
                  "Thank you! SnapGuard can now protect your digital environment."}
                {step === "error" &&
                  "Unable to access your camera and microphone. Some features may not work properly."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {step === "intro" && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Camera className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Camera Access</p>
                        <p className="text-xs text-muted-foreground">
                          Monitor your screen for visual threats
                        </p>
                      </div>
                      {getPermissionIcon(permissions.camera)}
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Mic className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Microphone Access</p>
                        <p className="text-xs text-muted-foreground">
                          Analyze audio for security threats
                        </p>
                      </div>
                      {getPermissionIcon(permissions.microphone)}
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Your privacy is protected. All processing happens locally
                      on your device.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={onClose}
                    >
                      Maybe Later
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleRequestPermissions}
                      disabled={isLoading}
                    >
                      Grant Access
                    </Button>
                  </div>
                </>
              )}

              {step === "requesting" && (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
                  />
                  <p className="text-sm text-muted-foreground mb-4">
                    Waiting for browser permissions...
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Camera
                      </span>
                      <span className="flex items-center gap-1">
                        {getPermissionIcon(permissions.camera)}
                        {getPermissionText(permissions.camera)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        Microphone
                      </span>
                      <span className="flex items-center gap-1">
                        {getPermissionIcon(permissions.microphone)}
                        {getPermissionText(permissions.microphone)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {step === "success" && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10"
                  >
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to monitoring dashboard...
                  </p>
                </div>
              )}

              {step === "error" && (
                <>
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      You can still use SnapGuard with limited functionality, or
                      try again.
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                      >
                        Continue Limited
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => {
                          setStep("intro");
                        }}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MediaPermissionsDialog;
