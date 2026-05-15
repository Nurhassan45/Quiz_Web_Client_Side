import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Play, Trophy, Clock, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
// import axiosInstance from '../../Axios/AxiosInstance';
import Loading from '../Loading/Loading';
import axiosInstance from '../Axios/AxiosInstance';
// import Loading from '../../Loading/Loading';

const LiveQuizList = () => {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await axiosInstance.get('/quizes');
      return res.data;
    }
  });

  if (isLoading) return <Loading />;

  const handleHostQuiz = (quiz) => {
    navigate('/live-quiz/lobby', { state: { quizData: quiz, mode: 'host' } });
  };

  const handleJoinQuiz = () => {
    navigate('/live-quiz/join');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl rotate-6 mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Live Quiz Arena
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Host a live quiz and challenge your friends or join an existing game
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Host Quiz Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Host a Quiz</h2>
            <p className="text-gray-500 mb-6">
              Create a room and invite players to join your live quiz competition
            </p>
            
            {selectedQuiz ? (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-gray-500">Selected Quiz</p>
                  <p className="font-semibold text-gray-800">{selectedQuiz.quiz?.title}</p>
                  <p className="text-xs text-gray-500">
                    {selectedQuiz.questions?.length || 0} questions • {selectedQuiz.quiz?.duration} min
                  </p>
                </div>
                <button
                  onClick={() => handleHostQuiz(selectedQuiz)}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Start Live Session
                </button>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="w-full text-gray-500 py-2 hover:text-gray-700 transition"
                >
                  Change Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {quizzes?.map((quiz) => (
                  <button
                    key={quiz._id}
                    onClick={() => setSelectedQuiz(quiz)}
                    className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition"
                  >
                    <p className="font-semibold text-gray-800">{quiz.quiz?.title}</p>
                    <p className="text-sm text-gray-500">
                      {quiz.questions?.length || 0} questions • {quiz.quiz?.duration} min
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Join Quiz Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Join a Quiz</h2>
            <p className="text-gray-500 mb-6">
              Enter a room code to join an existing live quiz session
            </p>
            <button
              onClick={handleJoinQuiz}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Join Room
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Real-time Gameplay</h3>
            <p className="text-sm text-gray-500">All players see questions simultaneously</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Timed Challenges</h3>
            <p className="text-sm text-gray-500">Race against the clock to answer</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Live Leaderboard</h3>
            <p className="text-sm text-gray-500">See rankings update in real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveQuizList;