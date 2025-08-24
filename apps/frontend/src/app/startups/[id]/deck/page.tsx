// Created automatically by Cursor AI (2024-08-24)
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStartupStore } from '@/lib/stores/useStartupStore';

interface Slide {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  layout: string;
  content: any;
  branding?: any;
}

interface SlideDeck {
  id: string;
  startupId: string;
  narrativeId: string;
  slides: Slide[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function DeckPage() {
  const params = useParams();
  const startupId = params.id as string;
  const { getStartup, currentStartup } = useStartupStore();
  const [slideDeck, setSlideDeck] = useState<SlideDeck | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (startupId) {
      getStartup(startupId);
      // TODO: Fetch slide deck from API
      loadMockSlideDeck();
    }
  }, [startupId, getStartup]);

  const loadMockSlideDeck = () => {
    const mockSlideDeck: SlideDeck = {
      id: '1',
      startupId,
      narrativeId: '1',
      status: 'draft',
      slides: [
        {
          id: 'slide_1',
          type: 'title',
          title: 'Example Startup',
          subtitle: 'SaaS • Seed Stage',
          layout: 'title',
          content: {
            background_color: '#2563eb',
            text_color: '#ffffff',
            logo: null
          }
        },
        {
          id: 'slide_2',
          type: 'problem',
          title: 'The Problem',
          subtitle: 'What we\'re solving',
          layout: 'content',
          content: {
            main_text: 'Small businesses struggle to manage their customer relationships effectively, leading to lost opportunities and poor customer retention.',
            bullets: [
              'Complex customer relationship management',
              'Lost opportunities due to poor tracking',
              'Low customer retention rates',
              'Inefficient communication processes'
            ],
            visual: 'problem_illustration'
          }
        },
        {
          id: 'slide_3',
          type: 'solution',
          title: 'Our Solution',
          subtitle: 'How we solve it',
          layout: 'content',
          content: {
            main_text: 'Our AI-powered CRM platform automates customer interactions, provides actionable insights, and helps businesses build stronger relationships.',
            bullets: [
              'AI-powered automation',
              'Intelligent insights and analytics',
              'Seamless integration capabilities',
              'User-friendly interface'
            ],
            visual: 'solution_diagram'
          }
        },
        {
          id: 'slide_4',
          type: 'market',
          title: 'Market Opportunity',
          subtitle: 'The size of the prize',
          layout: 'market',
          content: {
            main_text: 'The global CRM market is valued at $58.5B and growing at 12% annually. We target the SMB segment, which represents $15B in opportunity.',
            market_data: {
              tam: '$58.5B',
              sam: '$15B',
              som: '$500M'
            },
            visual: 'market_chart'
          }
        },
        {
          id: 'slide_5',
          type: 'traction',
          title: 'Traction & Metrics',
          subtitle: 'Proof of progress',
          layout: 'metrics',
          content: {
            main_text: 'We have 500+ paying customers, $2M ARR, 15% month-over-month growth, and 95% customer satisfaction score.',
            metrics: [
              { label: 'Customers', value: '500+', trend: 'up' },
              { label: 'ARR', value: '$2M', trend: 'up' },
              { label: 'Growth', value: '15% MoM', trend: 'up' },
              { label: 'Satisfaction', value: '95%', trend: 'stable' }
            ],
            visual: 'metrics_chart'
          }
        },
        {
          id: 'slide_6',
          type: 'team',
          title: 'Team',
          subtitle: 'Why we can execute',
          layout: 'team',
          content: {
            main_text: 'Our team includes former executives from Salesforce and HubSpot, with deep expertise in CRM and AI technologies.',
            team_members: [
              { name: 'CEO', background: 'Former Salesforce VP' },
              { name: 'CTO', background: 'Ex-HubSpot Engineering Lead' },
              { name: 'CPO', background: 'AI/ML Expert' }
            ],
            visual: 'team_photos'
          }
        },
        {
          id: 'slide_7',
          type: 'funding',
          title: 'Funding Ask',
          subtitle: 'Investment opportunity',
          layout: 'funding',
          content: {
            main_text: 'We\'re raising $5M Series A to expand our team, enhance our AI capabilities, and scale our go-to-market efforts.',
            funding_details: {
              amount: '$5M',
              round: 'Series A',
              use_of_funds: [
                'Team expansion (40%)',
                'Product development (30%)',
                'Sales & marketing (20%)',
                'Operations (10%)'
              ]
            },
            visual: 'funding_chart'
          }
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSlideDeck(mockSlideDeck);
  };

  const handleBuildSlides = async () => {
    setIsBuilding(true);
    try {
      // TODO: Call API to build slides
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      
      // Update slide deck status
      if (slideDeck) {
        setSlideDeck({
          ...slideDeck,
          status: 'completed'
        });
      }
    } catch (error) {
      console.error('Error building slides:', error);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleSlideUpdate = (slideIndex: number, updates: Partial<Slide>) => {
    if (slideDeck) {
      const updatedSlides = [...slideDeck.slides];
      updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], ...updates };
      setSlideDeck({
        ...slideDeck,
        slides: updatedSlides
      });
    }
  };

  const renderSlidePreview = (slide: Slide) => {
    const baseClasses = "w-full h-64 bg-white border border-gray-200 rounded-lg p-6 shadow-sm";
    
    switch (slide.layout) {
      case 'title':
        return (
          <div className={`${baseClasses} flex flex-col justify-center items-center text-center`} 
               style={{ backgroundColor: slide.content.background_color, color: slide.content.text_color }}>
            <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
            <p className="text-lg opacity-90">{slide.subtitle}</p>
          </div>
        );
      
      case 'content':
        return (
          <div className={baseClasses}>
            <h3 className="text-lg font-semibold mb-2">{slide.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{slide.subtitle}</p>
            <p className="text-sm mb-3">{slide.content.main_text}</p>
            <ul className="text-sm space-y-1">
              {slide.content.bullets?.slice(0, 3).map((bullet: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'market':
        return (
          <div className={baseClasses}>
            <h3 className="text-lg font-semibold mb-2">{slide.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{slide.subtitle}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-xs text-gray-600">TAM</div>
                <div className="font-semibold">{slide.content.market_data.tam}</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="text-xs text-gray-600">SAM</div>
                <div className="font-semibold">{slide.content.market_data.sam}</div>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <div className="text-xs text-gray-600">SOM</div>
                <div className="font-semibold">{slide.content.market_data.som}</div>
              </div>
            </div>
          </div>
        );
      
      case 'metrics':
        return (
          <div className={baseClasses}>
            <h3 className="text-lg font-semibold mb-2">{slide.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{slide.subtitle}</p>
            <div className="grid grid-cols-2 gap-3">
              {slide.content.metrics?.slice(0, 4).map((metric: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-600">{metric.label}</div>
                  <div className="font-semibold">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className={baseClasses}>
            <h3 className="text-lg font-semibold mb-2">{slide.title}</h3>
            <p className="text-sm text-gray-600">{slide.subtitle}</p>
          </div>
        );
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Slide Workshop</h1>
          <p className="mt-2 text-gray-600">
            Build and customize your pitch deck for {currentStartup.name}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex space-x-4">
          <button
            onClick={handleBuildSlides}
            disabled={isBuilding}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isBuilding ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Building...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Build Slides
              </>
            )}
          </button>
          
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PPTX
          </button>
        </div>

        {slideDeck && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Slide Thumbnails */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow sm:rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Slides</h3>
                <div className="space-y-3">
                  {slideDeck.slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => setActiveSlide(index)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        activeSlide === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        Slide {index + 1}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {slide.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {slide.type}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Slide Editor/Preview */}
            <div className="lg:col-span-3">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {slideDeck.slides[activeSlide]?.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {slideDeck.slides[activeSlide]?.subtitle}
                  </p>
                </div>
                
                <div className="p-6">
                  {previewMode ? (
                    // Preview Mode
                    <div className="flex justify-center">
                      <div className="w-full max-w-2xl">
                        {renderSlidePreview(slideDeck.slides[activeSlide])}
                      </div>
                    </div>
                  ) : (
                    // Edit Mode
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Slide Editor */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Slide</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={slideDeck.slides[activeSlide]?.title || ''}
                                onChange={(e) => handleSlideUpdate(activeSlide, { title: e.target.value })}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtitle
                              </label>
                              <input
                                type="text"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={slideDeck.slides[activeSlide]?.subtitle || ''}
                                onChange={(e) => handleSlideUpdate(activeSlide, { subtitle: e.target.value })}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content
                              </label>
                              <textarea
                                rows={4}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={slideDeck.slides[activeSlide]?.content.main_text || ''}
                                onChange={(e) => handleSlideUpdate(activeSlide, { 
                                  content: { ...slideDeck.slides[activeSlide]?.content, main_text: e.target.value }
                                })}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Slide Preview */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
                          {renderSlidePreview(slideDeck.slides[activeSlide])}
                        </div>
                      </div>
                      
                      {/* Navigation */}
                      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <button
                          onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                          disabled={activeSlide === 0}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        
                        <span className="text-sm text-gray-600">
                          Slide {activeSlide + 1} of {slideDeck.slides.length}
                        </span>
                        
                        <button
                          onClick={() => setActiveSlide(Math.min(slideDeck.slides.length - 1, activeSlide + 1))}
                          disabled={activeSlide === slideDeck.slides.length - 1}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
