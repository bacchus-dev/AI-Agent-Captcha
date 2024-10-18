// src/app/api/verify/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface VerificationRequestBody {
  session_id: string;
  answer: string;
}

interface VerificationResponse {
  status: 'success' | 'failure';
}

export async function POST(request: NextRequest) {
  console.log('Received verification request');

  try {
    const body: VerificationRequestBody = await request.json();
    console.log('Verification request body:', JSON.stringify(body, null, 2));

    // Basic validation
    if (!body.session_id || !body.answer) {
      console.error('Missing session_id or answer in request body');
      return NextResponse.json(
        { error: 'Missing session_id or answer' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const apiKey = process.env.CAPTCHA_API_KEY; // Ensure this is set in .env.local
    if (!apiKey) {
      throw new Error('CAPTCHA_API_KEY is not set in environment variables.');
    }

    console.log(`Attempting to verify challenge with backend: ${backendUrl}/verify`);

    const response = await fetch(`${backendUrl}/verify`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      cache: 'no-store',
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response from backend:', errorData);
      throw new Error(`Failed to verify challenge with backend: ${response.status} ${response.statusText}`);
    }

    const data: VerificationResponse = await response.json();
    console.log('Verification response:', data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in /api/verify:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
