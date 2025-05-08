import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Bot, Maximize2, Minimize2 } from "lucide-react";
import "./StyleChat"
import { apiService } from "@/service/apiservice";

interface Message {
  conversation_id: string;
  role: "user" | "assistant";
  message: string;
}


export function ChatIA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          conversation_id: "1",
          message: "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?",
          role: "assistant"
        },
      ]);
    }
  }, [isOpen]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;


    const userMessage: Message = {
      conversation_id: Date.now().toString(),
      message: inputValue,
      role: "user"
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);


    await apiService.post("/chat/", {
      conversation_id: userMessage.conversation_id,
      message: userMessage.message,
      role: userMessage.role
    }).then((response) => {
      const aiResponse: any = response;
      console.log(aiResponse);
      const mapMessage: Message = {
        conversation_id: aiResponse.conversation_id,
        message: aiResponse.response,
        role: "assistant",
      };
      setMessages((prev) => [...prev, mapMessage]);
    }).catch((error) => {
      console.error("Error al obtener respuesta de la IA:", error);
      setMessages((prev) => [
        ...prev,
        {
          conversation_id: (Date.now() + 1).toString(),
          message: "Lo siento, hubo un error al procesar tu solicitud.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    }).finally(() => {
      setIsLoading(false);
    });



  };

  return (
    <div className="text-white fixed bottom-4 right-4 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative"
          >
            <Card
              className={`w-full ${isExpanded ? "h-[600px] w-[400px]" : "h-[500px] w-[350px]"
                } flex flex-col bg-black border-2 border-neon-cyan shadow-glow`}
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                background: 'radial-gradient(circle at center, #001111, #000)'
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b-2 border-neon-cyan">
                <div className="flex items-center space-x-3">
                  <Avatar className="border-2 border-neon-cyan">
                    <AvatarImage src="/ai-avatar.png" />
                    <AvatarFallback className="bg-black">
                      <Bot className="h-5 w-5 text-neon-cyan" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-neon-cyan font-mono">
                      Bicentenario IA
                    </CardTitle>
                    <CardDescription className="text-xs text-neon-green">
                      {isLoading ? "[STATUS: PROCESSING...]" : "[STATUS: ONLINE]"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleExpand}
                    className="h-8 w-8 text-neon-cyan hover:bg-neon-cyan/10"
                  >
                    {isExpanded ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="h-8 w-8 text-neon-cyan hover:bg-neon-cyan/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0 overflow-hidden bg-grid-pattern">
                <ScrollArea className="h-full p-4 bg-black/50">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.conversation_id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`max-w-[80%] rounded-lg px-4 py-2 font-mono text-sm border ${message.role === "user"
                              ? "border-neon-cyan text-neon-cyan bg-cyan-900/10 shadow-glow-cyan"
                              : "border-neon-green text-neon-green bg-green-900/10 shadow-glow-green"
                            }`}
                          style={{
                            textShadow: message.role === "user"
                              ? '0 0 8px rgba(0, 255, 255, 0.5)'
                              : '0 0 8px rgba(0, 255, 0, 0.5)'
                          }}
                        >
                          {message.message}
                        </motion.div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="border border-neon-green text-neon-green rounded-lg px-4 py-2 font-mono">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-neon-green animate-bounce" />
                            <div
                              className="h-2 w-2 rounded-full bg-neon-cyan animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                            <div
                              className="h-2 w-2 rounded-full bg-neon-green animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-4 border-t-2 border-neon-cyan">
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="INPUT QUERY..."
                    className="flex-1 bg-black border-2 border-neon-cyan text-neon-cyan font-mono placeholder:text-neon-cyan/50 focus-visible:ring-neon-cyan"
                    disabled={isLoading}
                    style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading}
                    className="border-2 border-neon-cyan text-neon-cyan bg-black hover:bg-neon-cyan/10 hover:text-neon-cyan"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
        >
          <Button
            onClick={toggleChat}
            size="lg"
            className="rounded-full h-14 w-14 bg-black border-2 border-neon-cyan hover:bg-neon-cyan/10 shadow-glow-cyan"
          >
            <Bot className="h-6 w-6 text-neon-cyan" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}