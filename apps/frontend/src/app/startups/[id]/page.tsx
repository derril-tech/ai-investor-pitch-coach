// Created automatically by Cursor AI (2024-08-24)
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Startup {
  id: string;
  name: string;
  sector: string;
  stage: string;
  brand?: any;
  createdAt: string;
}

const tabs = [
  { name: 'Narrative', href: 'narrative', current: true },
  { name: 'Deck', href: 'deck', current: false },
  { name: 'Finance', href: 'finance', current: false },
  { name: 'Market', href: 'market', current: false },
  { name: 'Q&A', href: 'qa', current: false },
  { name: 'Rehearsal', href: 'rehearsal', current: false },
  { name: 'Exports', href: 'exports', current: false },
];

export default function StartupDetailPage() {
  const params = useParams();
  const startupId = params.id as string;
  const [startup, setStartup] = useState<Startup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('narrative');

  useEffect(() => {
    // TODO: Fetch startup data from API
    const mockStartup: Startup = {
      id: startupId,
      name: 'Example Startup',
      sector: 'SaaS',
      stage: 'seed',
      brand: { colors: ['#000000', '#ffffff'] },
      createdAt: '2024-01-01T00:00:00Z',
    };
    setStartup(mockStartup);
    setIsLoading(false);
  }, [startupId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading startup...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Startup not found</h3>
          <p className="mt-2 text-gray-600">The startup you're looking for doesn't exist.</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{startup.name}</h1>
              <p className="mt-2 text-gray-600">
                {startup.sector} • {startup.stage} • Created {new Date(startup.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={`/startups/${startupId}/${tab.href}`}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.href
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.href)}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Content coming soon</h3>
              <p className="mt-1 text-sm text-gray-500">
                The {activeTab} section is under development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
