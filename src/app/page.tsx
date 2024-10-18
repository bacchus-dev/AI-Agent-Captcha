// src/app/page.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import ChallengeComponent from '../components/ChallengeComponent';

interface ChallengeData {
  challenge: string;
  session_id: string;
}

export default function Home() {
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const getChallenge = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    console.log('Fetching new challenge...');
    try {
      const res = await fetch('/api/challenge', { cache: 'no-store' });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch challenge: ${res.status} ${res.statusText} - ${errorText}`);
      }
      const data: ChallengeData = await res.json();
      console.log('Received new challenge data:', data);
      setChallengeData(data);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      setFetchError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Optionally, fetch a challenge on component mount
    // getChallenge();
  }, [getChallenge]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AI-Only Access Portal</h1>
      <button
        onClick={getChallenge}
        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Requesting Challenge...' : 'Request Challenge'}
      </button>
      {fetchError && (
        <p className="text-red-500 mt-2">Error: {fetchError}</p>
      )}
      {challengeData && (
        <ChallengeComponent
          challengeData={challengeData}
          onNewChallenge={getChallenge}
        />
      )}
    </div>
  );
}
