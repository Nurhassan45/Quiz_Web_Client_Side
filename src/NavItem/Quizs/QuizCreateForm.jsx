import React, { useState, useCallback, useMemo, use } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Save, 
  Clock, 
  Award, 
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';
import axiosInstance from '../../Axios/AxiosInstance';
import { AuthContext } from '../../Context/Authcontext';

const QuizCreateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    questions: true,
    settings: false,
  });

  const {user}=use(AuthContext)

  const { register, control, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: {
      quiz: {
        title: '',
        description: '',
        category: '',
        subcategory: '',
        difficulty: 'intermediate',
        duration: 30,
        passingScore: 70,
        totalPoints: 100,
        isPremium: false,
        isActive: true,
        tags: [],
        thumbnail: '',
        attempts: 0,
        averageScore: 0,
        rating: 4.5,
        timesTaken: 0
      },
      questions: [
        {
          id: `q_${Date.now()}_1`,
          text: '',
          type: 'multiple_choice',
          points: 5,
          difficulty: 'easy',
          explanation: '',
          hint: '',
          codeSnippet: '',
          tags: [],
          options: [
            { id: `opt_${Date.now()}_1_1`, text: '', isCorrect: false },
            { id: `opt_${Date.now()}_1_2`, text: '', isCorrect: false },
            { id: `opt_${Date.now()}_1_3`, text: '', isCorrect: false },
            { id: `opt_${Date.now()}_1_4`, text: '', isCorrect: false }
          ]
        }
      ]
    }
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: "questions"
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addQuestion = () => {
    const newId = `q_${Date.now()}_${questionFields.length + 1}`;
    appendQuestion({
      id: newId,
      text: '',
      type: 'multiple_choice',
      points: 5,
      difficulty: 'easy',
      explanation: '',
      hint: '',
      codeSnippet: '',
      tags: [],
      options: [
        { id: `${newId}_opt_1`, text: '', isCorrect: false },
        { id: `${newId}_opt_2`, text: '', isCorrect: false },
        { id: `${newId}_opt_3`, text: '', isCorrect: false },
        { id: `${newId}_opt_4`, text: '', isCorrect: false }
      ]
    });
    setActiveQuestion(questionFields.length);
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = getValues(`questions.${index}`);
    const newId = `q_${Date.now()}_${questionFields.length + 1}`;
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: newId,
      options: questionToDuplicate.options.map(opt => ({
        ...opt,
        id: `${newId}_opt_${Math.random()}`
      }))
    };
    appendQuestion(duplicatedQuestion);
  };

  const handleCorrectAnswer = (questionIndex, optionIndex) => {
    const options = getValues(`questions.${questionIndex}.options`);
    const updatedOptions = options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === optionIndex
    }));
    setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  const handleQuizTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    setValue('quiz.tags', tagsArray);
  };

  const handleQuestionTagsChange = (questionIndex, e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    setValue(`questions.${questionIndex}.tags`, tagsArray);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    console.log('data from onSubmit', data);
    try {
      const quizData = {
        quiz: {
          ...data.quiz,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: user?.email,
          approve:false,
          totalQuestions: data.questions.length,
          totalPoints: data.questions.reduce((sum, q) => sum + (q.points || 5), 0)
        },
        questions: data.questions.map(q => ({
          ...q,
          quizId: `quiz_${Date.now()}`
        }))
      };

      const response = await axiosInstance.post('/quizzes/add', quizData);
      if( response.data.acknowledged) return alert('successfull')
      setSuccess(true);
      setTimeout(() => {
        navigate(`/quizzes/quizCard/${response.data.quiz.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Memoize the QuestionCard component to prevent unnecessary re-renders
  const QuestionCard = useCallback(({ index }) => {
    const [showOptions, setShowOptions] = useState(true);
    const questionText = watch(`questions.${index}.text`);
    const points = watch(`questions.${index}.points`);
    const difficulty = watch(`questions.${index}.difficulty`);
    const options = watch(`questions.${index}.options`);
    const currentTags = watch(`questions.${index}.tags`) || [];
    const tagsString = currentTags.join(', ');
    const isActive = activeQuestion === index;
    
    return (
      <div className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
        isActive ? 'border-purple-500 shadow-lg' : 'border-gray-200'
      }`}>
        {/* Question Header */}
        <div 
          className="p-4 cursor-pointer hover:bg-gray-50 rounded-t-xl flex justify-between items-center"
          onClick={() => setActiveQuestion(index)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              isActive ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {questionText || `Question ${index + 1}`}
              </h3>
              <div className="flex gap-3 text-xs text-gray-500 mt-1">
                <span>Points: {points || 5}</span>
                <span>Difficulty: {difficulty || 'easy'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); duplicateQuestion(index); }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Duplicate"
            >
              <Copy size={16} className="text-gray-500" />
            </button>
            {questionFields.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); removeQuestion(index); }}
                className="p-1 hover:bg-red-100 rounded"
                title="Delete"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            )}
          </div>
        </div>

        {/* Question Content */}
        {isActive && (
          <div className="p-4 border-t border-gray-100 space-y-4">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Text *
              </label>
              <textarea
                {...register(`questions.${index}.text`, { 
                  required: "Question text is required",
                  shouldUnregister: false
                })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your question here..."
              />
              {errors.questions?.[index]?.text && (
                <p className="text-red-500 text-xs mt-1">{errors.questions[index].text.message}</p>
              )}
            </div>

            {/* Code Snippet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code Snippet (Optional)
              </label>
              <textarea
                {...register(`questions.${index}.codeSnippet`)}
                rows="4"
                className="w-full px-3 py-2 font-mono text-sm bg-gray-900 text-green-400 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="console.log('Hello World');"
              />
            </div>

            {/* Options */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Answer Options *
                </label>
                <button
                  type="button"
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-xs text-purple-600"
                >
                  {showOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              
              {showOptions && options && (
                <div className="space-y-2">
                  {options.map((option, optIdx) => (
                    <div key={option.id || optIdx} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct_${index}`}
                        checked={option.isCorrect || false}
                        onChange={() => handleCorrectAnswer(index, optIdx)}
                        className="w-4 h-4 text-green-600 cursor-pointer"
                      />
                      <input
                        {...register(`questions.${index}.options.${optIdx}.text`, { 
                          required: "Option text is required" 
                        })}
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                      {option.isCorrect && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-1">
                    Select the radio button next to the correct answer
                  </p>
                </div>
              )}
            </div>

            {/* Question Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points
                </label>
                <input
                  type="number"
                  {...register(`questions.${index}.points`, { min: 1, max: 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  {...register(`questions.${index}.difficulty`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="easy">Easy</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            {/* Hint & Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hint (Optional)
              </label>
              <input
                {...register(`questions.${index}.hint`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Give students a hint..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Explanation (Optional)
              </label>
              <textarea
                {...register(`questions.${index}.explanation`)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Explain why the answer is correct..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsString}
                onChange={(e) => handleQuestionTagsChange(index, e)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="javascript, arrays, functions"
              />
              <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
            </div>
          </div>
        )}
      </div>
    );
  }, [watch, register, errors, activeQuestion, questionFields.length, removeQuestion, setActiveQuestion]);

  const quizTagsString = (watch('quiz.tags') || []).join(', ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Create New Quiz
          </h1>
          <p className="text-gray-500 mt-1">Design engaging quizzes for your students</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="text-green-500" />
            <div>
              <h3 className="font-semibold text-green-800">Quiz Created Successfully!</h3>
              <p className="text-sm text-green-600">Redirecting to quiz page...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('basicInfo')}
              className="w-full p-5 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
              </div>
              {expandedSections.basicInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {expandedSections.basicInfo && (
              <div className="p-5 border-t border-gray-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quiz Title *
                    </label>
                    <input
                      {...register("quiz.title", { required: "Title is required" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., JavaScript Fundamentals"
                    />
                    {errors.quiz?.title && <p className="text-red-500 text-xs mt-1">{errors.quiz.title.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <input
                      {...register("quiz.category", { required: "Category is required" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Programming"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <input
                      {...register("quiz.subcategory")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Web Development"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      {...register("quiz.difficulty")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register("quiz.description", { required: "Description is required" })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe what this quiz covers..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail URL
                    </label>
                    <input
                      {...register("quiz.thumbnail")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={quizTagsString}
                      onChange={handleQuizTagsChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="javascript, web-dev, programming"
                    />
                    <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('questions')}
              className="w-full p-5 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <Award size={20} className="text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Questions ({questionFields.length})
                </h2>
              </div>
              {expandedSections.questions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {expandedSections.questions && (
              <div className="p-5 border-t border-gray-100">
                <div className="space-y-4">
                  {questionFields.map((field, index) => (
                    <QuestionCard key={field.id} index={index} />
                  ))}
                  
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-500 hover:text-purple-500 transition flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add New Question
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quiz Settings Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('settings')}
              className="w-full p-5 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-800">Quiz Settings</h2>
              </div>
              {expandedSections.settings ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {expandedSections.settings && (
              <div className="p-5 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      {...register("quiz.duration")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      {...register("quiz.passingScore")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("quiz.isPremium")}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm text-gray-700">Premium Quiz</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("quiz.isActive")}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm text-gray-700">Active (Publish immediately)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/quizzes')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizCreateForm;