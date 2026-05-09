import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useMemo, use } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Trophy,
  Home
} from 'lucide-react';
import axiosInstance from '../../Axios/AxiosInstance';
import Loading from '../../Loading/Loading';
import { AuthContext } from '../../Context/Authcontext';

const QuizQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const{user}=use(AuthContext)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/quizes/${id}`);
      return res.data;
    }
  });

  const questions = useMemo(() => data?.questions || [], [data]);
  const quizInfo = useMemo(() => data?.quiz, [data]);

  useEffect(() => {
    if (quizInfo?.duration && !quizCompleted && !showResult) {
      setTimeLeft(quizInfo.duration * 60);
    }
  }, [quizInfo, quizCompleted, showResult]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted && !showResult) {
      handleAutoSubmit();
    }
  }, [timeLeft, quizCompleted, showResult]);

  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent error={error} />;

  const currentQuestion = questions[currentIndex];

  // Get options from question (options are already in correct format)
  const getQuestionOptions = (question) => {
    if (!question) return [];
    return question.options || [];
  };

  // Get the correct answer text for a question
  const getCorrectAnswerText = (question) => {
    if (!question || !question.options) return null;
    
    const correctOption = question.options.find(opt => opt.isCorrect === true);
    return correctOption ? correctOption.text : null;
  };

  // Check if the selected answer is correct
  const isAnswerCorrect = (question, selectedAnswerText) => {
    if (!question || !selectedAnswerText) return false;
    
    const correctAnswerText = getCorrectAnswerText(question);
    return selectedAnswerText === correctAnswerText;
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answerText) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerText
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleAutoSubmit = () => {
    if (!quizCompleted && !showResult) {
      alert('Time is up! Submitting your quiz...');
      handleSubmit();
    }
  };

  const calculateResults = () => {
    let score = 0;
    let totalPoints = 0;
    let correctCount = 0;
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = isAnswerCorrect(question, userAnswer);
      const points = question?.points || 5;
      
      totalPoints += points;
      if (isCorrect) {
        score += points;
        correctCount++;
      }
    });
    
    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const passed = percentage >= (quizInfo?.passingScore || 60);
    
    return { score, totalPoints, percentage, passed, correctCount };
  };

  const handleSubmit = async () => {
    if (quizCompleted || showResult) return;
    
    const results = calculateResults();
    setShowResult(true);
    setQuizCompleted(true);

    console.log('result',results)
    
    try {
      await axiosInstance.post('/quiz/submit', {
        quizId: quizInfo?.id,
        ExamnerEmail:user?.email,
        answers,
        results,
        timeTaken: quizInfo?.duration ? (quizInfo.duration * 60) - (timeLeft || 0) : 0
      });
    } catch (error) {
      console.error('Failed to save results:', error);
    }
  };

  const QuestionNavigator = () => (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700">Questions</h3>
        <span className="text-sm text-gray-500">
          {Object.keys(answers).length} / {questions.length} Answered
        </span>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {questions.map((q, idx) => (
          <button
            key={q.id || idx}
            onClick={() => setCurrentIndex(idx)}
            className={`
              w-10 h-10 rounded-lg font-semibold text-sm transition-all
              ${currentIndex === idx ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
              ${answers[q.id] 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                : flaggedQuestions.includes(q.id)
                  ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );

  if (showResult) {
    const { score, totalPoints, percentage, passed, correctCount } = calculateResults();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`p-8 text-center ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}>
              <Trophy className="w-20 h-20 text-white mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                {passed ? 'Congratulations!' : 'Better Luck Next Time!'}
              </h1>
              <p className="text-white/90">
                You have completed {quizInfo?.title}
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">Your Score</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {score} / {totalPoints}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">Percentage</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">Correct Answers</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {correctCount} / {questions.length}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">Status</p>
                  <p className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                    {passed ? 'PASSED' : 'FAILED'}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl mb-8">
                <h3 className="font-semibold text-blue-900 mb-2">Passing Score Required:</h3>
                <p className="text-blue-700">{quizInfo?.passingScore}% to pass this quiz</p>
                <p className="text-sm text-blue-600 mt-1">Your score: {percentage.toFixed(1)}%</p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/quizzes')}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <Home size={18} />
                  Back to Quizzes
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  <BarChart3 size={18} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <Loading />;

  const options = getQuestionOptions(currentQuestion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{quizInfo?.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${
              timeLeft !== null && timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'
            }`}>
              <Clock size={18} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentQuestion?.text}
                  </h2>
                  <button
                    onClick={() => toggleFlag(currentQuestion?.id)}
                    className={`p-2 rounded-lg transition ${
                      flaggedQuestions.includes(currentQuestion?.id)
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Flag size={18} />
                  </button>
                </div>

                {/* Code Snippet if available */}
                {currentQuestion?.codeSnippet && (
                  <div className="mb-4 p-3 bg-gray-900 rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
                    <pre>{currentQuestion.codeSnippet}</pre>
                  </div>
                )}

                {/* Options Rendering */}
                <div className="space-y-3">
                  {options.length > 0 ? (
                    options.map((option, idx) => (
                      <label
                        key={option.id || idx}
                        className={`
                          flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all
                          ${answers[currentQuestion?.id] === option.text
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="question"
                          value={option.text}
                          checked={answers[currentQuestion?.id] === option.text}
                          onChange={(e) => handleAnswer(currentQuestion?.id, e.target.value)}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">{option.text}</span>
                      </label>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No options available for this question
                    </div>
                  )}
                </div>

                {/* Hint Section */}
                {currentQuestion?.hint && answers[currentQuestion?.id] && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>💡 Hint:</strong> {currentQuestion.hint}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-4 pt-4 border-t">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
                
                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                  >
                    Submit Quiz
                    <CheckCircle size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <QuestionNavigator />
            
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Quiz Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Points:</span>
                    <span className="font-semibold">{currentQuestion?.points || 5} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Difficulty:</span>
                    <span className={`capitalize font-semibold ${
                      currentQuestion?.difficulty === 'easy' ? 'text-green-600' :
                      currentQuestion?.difficulty === 'intermediate' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {currentQuestion?.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="capitalize">{currentQuestion?.type || 'Multiple Choice'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Answered:</span>
                    <span className="font-semibold text-green-600">
                      {Object.keys(answers).length} / {questions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Flagged:</span>
                    <span className="font-semibold text-yellow-600">
                      {flaggedQuestions.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {currentQuestion?.tags && currentQuestion.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {currentQuestion.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ErrorComponent = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Quiz</h2>
      <p className="text-gray-500 mb-4">{error?.message || 'Something went wrong'}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default QuizQuestions;