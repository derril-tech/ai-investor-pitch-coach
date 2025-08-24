// Created automatically by Cursor AI (2024-08-24)
'use client';

import { useState } from 'react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Investor Pitch Coach
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your startup idea into a fundable pitch narrative
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setIsLoading(true)}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
