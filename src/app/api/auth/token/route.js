import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function GET(request) {
  try {
    // Create a mock response object that getAccessToken expects
    const response = new NextResponse();
    
    const { accessToken } = await getAccessToken(request, response);
    
    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Error getting access token:', error);
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
  }
}