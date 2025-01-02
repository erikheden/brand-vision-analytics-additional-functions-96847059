import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChatSectionProps {
  selectedCountry: string;
  selectedBrands: string[];
}

const ChatSection = ({ selectedCountry, selectedBrands }: ChatSectionProps) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!selectedCountry || selectedBrands.length === 0) {
      toast({
        title: "Please select a country and at least one brand",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    setMessage("");

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-rankings', {
        body: {
          country: selectedCountry,
          brands: selectedBrands,
          message,
        },
      });

      if (error) throw error;

      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col h-full">
        <h2 className="text-2xl font-semibold mb-4">Chat with AI about the Rankings</h2>
        
        <ScrollArea className="flex-1 h-[400px] mb-4 pr-4">
          <div className="space-y-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-8'
                    : 'bg-muted mr-8'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Ask about the rankings..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatSection;