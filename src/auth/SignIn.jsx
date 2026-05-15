import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Fingerprint, ChevronRight, AlertCircle, Brain, Sparkles, Trophy } from 'lucide-react';
import { AuthContext } from '../Context/Authcontext';
import Swal from 'sweetalert2';

const QuizSignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const { signIn, setLoading, loading, googleLogin } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const onSubmit = (data) => {
        setLoading(true);
        signIn(data.email, data.password).then(res => {
            if (res.user.accessToken) {
                Swal.fire({
                    title: "Welcome Back to QuizMaster!",
                    text: "Ready to test your knowledge?",
                    icon: "success",
                    background: "#fff",
                    confirmButtonColor: "#8b5cf6",
                    draggable: true  
                });
                setLoading(false);
                navigate('/quizzes');
            }
        }).catch(error => {
            Swal.fire({
                title: "Login Failed!",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#8b5cf6"
            });
            setLoading(false);
        });
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            
            {/* Floating Decorations - Quiz Themed */}
            <div className="absolute top-32 right-20 w-16 h-16 border-4 border-purple-500 rounded-2xl rotate-12 opacity-20 animate-float"></div>
            <div className="absolute bottom-32 left-20 w-20 h-20 border-4 border-indigo-400 rounded-full opacity-20 animate-float-delayed"></div>
            <div className="absolute top-1/3 left-10 w-3 h-3 bg-purple-500 rounded-full opacity-40 animate-ping"></div>
            <div className="absolute bottom-1/4 right-10 w-2 h-2 bg-indigo-500 rounded-full opacity-40 animate-ping"></div>
            <div className="absolute top-40 right-40 w-8 h-8 text-purple-300 opacity-30 animate-float">
                <Brain size={32} />
            </div>
            <div className="absolute bottom-40 left-32 w-6 h-6 text-indigo-300 opacity-40 animate-spin-slow">
                <Sparkles size={24} />
            </div>

            {/* Main Card */}
            <div className="relative w-full max-w-md mx-4">
                {/* Decorative Top Bar */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"></div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 transform transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-xl">
                    
                    {/* Brand Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl rotate-6 mb-4 shadow-lg group-hover:rotate-12 transition-transform duration-300">
                            <Brain className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                            Welcome Back!
                        </h2>
                        <p className="text-gray-500 text-sm mt-2">Sign in to continue your quiz journey</p>
                    </div>

                    {/* Stats Preview */}
                    <div className="flex justify-around mb-6 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-purple-600 font-semibold">
                                <Trophy size={16} />
                                <span className="text-sm">Rank</span>
                            </div>
                            <p className="text-lg font-bold text-gray-800">#42</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-indigo-600 font-semibold">
                                <Brain size={16} />
                                <span className="text-sm">Score</span>
                            </div>
                            <p className="text-lg font-bold text-gray-800">2,450</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-purple-600 font-semibold">
                                <Sparkles size={16} />
                                <span className="text-sm">Quizzes</span>
                            </div>
                            <p className="text-lg font-bold text-gray-800">18</p>
                        </div>
                    </div>

                    {/* Social Login Options */}
                    <div className="flex gap-3 mb-6">
                        <button 
                            onClick={() => googleLogin()} 
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#DB4437" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="text-sm text-gray-600 group-hover:text-purple-600">Google</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white text-gray-400">or sign in with email</span>
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                            <input
                                type="email"
                                placeholder="hello@example.com"
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Please enter a valid email address"
                                    }
                                })}
                                className={`w-full pl-9 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                    errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 group-hover:border-purple-500/50'
                                }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                className={`w-full pl-9 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                    errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 group-hover:border-purple-500/50'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center mb-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                                Remember me
                            </span>
                        </label>
                        <Link 
                            to="/forgot-password" 
                            className="text-sm text-purple-500 hover:text-indigo-600 font-medium hover:underline transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Sign In Button */}
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                        className="group relative w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden mb-4"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Sign In to Quiz
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/login" className="text-purple-500 font-semibold hover:text-indigo-600 hover:underline inline-flex items-center gap-1 group">
                                Create Account
                                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    By signing in, you agree to our{' '}
                    <Link to="/terms" className="text-purple-500 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-purple-500 hover:underline">Privacy Policy</Link>
                </p>
            </div>

            {/* Add animation styles */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(12deg); }
                    50% { transform: translateY(-20px) rotate(12deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.4; }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 7s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                .animate-pulse {
                    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animate-ping {
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.4; }
                    75%, 100% { transform: scale(2); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default QuizSignIn;