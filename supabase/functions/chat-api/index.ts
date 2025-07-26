import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { method } = req;
    const url = new URL(req.url);
    const path = url.pathname;

    // Get chat rooms for a user
    if (method === 'GET' && path.includes('/chat-rooms')) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) throw new Error('No authorization header');

      const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
      if (!user) throw new Error('Unauthorized');

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data: chatRooms, error } = await supabaseClient
        .from('chat_rooms')
        .select(`
          id,
          vendor_id,
          supplier_id,
          created_at,
          vendor:profiles!vendor_id(business_name, contact_person),
          supplier:profiles!supplier_id(business_name, contact_person)
        `)
        .or(`vendor_id.eq.${profile.id},supplier_id.eq.${profile.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ chatRooms }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send a message
    if (method === 'POST' && path.includes('/send-message')) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) throw new Error('No authorization header');

      const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
      if (!user) throw new Error('Unauthorized');

      const { chatRoomId, message } = await req.json();

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data: newMessage, error } = await supabaseClient
        .from('messages')
        .insert({
          chat_room_id: chatRoomId,
          sender_id: profile.id,
          message: message,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ message: newMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});