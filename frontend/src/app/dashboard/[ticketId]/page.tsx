'use client';
export const runtime = 'edge';
import React from 'react';
import { Reply } from '../../../api/models/Reply';
import TokenHandler from './TokenHandler';
import ReplyForm from './ReplyForm';
import Header from '../../../components/Header';
import { Ticket, TicketsService } from '@/api';
import TicketForm from '@/components/TicketForm';
import { toast } from 'react-toastify';

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
  const [isEditFormOpen, setIsEditFormOpen] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdateTicket = async (ticketId: string, data: Ticket) => {
    setIsUpdating(true);
    try {
      const { title, description, facility, category } = data;
      if (
        data.title === ticket?.title &&
        data.description === ticket?.description &&
        data.facility === ticket?.facility &&
        data.category === ticket?.category
      ) {
        toast.info('No changes to update.');
        return;
      }
      await TicketsService.patchTickets({ ticketId: ticketId, requestBody: { title, description, facility, category } });
      toast.success('Ticket updated successfully!');
      fetchTicket();
    } catch (error) {
      console.error('Failed to update ticket:', error);
      toast.error('Failed to update ticket.');
    } finally {
      setIsEditFormOpen(false);
      setIsUpdating(false);
    }
  };

  const fetchTicket = React.useCallback(async () => {
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
  }, [ticketId]);

  React.useEffect(() => {
    fetchTicket();
  }, [apiUrl, ticketId, token, fetchTicket]);

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
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-6">
      {isUpdating ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500">
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {!isEditFormOpen ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                <div className="flex items-center gap-2">

                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{ticket.title}</h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
                    #: {ticket.ticket_number ?? 'UNKNOWN'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${ticket.status === 'active' || ticket.status === 'open'
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
              <p className="text-gray-700 whitespace-pre-wrap mb-4 text-lg leading-relaxed">{ticket.description}</p>
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
              <div className="mt-2 flex justify-end">
                {((localStorage.getItem('role') === 'admin') || (ticket.created_by === localStorage.getItem('user_id'))) && (
                  <>
                    {ticket.status === 'closed' && (
                      <button
                        className="inline-flex items-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 mr-2"
                        onClick={async () => {
                          try {
                            await TicketsService.patchTicketsSolution({ ticketId: ticketId, requestBody: { status: 'open' } });
                            toast.success('Ticket reopened successfully!');
                            fetchTicket();
                          } catch (error) {
                            console.error('Failed to reopen ticket:', error);
                            toast.error('Failed to reopen ticket.');
                          }
                        }}
                      >
                        Reopen
                      </button>
                    )}
                    <button
                      className="inline-flex items-center rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                      onClick={() => setIsEditFormOpen(true)}
                    >
                      <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M2.695 14.763l-1.292 1.292a1.335 1.335 0 00-.373.969V19.5a.5.5 0 00.5.5h2.121a.375.375 0 00.264-.643l-1.293-1.292c-.112-.112-.305-.112-.417 0zM19.477 5.425l-7.647 7.648a.5.5 0 01-.707 0l-2.192-2.192a.5.5 0 010-.707l7.649-7.647a.5.5 0 01.707 0l2.191 2.191a.5.5 0 010 .707z" />
                      </svg>
                      Edit
                    </button>
                  </>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold mb-4">Replies</h2>
                <ul className="space-y-6">
                  {ticket.replies?.sort((a, b) => {
                    if (ticket.status === 'closed' && ticket.solution_reply_id) {
                      if (a.reply_id === ticket.solution_reply_id) {
                        return -1;
                      }
                      if (b.reply_id === ticket.solution_reply_id) {
                        return 1;
                      }
                    }
                    return 0;
                  }).map((reply: Reply) => (
                    <li key={reply.reply_id} className={`rounded-lg border border-gray-200 p-4 ${reply.reply_id === ticket.solution_reply_id ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <p className="text-gray-700 whitespace-pre-wrap text-base">{reply.reply_text}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <span className="text-gray-400">By {reply.created_by_name}</span>
                          at {new Date(reply.created_at ?? '').toLocaleString()}
                        </p>
                        {ticket.status !== 'closed' && ((localStorage.getItem('role') === 'admin') || (ticket.created_by === localStorage.getItem('user_id'))) && (
                          <button
                            className="inline-flex items-center text-sky-500 hover:text-sky-700 text-sm"
                            onClick={async () => {
                              try {
                                await TicketsService.patchTicketsSolution({ ticketId: ticketId, requestBody: { reply_id: reply.reply_id } });
                                toast.success('Reply marked as solution!');
                                fetchTicket();
                              } catch (error) {
                                console.error('Failed to mark reply as solution:', error);
                                toast.error('Failed to mark reply as solution.');
                              }
                            }}
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Mark as Solution
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <ReplyForm ticketId={ticketId} />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              <TicketForm
                initialValues={ticket}
                onSubmit={(data: Ticket) => handleUpdateTicket(ticketId, data)}
                onCancel={() => setIsEditFormOpen(false)}
              />
            </div>
          )}
        </div>)}
    </div >
  );
}
