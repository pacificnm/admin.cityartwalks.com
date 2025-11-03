export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',').shift() || // If behind a proxy
    req.headers['x-real-ip'] || // Another common header for IP
    req.socket?.remoteAddress || // Direct connection IP
    '127.0.01' // Fallback in case no IP is found
  );
}
