import React, { useState, useEffect, useRef } from 'react';

interface ChallengeData {
  challenge: string;
  session_id: string;
}

interface Props {
  challengeData: ChallengeData;
  onNewChallenge: () => void;
}

enum VerificationStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILURE = 'failure',
  ERROR = 'error',
}

const ChallengeComponent: React.FC<Props> = ({ challengeData, onNewChallenge }) => {
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const hasVerified = useRef<boolean>(false);

  useEffect(() => {
    const verifyChallenge = async () => {
      console.log(`Starting verification for session_id: ${challengeData.session_id}`);
      setStatus(VerificationStatus.PROCESSING);
      setError(null);
      setProgress(0);

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prevProgress) => {
            const newProgress = prevProgress + 10;
            return newProgress > 90 ? 90 : newProgress;
          });
        }, 500);

        // Process the challenge
        const agentResponse = await processChallenge(challengeData.challenge);
        console.log(`Agent response for session_id ${challengeData.session_id}:`, agentResponse);

        // Send verification request to backend via proxy
        const res = await fetch('/api/verify', {
          method: 'POST',
          body: JSON.stringify({
            session_id: challengeData.session_id,
            answer: agentResponse,
          }),
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        clearInterval(progressInterval);
        setProgress(100);

        console.log(`Verification response status for session_id ${challengeData.session_id}:`, res.status);

        const data = await res.json();
        console.log(`Verification response data for session_id ${challengeData.session_id}:`, data);

        if (!res.ok) {
          throw new Error(data.detail || 'Failed to verify challenge');
        }

        if (data.status === 'success') {
          setStatus(VerificationStatus.SUCCESS);
          console.log(`Verification successful for session_id: ${challengeData.session_id}`);
        } else {
          setStatus(VerificationStatus.FAILURE);
          console.warn(`Verification failed for session_id: ${challengeData.session_id}`);
        }

      } catch (error) {
        console.error(`Error processing verification for session_id ${challengeData.session_id}:`, error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setStatus(VerificationStatus.ERROR);
      } finally {
        hasVerified.current = true; // Mark as verified to prevent re-verification
      }
    };

    if (!hasVerified.current) {
      verifyChallenge();
    }

    // Reset verification flag when challengeData changes
    return () => {
      hasVerified.current = false;
    };
  }, [challengeData]);

  const processChallenge = async (challenge: string): Promise<string> => {
    try {
      // Decode the Base64-encoded challenge data to Uint8Array
      const decodedChallenge = atob(challenge);
      const challengeArray = Uint8Array.from(decodedChallenge, (c) => c.charCodeAt(0));

      // Convert Uint8Array to BigInt
      const challengeHex = Array.from(challengeArray)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const challengeNumber = BigInt(`0x${challengeHex}`);

      console.log(`Decoded challenge number: ${challengeNumber}`);

      // Perform the computation using the mathematical formula
      const n = challengeNumber;
      const expectedResult = (n * (n + BigInt(1)) * (BigInt(2) * n + BigInt(1))) / BigInt(6);

      console.log(`Computed expected result: ${expectedResult}`);

      // Convert the result BigInt to Uint8Array
      const expectedHex = expectedResult.toString(16);
      const hexArray = expectedHex.length % 2 ? '0' + expectedHex : expectedHex;
      const resultArray = Uint8Array.from(
        hexArray.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
      );

      // Encode Uint8Array to Base64
      const resultString = String.fromCharCode(...resultArray);
      const resultBase64 = btoa(resultString);

      console.log(`Encoded expected result to Base64: ${resultBase64}`);

      return resultBase64;
    } catch (error) {
      console.error('Error processing challenge:', error);
      throw new Error('Failed to process challenge');
    }
  };

  const renderContent = () => {
    switch (status) {
      case VerificationStatus.PROCESSING:
        return (
          <div className="space-y-4">
            <p className="text-blue-500 font-semibold">Verifying...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        );
      case VerificationStatus.SUCCESS:
        return (
          <p className="text-green-500 font-semibold">
            Verification Successful: You have passed the AI verification.
          </p>
        );
      case VerificationStatus.FAILURE:
        return (
          <div className="space-y-4">
            <p className="text-red-500 font-semibold">
              Verification Failed: The provided answer did not match the expected result.
            </p>
            <button
              onClick={onNewChallenge}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        );
      case VerificationStatus.ERROR:
        return (
          <div className="space-y-4">
            <p className="text-red-500 font-semibold">
              Error: {error || 'An unknown error occurred during verification.'}
            </p>
            <button
              onClick={onNewChallenge}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">AI Verification Challenge</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default ChallengeComponent;