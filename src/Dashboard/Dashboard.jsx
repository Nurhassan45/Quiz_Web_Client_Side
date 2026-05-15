import React, { use, useState } from 'react';
import { 
  Home, 
  Settings, 
  BookOpen, 
  Trophy, 
  Users, 
  BarChart3, 
  Calendar,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Activity,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  Menu,
  Plus,
  Edit,
  Trash2,
  Eye,
  XCircle,
  FileText,
  PieChart
} from 'lucide-react';
import { AuthContext } from '../Context/Authcontext';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Axios/AxiosInstance';
import Loading from '../Loading/Loading';

const Dashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const { user } = use(AuthContext);
  
  // Fetch all quizzes
  const { data: quizzesData, isLoading: quizzesLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await axiosInstance.get(`quizes`);
      return res.data;
    }
  });

  // Fetch quiz results for current user
  const { data: resultsData, isLoading: resultsLoading } = useQuery({
    queryKey: ['quizResults'],
    queryFn: async () => {
      const res = await axiosInstance.get(`/quizzes/getResult`);
      return res.data;
    },
    enabled: !!user?.email
  });

  if (resultsLoading || quizzesLoading) return <Loading />;

  // Fix: Properly filter results for current user
  const filterResult = resultsData?.filter(res => res?.ExamnerEmail === user?.email) || [];
  
  console.log('QuizResult for user:', resultsData);
  console.log('User email:', user?.email);

  // Filter quizzes created by current user
  const createdQuizzes = quizzesData?.filter(res => res?.quiz?.createdBy === user?.email) || [];
  
  // Process quiz results - use filterResult directly
  const quizResults = filterResult;
  
  // Calculate statistics from results
  const calculateStats = () => {
    if (!quizResults || quizResults.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        totalPoints: 0,
        passedCount: 0,
        failedCount: 0,
        bestScore: 0,
        worstScore: 0,
        completionRate: 0
      };
    }

    const totalQuizzes = quizResults.length;
    const totalPercentage = quizResults.reduce((sum, result) => sum + (result.results?.percentage || 0), 0);
    const averageScore = totalPercentage / totalQuizzes;
    const totalPoints = quizResults.reduce((sum, result) => sum + (result.results?.score || 0), 0);
    const passedCount = quizResults.filter(result => result.results?.passed === true).length;
    const failedCount = quizResults.filter(result => result.results?.passed === false).length;
    const bestScore = Math.max(...quizResults.map(result => result.results?.percentage || 0), 0);
    const worstScore = Math.min(...quizResults.map(result => result.results?.percentage || 0), 0);
    const completionRate = quizResults.length > 0 ? (quizResults.filter(result => result.results?.percentage > 0).length / totalQuizzes) * 100 : 0;

    return {
      totalQuizzes,
      averageScore: Math.round(averageScore),
      totalPoints,
      passedCount,
      failedCount,
      bestScore: Math.round(bestScore),
      worstScore: Math.round(worstScore),
      completionRate: Math.round(completionRate)
    };
  };

  // Get recent quiz results
  const getRecentResults = () => {
    if (!quizResults || quizResults.length === 0) return [];
    return [...quizResults]
      .sort((a, b) => {
        const dateA = a._id?.$oid ? new Date(parseInt(a._id.$oid.substring(0, 8), 16) * 1000) : new Date(a.createdAt || 0);
        const dateB = b._id?.$oid ? new Date(parseInt(b._id.$oid.substring(0, 8), 16) * 1000) : new Date(b.createdAt || 0);
        return dateB - dateA;
      })
      .slice(0, 5);
  };

  // Get performance by quiz
  const getQuizPerformance = () => {
    if (!quizResults || quizResults.length === 0) return [];
    
    const quizMap = new Map();
    
    quizResults.forEach(result => {
      const quizId = result.quizId;
      if (!quizMap.has(quizId)) {
        quizMap.set(quizId, {
          quizId,
          attempts: 0,
          totalScore: 0,
          bestScore: 0,
          lastAttempt: result._id?.$oid || result.createdAt
        });
      }
      
      const data = quizMap.get(quizId);
      data.attempts++;
      data.totalScore += result.results?.percentage || 0;
      data.bestScore = Math.max(data.bestScore, result.results?.percentage || 0);
    });
    
    return Array.from(quizMap.values()).map(quiz => ({
      ...quiz,
      averageScore: Math.round(quiz.totalScore / quiz.attempts)
    }));
  };

  const stats = calculateStats();
  const recentResults = getRecentResults();
  const quizPerformance = getQuizPerformance();

  // Menu items
  const menuItems = [
    { id: 'home', label: 'Overview', icon: <Home size={20} />, tip: 'Overview' },
    { id: 'my-results', label: 'My Results', icon: <FileText size={20} />, tip: 'My Quiz Results', badge: quizResults.length },
    { id: 'created-quizzes', label: 'My Quizzes', icon: <Plus size={20} />, tip: 'Quizzes I Created', badge: createdQuizzes.length },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, tip: 'Performance Analytics' },
    { id: 'achievements', label: 'Achievements', icon: <Trophy size={20} />, tip: 'Achievements' },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Users size={20} />, tip: 'Leaderboard' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, tip: 'Settings' },
  ];

  // Toggle drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return <HomeContent stats={stats} recentResults={recentResults} quizPerformance={quizPerformance} />;
      case 'my-results':
        return <MyResultsContent results={quizResults} />;
      case 'created-quizzes':
        return <CreatedQuizzesContent quizzes={createdQuizzes} />;
      case 'analytics':
        return <AnalyticsContent stats={stats} quizPerformance={quizPerformance} />;
      case 'achievements':
        return <AchievementsContent stats={stats} />;
     case 'leaderboard':
  return <LeaderboardContent resultsData={quizResults} />;
      case 'settings':
        return <SettingsContent user={user} />;
      default:
        return <HomeContent stats={stats} recentResults={recentResults} quizPerformance={quizPerformance} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Drawer Toggle Input */}
      <input 
        type="checkbox" 
        className="hidden" 
        id="my-drawer-4" 
        checked={isDrawerOpen}
        onChange={() => {}}
      />
      
      {/* Drawer Content (Main Area) */}
      <div className={`transition-all duration-300 ${isDrawerOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Navbar */}
        <nav className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-3">
              <label 
                htmlFor="my-drawer-4" 
                onClick={toggleDrawer}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition"
              >
                <Menu size={20} className="text-gray-600" />
              </label>
              <div className="px-2">
                <h1 className="text-xl font-semibold text-gray-800">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none px-2 text-sm w-64"
                />
              </div>

              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition">
                <img 
                  src={user?.photoURL || `https://randomuser.me/api/portraits/men/1.jpg`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.displayName || 'User'}
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Drawer Side (Sidebar) */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-all duration-300
        ${isDrawerOpen ? 'w-64' : 'w-0 lg:w-20'} overflow-hidden`}
      >
        <div className="flex min-h-full flex-col items-start bg-white">
          <div className="h-16 flex items-center justify-center w-full border-b border-gray-100 px-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              {isDrawerOpen && (
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  QuizMaster
                </span>
              )}
            </div>
          </div>

          <div className={`p-4 border-b border-gray-100 w-full ${!isDrawerOpen && 'flex justify-center'}`}>
            <div className="flex items-center gap-3">
              <img 
                src={user?.photoURL || `https://randomuser.me/api/portraits/men/1.jpg`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              {isDrawerOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              )}
            </div>
          </div>

          <ul className="menu w-full grow p-3 space-y-1">
            {menuItems.map((item) => (
              <li key={item.id} className="w-full">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center rounded-lg transition-all duration-200
                    ${!isDrawerOpen && 'justify-center'}
                    ${activeTab === item.id 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-purple-600'
                    }
                  `}
                  title={!isDrawerOpen ? item.tip : ''}
                >
                  <div className={`flex items-center gap-3 px-3 py-2.5 ${!isDrawerOpen && 'justify-center'}`}>
                    <span className={activeTab === item.id ? 'text-white' : 'text-gray-500'}>
                      {item.icon}
                    </span>
                    {isDrawerOpen && (
                      <>
                        <span className="font-medium">{item.label}</span>
                        {item.badge > 0 && (
                          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                            activeTab === item.id 
                              ? 'bg-white/20 text-white' 
                              : 'bg-purple-100 text-purple-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className={`p-4 border-t border-gray-100 w-full space-y-2 ${!isDrawerOpen && 'flex flex-col items-center'}`}>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition ${!isDrawerOpen && 'justify-center'}`}
              title={!isDrawerOpen ? 'Logout' : ''}
            >
              <LogOut size={18} />
              {isDrawerOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Home Content Component
const HomeContent = ({ stats, recentResults, quizPerformance }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
        <p className="text-purple-100">Here's your quiz performance summary</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalQuizzes}</p>
              <p className="text-xs text-gray-500 mt-2">Attempted</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Score</p>
              <p className="text-2xl font-bold text-gray-800">{stats.averageScore}%</p>
              <p className="text-xs text-green-600 mt-2">Best: {stats.bestScore}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Passed/Failed</p>
              <p className="text-2xl font-bold text-gray-800">
                <span className="text-green-600">{stats.passedCount}</span>
                <span className="text-gray-400">/</span>
                <span className="text-red-600">{stats.failedCount}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">Pass Rate: {stats.totalQuizzes > 0 ? Math.round((stats.passedCount / stats.totalQuizzes) * 100) : 0}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Trophy size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Points</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalPoints}</p>
              <p className="text-xs text-gray-500 mt-2">Earned</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Award size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Quiz Results</h3>
            <button className="text-purple-600 text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {recentResults.length > 0 ? (
              recentResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{result.quizId}</p>
                    <p className="text-xs text-gray-500">
                      {result.results?.correctCount || 0}/{result.results?.totalPoints || 0} correct • {result.timeTaken || 0}s
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${result.results?.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.results?.percentage || 0}%
                    </p>
                    {result.results?.passed ? (
                      <CheckCircle size={14} className="text-green-500 mt-1" />
                    ) : (
                      <XCircle size={14} className="text-red-500 mt-1" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No quiz results yet</p>
                <p className="text-sm mt-2">Take a quiz to see your results here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Quiz Performance</h3>
            <button className="text-purple-600 text-sm hover:underline">Details</button>
          </div>
          <div className="space-y-4">
            {quizPerformance.length > 0 ? (
              quizPerformance.map((quiz, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 truncate flex-1">{quiz.quizId}</span>
                    <span className="text-gray-500 ml-2">{quiz.averageScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${quiz.averageScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{quiz.attempts} attempts • Best: {quiz.bestScore}%</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No performance data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// My Results Component
const MyResultsContent = ({ results }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">My Quiz Results</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
            Filter
          </button>
          <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition">
            Export
          </button>
        </div>
      </div>
      
      {results && results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Quiz ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Percentage</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Time Taken</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-800 font-mono">{result.quizId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{result.results?.score || 0}/{result.results?.totalPoints || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${
                      (result.results?.percentage || 0) >= 70 ? 'text-green-600' : 
                      (result.results?.percentage || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {result.results?.percentage || 0}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      result.results?.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {result.results?.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{result.timeTaken || 0} seconds</td>
                  <td className="px-4 py-3">
                    <button className="text-purple-600 hover:text-purple-700 text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FileText size={48} className="mx-auto mb-3 text-gray-300" />
          <p>No quiz results found</p>
          <button className="mt-2 text-purple-600 hover:underline">Take a Quiz</button>
        </div>
      )}
    </div>
  );
};

// Created Quizzes Component
const CreatedQuizzesContent = ({ quizzes }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Quizzes Created By Me</h2>
        <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition flex items-center gap-1">
          <Plus size={16} />
          Create New Quiz
        </button>
      </div>
      
      {quizzes && quizzes.length > 0 ? (
        <div className="space-y-3">
          {quizzes.map((quiz, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-gray-800">{quiz?.quiz?.title || 'Untitled Quiz'}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    quiz?.quiz?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {quiz?.quiz?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {quiz?.quiz?.category} • {quiz?.questions?.length || 0} questions • {quiz?.quiz?.duration || 0} min
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Created: {quiz?.quiz?.createdAt ? new Date(quiz.quiz.createdAt).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View">
                  <Eye size={18} />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Edit">
                  <Edit size={18} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Plus size={48} className="mx-auto mb-3 text-gray-300" />
          <p>You haven't created any quizzes yet</p>
          <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            Create Your First Quiz
          </button>
        </div>
      )}
    </div>
  );
};

// Analytics Component
const AnalyticsContent = ({ stats, quizPerformance }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Analytics</h2>
        
        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-gray-600">Overall Success Rate</p>
              <p className="text-purple-600 font-semibold">{stats.averageScore}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.averageScore}%` }}
              />
            </div>
          </div>

          {/* Pass/Fail Distribution */}
          <div>
            <p className="text-gray-600 mb-2">Pass/Fail Distribution</p>
            <div className="flex h-3 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${stats.totalQuizzes > 0 ? (stats.passedCount / stats.totalQuizzes) * 100 : 0}%` }}
              />
              <div 
                className="bg-red-500 transition-all duration-500"
                style={{ width: `${stats.totalQuizzes > 0 ? (stats.failedCount / stats.totalQuizzes) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-green-600">Passed: {stats.passedCount}</span>
              <span className="text-red-600">Failed: {stats.failedCount}</span>
            </div>
          </div>

          {/* Best/Worst Performance */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Best Performance</p>
              <p className="text-2xl font-bold text-green-700">{stats.bestScore}%</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 mb-1">Needs Improvement</p>
              <p className="text-2xl font-bold text-red-700">{stats.worstScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Performance Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Performance Details</h3>
        <div className="space-y-4">
          {quizPerformance.length > 0 ? (
            quizPerformance.map((quiz, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{quiz.quizId}</p>
                    <p className="text-xs text-gray-500">{quiz.attempts} attempts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-purple-600">Avg: {quiz.averageScore}%</p>
                    <p className="text-xs text-gray-500">Best: {quiz.bestScore}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
                    style={{ width: `${quiz.averageScore}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No quiz performance data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Achievements Component
const AchievementsContent = ({ stats }) => {
  const achievements = [
    { title: 'Quiz Taker', description: 'Complete 10 quizzes', progress: stats.totalQuizzes, target: 10, icon: '📝' },
    { title: 'Score Master', description: 'Score 80%+ on 5 quizzes', progress: stats.passedCount, target: 5, icon: '🎯' },
    { title: 'Perfect Streak', description: 'Pass 3 quizzes in a row', progress: stats.passedCount >= 3 ? 3 : stats.passedCount, target: 3, icon: '🔥' },
    { title: 'Knowledge Seeker', description: 'Achieve 70% average score', progress: stats.averageScore, target: 70, icon: '📚' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Achievements</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {achievements.map((achievement, i) => {
          const percentage = Math.min(Math.round((achievement.progress / achievement.target) * 100), 100);
          const isCompleted = percentage >= 100;
          
          return (
            <div key={i} className={`p-4 rounded-lg ${isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
                {isCompleted && <CheckCircle size={20} className="text-green-500" />}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-indigo-600'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Leaderboard Component
const LeaderboardContent = ({ resultsData }) => {
  const [timeFrame, setTimeFrame] = useState('all'); // 'all', 'month', 'week'
  const [sortBy, setSortBy] = useState('points'); // 'points', 'quizzes', 'avgScore'

  // Calculate leaderboard from results data
  const calculateLeaderboard = () => {
    if (!resultsData || resultsData.length === 0) return [];

    // Group results by user email
    const userStats = new Map();

    resultsData.forEach(result => {
      const email = result.ExamnerEmail;
      const score = result.results?.score || 0;
      const totalPoints = result.results?.totalPoints || 0;
      const percentage = result.results?.percentage || 0;
      const passed = result.results?.passed || false;
      const date = result._id?.$oid ? new Date(parseInt(result._id.$oid.substring(0, 8), 16) * 1000) : new Date();

      // Filter by time frame
      if (timeFrame !== 'all') {
        const now = new Date();
        const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
        if (timeFrame === 'week' && daysDiff > 7) return;
        if (timeFrame === 'month' && daysDiff > 30) return;
      }

      if (!userStats.has(email)) {
        userStats.set(email, {
          email,
          name: email.split('@')[0], // Extract name from email
          totalPoints: 0,
          totalQuizzes: 0,
          passedQuizzes: 0,
          totalPercentage: 0,
          bestScore: 0,
          lastActive: date
        });
      }

      const stats = userStats.get(email);
      stats.totalPoints += score;
      stats.totalQuizzes++;
      if (passed) stats.passedQuizzes++;
      stats.totalPercentage += percentage;
      stats.bestScore = Math.max(stats.bestScore, percentage);
      if (date > stats.lastActive) stats.lastActive = date;
    });

    // Calculate averages and prepare final data
    let leaderboard = Array.from(userStats.values()).map(user => ({
      ...user,
      averageScore: Math.round(user.totalPercentage / user.totalQuizzes),
      passRate: Math.round((user.passedQuizzes / user.totalQuizzes) * 100)
    }));

    // Sort based on selected criteria
    if (sortBy === 'points') {
      leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    } else if (sortBy === 'quizzes') {
      leaderboard.sort((a, b) => b.totalQuizzes - a.totalQuizzes);
    } else if (sortBy === 'avgScore') {
      leaderboard.sort((a, b) => b.averageScore - a.averageScore);
    }

    // Add rank
    return leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  };

  const leaderboard = calculateLeaderboard();
  const topThree = leaderboard.slice(0, 3);
  const restLeaderboard = leaderboard.slice(3);

  // Get medal color based on rank
  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-orange-500';
      default: return 'text-gray-300';
    }
  };

  // Get rank background
  const getRankBg = (rank) => {
    switch(rank) {
      case 1: return 'bg-yellow-500';
      case 2: return 'bg-gray-400';
      case 3: return 'bg-orange-500';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Global Leaderboard</h2>
          <p className="text-sm text-gray-500 mt-1">Top performers from around the world</p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="points">By Points</option>
            <option value="quizzes">By Quizzes</option>
            <option value="avgScore">By Average Score</option>
          </select>
        </div>
      </div>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-center items-end gap-4">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="text-center">
                <div className="mb-2">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🥈</span>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-xl p-3 w-32">
                  <p className="font-semibold text-gray-800 truncate">{topThree[1].name}</p>
                  <p className="text-xs text-gray-500">{topThree[1].totalPoints} pts</p>
                  <div className="mt-1 text-xs">
                    <span className="text-purple-600">{topThree[1].averageScore}% avg</span>
                  </div>
                </div>
                <div className="mt-2 w-8 h-8 mx-auto bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <div className="text-center -mt-4">
                <div className="mb-2">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center ring-4 ring-yellow-300">
                    <span className="text-4xl">👑</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-3 w-36 text-white">
                  <p className="font-bold truncate">{topThree[0].name}</p>
                  <p className="text-sm font-semibold">{topThree[0].totalPoints} pts</p>
                  <div className="mt-1 text-xs opacity-90">
                    {topThree[0].averageScore}% avg • {topThree[0].totalQuizzes} quizzes
                  </div>
                </div>
                <div className="mt-2 w-8 h-8 mx-auto bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <div className="text-center">
                <div className="mb-2">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🥉</span>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-xl p-3 w-32">
                  <p className="font-semibold text-gray-800 truncate">{topThree[2].name}</p>
                  <p className="text-xs text-gray-500">{topThree[2].totalPoints} pts</p>
                  <div className="mt-1 text-xs">
                    <span className="text-purple-600">{topThree[2].averageScore}% avg</span>
                  </div>
                </div>
                <div className="mt-2 w-8 h-8 mx-auto bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 w-16">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">User</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Quizzes</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Avg Score</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Best Score</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Pass Rate</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Total Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {restLeaderboard.map((user) => (
              <tr key={user.email} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full ${getRankBg(user.rank)} flex items-center justify-center text-white text-xs font-bold`}>
                      {user.rank}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{user.totalQuizzes}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-semibold ${
                    user.averageScore >= 80 ? 'text-green-600' :
                    user.averageScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {user.averageScore}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{user.bestScore}%</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-600">{user.passRate}%</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${user.passRate}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-bold text-purple-600">{user.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {leaderboard.length === 0 && (
        <div className="text-center py-12">
          <Trophy size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No data available for leaderboard</p>
          <p className="text-sm text-gray-400 mt-1">Complete some quizzes to see rankings!</p>
        </div>
      )}

      {/* Stats Summary */}
      {leaderboard.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">{leaderboard.length}</p>
              <p className="text-xs text-gray-500">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {leaderboard.reduce((sum, user) => sum + user.totalQuizzes, 0)}
              </p>
              <p className="text-xs text-gray-500">Total Quizzes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(leaderboard.reduce((sum, user) => sum + user.averageScore, 0) / leaderboard.length)}%
              </p>
              <p className="text-xs text-gray-500">Global Avg Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(leaderboard.reduce((sum, user) => sum + user.passRate, 0) / leaderboard.length)}%
              </p>
              <p className="text-xs text-gray-500">Global Pass Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Settings Component
const SettingsContent = ({ user }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" defaultValue={user?.displayName || 'User'} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" defaultValue={user?.email || 'user@example.com'} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notifications</label>
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600" />
          <span className="text-gray-600">Receive email notifications about quiz results</span>
        </label>
      </div>
      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
        Save Changes
      </button>
    </div>
  </div>
);

export default Dashboard;