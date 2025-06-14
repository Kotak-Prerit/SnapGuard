// Debug component to check environment variables in production
// This can be temporarily added to help troubleshoot

export const EnvDebugger = () => {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_GROQ_API: import.meta.env.VITE_GROQ_API,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  };

  console.log("Environment Variables Debug:", envVars);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "500px",
        overflow: "auto",
      }}
    >
      <h3>Environment Variables Debug</h3>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>
    </div>
  );
};
