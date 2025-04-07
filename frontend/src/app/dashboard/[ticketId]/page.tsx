"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem('token') ?? '';
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}`;
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setTicket(data);
      } catch (err) {
        console.error('Failed to fetch ticket:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleReply = async () => {
    try {
      const token = localStorage.getItem('token') ?? '';
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}/reply`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: replyText }),
      });
      setReplyText('');
      // Refresh ticket details
      window.location.reload();
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!ticket) {
    return <div className="p-6">Ticket not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{ticket.title}</h1>
      <p className="text-gray-600">{ticket.description}</p>
      <p className="text-sm text-gray-500">Status: {ticket.status}</p>
      <p className="text-sm text-gray-500">Created: {new Date(ticket.created_at).toLocaleString()}</p>

      <h2 className="mt-6 text-lg font-semibold">Replies</h2>
      <ul className="space-y-4">
        {ticket.replies?.map((reply: any) => (
          <li key={reply.id} className="rounded border p-3">
            <p>{reply.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              By {reply.author} at {new Date(reply.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          className="w-full rounded border p-2"
        />
        <button
          onClick={handleReply}
          className="rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
        >
          Post Reply
        </button>
      </div>
    </div>
  );
}
