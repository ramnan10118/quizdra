"use client";

import { useState, useEffect } from 'react';
import { useSocket, Team, QuestionUpdate } from '../../hooks/useSocket';

export default function BuzzerPage() {
  const socket = useSocket();
  const [teamName, setTeamName] = useState<string>('');
  const [isBuzzerPressed, setIsBuzzerPressed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameInfo, setGameInfo] = useState<QuestionUpdate>({ round: 0, question: 0 });

  useEffect(() => {
    const storedTeamName = localStorage.getItem('teamName');
    if (storedTeamName) {
      setTeamName(storedTeamName);
    }

    if (socket) {
      socket.on('teams_update', (teams: Team[]) => {
        const myTeam = teams.find(team => team.name === storedTeamName);
        if (myTeam) {
          setScore(myTeam.score);
        }
      });

      socket.on('question_update', (update: QuestionUpdate) => {
        setGameInfo(update);
        setIsBuzzerPressed(false);
      });
    }
  }, [socket]);

  const handleBuzzerPress = () => {
    if (socket && !isBuzzerPressed) {
      socket.emit('buzzer_press');
      setIsBuzzerPressed(true);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-gray-100 p-4 safe-area-inset-bottom">
      {/* Team Info */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3">{teamName}</h1>
        <p className="text-2xl mb-2">Score: {score}</p>
        <p className="text-lg text-gray-600">
          Round {gameInfo.round} - Question {gameInfo.question}
        </p>
      </div>

      {/* Buzzer Button */}
      <button
        onClick={handleBuzzerPress}
        disabled={isBuzzerPressed}
        className={`
          w-[85vw] h-[85vw] 
          max-w-[500px] max-h-[500px]
          min-w-[280px] min-h-[280px]
          rounded-full 
          ${isBuzzerPressed 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-red-500 hover:bg-red-600 active:bg-red-700'}
          shadow-xl
          transform transition-all duration-150
          active:scale-95
          focus:outline-none focus:ring-4 focus:ring-red-300
          flex items-center justify-center
          -mt-8
        `}
      >
        <span className="text-white text-4xl sm:text-5xl font-bold select-none">
          {isBuzzerPressed ? 'BUZZED!' : 'BUZZ'}
        </span>
      </button>

      {/* Status Message */}
      {isBuzzerPressed && (
        <div className="mt-12 text-center">
          <p className="text-xl text-gray-700 font-medium">
            Your response has been recorded!
          </p>
          <p className="text-lg text-gray-600 mt-2">
            Wait for the next question
          </p>
        </div>
      )}
    </div>
  );
} 