// Created automatically by Cursor AI (2024-08-24)
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStartupStore } from '@/lib/stores/useStartupStore';

interface MarketSize {
  tam: number;
  sam: number;
  som: number;
  assumptions: Record<string, any>;
}

interface SensitivityAnalysis {
  base_case: MarketSize;
  sensitivity_results: Record<string, any>;
  key_drivers: string[];
}

interface MarketValidation {
  tam_size: {
    status: string;
    message: string;
    recommendation: string;
  };
  sam_tam_ratio: {
    status: string;
    message: string;
    recommendation: string;
  };
  som_sam_ratio: {
    status: string;
    message: string;
    recommendation: string;
  };
}

interface MarketAnalysis {
  methodology: string;
  inputs: Record<string, any>;
  results: MarketSize;
  sensitivity: SensitivityAnalysis;
  validation: MarketValidation;
  status: string;
}

export default function MarketPage() {
  const params = useParams();
  const startupId = params.id as string;
  const { getStartup, currentStartup } = useStartupStore();
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'sensitivity' | 'validation'>('results');
  const [methodology, setMethodology] = useState('top_down');

  useEffect(() => {
    if (startupId) {
      getStartup(startupId);
      // TODO: Fetch market analysis from API
      loadMockAnalysis();
    }
  }, [startupId, getStartup]);

  const loadMockAnalysis = () => {
    const mockAnalysis: MarketAnalysis = {
      methodology: 'top_down',
      inputs: {
        total_market_size: 100000000000,
        target_segment_percentage: 0.20,
        geographic_percentage: 0.15,
        accessibility_factor: 0.10
      },
      results: {
        tam: 3000000000, // $3B
        sam: 300000000,  // $300M
        som: 15000000,   // $15M
        assumptions: {
          total_market_size: 100000000000,
          target_segment_percentage: 0.20,
          geographic_percentage: 0.15,
          accessibility_factor: 0.10,
          market_share_assumption: 0.05
        }
      },
      sensitivity: {
        base_case: {
          tam: 3000000000,
          sam: 300000000,
          som: 15000000,
          assumptions: {}
        },
        sensitivity_results: {
          total_market_size: {
            tam_range: [2400000000, 3600000000],
            sam_range: [240000000, 360000000],
            som_range: [12000000, 18000000]
          },
          target_segment_percentage: {
            tam_range: [2400000000, 3600000000],
            sam_range: [240000000, 360000000],
            som_range: [12000000, 18000000]
          }
        },
        key_drivers: ['total_market_size', 'target_segment_percentage', 'geographic_percentage']
      },
      validation: {
        tam_size: {
          status: 'good',
          message: 'TAM size is reasonable for most investors.',
          recommendation: 'Proceed with current market definition.'
        },
        sam_tam_ratio: {
          status: 'good',
          message: 'SAM/TAM ratio is reasonable.',
          recommendation: 'Market definition appears appropriate.'
        },
        som_sam_ratio: {
          status: 'good',
          message: 'SOM/SAM ratio is reasonable.',
          recommendation: 'Market share assumptions appear realistic.'
        }
      },
      status: 'completed'
    };
    setAnalysis(mockAnalysis);
  };

  const handleCalculateMarketSize = async () => {
    setIsCalculating(true);
    try {
      // TODO: Call API to calculate market size
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      
      // Update analysis with new results
      if (analysis) {
        setAnalysis({
          ...analysis,
          methodology,
          status: 'updated'
        });
      }
    } catch (error) {
      console.error('Error calculating market size:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
          <h1 className="text-3xl font-bold text-gray-900">Market Sizer</h1>
          <p className="mt-2 text-gray-600">
            Calculate TAM, SAM, and SOM for {currentStartup.name}
          </p>
        </div>

        {/* Methodology Selection */}
        <div className="mb-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Market Sizing Methodology</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { value: 'top_down', label: 'Top-Down', description: 'Start with total market and segment down' },
                { value: 'bottom_up', label: 'Bottom-Up', description: 'Start with individual customers and scale up' },
                { value: 'analogy', label: 'Analogy', description: 'Compare to similar markets' },
                { value: 'hybrid', label: 'Hybrid', description: 'Combine multiple approaches' }
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setMethodology(method.value)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    methodology === method.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{method.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{method.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={handleCalculateMarketSize}
            disabled={isCalculating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Calculate Market Size
              </>
            )}
          </button>
        </div>

        {analysis && (
          <>
            {/* Market Size Results */}
            <div className="mb-8">
              <div className="bg-white shadow sm:rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Market Size Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {formatCurrency(analysis.results.tam)}
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">TAM</div>
                    <div className="text-xs text-gray-600">Total Addressable Market</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {formatCurrency(analysis.results.sam)}
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">SAM</div>
                    <div className="text-xs text-gray-600">Serviceable Addressable Market</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {formatCurrency(analysis.results.som)}
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">SOM</div>
                    <div className="text-xs text-gray-600">Serviceable Obtainable Market</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('results')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'results'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Results
                </button>
                <button
                  onClick={() => setActiveTab('sensitivity')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'sensitivity'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Sensitivity Analysis
                </button>
                <button
                  onClick={() => setActiveTab('validation')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'validation'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Validation
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="bg-white shadow sm:rounded-lg">
              {activeTab === 'results' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Detailed Results</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Methodology</h4>
                      <p className="text-sm text-gray-600 capitalize">{analysis.methodology.replace('_', ' ')}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Key Assumptions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(analysis.results.assumptions).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm text-gray-600 capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {typeof value === 'number' && value < 1 ? `${(value * 100).toFixed(1)}%` : value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sensitivity' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Sensitivity Analysis</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Key Drivers</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.sensitivity.key_drivers.map((driver, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {driver.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Sensitivity Results</h4>
                      <div className="space-y-4">
                        {Object.entries(analysis.sensitivity.sensitivity_results).map(([assumption, ranges]) => (
                          <div key={assumption} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-gray-900 mb-2 capitalize">
                              {assumption.replace(/_/g, ' ')}
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-gray-600">TAM Range</div>
                                <div className="font-medium">
                                  {formatCurrency(ranges.tam_range[0])} - {formatCurrency(ranges.tam_range[1])}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-600">SAM Range</div>
                                <div className="font-medium">
                                  {formatCurrency(ranges.sam_range[0])} - {formatCurrency(ranges.sam_range[1])}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-600">SOM Range</div>
                                <div className="font-medium">
                                  {formatCurrency(ranges.som_range[0])} - {formatCurrency(ranges.som_range[1])}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'validation' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Assumption Validation</h3>
                  <div className="space-y-4">
                    {Object.entries(analysis.validation).map(([key, validation]) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(validation.status)}`}>
                                {validation.status}
                              </span>
                              <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                                {key.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{validation.message}</p>
                            <p className="text-xs text-gray-500">Recommendation: {validation.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
