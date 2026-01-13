import { NextRequest } from 'next/server';
import { 
  createConversation, 
  getAllConversations, 
  deleteConversation,
  getConversation,
  createMessage
} from '@/lib/db/schema';
import { getSystemPrompt } from '@/lib/ai/prompts';

export async function GET() {
  try {
    const conversations = getAllConversations();
    return Response.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch conversations' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();
    const conversation = createConversation(title);
    
    // Add system message to the new conversation
    createMessage(conversation.id, 'system', getSystemPrompt());
    
    return Response.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create conversation' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Missing conversation id' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    deleteConversation(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete conversation' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
