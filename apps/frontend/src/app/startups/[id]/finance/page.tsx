// Created automatically by Cursor AI (2024-08-24)
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStartupStore } from '@/lib/stores/useStartupStore';

interface FinancialMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  benchmark: {
    good: number;
    warning: number;
    critical: number;
  };
  score: number;
}

interface FinancialAnomaly {
  type: string;
  severity: 'critical' | 'warning' | 'info';
  metric: string;
  value: number;
  message: string;
  impact: string;
}

interface FinancialRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  actions: string[];
  expected_impact: string;
}

interface FinancialAnalysis {
  metrics: FinancialMetric[];
  anomalies: FinancialAnomaly[];
  recommendations: FinancialRecommendation[];
  overall_score: number;
  status: string;
}

export default function FinancePage() {
  const params = useParams();
  const startupId = params.id as string;
  const { getStartup, currentStartup } = useStartupStore();
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'anomalies' | 'recommendations'>('metrics');

  useEffect(() => {
    if (startupId) {
      getStartup(startupId);
      // TODO: Fetch financial analysis from API
      loadMockAnalysis();
    }
  }, [startupId, getStartup]);

  const loadMockAnalysis = () => {
    const mockAnalysis: FinancialAnalysis = {
      metrics: [
        {
          name: 'CAC',
          value: 150,
          unit: '$',
          status: 'warning',
          benchmark: { good: 100, warning: 200, critical: 300 },
          score: 75
        },
        {
          name: 'LTV',
          value: 1200,
          unit: '$',
          status: 'good',
          benchmark: { good: 1000, warning: 800, critical: 600 },
          score: 90
        },
        {
          name: 'LTV/CAC Ratio',
          value: 8.0,
          unit: 'x',
          status: 'good',
          benchmark: { good: 3.0, warning: 2.0, critical: 1.0 },
          score: 100
        },
        {
          name: 'Churn Rate',
          value: 0.05,
          unit: '%',
          status: 'good',
          benchmark: { good: 0.05, warning: 0.10, critical: 0.15 },
          score: 100
        },
        {
          name: 'Gross Margin',
          value: 0.75,
          unit: '%',
          status: 'warning',
          benchmark: { good: 0.80, warning: 0.70, critical: 0.60 },
          score: 70
        },
        {
          name: 'Runway',
          value: 18,
          unit: 'months',
          status: 'good',
          benchmark: { good: 12, warning: 6, critical: 3 },
          score: 100
        }
      ],
      anomalies: [
        {
          type: 'warning_cac',
          severity: 'warning',
          metric: 'CAC',
          value: 150,
          message: 'Customer acquisition cost is above industry average',
          impact: 'Moderate risk to growth and efficiency'
        },
        {
          type: 'warning_gross_margin',
          severity: 'warning',
          metric: 'Gross Margin',
          value: 0.75,
          message: 'Gross margin is below optimal at 75%',
          impact: 'May indicate pricing or cost structure issues'
        }
      ],
      recommendations: [
        {
          priority: 'medium',
          category: 'pricing',
          title: 'Improve Gross Margins',
          description: 'Gross margins below industry standard may indicate pricing or cost issues.',
          actions: [
            'Review pricing strategy and consider increases',
            'Optimize cost of goods sold',
            'Negotiate better vendor terms',
            'Consider premium tier offerings'
          ],
          expected_impact: 'Improve profitability and investor appeal'
        },
        {
          priority: 'medium',
          category: 'efficiency',
          title: 'Optimize Customer Acquisition',
          description: 'Long payback period indicates inefficient customer acquisition.',
          actions: [
            'Optimize marketing channels and campaigns',
            'Improve conversion rates',
            'Consider referral programs',
            'Focus on higher-value customer segments'
          ],
          expected_impact: 'Improve cash flow and efficiency'
        }
      ],
      overall_score: 85,
      status: 'completed'
    };
    setAnalysis(mockAnalysis);
  };

  const handleAnalyzeFinancials = async () => {
    setIsAnalyzing(true);
    try {
      // TODO: Call API to analyze financials
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      
      // Update analysis with new results
      if (analysis) {
        setAnalysis({
          ...analysis,
          overall_score: 88,
          status: 'updated'
        });
      }
    } catch (error) {
      console.error('Error analyzing financials:', error);
    } finally {
      setIsAnalyzing(false);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatMetricValue = (metric: FinancialMetric) => {
    if (metric.unit === '%') {
      return `${(metric.value * 100).toFixed(1)}%`;
    } else if (metric.unit === '$') {
      return `$${metric.value.toLocaleString()}`;
    } else if (metric.unit === 'x') {
      return `${metric.value.toFixed(1)}x`;
    } else {
      return `${metric.value.toLocaleString()} ${metric.unit}`;
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
          <h1 className="text-3xl font-bold text-gray-900">Finance Diagnostics</h1>
          <p className="mt-2 text-gray-600">
            Analyze financial health and identify opportunities for {currentStartup.name}
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={handleAnalyzeFinancials}
            disabled={isAnalyzing}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analyze Financials
              </>
            )}
          </button>
        </div>

        {analysis && (
          <>
            {/* Overall Score */}
            <div className="mb-8">
              <div className="bg-white shadow sm:rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Overall Financial Health</h3>
                    <p className="text-sm text-gray-600">Based on key metrics and benchmarks</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{analysis.overall_score}</div>
                    <div className="text-sm text-gray-600">out of 100</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysis.overall_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'metrics'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Key Metrics
                </button>
                <button
                  onClick={() => setActiveTab('anomalies')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'anomalies'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Anomalies ({analysis.anomalies.length})
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'recommendations'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Recommendations ({analysis.recommendations.length})
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="bg-white shadow sm:rounded-lg">
              {activeTab === 'metrics' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Key Financial Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analysis.metrics.map((metric) => (
                      <div key={metric.name} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{metric.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(metric.status)}`}>
                            {metric.status}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {formatMetricValue(metric)}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Score: {metric.score}/100</span>
                          <span>Benchmark: {metric.benchmark.good}</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full"
                              style={{ width: `${metric.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'anomalies' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Financial Anomalies</h3>
                  <div className="space-y-4">
                    {analysis.anomalies.map((anomaly, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(anomaly.severity)}`}>
                                {anomaly.severity}
                              </span>
                              <span className="ml-2 text-sm font-medium text-gray-900">
                                {anomaly.metric}: {anomaly.value}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{anomaly.message}</p>
                            <p className="text-xs text-gray-500">Impact: {anomaly.impact}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Recommendations</h3>
                  <div className="space-y-6">
                    {analysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(recommendation.priority)}`}>
                                {recommendation.priority} priority
                              </span>
                              <span className="ml-2 text-xs text-gray-500">{recommendation.category}</span>
                            </div>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">{recommendation.title}</h4>
                            <p className="text-sm text-gray-600 mb-4">{recommendation.description}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Recommended Actions:</h5>
                          <ul className="space-y-1">
                            {recommendation.actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="text-sm text-gray-600 flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Expected Impact: {recommendation.expected_impact}
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
