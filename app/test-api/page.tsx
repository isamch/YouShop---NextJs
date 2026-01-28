'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    console.log('🔍 Testing API Connection...');
    console.log('API URL:', apiUrl);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@youshop.com',
          password: 'password123'
        })
      });

      console.log('✅ Response Status:', response.status);
      console.log('✅ Response OK:', response.ok);

      const data = await response.json();
      console.log('✅ Response Data:', data);

      setResult({
        status: response.status,
        ok: response.ok,
        data: data
      });
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);

      setResult({
        error: err.message,
        type: err.constructor.name,
        isCORS: err.message.includes('fetch') || err.message.includes('CORS')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          </div>
        </div>

        <Button
          onClick={testAPI}
          disabled={loading}
          size="lg"
          className="mb-6"
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </Button>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Error</h3>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Result</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>

            {result.isCORS && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                  🚨 CORS Error Detected
                </h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                  Your NestJS backend needs to enable CORS. Add this to your main.ts:
                </p>
                <pre className="bg-black/50 text-white p-3 rounded text-xs overflow-auto">
                  {`app.enableCors({
  origin: 'http://localhost:4000',
  credentials: true,
});`}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-muted/50 border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Troubleshooting Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Make sure your NestJS backend is running on port 3000</li>
            <li>Check if CORS is enabled in your backend</li>
            <li>Verify the API URL in .env.local file</li>
            <li>Check browser console for detailed errors</li>
            <li>Try accessing http://localhost:3000/api directly in browser</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
