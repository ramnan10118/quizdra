"use client";

import { useState, useEffect } from 'react';
import { useSocket, Team, BuzzerResponse } from '../hooks/useSocket';

export default function HostPage() {
  const socket = useSocket();
  const [teams, setTeams] = useState<Team[]>([]);
  const [buzzerResponses, setBuzzerResponses] = useState<BuzzerResponse[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  useEffect(() => {
    if (socket) {
      // Listen for buzzer responses
      socket.on('buzzer_responses', (responses: BuzzerResponse[]) => {
        setBuzzerResponses(responses);
      });

      // Listen for team updates
      socket.on('teams_update', (updatedTeams: Team[]) => {
        setTeams(updatedTeams);
      });
    }
  }, [socket]);

  const handleNextQuestion = () => {
    if (socket) {
      socket.emit('next_question');
      setCurrentQuestion(prev => prev + 1);
      setBuzzerResponses([]); // Clear previous responses
    }
  };

  const handleAwardPoint = (teamId: string) => {
    if (socket) {
      socket.emit('award_point', teamId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 safe-area-inset-top">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <h1 className="text-2xl font-bold text-center sm:text-left">Quiz Host Panel</h1>
          <div className="text-lg">
            Round {currentRound} - Question {currentQuestion}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* Question Display */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Current Question</h2>
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Question/Puzzle Display Area</p>
          </div>
        </div>

        {/* Buzzer Responses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Fastest Responses</h2>
          <div className="space-y-3">
            {buzzerResponses.map((response, index) => (
              <div 
                key={response.teamId}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div>
                  <span className="font-bold mr-2 text-lg">#{index + 1}</span>
                  <span className="text-lg">{response.teamName}</span>
                </div>
                <button
                  onClick={() => handleAwardPoint(response.teamId)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-base"
                >
                  Award Point
                </button>
              </div>
            ))}
            {buzzerResponses.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Waiting for responses...
              </p>
            )}
          </div>
        </div>

        {/* Team Scores */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Team Scores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {teams.map(team => (
              <div 
                key={team.id}
                className="p-6 rounded-lg bg-gray-50"
              >
                <div className="font-medium text-lg">{team.name}</div>
                <div className="text-3xl font-bold text-blue-600">{team.score}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <button
            onClick={handleNextQuestion}
            className="w-full py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-lg"
          >
            Next Question
          </button>
        </div>
      </main>
    </div>
  );
}