'use client';
export const runtime = 'edge';
import React from 'react';
import { Reply } from '../../../api/models/Reply';
import TokenHandler from './TokenHandler';
import ReplyForm from './ReplyForm';
import Header from '../../../components/Header';
import { Ticket, TicketsService } from '@/api';

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
  const [ticket, setTicket] = React.useState<Ticket | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTicket = async () => {
      try {
        TicketsService.getTicketById({ ticketId: ticketId }).then((response) => {
          if (!response) {
            setError(`Failed to load ticket. TicketID : ${ticketId}`);
            return;
          }
          setTicket(response);
        });
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

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
              #: {ticket.ticket_number ?? 'UNKNOWN'}
            </span>
            <h1 className="text-2xl font-bold text-gray-800">{ticket.title}</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                ticket.status === 'active' || ticket.status === 'open'
                  ? 'bg-orange-100 text-orange-800'
                  : ticket.status === 'closed'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {ticket.status?.toUpperCase() || 'ACTIVE'}
              </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
              {ticket.facility?.toUpperCase() || 'UNKNOWN'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              {ticket.category?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap mb-4">{ticket.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1">
            <span className="text-gray-400">Created:</span>
            {new Date(ticket.created_at ?? '').toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-gray-400">By:</span>
            {ticket.created_by_name || ticket.created_by}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-4">Replies</h2>
          <ul className="space-y-4">
            {ticket.replies?.map((reply: Reply) => (
              <li key={reply.reply_id} className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <p className="text-gray-700 whitespace-pre-wrap">{reply.reply_text}</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span className="text-gray-400">By {reply.created_by_name}</span>
                  at {new Date(reply.created_at ?? '').toLocaleString()}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <ReplyForm ticketId={ticketId} />
          </div>
        </div>
      </div>
    </div>
  );
}
