import { NextRequest } from 'next/server';
import { getMessages } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    
    if (!conversationId) {
      return new Response(
        JSON.stringify({ error: 'Missing conversationId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const messages = getMessages(conversationId);
    // Filter out system messages from the response
    const userMessages = messages.filter(msg => msg.role !== 'system');
    
    return Response.json(userMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch messages' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
