import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Copy, Users, Play, LogOut, Check, Share2, Crown } from 'lucide-react';
// import { AuthContext } from '../../Context/Authcontext';
import { useContext } from 'react';
import { AuthContext } from '../Context/Authcontext';

const LiveQuizLobby = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { quizData, mode } = location.state || {};
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    if (mode === 'host') {
      const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRoomId(newRoomId);
      setIsHost(true);

      socket.emit('create-room', {
        roomId: newRoomId,
        quizData,
        hostName: user?.displayName || user?.email?.split('@')[0],
        userId: user?.uid
      });
    }

    socket.on('room-created', (data) => {
      console.log('Room created:', data);
    });

    socket.on('player-joined', (data) => {
      setPlayers(data.players);
    });

    socket.on('joined-room', (data) => {
      setPlayers(data.players);
    });

    socket.on('quiz-started', () => {
      navigate(`/live-quiz/play/${roomId}`, { 
        state: { quizData, isHost, roomId, mode } 
      });
    });

    socket.on('error', (data) => {
      alert(data.message);
    });

    return () => {
      socket.off('room-created');
      socket.off('player-joined');
      socket.off('joined-room');
      socket.off('quiz-started');
      socket.off('error');
    };
  }, [socket, mode, quizData, user, navigate, roomId, isHost]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startQuiz = () => {
    if (players.length === 0) {
      alert('Wait for at least one player to join');
      return;
    }
    socket.emit('start-quiz', { roomId });
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit('leave-room', { roomId });
      socket.disconnect();
    }
    navigate('/live-quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Quiz Lobby
          </h1>
          <p className="text-gray-500">{quizData?.quiz?.title || quizData?.title}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Room Code Section */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-2">Room Code</p>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-4xl font-bold tracking-wider text-purple-700">{roomId}</h2>
              <button
                onClick={copyRoomCode}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Share this code with players to join</p>
          </div>

          {/* Players Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users size={18} />
                Players ({players.length})
              </h3>
              {isHost && (
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                  You are the host
                </span>
              )}
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {players.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Users size={40} className="mx-auto mb-2 opacity-50" />
                  <p>No players joined yet</p>
                  <p className="text-sm">Share the room code to invite players</p>
                </div>
              ) : (
                players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-800">{player.name}</span>
                    </div>
                    {player.id === socket?.id && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">You</span>
                    )}
                    {isHost && player.id === socket?.id && (
                      <Crown size={16} className="text-yellow-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {isHost ? (
              <button
                onClick={startQuiz}
                disabled={players.length === 0}
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play size={18} />
                Start Quiz ({players.length} players)
              </button>
            ) : (
              <div className="flex-1 text-center py-3 bg-gray-100 rounded-xl text-gray-500">
                Waiting for host to start the quiz...
              </div>
            )}
            <button
              onClick={leaveRoom}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <LogOut size={18} />
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveQuizLobby;