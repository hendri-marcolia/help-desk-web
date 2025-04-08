"use client";

import React, { useState } from "react";

interface ReplyFormProps {
  ticketId: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ ticketId }: ReplyFormProps) => {
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    try {
      const token = localStorage.getItem("token") ?? "";
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}/reply`;
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: replyText }),
      });
      setReplyText("");
      window.location.reload();
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  return (
    <div className="mt-6 space-y-2">
      <textarea
        value={replyText}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
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
  );
};

export default ReplyForm;