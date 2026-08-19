export const dynamic = "force-dynamic";

export function GET() {
  const body = `User-agent: *
Disallow: /admin
Disallow: /demo
Allow: /
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
