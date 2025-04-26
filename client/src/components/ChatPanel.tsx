import React, { useState, useEffect } from "react";
import { Send, Bot, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { supabase, saveChatMessage, getChatHistory, type ChatMessage } from "@/lib/supabase";
import { getChatResponse } from "@/lib/groq";
import { AuthModal } from "./auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPanel = ({ isOpen, onClose }: ChatPanelProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      loadChatHistory(user.id);
    }
  }, [user]);

  const loadChatHistory = async (userId: string) => {
    try {
      const history = await getChatHistory(userId);
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsLoading(true);

      // Add user message
      const userMessage: Omit<ChatMessage, 'id' | 'created_at'> = {
        user_id: user!.id,
        content: input,
        role: 'user'
      };
      
      const savedUserMessage = await saveChatMessage(userMessage);
      setMessages(prev => [...prev, savedUserMessage]);
      setInput("");

      // Get AI response
      const response = await getChatResponse(input);
      
      // Save and display AI response
      const assistantMessage: Omit<ChatMessage, 'id' | 'created_at'> = {
        user_id: user!.id,
        content: response,
        role: 'assistant'
      };
      
      const savedAssistantMessage = await saveChatMessage(assistantMessage);
      setMessages(prev => [...prev, savedAssistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-[350px] p-0" side="right">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">SnapGuard Assistant</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground p-4">
                  <p>Welcome to SnapGuard Assistant!</p>
                  <p className="text-sm mt-2">Ask me anything about cybersecurity or our platform's features.</p>
                </div>
              )}
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "mb-4 max-w-[90%] rounded-lg p-3",
                    message.role === "user" 
                      ? "ml-auto bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}
            </ScrollArea>
            
            {/* Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  placeholder={isAuthenticated ? "Ask about cyber threats..." : "Sign in to chat..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                  disabled={isLoading || !isAuthenticated}
                />
                <Button type="submit" size="icon" disabled={isLoading || !isAuthenticated}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              {!isAuthenticated && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Please{" "}
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-primary hover:underline"
                  >
                    sign in
                  </button>
                  {" "}to chat with the assistant
                </p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signin"
      />
    </>
  );
};

export default ChatPanel;
