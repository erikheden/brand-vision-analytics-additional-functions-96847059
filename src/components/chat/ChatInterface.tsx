
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
}

interface ChatInterfaceProps {
  selectedCountry: string;
  selectedBrands: string[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedCountry, selectedBrands }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!selectedCountry) {
      toast({
        title: "No country selected",
        description: "Please select a country first to ask questions about brand rankings.",
        variant: "destructive"
      });
      return;
    }
    if (selectedBrands.length === 0) {
      toast({
        title: "No brands selected",
        description: "Please select at least one brand to ask questions about.",
        variant: "destructive"
      });
      return;
    }

    // Add user message to chat
    const userMessage: ChatMessage = { content: input, role: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat-with-rankings', {
        body: {
          country: selectedCountry,
          brands: selectedBrands,
          message: input
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Add assistant response to chat
      const assistantMessage: ChatMessage = { 
        content: data.response || "I'm sorry, I couldn't generate a response.", 
        role: 'assistant' 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling chat function:', error);
      toast({
        title: "Error",
        description: "There was an error processing your question. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-md shadow-sm">
      <div className="p-4 bg-[#34502b] text-white rounded-t-md">
        <h3 className="text-lg font-medium">Chat with Sustainability Data</h3>
        <p className="text-sm opacity-90">Ask questions about the sustainability rankings for selected brands</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 min-h-[300px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>Select a country and brands, then ask a question about their sustainability rankings.</p>
            <p className="text-sm mt-2">Example: "Which brand has improved the most since 2020?"</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary/10 ml-auto mr-0 max-w-[80%]' 
                    : 'bg-white shadow-sm mr-auto ml-0 max-w-[80%]'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the selected brands' sustainability rankings..."
            className="resize-none"
            rows={2}
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
            className="flex-shrink-0" 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
