"use client";

import React, { useState } from "react";
import { toast } from 'react-toastify';

interface ReplyFormProps {
  ticketId: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ ticketId }: ReplyFormProps) => {
  const [replyText, setReplyText] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  const handleConfirm = () => {
    if (replyText.length === 0) {
      toast.error("Please enter a reply.");
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    handleReply();
    setIsConfirmOpen(false);
  };

  const handleConfirmCancel = () => {
    setIsConfirmOpen(false);
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

      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="text-lg font-semibold mb-4">Confirm Reply</p>
            <p className="text-gray-600 mb-6">Are you sure you want to post this reply?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 text-sm bg-sky-500 text-white hover:bg-sky-600 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyForm;
