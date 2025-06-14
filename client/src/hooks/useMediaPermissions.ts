import { useState, useEffect, useCallback } from "react";

export interface MediaPermissions {
  camera: PermissionState;
  microphone: PermissionState;
}

export interface MediaStreams {
  camera?: MediaStream;
  microphone?: MediaStream;
}

export interface UseMediaPermissionsReturn {
  permissions: MediaPermissions;
  streams: MediaStreams;
  isLoading: boolean;
  error: string | null;
  requestPermissions: () => Promise<boolean>;
  startStreams: () => Promise<boolean>;
  stopStreams: () => void;
  hasAllPermissions: boolean;
}

export const useMediaPermissions = (): UseMediaPermissionsReturn => {
  const [permissions, setPermissions] = useState<MediaPermissions>({
    camera: "prompt" as PermissionState,
    microphone: "prompt" as PermissionState,
  });
  const [streams, setStreams] = useState<MediaStreams>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check current permissions
  const checkPermissions = useCallback(async () => {
    try {
      if (!navigator.permissions) {
        // Fallback for browsers that don't support the Permissions API
        setPermissions({
          camera: "prompt",
          microphone: "prompt",
        });
        return;
      }

      const [cameraPermission, microphonePermission] = await Promise.all([
        navigator.permissions.query({ name: "camera" as PermissionName }),
        navigator.permissions.query({ name: "microphone" as PermissionName }),
      ]);

      setPermissions({
        camera: cameraPermission.state,
        microphone: microphonePermission.state,
      });

      // Listen for permission changes
      cameraPermission.onchange = () => {
        setPermissions((prev) => ({ ...prev, camera: cameraPermission.state }));
      };

      microphonePermission.onchange = () => {
        setPermissions((prev) => ({
          ...prev,
          microphone: microphonePermission.state,
        }));
      };
    } catch (err) {
      console.warn("Error checking permissions:", err);
      setError(
        "Unable to check permissions. Some features may not work properly."
      );
    }
  }, []);

  // Request permissions by attempting to access media
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Immediately stop the stream as we just wanted to trigger permission request
      stream.getTracks().forEach((track) => track.stop());

      // Recheck permissions after the request
      await checkPermissions();

      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("Error requesting permissions:", err);

      let errorMessage = "Failed to request media permissions.";

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage =
            "Camera and microphone access denied. Please allow access in your browser settings.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera or microphone found on this device.";
        } else if (err.name === "NotSupportedError") {
          errorMessage = "Media access is not supported in this browser.";
        }
      }

      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, [checkPermissions]);

  // Start media streams
  const startStreams = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Request separate streams for better control
      const [cameraStream, microphoneStream] = await Promise.all([
        navigator.mediaDevices.getUserMedia({ video: true }),
        navigator.mediaDevices.getUserMedia({ audio: true }),
      ]);

      setStreams({
        camera: cameraStream,
        microphone: microphoneStream,
      });

      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("Error starting streams:", err);

      let errorMessage = "Failed to start media streams.";

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage =
            "Media access denied. Please allow camera and microphone access.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "Camera or microphone not found.";
        }
      }

      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, []);

  // Stop all streams
  const stopStreams = useCallback(() => {
    Object.values(streams).forEach((stream) => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });
    setStreams({});
  }, [streams]);

  // Check if all required permissions are granted
  const hasAllPermissions =
    permissions.camera === "granted" && permissions.microphone === "granted";

  // Initialize permissions check on mount
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      stopStreams();
    };
  }, []);

  return {
    permissions,
    streams,
    isLoading,
    error,
    requestPermissions,
    startStreams,
    stopStreams,
    hasAllPermissions,
  };
};
