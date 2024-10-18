// src/app/api/challenge/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  console.log('Received request for challenge');

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const apiKey = process.env.CAPTCHA_API_KEY; // Ensure this is set in .env.local
    if (!apiKey) {
      throw new Error('CAPTCHA_API_KEY is not set in environment variables.');
    }

    console.log(`Attempting to fetch challenge from backend: ${backendUrl}/challenge`);

    const response = await fetch(`${backendUrl}/challenge`, {
      headers: {
        'x-api-key': apiKey,
      },
      cache: 'no-store',
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response from backend:', errorData);
      throw new Error(`Failed to fetch challenge from backend: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully received challenge data');

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error in /api/challenge:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
