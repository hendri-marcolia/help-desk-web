export const runtime = 'edge';

import { cookies } from 'next/headers';
import ReplyForm from './ReplyForm';

import React from 'react';
import type { Reply } from '../../../api/models/Reply';

export default async function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;
  const token = (await cookies()).get('token')?.value ?? '';

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}`;
  const response = await fetch(apiUrl, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    return <div>Failed to load ticket. {ticketId} with {JSON.stringify(cookies())}</div>;
  }

  const ticket = await response.json();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{ticket.title}</h1>
      <p className="text-gray-600">{ticket.description}</p>
      <p className="text-sm text-gray-500">Status: {ticket.status}</p>
      <p className="text-sm text-gray-500">Created: {new Date(ticket.created_at).toLocaleString()}</p>

      <h2 className="mt-6 text-lg font-semibold">Replies</h2>
      <ul className="space-y-4">
        {ticket.replies?.map((reply: Reply) => (
          <li key={reply.id} className="rounded border p-3">
            <p>{reply.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              By {reply.author} at {new Date(reply.created_at ?? '').toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <ReplyForm ticketId={ticketId} />
    </div>
  );
}
