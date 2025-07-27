import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
  sender?: {
    business_name: string;
    contact_person: string;
  };
}

interface ChatWindowProps {
  chatRoomId: string;
  otherUser: {
    business_name: string;
    contact_person: string;
    user_type: string;
  };
  onClose: () => void;
}

const ChatWindow = ({ chatRoomId, otherUser, onClose }: ChatWindowProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(business_name, contact_person)
        `)
        .eq('chat_room_id', chatRoomId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        });
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel(`messages:${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_room_id=eq.${chatRoomId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatRoomId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    try {
      const response = await supabase.functions.invoke('chat-api', {
        body: {
          action: 'send-message',
          chatRoomId,
          message: newMessage.trim()
        }
      });

      if (response.error) {
        throw response.error;
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-xl animate-fade-in z-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-white/20 text-primary-foreground">
              {otherUser.business_name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm">{otherUser.business_name}</CardTitle>
            <p className="text-xs opacity-80">{otherUser.contact_person}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary-foreground hover:bg-white/20">
            <Phone className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary-foreground hover:bg-white/20">
            <Video className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary-foreground hover:bg-white/20">
            <MoreVertical className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary-foreground hover:bg-white/20" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-80">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-3 py-2 text-sm animate-scale-in ${
                      isOwn
                        ? 'bg-gradient-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p>{message.message}</p>
                    <p className={`text-xs mt-1 opacity-70 ${
                      isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                    }`}>
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading || !newMessage.trim()}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;