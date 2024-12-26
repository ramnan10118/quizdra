"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '../hooks/useSocket';

export default function TeamRegistration() {
  const [teamName, setTeamName] = useState('');
  const router = useRouter();
  const socket = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim() && socket) {
      socket.emit('register_team', teamName);
      localStorage.setItem('teamName', teamName);
      router.push('/participant/buzzer');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Team Registration</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="teamName" className="block text-lg font-medium text-gray-700 mb-2">
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
              required
              autoComplete="off"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-4 text-xl font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
} 