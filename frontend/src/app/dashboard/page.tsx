"use client";

import React, { useEffect, useState } from 'react';

type Ticket = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  description?: string;
  category?: string;
  facility?: string;
  priority?: string;
  ticket_number?: string;
  created_by?: string;
  _authorName?: string;
};

const authorNameCache: Record<string, string> = {};

let cachedUserId: string | null = null;

async function getAuthorName(ticket: any): Promise<string> {
  const authorId = ticket.created_by?.toString();
  if (!authorId) return 'Unknown';

  const cacheKey = `${authorId}_${ticket.created_by_name}`;
  if (authorNameCache[cacheKey]) {
    return authorNameCache[cacheKey];
  }

  if (!cachedUserId) {
    cachedUserId = localStorage.getItem('user_id') ?? '';
  }

  const isLoggedUser = authorId === cachedUserId;
  const displayName = ticket.created_by_name ?? authorId;
  const formattedName = isLoggedUser ? `${displayName} (You)` : displayName;

  authorNameCache[cacheKey] = formattedName;
  return formattedName;
}

export default function DashboardPage() {
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [resolvedTickets, setResolvedTickets] = useState<Ticket[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'open' | 'closed'>('open');
  const [resolvedLoaded, setResolvedLoaded] = useState(false);

  const fetchTicketsByStatus = async (status: 'open' | 'closed') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') ?? '';
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tickets?status=${status}`;
      const response = await fetch(apiUrl, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      let ticketList: Ticket[] = [];
      if (Array.isArray(data)) {
        ticketList = data as Ticket[];
      } else if (data && Array.isArray((data as any).tickets)) {
        ticketList = (data as any).tickets;
      } else {
        ticketList = [];
      }

      const enriched = await Promise.all(
        ticketList.map(async (ticket) => {
          const authorName = await getAuthorName(ticket);
          return { ...ticket, _authorName: authorName };
        })
      );

      if (status === 'open') {
        setActiveTickets(enriched);
      } else {
        setResolvedTickets(enriched);
        setResolvedLoaded(true);
      }
      setTickets(enriched);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketsByStatus('open');
  }, []);

  useEffect(() => {
    if (statusFilter === 'open') {
      setTickets(activeTickets);
      // Always refresh active tickets in background
      fetchTicketsByStatus('open');
    } else {
      if (!resolvedLoaded) {
        fetchTicketsByStatus('closed');
      } else {
        setTickets(resolvedTickets);
        // Always refresh resolved tickets in background
        fetchTicketsByStatus('closed');
      }
    }
  }, [statusFilter, resolvedLoaded]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <header className="flex items-center justify-between border-b bg-white px-8 py-4 shadow-sm">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
          <span>💬</span> Facility's Help Desk
        </h1>
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold">U</div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="Search cases..."
              className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
            <select className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none">
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 transition">
              Filters:
            </button>
            <button className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 transition">
              Category
            </button>
            <button className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 transition">
              Location
            </button>
            <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition">
              + New Case
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2 rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setStatusFilter('open')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                statusFilter === 'open'
                  ? 'text-sky-600 bg-white shadow'
                  : 'text-gray-500 hover:text-sky-600'
              }`}
            >
              Active Cases
            </button>
            <button
              onClick={() => setStatusFilter('closed')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                statusFilter === 'closed'
                  ? 'text-sky-600 bg-white shadow'
                  : 'text-gray-500 hover:text-sky-600'
              }`}
            >
              Resolved Cases
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <svg
              className="h-8 w-8 animate-spin text-sky-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div className="rounded bg-red-100 p-4 text-red-700">{error}</div>
        ) : (
          <ul className="space-y-6">
            {tickets.map((ticket) => (
              <li
                key={`${ticket.id}-${ticket.ticket_number ?? ''}`}
                className="group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow transition hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{ticket.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">{ticket.description || 'No description'}</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 whitespace-nowrap">
                    Ticket #: {ticket.ticket_number ?? 'UNKNOWN'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-gray-500">
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-medium">
                      🕒 {new Date(ticket.created_at).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-medium">
                      👤 {ticket._authorName ?? 'Loading...'}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-medium">
                      🏢 {ticket.facility?.toUpperCase() || 'UNKNOWN'}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-medium">
                      🏷️ {ticket.category?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    ticket.status === 'active' || ticket.status === 'open'
                      ? 'bg-orange-100 text-orange-800'
                      : ticket.status === 'closed'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ticket.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
