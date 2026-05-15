import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Clock, Trophy, Users, CheckCircle, XCircle, Award } from 'lucide-react';

const LiveQuizPlay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizData, isHost, roomId } = location.state || {};
  const [socket, setSocket] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizEnded, setQuizEnded] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [answerResult, setAnswerResult] = useState(null);
  const [players, setPlayers] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const timerRef = useRef(null);
  const questions = quizData?.questions || quizData?.quiz?.questions || [];

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // In LiveQuizPlay.jsx, update the useEffect for new-question:

newSocket.on('new-question', (data) => {
  setCurrentQuestion(data);
  setSelectedAnswer(null);
  setAnswerResult(null);
  setWaitingForNext(false);
  setTimeLeft(data.timeLimit);
  setQuestionNumber(data.questionNumber);
  setTotalQuestions(data.totalQuestions);
  
  // Clear existing timer
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
  
  // Start new timer
  timerRef.current = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
});

    newSocket.on('answer-result', (data) => {
      setAnswerResult(data);
    });

    newSocket.on('scores-update', (data) => {
      setPlayers(data.players);
    });

    newSocket.on('time-up', (data) => {
      setWaitingForNext(true);
      setAnswerResult({ isCorrect: false, message: data.message });
    });

    newSocket.on('quiz-ended', (data) => {
      setQuizEnded(true);
      setLeaderboard(data.leaderboard);
      if (timerRef.current) clearInterval(timerRef.current);
    });

    newSocket.on('player-left', (data) => {
      setPlayers(data.players);
    });

    return () => {
      newSocket.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const submitAnswer = (answer) => {
    if (selectedAnswer || waitingForNext || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    const timeTaken = currentQuestion.timeLimit - timeLeft;
    
    socket.emit('submit-answer', {
      roomId,
      questionIndex: questionNumber - 1,
      answer,
      timeTaken
    });
    
    if (timerRef.current) clearInterval(timerRef.current);
  };

  if (quizEnded) {
    const top3 = leaderboard.slice(0, 3);
    const currentPlayer = leaderboard.find(p => p.playerName === (localStorage.getItem('displayName') || 'You'));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h1>
            <p className="text-gray-500 mb-8">
              Your final score: <span className="font-bold text-purple-600">{currentPlayer?.score || 0} points</span>
            </p>

            {/* Podium */}
            <div className="flex justify-center items-end gap-4 mb-8">
              {top3[1] && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-3xl">🥈</span>
                  </div>
                  <p className="font-semibold">{top3[1].playerName}</p>
                  <p className="text-sm text-gray-500">{top3[1].score} pts</p>
                </div>
              )}
              {top3[0] && (
                <div className="text-center -mt-8">
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 ring-4 ring-yellow-400">
                    <span className="text-4xl">👑</span>
                  </div>
                  <p className="font-bold text-lg">{top3[0].playerName}</p>
                  <p className="text-purple-600 font-semibold">{top3[0].score} pts</p>
                </div>
              )}
              {top3[2] && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-3xl">🥉</span>
                  </div>
                  <p className="font-semibold">{top3[2].playerName}</p>
                  <p className="text-sm text-gray-500">{top3[2].score} pts</p>
                </div>
              )}
            </div>

            {/* Full Leaderboard */}
            <div className="bg-gray-50 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={18} />
                Final Leaderboard
              </h3>
              <div className="space-y-2">
                {leaderboard.map((player, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' : 'bg-gray-200'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium">{player.playerName}</span>
                    </div>
                    <span className="font-bold text-purple-600">{player.score} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/live-quiz')}
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
            >
              Back to Live Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Waiting for quiz to start...</p>
          <p className="text-sm text-gray-400 mt-2">Room: {roomId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Question {questionNumber} of {totalQuestions}</p>
              <p className="text-sm font-semibold text-purple-600">{currentQuestion.points} points</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${
              timeLeft < 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'
            }`}>
              <Clock size={18} />
              <span>{timeLeft}s</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentQuestion.text}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => submitAnswer(typeof option === 'object' ? option.text : option)}
                disabled={!!selectedAnswer || waitingForNext}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedAnswer === (typeof option === 'object' ? option.text : option)
                    ? answerResult?.isCorrect
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : selectedAnswer
                      ? 'border-gray-200 opacity-50'
                      : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{typeof option === 'object' ? option.text : option}</span>
                  {selectedAnswer === (typeof option === 'object' ? option.text : option) && answerResult?.isCorrect && (
                    <CheckCircle className="ml-auto text-green-500" size={20} />
                  )}
                  {selectedAnswer === (typeof option === 'object' ? option.text : option) && !answerResult?.isCorrect && (
                    <XCircle className="ml-auto text-red-500" size={20} />
                  )}
                </div>
              </button>
            ))}
          </div>

          {answerResult && (
            <div className={`mt-6 p-4 rounded-xl ${
              answerResult.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {answerResult.isCorrect ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <XCircle className="text-red-600" size={20} />
                )}
                <span className="font-semibold">
                  {answerResult.isCorrect ? 'Correct!' : 'Incorrect!'}
                </span>
              </div>
              {!answerResult.isCorrect && answerResult.correctAnswer && (
                <p className="text-sm">Correct answer: <span className="font-semibold">{answerResult.correctAnswer}</span></p>
              )}
              {answerResult.explanation && (
                <p className="text-sm text-gray-600 mt-2">{answerResult.explanation}</p>
              )}
              <p className="text-sm mt-2">
                You earned <span className="font-bold text-green-600">{answerResult.pointsEarned} points</span>
              </p>
            </div>
          )}

          {waitingForNext && (
            <div className="mt-6 text-center p-4 bg-blue-50 rounded-xl">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-blue-600">Next question loading...</p>
            </div>
          )}
        </div>

        {/* Players Sidebar */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Users size={16} />
            Players ({players.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {players.map((player, index) => (
              <div key={player.id} className="flex justify-between items-center text-sm">
                <span>{player.name}</span>
                <span className="font-semibold text-purple-600">{player.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveQuizPlay;