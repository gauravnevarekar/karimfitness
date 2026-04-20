/**
 * Example serverless handler for Vite dev proxy / edge runtime.
 * Validate caller network by public IP CIDR match.
 */
import ipaddr from 'ipaddr.js';

const allowedRanges = (process.env.VITE_GYM_ALLOWED_CIDRS || '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean);

function ipInCidr(ip, cidr) {
  const [range, bits] = cidr.split('/');
  const addr = ipaddr.parse(ip);
  const net = ipaddr.parse(range);
  return addr.match(net, Number(bits));
}

export async function GET(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (!ip) return Response.json({ allowed: false });
  const allowed = allowedRanges.some((cidr) => ipInCidr(ip, cidr));
  return Response.json({ allowed });
}
