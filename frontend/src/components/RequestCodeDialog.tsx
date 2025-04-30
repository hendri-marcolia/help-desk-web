"use client";
import React, { useState, useEffect } from 'react';

interface RequestCodeDialogProps {
  code: string;
  expires_at?: number;
  onClose: () => void;
}

const RequestCodeDialog: React.FC<RequestCodeDialogProps> = ({ code, expires_at, onClose }) => {
  const [timer, setTimer] = useState(() => {
    if (expires_at) {
      const expiryTime = new Date(expires_at * 1000).getTime();
      const now = Date.now();
      const diff = Math.max(0, expiryTime - now);
      return Math.ceil(diff / 1000);
    }
    return 30;
  });
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      onClose();
    }
  }, [timer, onClose]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const initialTimer = (() => {
    if (expires_at) {
      const expiryTime = new Date(expires_at * 1000).getTime();
      const now = Date.now();
      const diff = Math.max(0, expiryTime - now);
      return Math.ceil(diff / 1000);
    }
    return 30;
  })();

  const progress = (timer / initialTimer) * 100;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900/75 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Login Code</h2>
          <div className="relative">
            <div className="bg-gray-100 rounded-2xl p-8 font-mono text-lg text-gray-700 break-words text-center">
              {code}
            </div>
            <button
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-md text-sm focus:outline-none focus:shadow-outline"
              onClick={handleCopyCode}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="bg-gray-50 px-8 py-4 flex items-center justify-between">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-gray-600 text-sm">{timer}s</span>
        </div>
      </div>
    </div>
  );
};

export default RequestCodeDialog;
