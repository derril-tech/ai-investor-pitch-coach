// Created automatically by Cursor AI (2024-08-24)
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStartupStore } from '@/lib/stores/useStartupStore';

interface NarrativeSection {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'reviewing' | 'approved';
}

interface Narrative {
  id: string;
  startupId: string;
  version: number;
  status: string;
  outline: {
    problem: string;
    solution: string;
    market: string;
    traction: string;
    team: string;
    funding: string;
  };
  sections: NarrativeSection[];
  createdAt: string;
  updatedAt: string;
}

export default function NarrativePage() {
  const params = useParams();
  const startupId = params.id as string;
  const { getStartup, currentStartup } = useStartupStore();
  const [narrative, setNarrative] = useState<Narrative | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('problem');

  useEffect(() => {
    if (startupId) {
      getStartup(startupId);
      // TODO: Fetch narrative from API
      loadMockNarrative();
    }
  }, [startupId, getStartup]);

  const loadMockNarrative = () => {
    const mockNarrative: Narrative = {
      id: '1',
      startupId,
      version: 1,
      status: 'draft',
      outline: {
        problem: 'Small businesses struggle to manage their customer relationships effectively, leading to lost opportunities and poor customer retention.',
        solution: 'Our AI-powered CRM platform automates customer interactions, provides actionable insights, and helps businesses build stronger relationships.',
        market: 'The global CRM market is valued at $58.5B and growing at 12% annually. We target the SMB segment, which represents $15B in opportunity.',
        traction: 'We have 500+ paying customers, $2M ARR, 15% month-over-month growth, and 95% customer satisfaction score.',
        team: 'Our team includes former executives from Salesforce and HubSpot, with deep expertise in CRM and AI technologies.',
        funding: 'We\'re raising $5M Series A to expand our team, enhance our AI capabilities, and scale our go-to-market efforts.'
      },
      sections: [
        { id: 'problem', title: 'Problem Statement', content: '', status: 'draft' },
        { id: 'solution', title: 'Solution Description', content: '', status: 'draft' },
        { id: 'market', title: 'Market Opportunity', content: '', status: 'draft' },
        { id: 'traction', title: 'Traction & Metrics', content: '', status: 'draft' },
        { id: 'team', title: 'Team Overview', content: '', status: 'draft' },
        { id: 'funding', title: 'Funding Ask', content: '', status: 'draft' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNarrative(mockNarrative);
  };

  const handleGenerateNarrative = async () => {
    setIsGenerating(true);
    try {
      // TODO: Call API to generate narrative
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      
      // Update narrative with generated content
      if (narrative) {
        const updatedNarrative = {
          ...narrative,
          status: 'reviewing',
          sections: narrative.sections.map(section => ({
            ...section,
            content: narrative.outline[section.id as keyof typeof narrative.outline] || '',
            status: 'reviewing' as const
          }))
        };
        setNarrative(updatedNarrative);
      }
    } catch (error) {
      console.error('Error generating narrative:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSectionUpdate = (sectionId: string, content: string) => {
    if (narrative) {
      const updatedNarrative = {
        ...narrative,
        sections: narrative.sections.map(section =>
          section.id === sectionId ? { ...section, content } : section
        )
      };
      setNarrative(updatedNarrative);
    }
  };

  const getSectionStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Narrative Builder</h1>
          <p className="mt-2 text-gray-600">
            Craft your compelling pitch narrative for {currentStartup.name}
          </p>
        </div>

        {/* Generate Button */}
        <div className="mb-8">
          <button
            onClick={handleGenerateNarrative}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Narrative
              </>
            )}
          </button>
        </div>

        {narrative && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Section Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow sm:rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sections</h3>
                <nav className="space-y-2">
                  {narrative.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{section.title}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSectionStatusColor(section.status)}`}>
                          {section.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content - Section Editor */}
            <div className="lg:col-span-3">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {narrative.sections.find(s => s.id === activeSection)?.title}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        id="content"
                        rows={8}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your content here..."
                        value={narrative.sections.find(s => s.id === activeSection)?.content || ''}
                        onChange={(e) => handleSectionUpdate(activeSection, e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {narrative.sections.find(s => s.id === activeSection)?.content.length || 0} characters
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                          Save Draft
                        </button>
                        <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                          Publish
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
