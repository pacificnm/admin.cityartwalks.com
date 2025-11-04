import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function GET(request) {
  try {
    // Create a mock response object that getAccessToken expects
    const response = new NextResponse();
    
    const tokenData = await getAccessToken(request, response);
    
    if (!tokenData?.accessToken) {
      return NextResponse.json({ error: 'No token available' }, { status: 401 });
    }

    // Decode JWT to get expiration (without verification - already trusted from Auth0)
    const decoded = jwt.decode(tokenData.accessToken);
    
    return NextResponse.json({
      accessToken: tokenData.accessToken,
      expiresAt: decoded?.exp,
      expiresIn: decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : null,
    });
  } catch (error) {
    console.error('Error getting access token:', error);
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
  }
}