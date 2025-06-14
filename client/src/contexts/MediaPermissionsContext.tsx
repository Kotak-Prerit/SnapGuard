import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  useMediaPermissions,
  UseMediaPermissionsReturn,
} from "@/hooks/useMediaPermissions";

interface MediaPermissionsContextType extends UseMediaPermissionsReturn {
  showPermissionsDialog: boolean;
  setShowPermissionsDialog: (show: boolean) => void;
  isFirstVisit: boolean;
  hasUserDismissed: boolean;
  dismissDialog: () => void;
}

const MediaPermissionsContext = createContext<
  MediaPermissionsContextType | undefined
>(undefined);

interface MediaPermissionsProviderProps {
  children: ReactNode;
}

export const MediaPermissionsProvider = ({
  children,
}: MediaPermissionsProviderProps) => {
  const mediaPermissions = useMediaPermissions();
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [hasUserDismissed, setHasUserDismissed] = useState(false);

  // Check if this is the user's first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("snapguard-has-visited");
    const userDismissed = localStorage.getItem(
      "snapguard-permissions-dismissed"
    );

    if (hasVisited) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem("snapguard-has-visited", "true");
    }

    if (userDismissed === "true") {
      setHasUserDismissed(true);
    }
  }, []);

  // Show permissions dialog on first visit if permissions aren't granted
  useEffect(() => {
    if (
      isFirstVisit &&
      !mediaPermissions.hasAllPermissions &&
      !hasUserDismissed &&
      !mediaPermissions.isLoading
    ) {
      // Delay showing the dialog slightly to allow the page to load
      const timer = setTimeout(() => {
        setShowPermissionsDialog(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [
    isFirstVisit,
    mediaPermissions.hasAllPermissions,
    hasUserDismissed,
    mediaPermissions.isLoading,
  ]);

  const dismissDialog = () => {
    setHasUserDismissed(true);
    setShowPermissionsDialog(false);
    localStorage.setItem("snapguard-permissions-dismissed", "true");
  };

  const contextValue: MediaPermissionsContextType = {
    ...mediaPermissions,
    showPermissionsDialog,
    setShowPermissionsDialog,
    isFirstVisit,
    hasUserDismissed,
    dismissDialog,
  };

  return (
    <MediaPermissionsContext.Provider value={contextValue}>
      {children}
    </MediaPermissionsContext.Provider>
  );
};

export const useMediaPermissionsContext = (): MediaPermissionsContextType => {
  const context = useContext(MediaPermissionsContext);
  if (context === undefined) {
    throw new Error(
      "useMediaPermissionsContext must be used within a MediaPermissionsProvider"
    );
  }
  return context;
};
