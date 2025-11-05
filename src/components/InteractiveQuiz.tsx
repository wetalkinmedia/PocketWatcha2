import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Award, RotateCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

interface InteractiveQuizProps {
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  allowRetakes: boolean;
  showCorrectAnswers: boolean;
  lessonId?: string;
}

export function InteractiveQuiz({
  title,
  description,
  questions,
  timeLimit,
  passingScore,
  allowRetakes,
  showCorrectAnswers,
  lessonId
}: InteractiveQuizProps) {
  const { supabaseUser } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit ? timeLimit * 60 : null);
  const [quizStarted, setQuizStarted] = useState(false);

  React.useEffect(() => {
    if (quizStarted && timeLeft && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(timeLimit ? timeLimit * 60 : null);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setShowResults(true);

    if (supabaseUser && lessonId) {
      try {
        const responsePromises = questions.map(question => {
          const userAnswer = answers[question.id];
          const isCorrect = userAnswer === question.correctAnswer;

          return supabase.from('responses').insert({
            user_id: supabaseUser.id,
            question_id: question.id,
            lesson_id: lessonId,
            answer: userAnswer || '',
            correct: isCorrect
          });
        });

        await Promise.all(responsePromises);
      } catch (error) {
        console.error('Error saving quiz responses:', error);
      }
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setQuizStarted(false);
    setTimeLeft(timeLimit ? timeLimit * 60 : null);
  };

  const calculateScore = () => {
    let correct = 0;
    let totalPoints = 0;
    
    questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correct += question.points;
      }
    });
    
    return {
      score: Math.round((correct / totalPoints) * 100),
      correct,
      totalPoints,
      passed: Math.round((correct / totalPoints) * 100) >= passingScore
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizStarted) {
    return (
      <div className="w-full p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{passingScore}%</div>
              <div className="text-sm text-gray-600">Passing Score</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {timeLimit ? `${timeLimit} min` : '∞'}
              </div>
              <div className="text-sm text-gray-600">Time Limit</div>
            </div>
          </div>
          
          <button
            onClick={handleStartQuiz}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateScore();
    
    return (
      <div className="w-full p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            results.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {results.passed ? (
              <Award size={40} className="text-green-600" />
            ) : (
              <XCircle size={40} className="text-red-600" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {results.passed ? 'Congratulations! 🎉' : 'Keep Learning! 📚'}
          </h3>
          
          <div className="text-4xl font-bold mb-2">
            <span className={results.passed ? 'text-green-600' : 'text-red-600'}>
              {results.score}%
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">
            You scored {results.correct} out of {results.totalPoints} points
          </p>
          
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
            results.passed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {results.passed ? `Passed (${passingScore}% required)` : `Failed (${passingScore}% required)`}
          </div>
        </div>

        {showCorrectAnswers && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Review Your Answers:</h4>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <XCircle size={16} className="text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </h5>
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="text-gray-600">Your answer: </span>
                            <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {userAnswer || 'No answer'}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div>
                              <span className="text-gray-600">Correct answer: </span>
                              <span className="text-green-600">{question.correctAnswer}</span>
                            </div>
                          )}
                          {question.explanation && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
                              <strong>Explanation:</strong> {question.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {allowRetakes && !results.passed && (
          <div className="text-center">
            <button
              onClick={handleRetakeQuiz}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw size={16} />
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="w-full p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        {timeLeft !== null && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            timeLeft < 60 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            <Clock size={16} />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          {question.question}
        </h4>

        <div className="space-y-3">
          {question.type === 'multiple-choice' && question.options?.map(option => (
            <label
              key={option}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={answers[question.id] === option}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}

          {question.type === 'true-false' && (
            <>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={question.id}
                  value="true"
                  checked={answers[question.id] === 'true'}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="text-blue-600"
                />
                <span>True</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={question.id}
                  value="false"
                  checked={answers[question.id] === 'false'}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="text-blue-600"
                />
                <span>False</span>
              </label>
            </>
          )}

          {question.type === 'fill-blank' && (
            <input
              type="text"
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Type your answer here..."
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <div className="text-sm text-gray-600">
          {currentQuestion + 1} / {questions.length}
        </div>
        
        <button
          onClick={handleNextQuestion}
          disabled={!answers[question.id]}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next'}
        </button>
      </div>
    </div>
  );
}