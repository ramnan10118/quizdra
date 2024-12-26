import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

// Store active game state
const gameState = {
  teams: new Map(),
  currentRound: 0,
  currentQuestion: 0,
  buzzerResponses: [],
};

// Socket.io server instance
let io: Server;

if (!global.io) {
  io = new Server({
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  global.io = io;
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle team registration
  socket.on('register_team', (teamName: string) => {
    gameState.teams.set(socket.id, {
      id: socket.id,
      name: teamName,
      score: 0,
    });
    io.emit('teams_update', Array.from(gameState.teams.values()));
  });

  // Handle buzzer press
  socket.on('buzzer_press', () => {
    const team = gameState.teams.get(socket.id);
    if (team) {
      const timestamp = Date.now();
      gameState.buzzerResponses.push({
        teamId: socket.id,
        teamName: team.name,
        timestamp,
      });
      
      // Sort and get top 4 fastest responses
      const topResponses = gameState.buzzerResponses
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, 4);
      
      io.emit('buzzer_responses', topResponses);
    }
  });

  // Handle point award
  socket.on('award_point', (teamId: string) => {
    const team = gameState.teams.get(teamId);
    if (team) {
      team.score += 1;
      io.emit('teams_update', Array.from(gameState.teams.values()));
    }
  });

  // Handle next question
  socket.on('next_question', () => {
    gameState.buzzerResponses = [];
    gameState.currentQuestion += 1;
    io.emit('question_update', {
      round: gameState.currentRound,
      question: gameState.currentQuestion,
    });
  });

  socket.on('disconnect', () => {
    gameState.teams.delete(socket.id);
    io.emit('teams_update', Array.from(gameState.teams.values()));
    console.log('Client disconnected:', socket.id);
  });
});

export async function GET() {
  return NextResponse.json({ ok: true });
} 