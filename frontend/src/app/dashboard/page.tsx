"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';

type Ticket = {
  ticket_id: string;
  title: string;
  status: string;
  created_at: string;
  description?: string;
  category?: string;
  facility?: string;
  priority?: string;
  ticket_number?: string;
  created_by?: string;
  created_by_name?: string;
  _authorName?: string;
};

const authorNameCache: Record<string, string> = {};

let cachedUserId: string | null = null;

async function getAuthorName(ticket: Ticket): Promise<string> {
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
      } else if (data && Array.isArray((data).tickets)) {
        ticketList = (data).tickets;
      } else {
        ticketList = [];
      }

      const enriched = await Promise.all(
        ticketList.map(async (ticket: Ticket) => {
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
      fetchTicketsByStatus('open');
    } else {
      if (!resolvedLoaded) {
        fetchTicketsByStatus('closed');
      } else {
        setTickets(resolvedTickets);
        fetchTicketsByStatus('closed');
      }
    }
  }, [statusFilter, resolvedLoaded]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-6xl p-6 space-y-6">
        {/* Enhanced Search and Filter Section */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cases..."
                className="rounded-lg border border-gray-300 px-3 py-2 pl-10 text-sm focus:border-sky-500 focus:outline-none transition"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </span>
            </div>
            <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none transition">
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition">
              + New Case
            </button>
          </div>
        </div>

        {/* Active/Resolved Toggle */}
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

        {/* Ticket List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
        ) : error ? (
          <div className="rounded bg-red-100 p-4 text-red-700">{error}</div>
        ) : (
          <ul className="space-y-4">
            {tickets.map((ticket) => (
              <li key={`${ticket.ticket_id}-${ticket.ticket_number ?? ''}`}>
                <Link href={`/dashboard/${ticket.ticket_id}`}>
                  <div className="group relative cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{ticket.title}</h2>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{ticket.description || 'No description'}</p>
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
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
