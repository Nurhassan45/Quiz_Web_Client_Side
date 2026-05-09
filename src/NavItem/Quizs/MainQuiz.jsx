import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Star, 
  Users, 
  Trophy, 
  Lock, 
  ChevronRight, 
  TrendingUp,
  Award,
  BookOpen,
  BarChart3,
  Sparkles
} from 'lucide-react';
import axiosInstance from '../../Axios/AxiosInstance';
import Loading from '../../Loading/Loading';
import { useParams } from 'react-router-dom';

const MainQuiz = () => {
  const { subCategory } = useParams();
  const navigate =useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await axiosInstance.get('/quizes');
      return res.data;
    }
  });

  if (isLoading) return <Loading />;
  
  const filteredData = data.filter(res => res?.quiz?.subcategory === subCategory);
  console.log('Filtered Data', filteredData);

  // Difficulty color mapping
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-blue-500 to-cyan-500';
      case 'advanced': return 'from-purple-500 to-indigo-600';
      case 'expert': return 'from-red-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Difficulty badge color
  const getDifficultyBadge = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      case 'expert': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  //start quiz button
  const handleStartQuiz=(id)=>{
    navigate(`/quizzes/quizCard/${id}`)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-12 mb-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 capitalize">
            {subCategory} Quizzes
          </h1>
          <p className="text-lg opacity-90">
            Master your skills with our curated {subCategory} quizzes
          </p>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="container mx-auto px-4 pb-12">
        {filteredData.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600">No quizzes found</h3>
            <p className="text-gray-400 mt-2">Check back later for new quizzes in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((item, index) => {
              const quiz = item?.quiz;
              const difficultyGradient = getDifficultyColor(quiz?.difficulty);
              const difficultyBadge = getDifficultyBadge(quiz?.difficulty);
              
              return (
                <div 
                  key={quiz?.id || index}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Thumbnail Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={quiz?.thumbnail || 'https://via.placeholder.com/400x200?text=Quiz+Thumbnail'} 
                      alt={quiz?.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Premium Badge */}
                    {quiz?.isPremium && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                        <Lock size={12} />
                        Premium
                      </div>
                    )}
                    
                    {/* Difficulty Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${difficultyBadge}`}>
                        {quiz?.difficulty || 'Intermediate'}
                      </span>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm font-semibold">{quiz?.rating || 4.5}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Category & Subcategory */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-1 rounded">
                        {quiz?.category}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {quiz?.subcategory}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {quiz?.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {quiz?.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-purple-500" />
                        <span className="text-sm">{quiz?.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <BookOpen size={16} className="text-blue-500" />
                        <span className="text-sm">{quiz?.totalQuestions} questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} className="text-green-500" />
                        <span className="text-sm">{quiz?.attempts?.toLocaleString()} attempts</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Trophy size={16} className="text-yellow-500" />
                        <span className="text-sm">Pass: {quiz?.passingScore}%</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {quiz?.tags && quiz.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {quiz.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                        {quiz.tags.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            +{quiz.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress Bar (Average Score) */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Average Score</span>
                        <span className="font-semibold text-purple-600">{quiz?.averageScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${difficultyGradient}`}
                          style={{ width: `${quiz?.averageScore || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div onClick={()=>handleStartQuiz(item?._id)} className="flex gap-3">
                      <Link 
                        to={`/quiz/${quiz?.id}`}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 rounded-lg font-semibold text-center hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                      >
                        Start Quiz
                        <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                      
                      {quiz?.isPremium && (
                        <button className="px-4 py-2.5 border border-purple-500 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all">
                          Upgrade
                        </button>
                      )}
                    </div>

                    {/* Total Points */}
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-400">
                        Total Points: {quiz?.totalPoints} | Times Taken: {quiz?.timesTaken}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainQuiz;