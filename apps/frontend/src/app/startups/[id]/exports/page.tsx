// Created automatically by Cursor AI (2024-08-24)
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStartupStore } from '@/lib/stores/useStartupStore';

interface ExportJob {
  id: string;
  startupId: string;
  type: 'pitch_deck' | 'financial_model' | 'market_analysis' | 'qa_summary' | 'rehearsal_report';
  format: 'pdf' | 'pptx' | 'xlsx' | 'docx' | 'zip';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  destination?: string;
  file_url?: string;
  file_size?: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

export default function ExportsPage() {
  const params = useParams();
  const startupId = params.id as string;
  const { getStartup, currentStartup } = useStartupStore();
  const [exports, setExports] = useState<ExportJob[]>([]);
  const [selectedType, setSelectedType] = useState<ExportJob['type']>('pitch_deck');
  const [selectedFormat, setSelectedFormat] = useState<ExportJob['format']>('pdf');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (startupId) {
      getStartup(startupId);
      // TODO: Fetch exports from API
      loadMockExports();
    }
  }, [startupId, getStartup]);

  const loadMockExports = () => {
    const mockExports: ExportJob[] = [
      {
        id: 'export-1',
        startupId,
        type: 'pitch_deck',
        format: 'pdf',
        status: 'completed',
        file_url: '/api/exports/export-1/download',
        file_size: 2048576, // 2MB
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        completed_at: new Date(Date.now() - 3540000).toISOString() // 59 minutes ago
      },
      {
        id: 'export-2',
        startupId,
        type: 'financial_model',
        format: 'xlsx',
        status: 'completed',
        file_url: '/api/exports/export-2/download',
        file_size: 1048576, // 1MB
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        completed_at: new Date(Date.now() - 7080000).toISOString() // 1:58 hours ago
      },
      {
        id: 'export-3',
        startupId,
        type: 'market_analysis',
        format: 'pdf',
        status: 'processing',
        created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      },
      {
        id: 'export-4',
        startupId,
        type: 'qa_summary',
        format: 'docx',
        status: 'failed',
        error_message: 'Failed to generate document due to missing narrative data',
        created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        completed_at: new Date(Date.now() - 1790000).toISOString() // 29:50 minutes ago
      }
    ];

    setExports(mockExports);
  };

  const handleCreateExport = async () => {
    setIsCreating(true);
    try {
      // TODO: Call API to create export
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Add new export to list
      const newExport: ExportJob = {
        id: `export-${Date.now()}`,
        startupId,
        type: selectedType,
        format: selectedFormat,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      setExports([newExport, ...exports]);
    } catch (error) {
      console.error('Error creating export:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownload = (exportJob: ExportJob) => {
    if (exportJob.file_url) {
      // TODO: Implement actual download
      window.open(exportJob.file_url, '_blank');
    }
  };

  const getTypeLabel = (type: ExportJob['type']) => {
    switch (type) {
      case 'pitch_deck': return 'Pitch Deck';
      case 'financial_model': return 'Financial Model';
      case 'market_analysis': return 'Market Analysis';
      case 'qa_summary': return 'Q&A Summary';
      case 'rehearsal_report': return 'Rehearsal Report';
      default: return type;
    }
  };

  const getFormatLabel = (format: ExportJob['format']) => {
    switch (format) {
      case 'pdf': return 'PDF';
      case 'pptx': return 'PowerPoint';
      case 'xlsx': return 'Excel';
      case 'docx': return 'Word';
      case 'zip': return 'ZIP Archive';
      default: return format.toUpperCase();
    }
  };

  const getStatusColor = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: ExportJob['type']) => {
    switch (type) {
      case 'pitch_deck':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'financial_model':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'market_analysis':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'qa_summary':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rehearsal_report':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
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
          <h1 className="text-3xl font-bold text-gray-900">Exports</h1>
          <p className="mt-2 text-gray-600">
            Generate and download reports for {currentStartup.name}
          </p>
        </div>

        {/* Create Export */}
        <div className="mb-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Export</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ExportJob['type'])}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pitch_deck">Pitch Deck</option>
                  <option value="financial_model">Financial Model</option>
                  <option value="market_analysis">Market Analysis</option>
                  <option value="qa_summary">Q&A Summary</option>
                  <option value="rehearsal_report">Rehearsal Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as ExportJob['format'])}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="pptx">PowerPoint</option>
                  <option value="xlsx">Excel</option>
                  <option value="docx">Word</option>
                  <option value="zip">ZIP Archive</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleCreateExport}
                  disabled={isCreating}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Create Export
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Export List */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Export History</h3>
          <div className="space-y-4">
            {exports.map((exportJob) => (
              <div key={exportJob.id} className="bg-white shadow sm:rounded-lg">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 text-gray-400">
                        {getTypeIcon(exportJob.type)}
                      </div>
                      <div>
                        <h4 className="text-md font-medium text-gray-900">
                          {getTypeLabel(exportJob.type)} - {getFormatLabel(exportJob.format)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Created {new Date(exportJob.created_at).toLocaleDateString()} at {new Date(exportJob.created_at).toLocaleTimeString()}
                        </p>
                        {exportJob.error_message && (
                          <p className="text-sm text-red-600 mt-1">{exportJob.error_message}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(exportJob.status)}`}>
                        {exportJob.status}
                      </span>
                      {exportJob.status === 'completed' && exportJob.file_size && (
                        <span className="text-sm text-gray-600">
                          {formatFileSize(exportJob.file_size)}
                        </span>
                      )}
                      {exportJob.status === 'completed' && exportJob.file_url && (
                        <button
                          onClick={() => handleDownload(exportJob)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </button>
                      )}
                      {exportJob.status === 'processing' && (
                        <div className="flex items-center text-blue-600">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-sm">Processing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {exports.length === 0 && (
          <div className="bg-white shadow sm:rounded-lg p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-sm text-gray-600">
              No exports yet. Create your first export above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
