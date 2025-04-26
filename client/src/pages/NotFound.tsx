
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center w-full overflow-x-hidden">
      <div className="responsive-container text-center px-4 sm:px-[5vw] md:px-[1.5vw]">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <a href="/" className="text-primary/80 hover:text-primary underline transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
