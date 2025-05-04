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
import { FaCheck, FaEdit, FaMarker, FaRedo } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

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
              {/* Ai Feedback display */}
              {ticket.ai_request_in_progress && (
                <div className="flex items-start gap-2 mb-4 p-4 rounded-md" style={{ backgroundColor: 'rgba(173, 216, 230, 0.2)', borderRadius: '8px', border: '2px solid lightblue' }}>
                  <FaMarker className="text-gray-500 animate-spin" />
                  <div className="text-gray-700">
                    Requesting AI Feedback... Might take around 10 - 20 seconds
                    <div className="text-xs text-gray-500 mt-1">
                      Request started at {new Date(ticket.ai_request_in_progress ?? '').toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
              {ticket.ai_feedback && (
                <div className="flex items-start gap-2 mb-4 p-4 rounded-md" style={{ backgroundColor: 'rgba(173, 216, 230, 0.2)', borderRadius: '8px', border: '2px solid lightblue' }}>
                  <FaMarker className="text-gray-500" />
                  <div className="text-gray-700" style={{ whiteSpace: 'pre-line' }}>
                    <div className="text-xs text-gray-500 mb-1">
                      AI generated Feedback - Use as a reference only, do not fully depend on it.
                    </div>
                    <ReactMarkdown>{ticket.ai_feedback}</ReactMarkdown>
                  </div>
                </div>
              )}
              {/* End Ai Feedback display */}
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
                        <FaRedo className="mr-1" />
                        Reopen
                      </button>
                    )}
                    <button
                      className="inline-flex items-center rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                      onClick={() => setIsEditFormOpen(true)}
                    >
                      <FaEdit className="mr-1" />
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
                      {reply.ai_feedback && (
                        <div className="mt-2 p-2 rounded-md bg-blue-50 border border-blue-200">
                          <p className="text-xs text-gray-500 mb-1">AI Feedback:</p>
                          <ReactMarkdown>{reply.ai_feedback}</ReactMarkdown>
                        </div>
                      )}
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
                            <FaCheck className="mr-1" />
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
