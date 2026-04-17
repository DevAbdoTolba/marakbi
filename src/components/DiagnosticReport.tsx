'use client';

import { useState, useEffect } from 'react';
import { diagnoseConnection } from '@/lib/api';

interface DiagnosticResult {
  success: boolean;
  error?: string;
  errorType?: string;
  diagnostics?: { status: string; message: string; details: Record<string, unknown> };
  status?: number;
  data?: { status: string; message: string; details: Record<string, unknown> };
}

export default function DiagnosticReport() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRun, setAutoRun] = useState(true);

  useEffect(() => {
    if (autoRun) {
      runDiagnostics();
    }
  }, [autoRun]);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      console.log('🔍 Running comprehensive diagnostics...');
      const result = await diagnoseConnection();
      setDiagnostics(result);
    } catch (error) {
      console.error('❌ Diagnostics failed:', error);
      setDiagnostics({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: 'DiagnosticError'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  const getRecommendations = (result: DiagnosticResult) => {
    if (result.success) {
      return [
        '✅ Backend is running and accessible',
        '✅ CORS is properly configured',
        '✅ Network connectivity is working',
        '✅ Protocol compatibility is correct'
      ];
    }

    const recommendations = [];

    if (result.error?.includes('Failed to fetch')) {
      recommendations.push('🔧 Check if backend server is running on http://127.0.0.1:5000');
      recommendations.push('🔧 Verify the backend is accessible by visiting http://127.0.0.1:5000/client/home in browser');
    }

    if (result.error?.includes('CORS')) {
      recommendations.push('🔧 Add CORS middleware to your Python Flask backend');
      recommendations.push('🔧 Install flask-cors: pip install flask-cors');
      recommendations.push('🔧 Add CORS configuration to your Flask app');
    }

    if (result.diagnostics?.details?.isHttps && typeof result.diagnostics?.details?.baseUrl === 'string' && result.diagnostics.details.baseUrl.startsWith('http:')) {
      recommendations.push('🔧 Mixed content error: HTTPS page trying to fetch HTTP resource');
      recommendations.push('🔧 Solution: Change BASE_URL to HTTPS or run frontend on HTTP');
    }

    if (result.diagnostics?.details && !result.diagnostics.details.isLocalhost) {
      recommendations.push('🔧 Consider using localhost instead of 127.0.0.1 for better compatibility');
    }

    return recommendations;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🔍 Connection Diagnostics</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
              className="mr-2"
            />
            Auto-run on load
          </label>
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Running...' : 'Run Diagnostics'}
          </button>
        </div>
      </div>

      {diagnostics && (
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getStatusIcon(diagnostics.success)}</span>
              <span className={`text-lg font-medium ${getStatusColor(diagnostics.success)}`}>
                {diagnostics.success ? 'Connection Successful' : 'Connection Failed'}
              </span>
            </div>
            {diagnostics.status && (
              <p className="text-sm text-gray-600 mt-1">HTTP Status: {diagnostics.status}</p>
            )}
          </div>

          {/* Error Details */}
          {!diagnostics.success && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-red-800">Error Details</h3>
              <p className="text-red-700 mb-2">
                <strong>Error:</strong> {diagnostics.error}
              </p>
              {diagnostics.errorType && (
                <p className="text-red-700">
                  <strong>Type:</strong> {diagnostics.errorType}
                </p>
              )}
            </div>
          )}

          {/* System Information */}
          {diagnostics.diagnostics && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Backend URL:</strong> {String(diagnostics.diagnostics?.details?.baseUrl || 'N/A')}
                </div>
                <div>
                  <strong>Current Protocol:</strong> {String(diagnostics.diagnostics?.details?.currentProtocol || 'N/A')}
                </div>
                <div>
                  <strong>Current Host:</strong> {String(diagnostics.diagnostics?.details?.currentHost || 'N/A')}
                </div>
                <div>
                  <strong>Is HTTPS:</strong> {diagnostics.diagnostics?.details?.isHttps ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Is Localhost:</strong> {diagnostics.diagnostics?.details?.isLocalhost ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Timestamp:</strong> {diagnostics.diagnostics?.details?.timestamp ? new Date(String(diagnostics.diagnostics.details.timestamp)).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-yellow-800">Recommendations</h3>
            <ul className="space-y-1">
              {getRecommendations(diagnostics).map((rec, index) => (
                <li key={index} className="text-sm text-yellow-700">
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Python Backend CORS Fix */}
          {diagnostics.error?.includes('CORS') && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Python Backend CORS Fix</h3>
              <div className="bg-gray-800 text-green-400 p-4 rounded text-sm font-mono overflow-x-auto">
                <div># Install flask-cors</div>
                <div>pip install flask-cors</div>
                <div className="mt-2"># Add to your Flask app:</div>
                <div>from flask_cors import CORS</div>
                <div>from flask import Flask</div>
                <div className="mt-2">app = Flask(__name__)</div>
                <div>CORS(app)  # Enable CORS for all routes</div>
                <div className="mt-2"># Or configure specific origins:</div>
                <div>CORS(app, origins=[&apos;http://localhost:3000&apos;, &apos;http://127.0.0.1:3000&apos;])</div>
              </div>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Running diagnostics...</p>
        </div>
      )}
    </div>
  );
}
