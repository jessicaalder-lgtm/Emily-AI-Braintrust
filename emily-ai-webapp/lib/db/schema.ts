import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getDb } from './index';
import type { Message, Conversation } from '@/types/chat';

// Table definitions
export const conversations = sqliteTable('conversations', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  title: text('title').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['system', 'user', 'assistant'] }).notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  metadata: text('metadata'), // JSON string
});

// Query functions
export function createConversation(title?: string): Conversation {
  const db = getDb();
  const id = nanoid();
  const now = new Date();
  const conversationTitle = title || 'New Conversation';
  
  db.prepare(`
    INSERT INTO conversations (id, title, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `).run(id, conversationTitle, Math.floor(now.getTime() / 1000), Math.floor(now.getTime() / 1000));
  
  return {
    id,
    title: conversationTitle,
    createdAt: now,
    updatedAt: now,
  };
}

interface ConversationRow {
  id: string;
  title: string;
  created_at: number;
  updated_at: number;
}

export function getConversation(id: string): Conversation | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT id, title, created_at, updated_at
    FROM conversations
    WHERE id = ?
  `).get(id) as ConversationRow | undefined;
  
  if (!row) return null;
  
  return {
    id: row.id,
    title: row.title,
    createdAt: new Date(row.created_at * 1000),
    updatedAt: new Date(row.updated_at * 1000),
  };
}

export function getAllConversations(): Conversation[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT id, title, created_at, updated_at
    FROM conversations
    ORDER BY updated_at DESC
  `).all() as ConversationRow[];
  
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    createdAt: new Date(row.created_at * 1000),
    updatedAt: new Date(row.updated_at * 1000),
  }));
}

export function deleteConversation(id: string): void {
  const db = getDb();
  db.prepare(`DELETE FROM conversations WHERE id = ?`).run(id);
}

export function createMessage(
  conversationId: string,
  role: 'system' | 'user' | 'assistant',
  content: string,
  metadata?: Record<string, unknown>
): Message {
  const db = getDb();
  const id = nanoid();
  const now = new Date();
  const metadataString = metadata ? JSON.stringify(metadata) : null;
  
  db.prepare(`
    INSERT INTO messages (id, conversation_id, role, content, created_at, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, conversationId, role, content, Math.floor(now.getTime() / 1000), metadataString);
  
  return {
    id,
    conversationId,
    role,
    content,
    createdAt: now,
    metadata: metadata || undefined,
  };
}

interface MessageRow {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: number;
  metadata: string | null;
}

export function getMessages(conversationId: string): Message[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT id, conversation_id, role, content, created_at, metadata
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
  `).all(conversationId) as MessageRow[];
  
  return rows.map(row => ({
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role as 'system' | 'user' | 'assistant',
    content: row.content,
    createdAt: new Date(row.created_at * 1000),
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
  }));
}

export function updateConversationTimestamp(id: string): void {
  const db = getDb();
  db.prepare(`
    UPDATE conversations
    SET updated_at = ?
    WHERE id = ?
  `).run(Math.floor(Date.now() / 1000), id);
}
