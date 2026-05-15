import { Home, BookOpen, Trophy, Info, Phone, LogIn, Menu, X, ChevronRight, UserCircle, Brain, Sparkles, QuoteIcon } from 'lucide-react';
import React, { useState, useEffect, use } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/Authcontext';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.config';
// import Quizes from '../NavItem/Quizs/Quizes';

const QuizNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const{user}=use(AuthContext);
    const userEmail=user?.email;

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    //handle LogOut
    const handleLogOut=()=>{
        signOut(auth)
        .then(()=>{
            alert('SuccesFull');
        })
        .catch(()=>{
            alert('Unsuccesfull');
        })
    }
    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Quizzes', path: '/quizzes', icon: <BookOpen size={18} /> },
        { name: 'addQuiz', path: '/addQuiz', icon: <Trophy size={18} /> },
        { name: 'DashBoard', path: '/dashboard', icon: <Info size={18} /> },
        { name: 'Contact', path: '/contact', icon: <Phone size={18} /> },
        { name: 'Live Quiz', path: '/live-quiz', icon: <QuoteIcon size={18} /> },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
                    : 'bg-gradient-to-r from-white to-purple-50/50 backdrop-blur-sm py-4'
            }`}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-center">
                        {/* Logo Section */}
                        <NavLink to="/" className="group relative flex items-center gap-2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative h-12 w-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
                                    <Brain size={24} className="text-white" />
                                </div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent hidden sm:inline">
                                QuizMaster
                            </span>
                            <Sparkles size={16} className="text-purple-500 hidden sm:block animate-pulse" />
                        </NavLink>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        relative group flex items-center gap-2 px-4 py-2 rounded-full
                                        transition-all duration-300 font-semibold text-sm
                                        ${isActive 
                                            ? 'text-purple-500 bg-purple-50' 
                                            : 'text-gray-600 hover:text-purple-500 hover:bg-purple-50/50'
                                        }
                                    `}
                                >
                                    <span className="transition-transform group-hover:scale-110">
                                        {item.icon}
                                    </span>
                                    <span>{item.name}</span>
                                    {location.pathname === item.path && (
                                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-purple-500 rounded-full"></span>
                                    )}
                                </NavLink>
                            ))}
                        </div>

                        {/* Login Button - Desktop */}
                      { userEmail?<h1
                            onClick={()=>handleLogOut()}
                            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 active:scale-95 group"
                      
                      >Logout</h1>: <NavLink 
                            to="/login" 
                            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 active:scale-95 group"
                        >
                            <LogIn size={18} className="transition-transform group-hover:rotate-12" />
                            <span>Login</span>
                            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </NavLink>
                       }
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-40 ${
                    isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`} onClick={() => setIsMenuOpen(false)}></div>

                {/* Mobile Menu Panel */}
                <div className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-all duration-300 ease-out ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    {/* Mobile Menu Header */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                                <Brain size={28} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                                    QuizMaster
                                </h3>
                                <p className="text-xs text-gray-400">Test your knowledge</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Mobile Navigation Items */}
                    <div className="p-4 space-y-2">
                        {navItems.map((item, index) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl
                                    transition-all duration-300 font-medium
                                    transform hover:translate-x-2
                                    ${isActive 
                                        ? 'bg-gradient-to-r from-purple-500/10 to-indigo-600/10 text-purple-500 border-l-4 border-purple-500' 
                                        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-500'
                                    }
                                `}
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    animation: isMenuOpen ? 'slideIn 0.3s ease-out forwards' : 'none'
                                }}
                            >
                                <span className="transition-transform group-hover:scale-110">
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </div>


                    {/* Quiz Stats Section */}
                    <div className="px-4 py-3 mx-4 mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Your Score:</span>
                            <span className="font-bold text-purple-600">0 pts</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                            <span className="text-gray-600">Quizzes Taken:</span>
                            <span className="font-bold text-indigo-600">0</span>
                        </div>
                    </div>

                    {/* Mobile Login Button */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gradient-to-r from-white to-purple-50/30">
                        <NavLink
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 group"
                        >
                            <LogIn size={18} className="transition-transform group-hover:rotate-12" />
                            <span>Login to Account</span>
                            <UserCircle size={18} />
                        </NavLink>
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content from hiding under fixed navbar */}
            <div className="h-20"></div>

            {/* Animation Keyframes */}
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </>
    );
};

export default QuizNavbar;