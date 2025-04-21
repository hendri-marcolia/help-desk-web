"use client";

import React, { useState } from "react";
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/ConfirmationDialog';

interface ReplyFormProps {
  ticketId: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ ticketId }: ReplyFormProps) => {
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    try {
      if (replyText.length === 0) {
        return;
      }
      const token = localStorage.getItem("token") ?? "";
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}/reply`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reply_text: replyText }),
      });

      if (!response.ok) {
        await response.json().then((data) => {
          if (data && data.error) {
            toast.error('Failed to post reply: ' + data.error);
          } else {
            toast.error("Failed to post reply.");
          }
        });
        return;
      } else {
        setReplyText("");
        toast.info("Reply posted successfully!");
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleConfirm = () => {
    if (replyText.length === 0) {
      toast.error("Please enter a reply.");
      return;
    }
    setIsConfirmationOpen(true);
  };

  const handleConfirmSubmit = () => {
    handleReply();
    setIsConfirmationOpen(false);
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <div className="mt-6 space-y-2">
      <form>
        <textarea
          value={replyText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          className="w-full rounded border p-2"
          required
        />
        <button
          type="button"
          onClick={handleConfirm}
          className="rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
        >
          Post Reply
        </button>
      </form>

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        title="Confirm Reply"
        message="Are you sure you want to post this reply?"
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelConfirmation}
      />
    </div>
  );
};

export default ReplyForm;
