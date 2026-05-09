import React from 'react';
import { Loader, Brain, Sparkles } from 'lucide-react';

const Loading = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-white flex items-center justify-center z-50">
            <div className="text-center">
                {/* Animated Logo */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl rotate-6 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                        <Brain className="w-10 h-10 text-white" />
                    </div>
                </div>
                
                {/* Loading Spinner */}
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-purple-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
                
                {/* Loading Text */}
                <p className="text-gray-600 font-medium">{message}</p>
                
                {/* Animated Dots */}
                <div className="flex justify-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-300"></div>
                </div>
            </div>
        </div>
    );
};

export default Loading;