import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";
import { Shield, Bot, Cpu, Activity, EyeOff, Microscope, ChevronRight, Sparkles } from "lucide-react";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="group"
  >
    <Card className="h-full border border-border/60 bg-card/50 hover:bg-accent/50 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const Index = () => {
  const navigate = useNavigate();

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="flex flex-col items-center text-center relative">
          {/* Gradient orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />
          
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            className="relative mb-4 z-10"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-primary opacity-20 blur-lg"
                />
                <Shield className="h-20 w-20 text-primary relative" />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="h-6 w-6 text-primary" />
                </motion.div>
              </div>
            </div>
            <div className="rounded-full bg-accent/80 backdrop-blur-sm py-2 px-4 mb-4 inline-flex items-center gap-1.5 border border-border/50">
              <span className="text-sm">AI-Powered Protection</span>
            </div>
          </motion.div>
          
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            className="mb-6 text-4xl md:text-6xl font-bold tracking-tight relative z-10"
          >
            Real-Time{" "}
            <span className="relative">
              <span className="relative z-10 text-primary">Digital Threat</span>
            </span>{" "}
            Assistant
          </motion.h1>
          
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            className="mb-10 max-w-[600px] text-muted-foreground text-lg md:text-xl"
          >
            Protect your digital conversations and screen activity with advanced AI-powered
            threat detection and real-time monitoring.
          </motion.p>
          
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Button 
              size="lg" 
              onClick={() => navigate("/monitor")}
              className="glow font-medium text-base h-12 px-6"
            >
              Start Monitoring
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/summary")}
              className="font-medium text-base h-12 px-6"
            >
              View Reports
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        
        <div className="mb-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-accent/80 backdrop-blur-sm py-2 px-4 mb-4 border border-border/50"
          >
            <Bot className="h-4 w-4" />
            <span className="text-sm font-medium">Advanced Features</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl md:text-4xl font-bold"
          >
            How SnapGuard Protects You
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto max-w-[600px] text-muted-foreground text-lg"
          >
            Our system uses cutting-edge AI to identify potential threats and vulnerabilities
            in real-time, keeping your digital life secure.
          </motion.p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
          <FeatureCard
            icon={Activity}
            title="Real-Time Monitoring"
            description="Continuous analysis of microphone input and screen activity to detect potential security threats as they happen."
          />
          <FeatureCard
            icon={Microscope}
            title="AI-Powered Detection"
            description="Advanced algorithms identify suspicious patterns and potential security risks with greater accuracy than traditional systems."
          />
          <FeatureCard
            icon={Bot}
            title="Live Alerts"
            description="Instant notifications when potential threats are detected with detailed information and recommended actions."
          />
          <FeatureCard
            icon={EyeOff}
            title="Privacy Focused"
            description="All processing happens locally on your device with no sensitive data sent to external servers, protecting your privacy."
          />
          <FeatureCard
            icon={Cpu}
            title="Low Resource Usage"
            description="Optimized for performance with minimal impact on system resources, even during intensive monitoring sessions."
          />
          <FeatureCard
            icon={Shield}
            title="Detailed Reports"
            description="Comprehensive session summaries with actionable insights and security recommendations for your digital environment."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="rounded-xl border border-border/60 bg-gradient-to-b from-accent/50 to-card/50 p-8 md:p-12 text-center relative overflow-hidden"
        >
          {/* Background gradient elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[60px] opacity-60" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[60px] opacity-40" />
          
          <h2 className="mb-4 text-2xl md:text-3xl font-bold relative z-10">Ready to Protect Your Digital Space?</h2>
          <p className="mx-auto mb-8 max-w-[600px] text-muted-foreground text-lg relative z-10">
            Start monitoring now and get real-time protection against digital threats with our advanced AI system.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/monitor")}
            className="glow font-medium text-base h-12 px-8 relative z-10"
          >
            Start Monitoring
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>
      </section>
    </PageTransition>
  );
};

export default Index;
