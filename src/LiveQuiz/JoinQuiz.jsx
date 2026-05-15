import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Users, LogIn, ArrowRight, AlertCircle } from 'lucide-react';
// import { AuthContext } from '../../Context/Authcontext';
import { useContext } from 'react';
import { AuthContext } from '../Context/Authcontext';

const JoinQuiz = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('joined-room', (data) => {
      setJoining(false);
      navigate(`/live-quiz/play/${roomCode}`, {
        state: { 
          quizData: data.quizData, 
          isHost: false, 
          roomId: roomCode,
          mode: 'player'
        }
      });
    });

    socket.on('join-error', (data) => {
      setError(data.message);
      setJoining(false);
    });

    return () => {
      socket.off('joined-room');
      socket.off('join-error');
    };
  }, [socket, navigate, roomCode]);

  const handleJoin = () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setError('');
    setJoining(true);
    
    socket.emit('join-room', {
      roomId: roomCode.toUpperCase(),
      playerName: user?.displayName || user?.email?.split('@')[0]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white py-8 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Join a Live Quiz</h2>
            <p className="text-gray-500 mt-2">Enter the room code shared by the host</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-wider border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                maxLength={6}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              onClick={handleJoin}
              disabled={joining || !roomCode}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {joining ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Joining...
                </>
              ) : (
                <>
                  Join Room
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have a room code?{' '}
              <button
                onClick={() => navigate('/live-quiz')}
                className="text-purple-600 hover:underline"
              >
                Go back
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinQuiz;