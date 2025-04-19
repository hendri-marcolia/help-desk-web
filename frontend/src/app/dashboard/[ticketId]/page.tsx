'use client';
export const runtime = 'edge';

import React from 'react';
import { Reply } from '../../../api/models/Reply';
import TokenHandler from './TokenHandler';
import ReplyForm from './ReplyForm';
import Header from '../../../components/Header';
import { Ticket } from '@/api';

export default function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = React.use(params);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TokenHandler ticketId={ticketId}>
        {(ticketId, token) => (
          <TicketDetail ticketId={ticketId} token={token} />
        )}
      </TokenHandler>
    </div>
  );
}

function TicketDetail({ ticketId, token }: { ticketId: string; token: string }) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}`;
  const [ticket, setTicket] = React.useState<Ticket>({});
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          setError(`Failed to load ticket. TicketID : ${ticketId}`);
          return;
        }

        const data = await response.json();
        setTicket(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error fetching ticket: ${error.message}`);
        } else {
          setError('An unknown error occurred while fetching the ticket');
        }
      }
    };

    fetchTicket();
  }, [apiUrl, ticketId, token]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!ticket.title) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{ticket.title}</h1>
      <p className="text-gray-600">{ticket.description}</p>
      <p className="text-sm text-gray-500">Status: {ticket.status}</p>
      <p className="text-sm text-gray-500">Created: {new Date(ticket.created_at ?? '').toLocaleString()}</p>

      <h2 className="mt-6 text-lg font-semibold">Replies</h2>
      <ul className="space-y-4">
        {ticket.replies?.map((reply: Reply) => (
          <li key={reply.reply_id} className="rounded border p-3">
            <p>{reply.reply_text}</p>
            <p className="text-xs text-gray-500 mt-1">
              By {reply.created_by_name} at {new Date(reply.created_at ?? '').toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <ReplyForm ticketId={ticketId} />
    </div>
  );
}
