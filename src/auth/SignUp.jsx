import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Brain, Sparkles, Trophy, Zap, Upload, Image, X, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthContext } from '../Context/Authcontext';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../Axios/AxiosInstance';

const QuizSignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { createUser, updateUserProfile, setUser, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const password = watch('password');

    // ImgBB API Key (Replace with your own key)
    const IMGBB_API_KEY = "e017c95f165c72492bcec2507d7f67f7";

    // Handle image upload to ImgBB
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                title: "Invalid File",
                text: "Please select an image file (JPEG, PNG, GIF)",
                icon: "error",
                confirmButtonColor: "#8b5cf6"
            });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                title: "File Too Large",
                text: "Please select an image less than 5MB",
                icon: "error",
                confirmButtonColor: "#8b5cf6"
            });
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                formData
            );
            
            if (response.data?.data?.url) {
                setProfilePicture(response.data.data.url);
                Swal.fire({
                    title: "Upload Successful!",
                    text: "Your profile picture has been uploaded",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error("Image upload error:", error);
            Swal.fire({
                title: "Upload Failed",
                text: "Failed to upload image. Please try again.",
                icon: "error",
                confirmButtonColor: "#8b5cf6"
            });
        } finally {
            setUploading(false);
        }
    };

    // Remove profile picture
    const removeProfilePicture = () => {
        setProfilePicture('');
    };

    // Save user to backend database
    const saveUserToBackend = async (userData) => {
        try {
            const response = await axiosInstance.post('/users/register', {
                uid: userData.uid,
                name: userData.name,
                email: userData.email,
                photoURL: userData.photoURL,
                interests: userData.interests || [],
                provider: userData.provider || 'email',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                isActive: true,
                role: 'user',
                totalPoints: 0,
                totalQuizzes: 0,
                averageScore: 0
            });
            return response.data;
        } catch (error) {
            console.error("Error saving user to backend:", error);
            throw error;
        }
    };

    // Main submit handler
    const onSubmit = async (data) => {
        if (!acceptedTerms) {
            Swal.fire({
                title: "Terms Required",
                text: "Please accept the Terms of Service and Privacy Policy",
                icon: "warning",
                confirmButtonColor: "#8b5cf6"
            });
            return;
        }

        setLoading(true);

        try {
            // 1. Create user in Firebase
            const userCredential = await createUser(data.email, data.password);
            const firebaseUser = userCredential.user;

            if (firebaseUser) {
                // 2. Update Firebase profile with name and photo
                await updateUserProfile({
                    displayName: data.name,
                    photoURL: profilePicture || null
                });

                // 3. Prepare user data for backend
                const userDetails = {
                    uid: firebaseUser.uid,
                    name: data.name,
                    email: data.email,
                    photoURL: profilePicture || null,
                    interests: data.interests || [],
                    provider: 'email'
                };

                // 4. Save to MongoDB backend
                await saveUserToBackend(userDetails);

                // 5. Update local context
                setUser({
                    displayName: data.name,
                    email: firebaseUser.email,
                    photoURL: profilePicture,
                    uid: firebaseUser.uid,
                    interests: data.interests || []
                });

                // 6. Show success message
                Swal.fire({
                    title: "Welcome to QuizMaster! 🎉",
                    text: `Your account has been created successfully, ${data.name}!`,
                    icon: "success",
                    background: "#fff",
                    confirmButtonColor: "#8b5cf6",
                    draggable: true,
                    timer: 2500
                });

                // 7. Navigate to dashboard
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            }
        } catch (error) {
            console.error("Signup error:", error);
            
            let errorMessage = "Something went wrong. Please try again.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered. Please sign in instead.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak. Please use a stronger password.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address. Please check and try again.";
            }

            Swal.fire({
                title: "Registration Failed!",
                text: errorMessage,
                icon: "error",
                confirmButtonColor: "#8b5cf6"
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle Google Sign Up
    const handleGoogleSignUp = async () => {
        setLoading(true);
        try {
            const result = await googleLogin();
            if (result?.user) {
                // Save Google user to backend
                await saveUserToBackend({
                    uid: result.user.uid,
                    name: result.user.displayName || result.user.email.split('@')[0],
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    interests: [],
                    provider: 'google'
                });
                
                Swal.fire({
                    title: "Welcome to QuizMaster!",
                    text: `Signed in successfully with Google!`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Google signup error:", error);
            Swal.fire({
                title: "Google Sign Up Failed",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#8b5cf6"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white overflow-hidden py-8 px-4">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

            {/* Floating Shapes */}
            <div className="absolute top-20 right-20 w-12 h-12 bg-purple-500 rounded-lg rotate-12 opacity-20 animate-bounce"></div>
            <div className="absolute bottom-20 left-20 w-16 h-16 border-4 border-indigo-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 left-10 w-8 h-8 bg-purple-500 rounded-full opacity-30 animate-spin-slow"></div>
            <div className="absolute bottom-40 right-32 w-10 h-10 text-purple-300 opacity-30 animate-float">
                <Brain size={40} />
            </div>
            <div className="absolute top-1/3 right-16 w-6 h-6 text-indigo-300 opacity-40 animate-ping">
                <Sparkles size={24} />
            </div>

            {/* Main Form Card */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 transform transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-xl"
            >
                {/* Brand Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl rotate-3 mb-3 shadow-lg">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                        Join QuizMaster
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">Start your quiz journey today!</p>
                </div>

                {/* Google Sign Up Button */}
                <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 mb-4 group"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#DB4437" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm text-gray-600 group-hover:text-purple-600">
                        {loading ? "Processing..." : "Continue with Google"}
                    </span>
                </button>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-gray-400">or sign up with email</span>
                    </div>
                </div>

                {/* Profile Picture Upload Section */}
                <div className="mb-5 flex flex-col items-center">
                    {profilePicture ? (
                        <div className="relative group">
                            <img 
                                className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 shadow-lg" 
                                src={profilePicture} 
                                alt="Profile" 
                            />
                            <button
                                type="button"
                                onClick={removeProfilePicture}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center border-4 border-purple-200">
                            <Upload className="w-8 h-8 text-purple-400" />
                        </div>
                    )}
                    
                    <label className="cursor-pointer mt-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                        <span className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                            {uploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Image size={14} />
                                    {profilePicture ? 'Change Photo' : 'Upload Profile Photo'}
                                </>
                            )}
                        </span>
                    </label>
                </div>

                {/* Name Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="John Doe"
                            {...register("name", { 
                                required: "Full name is required",
                                minLength: {
                                    value: 2,
                                    message: "Name must be at least 2 characters"
                                },
                                maxLength: {
                                    value: 50,
                                    message: "Name must not exceed 50 characters"
                                }
                            })}
                            className={`w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                                }`}
                        />
                    </div>
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="email"
                            placeholder="hello@example.com"
                            {...register("email", {
                                required: "Email address is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Please enter a valid email address"
                                }
                            })}
                            className={`w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                                }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)/,
                                    message: "Password must contain at least one letter and one number"
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
                            <AlertCircle size={12} />
                            {errors.password.message}
                        </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                        <Zap size={12} className="text-purple-500" />
                        <p className="text-gray-400 text-xs">Must be at least 6 characters with letters & numbers</p>
                    </div>
                </div>

                {/* Confirm Password Field */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: value => value === password || "Passwords do not match"
                            })}
                            className={`w-full pl-9 pr-10 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Quiz Interests */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interested in (Optional)</label>
                    <div className="flex flex-wrap gap-2">
                        {['General Knowledge', 'Science', 'History', 'Technology', 'Sports', 'Music', 'Art', 'Geography'].map((topic) => (
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
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-800">
                            I agree to the <Link to="/terms" className="text-purple-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-purple-500 hover:underline">Privacy Policy</Link>
                        </span>
                    </label>
                    {!acceptedTerms && errors.terms && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            You must accept the terms to continue
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
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
                    <Link to="/signin" className="text-purple-500 font-medium hover:underline">
                        Sign In
                    </Link>
                </p>

                {/* Footer Stats */}
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
                        <div className="flex items-center gap-1">
                            <CheckCircle size={12} className="text-green-500" />
                            <span>Track progress</span>
                        </div>
                    </div>
                </div>
            </form>

            {/* Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.5; }
                }
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.4; }
                    75%, 100% { transform: scale(2); opacity: 0; }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
                .animate-bounce { animation: bounce 2s ease-in-out infinite; }
                .animate-pulse { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .animate-ping { animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
            `}</style>
        </div>
    );
};

export default QuizSignUp;