import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API Routes
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, env);
    }

    // Serve static assets
    return serveAsset(request, env, ctx);
  }
};

// API Handler
async function handleAPI(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let response;

    // Routes
    if (path === '/api/register' && method === 'POST') {
      response = await registerUser(request, env.DB);
    } else if (path === '/api/login' && method === 'POST') {
      response = await loginUser(request, env.DB);
    } else if (path === '/api/users' && method === 'GET') {
      response = await getUsers(env.DB);
    } else if (path === '/api/swipe' && method === 'POST') {
      response = await recordSwipe(request, env.DB);
    } else if (path.startsWith('/api/matches/') && method === 'GET') {
      const userId = path.split('/')[3];
      response = await getMatches(userId, env.DB);
    } else if (path === '/api/messages' && method === 'POST') {
      response = await sendMessage(request, env.DB);
    } else if (path.startsWith('/api/messages/') && method === 'GET') {
      const userId = path.split('/')[3];
      const partnerId = path.split('/')[4];
      response = await getMessages(userId, partnerId, env.DB);
    } else {
      response = { error: 'Not found' };
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// User Registration
async function registerUser(request, DB) {
  const data = await request.json();

  // Check if email already exists
  const existing = await DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(data.email)
    .first();

  if (existing) {
    throw new Error('Email already registered');
  }

  const result = await DB.prepare(`
    INSERT INTO users (name, email, password, gender, age, dateOfBirth, religion, caste,
      height, bodyType, complexion, education, occupation, income, city, state, country,
      motherTongue, diet, smoking, drinking, familyType, familyValues, interests, bio, photo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.name, data.email, data.password, data.gender, data.age, data.dateOfBirth,
    data.religion, data.caste, data.height, data.bodyType, data.complexion,
    data.education, data.occupation, data.income, data.city, data.state, data.country,
    data.motherTongue, data.diet, data.smoking, data.drinking, data.familyType,
    data.familyValues, JSON.stringify(data.interests), data.bio, data.photo
  ).run();

  const user = await DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(result.meta.last_row_id)
    .first();

  // Parse interests back to array
  if (user.interests) {
    user.interests = JSON.parse(user.interests);
  }

  return { success: true, user };
}

// User Login
async function loginUser(request, DB) {
  const { email, password } = await request.json();

  const user = await DB.prepare('SELECT * FROM users WHERE email = ? AND password = ?')
    .bind(email, password)
    .first();

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Parse interests
  if (user.interests) {
    user.interests = JSON.parse(user.interests);
  }

  return { success: true, user };
}

// Get all users (for browsing)
async function getUsers(DB) {
  const result = await DB.prepare('SELECT * FROM users').all();

  // Parse interests for each user
  const users = result.results.map(user => ({
    ...user,
    interests: user.interests ? JSON.parse(user.interests) : []
  }));

  return { success: true, users };
}

// Record a swipe
async function recordSwipe(request, DB) {
  const { userId, targetUserId, direction } = await request.json();

  // Record the swipe
  await DB.prepare(`
    INSERT OR REPLACE INTO swipes (userId, targetUserId, direction)
    VALUES (?, ?, ?)
  `).bind(userId, targetUserId, direction).run();

  // Check for mutual match (both swiped right)
  if (direction === 'right') {
    const mutualSwipe = await DB.prepare(`
      SELECT * FROM swipes
      WHERE userId = ? AND targetUserId = ? AND direction = 'right'
    `).bind(targetUserId, userId).first();

    if (mutualSwipe) {
      // Create match
      await DB.prepare(`
        INSERT OR IGNORE INTO matches (user1Id, user2Id)
        VALUES (?, ?)
      `).bind(Math.min(userId, targetUserId), Math.max(userId, targetUserId)).run();

      return { success: true, matched: true };
    }
  }

  return { success: true, matched: false };
}

// Get matches for a user
async function getMatches(userId, DB) {
  const result = await DB.prepare(`
    SELECT u.* FROM users u
    INNER JOIN matches m ON (u.id = m.user1Id OR u.id = m.user2Id)
    WHERE (m.user1Id = ? OR m.user2Id = ?) AND u.id != ?
  `).bind(userId, userId, userId).all();

  const matches = result.results.map(user => ({
    ...user,
    interests: user.interests ? JSON.parse(user.interests) : []
  }));

  return { success: true, matches };
}

// Send a message
async function sendMessage(request, DB) {
  const { senderId, recipientId, message } = await request.json();

  await DB.prepare(`
    INSERT INTO messages (senderId, recipientId, message)
    VALUES (?, ?, ?)
  `).bind(senderId, recipientId, message).run();

  return { success: true };
}

// Get messages between two users
async function getMessages(userId, partnerId, DB) {
  const result = await DB.prepare(`
    SELECT * FROM messages
    WHERE (senderId = ? AND recipientId = ?)
       OR (senderId = ? AND recipientId = ?)
    ORDER BY createdAt ASC
  `).bind(userId, partnerId, partnerId, userId).all();

  return { success: true, messages: result.results };
}

// Serve static assets
async function serveAsset(request, env, ctx) {
  try {
    const response = await getAssetFromKV(
      { request, waitUntil: ctx.waitUntil.bind(ctx) },
      {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST),
        mapRequestToAsset: req => {
          const parsedUrl = new URL(req.url);
          const pathname = parsedUrl.pathname;

          // Serve actual files
          if (pathname.match(/\.(js|css|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
            return req;
          }

          // For all other routes, serve index.html (SPA routing)
          parsedUrl.pathname = '/index.html';
          return new Request(parsedUrl.toString(), req);
        }
      }
    );

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
    try {
      const notFoundResponse = await getAssetFromKV(
        { request, waitUntil: ctx.waitUntil.bind(ctx) },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST),
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
        }
      );

      return new Response(notFoundResponse.body, {
        status: 200,
        headers: notFoundResponse.headers,
      });
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  }
}
