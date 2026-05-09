import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Software Engineer",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      text: "QuizMaster helped me prepare for my technical interviews. The JavaScript quizzes are challenging and comprehensive!",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Data Scientist",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      text: "The data science quizzes are top-notch. I've improved my skills significantly and even got a promotion!",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Student",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      text: "Best platform for test preparation. The instant feedback and explanations help me learn from my mistakes.",
      rating: 5
    },
    {
      id: 4,
      name: "David Kim",
      role: "Teacher",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      text: "I use QuizMaster with my students. They love the competitive aspect and the variety of quizzes available.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-purple-100 max-w-2xl mx-auto">
            Join thousands of satisfied learners who have improved their skills with us
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12">
            <Quote className="w-12 h-12 text-purple-300 mb-6 opacity-50" />
            
            <p className="text-xl md:text-2xl leading-relaxed mb-8">
              "{testimonials[currentIndex].text}"
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full border-2 border-white object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">{testimonials[currentIndex].name}</h4>
                  <p className="text-purple-200">{testimonials[currentIndex].role}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white text-purple-600 p-2 rounded-full shadow-lg hover:scale-110 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white text-purple-600 p-2 rounded-full shadow-lg hover:scale-110 transition"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === index ? 'w-8 bg-white' : 'w-2 bg-purple-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;