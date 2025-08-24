// Created automatically by Cursor AI (2024-08-24)
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStartupStore } from '@/lib/stores/useStartupStore';
import { useRehearsalStore } from '@/lib/stores/useRehearsalStore';

interface SpeechAnalysis {
  pace: {
    words_per_minute: number;
    status: 'good' | 'slow' | 'fast';
    recommendation: string;
  };
  clarity: {
    filler_words_per_minute: number;
    status: 'good' | 'needs_improvement';
    recommendation: string;
  };
  confidence: {
    volume_variation: number;
    pitch_stability: number;
    status: 'good' | 'needs_improvement';
    recommendation: string;
  };
  engagement: {
    pause_frequency: number;
    emphasis_points: number;
    status: 'good' | 'needs_improvement';
    recommendation: string;
  };
  overall_score: number;
}

interface RehearsalSession {
  id: string;
  startupId: string;
  narrativeId: string;
  status: 'recording' | 'analyzing' | 'completed' | 'failed';
  audio_url?: string;
  transcript?: string;
  analysis?: SpeechAnalysis;
  created_at: string;
  completed_at?: string;
  duration?: number;
}

export default function RehearsalPage() {
  const params = useParams();
  const startupId = params.id as string;
  const { getStartup, currentStartup } = useStartupStore();
  const { startRehearsal, stopRehearsal, analyzeRehearsal, currentRehearsal, isRecording } = useRehearsalStore();
  const [sessions, setSessions] = useState<RehearsalSession[]>([]);
  const [selectedNarrative, setSelectedNarrative] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (startupId) {
      getStartup(startupId);
      // TODO: Fetch rehearsal sessions from API
      loadMockSessions();
    }
  }, [startupId, getStartup]);

  const loadMockSessions = () => {
    const mockSessions: RehearsalSession[] = [
      {
        id: 'rehearsal-1',
        startupId,
        narrativeId: 'narrative-1',
        status: 'completed',
        duration: 180, // 3 minutes
        analysis: {
          pace: {
            words_per_minute: 145,
            status: 'good',
            recommendation: 'Your speaking pace is excellent for investor presentations.'
          },
          clarity: {
            filler_words_per_minute: 2.1,
            status: 'good',
            recommendation: 'Very few filler words. Great clarity in delivery.'
          },
          confidence: {
            volume_variation: 0.8,
            pitch_stability: 0.7,
            status: 'good',
            recommendation: 'Good vocal variety and stable pitch throughout.'
          },
          engagement: {
            pause_frequency: 12,
            emphasis_points: 8,
            status: 'good',
            recommendation: 'Effective use of pauses and emphasis for engagement.'
          },
          overall_score: 85
        },
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        completed_at: new Date(Date.now() - 3540000).toISOString() // 59 minutes ago
      },
      {
        id: 'rehearsal-2',
        startupId,
        narrativeId: 'narrative-1',
        status: 'completed',
        duration: 165, // 2:45 minutes
        analysis: {
          pace: {
            words_per_minute: 160,
            status: 'fast',
            recommendation: 'Consider slowing down slightly for better comprehension.'
          },
          clarity: {
            filler_words_per_minute: 4.2,
            status: 'needs_improvement',
            recommendation: 'Reduce filler words like "um" and "uh" for clearer delivery.'
          },
          confidence: {
            volume_variation: 0.6,
            pitch_stability: 0.5,
            status: 'needs_improvement',
            recommendation: 'Work on maintaining consistent volume and pitch.'
          },
          engagement: {
            pause_frequency: 8,
            emphasis_points: 5,
            status: 'needs_improvement',
            recommendation: 'Add more strategic pauses and emphasis points.'
          },
          overall_score: 72
        },
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        completed_at: new Date(Date.now() - 7035000).toISOString() // 1:57 hours ago
      }
    ];

    setSessions(mockSessions);
  };

  const handleStartRehearsal = async () => {
    if (!selectedNarrative) {
      alert('Please select a narrative to rehearse');
      return;
    }

    try {
      await startRehearsal(startupId, selectedNarrative);
    } catch (error) {
      console.error('Error starting rehearsal:', error);
    }
  };

  const handleStopRehearsal = async () => {
    try {
      await stopRehearsal();
    } catch (error) {
      console.error('Error stopping rehearsal:', error);
    }
  };

  const handleAnalyzeRehearsal = async (sessionId: string) => {
    setIsAnalyzing(true);
    try {
      await analyzeRehearsal(sessionId);
      // Refresh sessions after analysis
      loadMockSessions();
    } catch (error) {
      console.error('Error analyzing rehearsal:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs_improvement': return 'text-yellow-600 bg-yellow-100';
      case 'slow': return 'text-blue-600 bg-blue-100';
      case 'fast': return 'text-orange-600 bg-orange-100';
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
          <h1 className="text-3xl font-bold text-gray-900">Speech Rehearsal</h1>
          <p className="mt-2 text-gray-600">
            Practice your pitch delivery for {currentStartup.name}
          </p>
        </div>

        {/* Recording Controls */}
        <div className="mb-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Start Rehearsal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Narrative
                </label>
                <select
                  value={selectedNarrative}
                  onChange={(e) => setSelectedNarrative(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a narrative...</option>
                  <option value="narrative-1">Main Pitch Narrative</option>
                  <option value="narrative-2">Problem Statement</option>
                  <option value="narrative-3">Solution Overview</option>
                </select>
              </div>
              <div className="flex items-end space-x-4">
                {!isRecording ? (
                  <button
                    onClick={handleStartRehearsal}
                    disabled={!selectedNarrative}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4V6.24C15.79 7.5 17 9.29 17 11.5V16L21 20H3L7 16V11.5C7 9.29 8.21 7.5 10 6.24V4C10 2.9 10.9 2 12 2M12 4C11.45 4 11 4.45 11 5V6H13V5C13 4.45 12.55 4 12 4Z"/>
                    </svg>
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={handleStopRehearsal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6H18V18H6V6Z"/>
                    </svg>
                    Stop Recording
                  </button>
                )}
              </div>
              <div className="flex items-center">
                {isRecording && (
                  <div className="flex items-center text-red-600">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm font-medium">Recording...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Session */}
        {currentRehearsal && (
          <div className="mb-8">
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Session</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Session ID: {currentRehearsal.id}</p>
                  <p className="text-sm text-gray-600">Status: {currentRehearsal.status}</p>
                </div>
                {currentRehearsal.status === 'recording' && (
                  <button
                    onClick={() => handleAnalyzeRehearsal(currentRehearsal.id)}
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
                        Analyze Speech
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Previous Sessions */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Previous Sessions</h3>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white shadow sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">Session {session.id}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(session.created_at).toLocaleDateString()} • {session.duration && formatDuration(session.duration)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        session.status === 'analyzing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status}
                      </span>
                      {session.analysis && (
                        <span className={`text-lg font-bold ${getScoreColor(session.analysis.overall_score)}`}>
                          {session.analysis.overall_score}/100
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {session.analysis && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Pace</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">WPM:</span>
                            <span className="font-medium">{session.analysis.pace.words_per_minute}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.analysis.pace.status)}`}>
                            {session.analysis.pace.status}
                          </span>
                          <p className="text-xs text-gray-600">{session.analysis.pace.recommendation}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Clarity</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Fillers/min:</span>
                            <span className="font-medium">{session.analysis.clarity.filler_words_per_minute}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.analysis.clarity.status)}`}>
                            {session.analysis.clarity.status}
                          </span>
                          <p className="text-xs text-gray-600">{session.analysis.clarity.recommendation}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Confidence</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Volume var:</span>
                            <span className="font-medium">{session.analysis.confidence.volume_variation}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.analysis.confidence.status)}`}>
                            {session.analysis.confidence.status}
                          </span>
                          <p className="text-xs text-gray-600">{session.analysis.confidence.recommendation}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Engagement</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Pauses:</span>
                            <span className="font-medium">{session.analysis.engagement.pause_frequency}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.analysis.engagement.status)}`}>
                            {session.analysis.engagement.status}
                          </span>
                          <p className="text-xs text-gray-600">{session.analysis.engagement.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {sessions.length === 0 && (
          <div className="bg-white shadow sm:rounded-lg p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <p className="mt-4 text-sm text-gray-600">
              No rehearsal sessions yet. Start your first practice session above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
