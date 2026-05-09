import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, TrendingUp, Award, Users, Clock, Trophy } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-purple-600">#1 Quiz Platform</span>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-gray-900">Test Your</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Knowledge & Skills
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Join millions of learners and challenge yourself with our interactive quizzes.
              Track your progress, compete with others, and become a master in your field.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/quizzes"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Start Learning
                <ArrowRight className="group-hover:translate-x-1 transition" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-purple-200 rounded-full font-semibold hover:border-purple-600 hover:bg-purple-50 transition">
                <Play size={18} />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">1M+</p>
                <p className="text-sm text-gray-500">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-500">Quizzes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-500">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-2 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=500&fit=crop"
                alt="Student taking quiz"
                className="rounded-2xl w-full h-auto"
              />
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-3 shadow-xl animate-bounce">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-500">Top Score</p>
                    <p className="font-bold">98%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500">Today's Active</p>
                    <p className="font-bold">50,000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;