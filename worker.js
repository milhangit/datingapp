import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const url = new URL(event.request.url);

  try {
    // Try to serve the requested asset
    const response = await getAssetFromKV(event, {
      mapRequestToAsset: req => {
        // For SPA routing - serve index.html for all routes
        const parsedUrl = new URL(req.url);
        const pathname = parsedUrl.pathname;

        // Serve actual files (js, css, images, etc.)
        if (pathname.match(/\.(js|css|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
          return req;
        }

        // For all other routes, serve index.html (SPA routing)
        parsedUrl.pathname = '/index.html';
        return new Request(parsedUrl.toString(), req);
      }
    });

    // Add security headers
    const headers = new Headers(response.headers);
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    });

  } catch (error) {
    // If asset not found, serve index.html
    try {
      const notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
      });

      return new Response(notFoundResponse.body, {
        status: 200,
        headers: notFoundResponse.headers,
      });
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  }
}
