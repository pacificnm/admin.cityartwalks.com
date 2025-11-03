import { handleAuth } from '@auth0/nextjs-auth0';

// Export handlers with async params support for Next.js 15
export async function GET(request, context) {
  // Await params and create new context
  const params = await context.params;
  const newContext = { ...context, params };
  
  const handlers = handleAuth();
  return handlers(request, newContext);
}

export async function POST(request, context) {
  // Await params and create new context
  const params = await context.params;
  const newContext = { ...context, params };
  
  const handlers = handleAuth();
  return handlers(request, newContext);
}