import React from 'react';
import { Zap, Trophy, Users, BookOpen, BarChart3, Shield, Clock, Award } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Diverse Quiz Categories",
      description: "From programming to history, science to arts - we have quizzes for every interest."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Feedback",
      description: "Get instant results and detailed explanations for each question."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Leaderboards & Achievements",
      description: "Compete with others and earn badges for your accomplishments."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Track your progress with detailed statistics and insights."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Timed Challenges",
      description: "Test your speed with timed quizzes and beat your personal best."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description: "Your data is safe with our enterprise-grade security."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Why Choose QuizMaster?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the features that make us the preferred choice for learners worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <div className="text-purple-600">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;