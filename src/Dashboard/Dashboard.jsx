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
  User,
  Activity,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  Menu
} from 'lucide-react';
import { AuthContext } from '../Context/Authcontext';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Axios/AxiosInstance';
import Loading from '../Loading/Loading';

const Dashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const {user}=use(AuthContext);
  
  const {data,isLoading}=useQuery({
    queryKey:['getById'],
    queryFn:async()=> {
     const res= await axiosInstance.get(`quizes`)
      return res.data;
    }
  })

  if(isLoading) return <Loading/>
  const filterData=data.filter(res=>res?.quiz?.createdBy===user?.email)
  console.log('data qiuz by email',filterData)
  // Menu items
  const menuItems = [
    { id: 'home', label: 'Homepage', icon: <Home size={20} />, tip: 'Homepage' },
    { id: 'quizzes', label: 'My Quizzes', icon: <BookOpen size={20} />, tip: 'My Quizzes', badge: 12 },
    { id: 'analytics', label: 'Analytics', icon: <Activity size={20} />, tip: 'Analytics' },
    { id: 'achievements', label: 'Achievements', icon: <Trophy size={20} />, tip: 'Achievements', badge: 5 },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Users size={20} />, tip: 'Leaderboard' },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} />, tip: 'Calendar' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, tip: 'Settings' },
    { id: 'help', label: 'Help', icon: <HelpCircle size={20} />, tip: 'Help & Support' },
  ];

  // Toggle drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return <HomeContent />;
      case 'quizzes':
        return <QuizzesContent />;
      case 'analytics':
        return <AnalyticsContent />;
      case 'achievements':
        return <AchievementsContent />;
      case 'leaderboard':
        return <LeaderboardContent />;
      case 'calendar':
        return <CalendarContent />;
      case 'settings':
        return <SettingsContent />;
      case 'help':
        return <HelpContent />;
      default:
        return <HomeContent />;
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
              {/* Sidebar Toggle Button */}
              <label 
                htmlFor="my-drawer-4" 
                onClick={toggleDrawer}
                className="btn btn-square btn-ghost p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition"
              >
                <Menu size={20} className="text-gray-600" />
              </label>
              <div className="px-2">
                <h1 className="text-xl font-semibold text-gray-800">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
              </div>
            </div>

            {/* Right side navbar items */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none px-2 text-sm w-64"
                />
              </div>

              {/* Notification Bell */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition">
                <img 
                src= {user?.photoURL|| `https://randomuser.me/api/portraits/men/1.jpg`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.displayName || `Alex Johnson`}
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
          {/* Sidebar Header */}
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

          {/* User Profile Summary */}
          <div className={`p-4 border-b border-gray-100 w-full ${!isDrawerOpen && 'flex justify-center'}`}>
            <div className="flex items-center gap-3">
              <img 
                src={user?.photoURL|| `https://randomuser.me/api/portraits/men/1.jpg`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              {isDrawerOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{user?.displayName || `Alex Johnson`}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
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
                        {item.badge && (
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

          {/* Footer Actions */}
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

// Content Components
const HomeContent = () => (
  <div className="space-y-6">
    {/* Welcome Banner */}
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Welcome back, Alex! 👋</h2>
      <p className="text-purple-100">Ready to test your knowledge today?</p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Quizzes</p>
            <p className="text-2xl font-bold text-gray-800">24</p>
            <p className="text-xs text-green-600 mt-2">+12% this month</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-xl">
            <BookOpen size={24} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Average Score</p>
            <p className="text-2xl font-bold text-gray-800">85%</p>
            <p className="text-xs text-green-600 mt-2">+5% increase</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-xl">
            <TrendingUp size={24} className="text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Points</p>
            <p className="text-2xl font-bold text-gray-800">2,450</p>
            <p className="text-xs text-gray-500 mt-2">Level 7</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-xl">
            <Award size={24} className="text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Current Streak</p>
            <p className="text-2xl font-bold text-gray-800">15 days</p>
            <p className="text-xs text-green-600 mt-2">Keep it up!</p>
          </div>
          <div className="p-3 bg-red-100 rounded-xl">
            <Clock size={24} className="text-red-600" />
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Quizzes</h3>
          <button className="text-purple-600 text-sm hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">JavaScript Quiz {i}</p>
                <p className="text-xs text-gray-500">Completed 2 days ago</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-semibold">92%</p>
                <CheckCircle size={14} className="text-green-500 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recommended for You</h3>
          <button className="text-purple-600 text-sm hover:underline">Browse All</button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">React Advanced {i}</p>
                <p className="text-xs text-gray-500">45 questions • 60 min</p>
              </div>
              <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition">
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const QuizzesContent = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">My Quizzes</h2>
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-gray-800">JavaScript Fundamentals {i}</p>
            <p className="text-sm text-gray-500">50 questions • 60 minutes</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-green-600 font-semibold">85%</span>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Retake
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnalyticsContent = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Analytics</h2>
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-2">Overall Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-purple-600 h-4 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">75% complete</p>
      </div>
      <div>
        <p className="text-gray-600 mb-2">Quiz Completion Rate</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-green-600 h-4 rounded-full" style={{ width: '82%' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">82% completion rate</p>
      </div>
    </div>
  </div>
);

const AchievementsContent = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Achievements</h2>
    <div className="grid md:grid-cols-2 gap-4">
      {[
        { title: 'Quiz Master', description: 'Complete 50 quizzes', progress: 24, target: 50 },
        { title: 'Perfect Score', description: 'Get 100% on any quiz', progress: 1, target: 1, completed: true },
        { title: 'Speed Demon', description: 'Complete quiz in half time', progress: 3, target: 5 },
        { title: 'Knowledge Seeker', description: 'Score 90%+ on 10 quizzes', progress: 7, target: 10 }
      ].map((achievement, i) => (
        <div key={i} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={24} className="text-yellow-500" />
            <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{achievement.progress}/{achievement.target}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full" 
              style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LeaderboardContent = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Global Leaderboard</h2>
    <div className="space-y-3">
      {[
        { name: 'Sarah Johnson', points: 3850, quizzes: 45, rank: 1 },
        { name: 'Michael Chen', points: 3620, quizzes: 42, rank: 2 },
        { name: 'Emma Wilson', points: 3450, quizzes: 40, rank: 3 },
        { name: 'Alex Johnson', points: 2450, quizzes: 24, rank: 42, isCurrentUser: true }
      ].map((user, i) => (
        <div key={i} className={`flex items-center justify-between p-4 rounded-lg ${user.isCurrentUser ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              user.rank === 1 ? 'bg-yellow-500 text-white' :
              user.rank === 2 ? 'bg-gray-400 text-white' :
              user.rank === 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {user.rank}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.quizzes} quizzes</p>
            </div>
          </div>
          <p className="font-bold text-purple-600">{user.points} pts</p>
        </div>
      ))}
    </div>
  </div>
);

const CalendarContent = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz Calendar</h2>
    <div className="grid grid-cols-7 gap-2 mb-4">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center font-semibold text-gray-600 py-2">{day}</div>
      ))}
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="text-center p-2 hover:bg-purple-50 rounded-lg cursor-pointer">
          <span className={i === 15 ? 'bg-purple-600 text-white w-8 h-8 inline-flex items-center justify-center rounded-full' : 'text-gray-700'}>
            {i + 1}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const SettingsContent = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" defaultValue="Alex Johnson" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" defaultValue="alex@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notifications</label>
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600" />
          <span className="text-gray-600">Receive email notifications</span>
        </label>
      </div>
      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
        Save Changes
      </button>
    </div>
  </div>
);

const HelpContent = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Help & Support</h2>
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">How to take a quiz?</h3>
        <p className="text-gray-600">Click on any quiz card and press the "Start Quiz" button to begin your quiz journey.</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">How are points calculated?</h3>
        <p className="text-gray-600">Points are based on your quiz score, speed, and accuracy. Higher scores earn more points!</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Need more help?</h3>
        <p className="text-gray-600">Contact our support team at support@quizmaster.com</p>
      </div>
    </div>
  </div>
);

export default Dashboard;