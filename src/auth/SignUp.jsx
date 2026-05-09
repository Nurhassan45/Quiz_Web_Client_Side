import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Brain, Sparkles, Trophy, Zap } from 'lucide-react';
import { AuthContext } from '../Context/Authcontext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const QuizSignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, loading, setLoading, googleLogin } = useContext(AuthContext);
    const navigate =useNavigate();
    const onSubmit = data => {
        setLoading(true);
        createUser(data.email, data.password)
            .then(result => {
                if (result.user.accessToken) {
                    Swal.fire({
                        title: "Welcome to QuizMaster!",
                        text: "Your account has been created successfully",
                        icon: "success",
                        background: "#fff",
                        confirmButtonColor: "#8b5cf6",
                        draggable: true
                    });
                    setLoading(false);
                    navigate('/');
                }
            })
            .catch(error => {
                Swal.fire({
                    title: "Error!",
                    text: error.message,
                    icon: "error",
                    confirmButtonColor: "#8b5cf6"
                });
                setLoading(false);
            });
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

            {/* Floating shapes - Quiz themed */}
            <div className="absolute top-20 right-20 w-12 h-12 bg-purple-500 rounded-lg rotate-12 opacity-20 animate-bounce"></div>
            <div className="absolute bottom-20 left-20 w-16 h-16 border-4 border-indigo-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 left-10 w-8 h-8 bg-purple-500 rounded-full opacity-30 animate-spin-slow"></div>
            <div className="absolute bottom-40 right-32 w-10 h-10 text-purple-300 opacity-30 animate-float">
                <Brain size={40} />
            </div>
            <div className="absolute top-1/3 right-16 w-6 h-6 text-indigo-300 opacity-40 animate-ping">
                <Sparkles size={24} />
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative bg-white/90 mt-5 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 transform transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-xl"
            >
                {/* Brand header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl rotate-3 mb-3 shadow-lg">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                        Join QuizMaster
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">Start your quiz journey today!</p>
                </div>

                {/* Social sign up options */}
                <div className="flex gap-3 mb-6">
                    <button 
                        onClick={() => googleLogin()} 
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#DB4437" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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
                        <span className="px-3 bg-white text-gray-400">or sign up with email</span>
                    </div>
                </div>

                {/* Name Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="John Doe"
                            {...register("name", { required: "Name is required" })}
                            className={`w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                                }`}
                        />
                    </div>
                    {errors?.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="email"
                            placeholder="hello@example.com"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            className={`w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                                }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Minimum 6 characters",
                                },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)/,
                                    message: "Must contain at least one letter and one number"
                                }
                            })}
                            className={`w-full pl-9 pr-10 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                            {errors.password.message}
                        </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                        <Zap size={12} className="text-purple-500" />
                        <p className="text-gray-400 text-xs">Must be at least 6 characters with letters & numbers</p>
                    </div>
                </div>

                {/* Quiz Preferences */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interested in (Optional)</label>
                    <div className="flex flex-wrap gap-2">
                        {['General Knowledge', 'Science', 'History', 'Technology', 'Sports'].map((topic) => (
                            <label key={topic} className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={topic}
                                    {...register("interests")}
                                    className="w-3.5 h-3.5 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-xs text-gray-600">{topic}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Terms & Conditions */}
                <div className="mb-5">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            {...register("terms", { required: "You must accept terms & conditions" })}
                            className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-800">
                            I agree to the <a href="#" className="text-purple-500 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-500 hover:underline">Privacy Policy</a>
                        </span>
                    </label>
                    {errors.terms && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                            {errors.terms.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                            Creating Account...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            Start Quiz Journey
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </button>

                {/* Sign In Link */}
                <p className="text-center text-sm text-gray-500 mt-5">
                    Already have an account?{' '}
                    <a href="/signIn" className="text-purple-500 font-medium hover:underline">
                        Sign In
                    </a>
                </p>

                {/* Quiz Stats Preview */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                            <Trophy size={12} className="text-yellow-500" />
                            <span>Compete globally</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Brain size={12} className="text-purple-500" />
                            <span>Challenge yourself</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QuizSignUp;