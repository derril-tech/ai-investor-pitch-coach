// Created automatically by Cursor AI (2024-08-24)
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStartupStore } from '@/lib/stores/useStartupStore';

interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expected_answer?: string;
  tips?: string[];
  follow_up_questions?: string[];
}

interface QASession {
  id: string;
  startupId: string;
  questions: Question[];
  status: 'generating' | 'ready' | 'completed';
  created_at: string;
  completed_at?: string;
}

export default function QAPage() {
  const params = useParams();
  const startupId = params.id as string;
  const { getStartup, currentStartup } = useStartupStore();
  const [qaSession, setQaSession] = useState<QASession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (startupId) {
      getStartup(startupId);
      // TODO: Fetch Q&A session from API
      loadMockQASession();
    }
  }, [startupId, getStartup]);

  const loadMockQASession = () => {
    const mockQuestions: Question[] = [
      {
        id: '1',
        text: 'What problem does your product solve?',
        category: 'Problem Statement',
        difficulty: 'easy',
        expected_answer: 'Clearly articulate the specific pain point or problem that your solution addresses.',
        tips: ['Be specific about the problem', 'Use concrete examples', 'Quantify the impact if possible']
      },
      {
        id: '2',
        text: 'How do you differentiate from existing competitors?',
        category: 'Competitive Advantage',
        difficulty: 'medium',
        expected_answer: 'Explain your unique value proposition and competitive moats.',
        tips: ['Focus on unique features', 'Highlight proprietary technology', 'Discuss network effects']
      },
      {
        id: '3',
        text: 'What is your go-to-market strategy?',
        category: 'Go-to-Market',
        difficulty: 'medium',
        expected_answer: 'Detail your customer acquisition strategy and sales process.',
        tips: ['Be specific about channels', 'Include timeline', 'Discuss customer acquisition cost']
      },
      {
        id: '4',
        text: 'How do you plan to scale the business?',
        category: 'Scaling',
        difficulty: 'hard',
        expected_answer: 'Explain your growth strategy and operational scaling plans.',
        tips: ['Discuss team growth', 'Cover geographic expansion', 'Address operational challenges']
      },
      {
        id: '5',
        text: 'What are your key financial metrics?',
        category: 'Financials',
        difficulty: 'medium',
        expected_answer: 'Highlight important KPIs and financial performance indicators.',
        tips: ['Include unit economics', 'Discuss burn rate', 'Show growth metrics']
      },
      {
        id: '6',
        text: 'How do you handle customer acquisition and retention?',
        category: 'Customer Success',
        difficulty: 'medium',
        expected_answer: 'Explain your customer lifecycle and retention strategies.',
        tips: ['Discuss onboarding process', 'Cover support systems', 'Include retention metrics']
      },
      {
        id: '7',
        text: 'What are the biggest risks to your business?',
        category: 'Risk Assessment',
        difficulty: 'hard',
        expected_answer: 'Honestly assess key risks and mitigation strategies.',
        tips: ['Be transparent', 'Show mitigation plans', 'Demonstrate awareness']
      },
      {
        id: '8',
        text: 'How do you plan to use the funding?',
        category: 'Use of Funds',
        difficulty: 'easy',
        expected_answer: 'Provide a clear breakdown of how you will allocate the investment.',
        tips: ['Be specific about allocation', 'Include timeline', 'Show expected outcomes']
      },
      {
        id: '9',
        text: 'What is your exit strategy?',
        category: 'Exit Strategy',
        difficulty: 'hard',
        expected_answer: 'Discuss potential exit scenarios and timeline.',
        tips: ['Consider multiple scenarios', 'Be realistic about timeline', 'Show market understanding']
      },
      {
        id: '10',
        text: 'How do you measure success?',
        category: 'Success Metrics',
        difficulty: 'medium',
        expected_answer: 'Define clear KPIs and success criteria for your business.',
        tips: ['Include both leading and lagging indicators', 'Be specific about targets', 'Show measurement methodology']
      }
    ];

    const mockSession: QASession = {
      id: 'qa-1',
      startupId,
      questions: mockQuestions,
      status: 'ready',
      created_at: new Date().toISOString()
    };

    setQaSession(mockSession);
    if (mockQuestions.length > 0) {
      setActiveQuestion(mockQuestions[0]);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    try {
      // TODO: Call API to generate questions
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      
      // Update session with new questions
      if (qaSession) {
        setQaSession({
          ...qaSession,
          status: 'ready'
        });
      }
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-green-100 text-green-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ];
    const index = category.length % colors.length;
    return colors[index];
  };

  if (!currentStartup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading startup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Q&A Practice</h1>
          <p className="mt-2 text-gray-600">
            Practice common investor questions for {currentStartup.name}
          </p>
        </div>

        {/* Configuration */}
        <div className="mb-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Question Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleGenerateQuestions}
                  disabled={isGenerating}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Generate Questions
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {qaSession && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Question List */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Questions ({qaSession.questions.length})</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {qaSession.questions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => {
                        setActiveQuestion(question);
                        setShowAnswer(false);
                      }}
                      className={`w-full text-left px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        activeQuestion?.id === question.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {index + 1}. {question.text}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(question.category)}`}>
                              {question.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Question Detail */}
            <div className="lg:col-span-2">
              {activeQuestion ? (
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(activeQuestion.difficulty)}`}>
                          {activeQuestion.difficulty}
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full ${getCategoryColor(activeQuestion.category)}`}>
                          {activeQuestion.category}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {showAnswer ? 'Hide Answer' : 'Show Answer'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-6">
                      {activeQuestion.text}
                    </h3>

                    {showAnswer && (
                      <div className="space-y-6">
                        {activeQuestion.expected_answer && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Expected Answer</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                              {activeQuestion.expected_answer}
                            </p>
                          </div>
                        )}

                        {activeQuestion.tips && activeQuestion.tips.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Tips</h4>
                            <ul className="space-y-2">
                              {activeQuestion.tips.map((tip, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  <span className="text-sm text-gray-700">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {activeQuestion.follow_up_questions && activeQuestion.follow_up_questions.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Follow-up Questions</h4>
                            <ul className="space-y-2">
                              {activeQuestion.follow_up_questions.map((question, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-gray-400 mr-2">•</span>
                                  <span className="text-sm text-gray-600">{question}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {!showAnswer && (
                      <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-4 text-sm text-gray-600">
                          Click "Show Answer" to see the expected response and tips
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow sm:rounded-lg p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-4 text-sm text-gray-600">
                    Select a question from the list to start practicing
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
