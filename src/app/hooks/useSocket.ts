import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socket = useRef<Socket>();

  useEffect(() => {
    // Connect to Socket.io server
    socket.current = io('http://localhost:3000', {
      path: '/api/socket',
    });

    // Cleanup on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return socket.current;
};

// Types for our socket events
export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface BuzzerResponse {
  teamId: string;
  teamName: string;
  timestamp: number;
}

export interface QuestionUpdate {
  round: number;
  question: number;
} 