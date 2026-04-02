'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';

const BACKEND_HTTP_URL = process.env.NEXT_PUBLIC_BACKEND_HTTP_URL || 'http://localhost:8000';

export function CameraControls(): Readonly<JSX.Element> {
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load email from localStorage
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      const email = globalThis.localStorage.getItem('userEmail') || '';
      setUserEmail(email);
    }
  }, []);

  const handleStart = async () => {
    if (!userEmail) {
      setError('Please register first to start the camera');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_HTTP_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: '0',
          owner_email: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start camera');
      }

      setRunning(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start camera');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_HTTP_URL}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to stop camera');
      }

      setRunning(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop camera');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-300 text-xs">{error}</p>
        </div>
      )}

      {userEmail && (
        <div className="p-3 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
          <p className="text-cyan-300 text-xs">Email: {userEmail}</p>
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={loading || running || !userEmail}
        className={clsx(
          'w-full py-2 px-4 rounded-lg font-medium transition-all duration-200',
          running || !userEmail
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-cyan-600 hover:bg-cyan-700 text-white',
          'focus:outline-none focus:ring-2 focus:ring-cyan-500',
          loading && 'opacity-50'
        )}
      >
        {loading && running === false ? 'Starting...' : 'Start camera'}
      </button>

      <button
        onClick={handleStop}
        disabled={loading || !running}
        className={clsx(
          'w-full py-2 px-4 rounded-lg font-medium transition-all duration-200',
          !running
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 text-white',
          'focus:outline-none focus:ring-2 focus:ring-red-500',
          loading && 'opacity-50'
        )}
      >
        {loading && running ? 'Stopping...' : 'Stop camera'}
      </button>

      {!userEmail && (
        <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
          <p className="text-amber-300 text-xs">
            <a href="/register" className="underline font-medium">
              Register first
            </a>{' '}
            to enable alerts
          </p>
        </div>
      )}
    </div>
  );
}
