"use client";

import React, { useState } from "react";
import { toast } from 'react-toastify';

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
                // throw new Error(`Failed to post reply: ${response.status}`);
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
                    onClick={handleReply}
                    className="rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
                >
                    Post Reply
                </button>
            </form>
        </div>
    );
};

export default ReplyForm;
