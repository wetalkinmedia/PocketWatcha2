import React from 'react';
import { useState } from 'react';
import { TrendingUp, Clock, BookOpen, Target, ExternalLink, Star, Users, DollarSign } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { CareerSuggestion, Course, getRelevantCourses } from '../utils/careerSuggestions';
import { getCurrencySymbol } from '../utils/currencyData';
import { CheckoutModal } from './CheckoutModal';

interface CareerSuggestionsProps {
  suggestions: CareerSuggestion[];
  currentSalary: number;
  currency: string;
  advice: string;
}

export function CareerSuggestions({ suggestions, currentSalary, currency, advice }: CareerSuggestionsProps) {
  const currencySymbol = getCurrencySymbol(currency);
  const relevantCourses = getRelevantCourses(suggestions.map(s => s.field));
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());

  if (suggestions.length === 0) {
    return null;
  }

  const handlePurchaseClick = (course: Course) => {
    if (course.price === 0) {
      setEnrolledCourses(prev => new Set([...prev, course.title]));
    } else {
      // Convert course to match expected Course interface
      const fullCourse = {
        id: course.title.toLowerCase().replace(/\s+/g, '-'),
        title: course.title,
        description: course.description,
        instructor: {
          id: 'instructor-' + course.title.toLowerCase().replace(/\s+/g, '-'),
          name: course.provider,
          bio: 'Expert instructor',
          avatar: '',
          credentials: []
        },
        duration: course.duration,
        level: 'Intermediate' as const,
        price: course.price,
        originalPrice: course.discount?.originalPrice,
        rating: course.rating,
        students: course.students,
        skills: course.skills,
        modules: [],
        certificate: true,
        enrolled: false,
        progress: 0,
        emoji: course.emoji,
        website: course.url
      };
      setCheckoutCourse(fullCourse);
      setShowCheckout(true);
    }
  };

  const handlePurchaseComplete = (courseId: string) => {
    setEnrolledCourses(prev => new Set([...prev, courseId]));
    setShowCheckout(false);
    setCheckoutCourse(null);
  };

  return (
    <div className="mt-8 mx-8 mb-8 p-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-center mb-4">
          ✨ Money Magic Career Boost
        </h2>
        <p className="text-center text-lg opacity-90 mb-6">
          {advice}
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {suggestions.map((career, index) => {
            const salaryIncrease = career.averageSalary - (currentSalary * 12);
            const percentIncrease = Math.round((salaryIncrease / (currentSalary * 12)) * 100);
            
            return (
              <div
                key={career.field}
                className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-2xl border border-white border-opacity-30 shadow-lg hover:bg-opacity-30 transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">{career.emoji}</span>
                    {career.field}
                  </h3>
                  <div className="bg-green-400 bg-opacity-80 px-3 py-1 rounded-full">
                    <span className="font-bold text-sm">+{percentIncrease}%</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-yellow-300" />
                    <span className="font-semibold">
                      {currencySymbol}{career.averageSalary.toLocaleString()}/year
                    </span>
                    <span className="text-sm opacity-80">
                      (+{currencySymbol}{Math.round(salaryIncrease/12).toLocaleString()}/month)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-green-300" />
                    <span className="text-sm">
                      <strong>{career.growthRate}</strong> job growth rate
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-300" />
                    <span className="text-sm">
                      <strong>{career.timeToTransition}</strong> to transition
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <BookOpen size={16} className="text-purple-300 mt-0.5" />
                    <span className="text-sm">
                      <strong>Requirements:</strong> {career.requirements}
                    </span>
                  </div>
                  
                  <p className="text-sm opacity-90 italic leading-relaxed">
                    {career.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-xl">
          <p className="text-center text-sm opacity-90">
            💡 <strong>Pro Tip:</strong> Start with online courses and certifications while keeping your current job. 
            Many of these transitions can happen gradually with evening/weekend learning!
          </p>
        </div>
      </div>
      
      {/* Courses Section */}
      {relevantCourses.length > 0 && (
        <div className="mt-8 p-6 bg-white bg-opacity-20 rounded-2xl border border-white border-opacity-30">
          <h3 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <BookOpen className="text-yellow-300" size={24} />
            🎓 Start Learning Today - Recommended Courses
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relevantCourses.map((course, index) => (
              <div
                key={course.title}
                className="bg-white bg-opacity-15 backdrop-blur-sm p-4 rounded-xl border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{course.emoji}</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-300 fill-current" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {course.price === 0 ? (
                      <div className="bg-green-400 bg-opacity-80 px-2 py-1 rounded-full">
                        <span className="text-xs font-bold text-green-900">FREE</span>
                      </div>
                    ) : (
                      <div className="text-right">
                        {course.discount && (
                          <div className="text-xs text-gray-300 line-through">
                            {currencySymbol}{course.discount.originalPrice}
                          </div>
                        )}
                        <div className="font-bold text-yellow-300">
                          {currencySymbol}{course.price}
                          {course.discount && (
                            <span className="text-xs ml-1 bg-red-400 bg-opacity-80 px-1 py-0.5 rounded text-red-900">
                              -{course.discount.discountPercent}%
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <h4 className="font-bold text-sm mb-2 leading-tight">{course.title}</h4>
                <p className="text-xs text-gray-200 mb-2">{course.provider}</p>
                
                <div className="flex items-center gap-3 text-xs text-gray-300 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{course.students}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-200 mb-3 leading-relaxed">{course.description}</p>
                
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {course.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="text-xs bg-blue-400 bg-opacity-60 px-2 py-1 rounded-full text-blue-100"
                      >
                        {skill}
                      </span>
                    ))}
                    {course.skills.length > 3 && (
                      <span className="text-xs text-gray-300">
                        +{course.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-gray-300 mb-3">
                  <strong>Certificate:</strong> {course.certificationType}
                </div>
                
                <a
                  onClick={() => handlePurchaseClick(course)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {course.price === 0 ? 'Start Free Course' : `Purchase $${course.price}`}
                  {enrolledCourses.has(course.title) ? <CheckCircle size={12} /> : <ExternalLink size={12} />}
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-white bg-opacity-15 rounded-xl text-center">
            <p className="text-sm opacity-90 mb-2">
              💡 <strong>Smart Learning Strategy:</strong>
            </p>
            <p className="text-xs opacity-80 leading-relaxed">
              Start with <strong>free courses</strong> to explore, then invest in <strong>certified programs</strong> for career advancement. 
              Many employers reimburse education costs - check with HR! 🎯
            </p>
          </div>
        </div>
      )}
      
      {checkoutCourse && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            setCheckoutCourse(null);
          }}
          course={checkoutCourse}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
      
      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white bg-opacity-5 rounded-full blur-3xl"></div>
    </div>
  );
}