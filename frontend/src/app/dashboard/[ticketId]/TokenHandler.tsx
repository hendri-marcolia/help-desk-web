'use client';

import React, { useEffect, useState } from 'react';

interface TokenHandlerProps {
  children: (ticketId: string, token: string) => React.ReactNode;
  ticketId: string;
}

export default function TokenHandler({ children, ticketId }: TokenHandlerProps) {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await localStorage.getItem('token') ?? '';
      setToken(storedToken);
      setIsLoading(false);
    };
    fetchToken();
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  return <>{children(ticketId, token)}</>;
}
