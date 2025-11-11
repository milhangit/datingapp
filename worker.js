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
    } else if (path.startsWith('/api/hearts/') && method === 'GET') {
      const userId = path.split('/')[3];
      response = await getHearts(userId, env.DB);
    } else if (path === '/api/messages' && method === 'POST') {
      response = await sendMessage(request, env.DB);
    } else if (path.startsWith('/api/messages/') && method === 'GET') {
      const userId = path.split('/')[3];
      const partnerId = path.split('/')[4];
      response = await getMessages(userId, partnerId, env.DB);
    }
    // Admin routes
    else if (path === '/api/admin/login' && method === 'POST') {
      response = await adminLogin(request, env.DB);
    } else if (path === '/api/admin/users' && method === 'GET') {
      response = await adminGetAllUsers(env.DB);
    } else if (path.startsWith('/api/admin/users/') && path.endsWith('/block') && method === 'POST') {
      const userId = path.split('/')[4];
      response = await adminBlockUser(request, userId, env.DB);
    } else if (path.startsWith('/api/admin/users/') && method === 'PUT') {
      const userId = path.split('/')[4];
      response = await adminUpdateUser(request, userId, env.DB);
    } else if (path.startsWith('/api/admin/users/') && method === 'DELETE') {
      const userId = path.split('/')[4];
      response = await adminDeleteUser(userId, env.DB);
    } else if (path.startsWith('/api/admin/users/') && method === 'GET') {
      const userId = path.split('/')[4];
      response = await adminGetUserDetails(userId, env.DB);
    } else if (path === '/api/admin/users' && method === 'POST') {
      response = await adminCreateUser(request, env.DB);
    } else if (path === '/api/admin/analytics' && method === 'GET') {
      response = await adminGetAnalytics(env.DB);
    } else if (path === '/api/admin/matches' && method === 'GET') {
      response = await adminGetAllMatches(env.DB);
    } else if (path === '/api/admin/messages' && method === 'GET') {
      response = await adminGetAllMessages(env.DB);
    } else if (path.startsWith('/api/admin/messages/') && method === 'GET') {
      const parts = path.split('/');
      const userId1 = parts[4];
      const userId2 = parts[5];
      response = await getMessages(userId1, userId2, env.DB);
    } else if (path === '/api/admin/reports' && method === 'GET') {
      response = await adminGetReports(env.DB);
    } else if (path.startsWith('/api/admin/reports/') && method === 'PUT') {
      const reportId = path.split('/')[4];
      response = await adminUpdateReport(request, reportId, env.DB);
    } else if (path === '/api/admin/swipes' && method === 'GET') {
      response = await adminGetAllSwipes(env.DB);
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

  return users;
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

      return { match: true };
    }
  }

  return { match: false };
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

  return matches;
}

// Get hearts/likes received by a user
async function getHearts(userId, DB) {
  // Get count of right swipes (hearts) the user received
  const countResult = await DB.prepare(`
    SELECT COUNT(*) as count FROM swipes
    WHERE targetUserId = ? AND direction = 'right'
  `).bind(userId).first();

  // Get users who swiped right on this user
  const usersResult = await DB.prepare(`
    SELECT u.* FROM users u
    INNER JOIN swipes s ON u.id = s.userId
    WHERE s.targetUserId = ? AND s.direction = 'right'
  `).bind(userId).all();

  const users = usersResult.results.map(user => ({
    ...user,
    interests: user.interests ? JSON.parse(user.interests) : []
  }));

  return {
    count: countResult.count,
    users: users
  };
}

// Send a message
async function sendMessage(request, DB) {
  const { senderId, recipientId, message } = await request.json();

  const result = await DB.prepare(`
    INSERT INTO messages (senderId, recipientId, message)
    VALUES (?, ?, ?)
  `).bind(senderId, recipientId, message).run();

  // Get the created message
  const createdMessage = await DB.prepare(`
    SELECT * FROM messages WHERE id = ?
  `).bind(result.meta.last_row_id).first();

  return createdMessage;
}

// Get messages between two users
async function getMessages(userId, partnerId, DB) {
  const result = await DB.prepare(`
    SELECT * FROM messages
    WHERE (senderId = ? AND recipientId = ?)
       OR (senderId = ? AND recipientId = ?)
    ORDER BY createdAt ASC
  `).bind(userId, partnerId, partnerId, userId).all();

  return result.results;
}

// ========== ADMIN FUNCTIONS ==========

// Hash password using Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Admin login with database authentication
async function adminLogin(request, DB) {
  const { username, password } = await request.json();

  // Get admin from database
  const admin = await DB.prepare('SELECT * FROM admins WHERE username = ?')
    .bind(username)
    .first();

  if (!admin) {
    throw new Error('Invalid admin credentials');
  }

  // Hash the provided password and compare
  const passwordHash = await hashPassword(password);

  if (passwordHash !== admin.passwordHash) {
    throw new Error('Invalid admin credentials');
  }

  // Update last login
  await DB.prepare('UPDATE admins SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(admin.id)
    .run();

  return {
    success: true,
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    }
  };
}

// Get all users for admin
async function adminGetAllUsers(DB) {
  const result = await DB.prepare('SELECT * FROM users ORDER BY createdAt DESC').all();

  const users = result.results.map(user => ({
    ...user,
    interests: user.interests ? JSON.parse(user.interests) : []
  }));

  return users;
}

// Get user details
async function adminGetUserDetails(userId, DB) {
  const user = await DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();

  if (user && user.interests) {
    user.interests = JSON.parse(user.interests);
  }

  return user;
}

// Create new user (admin)
async function adminCreateUser(request, DB) {
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
    data.name, data.email, data.password || 'password123', data.gender, data.age, data.dateOfBirth,
    data.religion, data.caste || '', data.height || '', data.bodyType || '', data.complexion || '',
    data.education, data.occupation, data.income || '', data.city, data.state || '', data.country || '',
    data.motherTongue || '', data.diet || '', data.smoking || '', data.drinking || '',
    data.familyType || '', data.familyValues || '', JSON.stringify(data.interests || []),
    data.bio || '', data.photo || 'https://via.placeholder.com/600'
  ).run();

  const user = await DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(result.meta.last_row_id)
    .first();

  if (user.interests) {
    user.interests = JSON.parse(user.interests);
  }

  return { success: true, user };
}

// Update user (admin)
async function adminUpdateUser(request, userId, DB) {
  const data = await request.json();

  await DB.prepare(`
    UPDATE users SET
      name = ?, email = ?, gender = ?, age = ?, dateOfBirth = ?, religion = ?,
      caste = ?, height = ?, bodyType = ?, complexion = ?, education = ?,
      occupation = ?, income = ?, city = ?, state = ?, country = ?,
      motherTongue = ?, diet = ?, smoking = ?, drinking = ?, familyType = ?,
      familyValues = ?, interests = ?, bio = ?, photo = ?
    WHERE id = ?
  `).bind(
    data.name, data.email, data.gender, data.age, data.dateOfBirth,
    data.religion, data.caste || '', data.height || '', data.bodyType || '',
    data.complexion || '', data.education, data.occupation, data.income || '',
    data.city, data.state || '', data.country || '', data.motherTongue || '',
    data.diet || '', data.smoking || '', data.drinking || '', data.familyType || '',
    data.familyValues || '', JSON.stringify(data.interests || []), data.bio || '',
    data.photo || 'https://via.placeholder.com/600', userId
  ).run();

  const user = await DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();

  if (user && user.interests) {
    user.interests = JSON.parse(user.interests);
  }

  return { success: true, user };
}

// Block/Unblock user
async function adminBlockUser(request, userId, DB) {
  const { blocked } = await request.json();

  await DB.prepare(`
    UPDATE users SET blocked = ? WHERE id = ?
  `).bind(blocked ? 1 : 0, userId).run();

  return { success: true, message: `User ${blocked ? 'blocked' : 'unblocked'} successfully` };
}

// Delete user
async function adminDeleteUser(userId, DB) {
  // Delete user's swipes
  await DB.prepare('DELETE FROM swipes WHERE userId = ? OR targetUserId = ?').bind(userId, userId).run();

  // Delete user's matches
  await DB.prepare('DELETE FROM matches WHERE user1Id = ? OR user2Id = ?').bind(userId, userId).run();

  // Delete user's messages
  await DB.prepare('DELETE FROM messages WHERE senderId = ? OR recipientId = ?').bind(userId, userId).run();

  // Delete user
  await DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();

  return { success: true, message: 'User deleted successfully' };
}

// Get analytics
async function adminGetAnalytics(DB) {
  const [totalUsers, totalMatches, totalMessages, totalSwipes] = await Promise.all([
    DB.prepare('SELECT COUNT(*) as count FROM users').first(),
    DB.prepare('SELECT COUNT(*) as count FROM matches').first(),
    DB.prepare('SELECT COUNT(*) as count FROM messages').first(),
    DB.prepare('SELECT COUNT(*) as count FROM swipes').first(),
  ]);

  const [maleUsers, femaleUsers, blockedUsers] = await Promise.all([
    DB.prepare("SELECT COUNT(*) as count FROM users WHERE gender = 'Male'").first(),
    DB.prepare("SELECT COUNT(*) as count FROM users WHERE gender = 'Female'").first(),
    DB.prepare('SELECT COUNT(*) as count FROM users WHERE blocked = 1').first(),
  ]);

  // Get recent activity (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [newThisWeek, matchesThisWeek] = await Promise.all([
    DB.prepare('SELECT COUNT(*) as count FROM users WHERE createdAt >= ?').bind(weekAgo).first(),
    DB.prepare('SELECT COUNT(*) as count FROM matches WHERE createdAt >= ?').bind(weekAgo).first(),
  ]);

  // Get today's activity
  const today = new Date().toISOString().split('T')[0];
  const activeToday = await DB.prepare('SELECT COUNT(*) as count FROM users WHERE createdAt >= ?').bind(today).first();

  return {
    totalUsers: totalUsers.count,
    totalMatches: totalMatches.count,
    totalMessages: totalMessages.count,
    totalSwipes: totalSwipes.count,
    maleUsers: maleUsers.count,
    femaleUsers: femaleUsers.count,
    blockedUsers: blockedUsers.count,
    newThisWeek: newThisWeek.count,
    matchesThisWeek: matchesThisWeek.count,
    activeToday: activeToday.count,
  };
}

// Get all matches
async function adminGetAllMatches(DB) {
  const result = await DB.prepare('SELECT * FROM matches ORDER BY createdAt DESC').all();
  return result.results;
}

// Get all messages
async function adminGetAllMessages(DB) {
  const result = await DB.prepare('SELECT * FROM messages ORDER BY createdAt DESC').all();
  return result.results;
}

// Get all reports
async function adminGetReports(DB) {
  // First create reports table if it doesn't exist
  await DB.prepare(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reporterId INTEGER NOT NULL,
      reportedUserId INTEGER NOT NULL,
      reason TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reporterId) REFERENCES users(id),
      FOREIGN KEY (reportedUserId) REFERENCES users(id)
    )
  `).run();

  const result = await DB.prepare('SELECT * FROM reports ORDER BY createdAt DESC').all();
  return result.results;
}

// Update report status
async function adminUpdateReport(request, reportId, DB) {
  const { status } = await request.json();

  await DB.prepare(`
    UPDATE reports SET status = ? WHERE id = ?
  `).bind(status, reportId).run();

  return { success: true, message: 'Report updated successfully' };
}

// Get all swipes
async function adminGetAllSwipes(DB) {
  const result = await DB.prepare('SELECT * FROM swipes ORDER BY createdAt DESC LIMIT 1000').all();
  return result.results;
}

// Serve static assets
async function serveAsset(request, env, ctx) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // For SPA routing - serve index.html for non-asset routes
    let assetRequest = request;

    // If it's not a file with extension, serve index.html
    if (!pathname.match(/\.(js|css|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|txt|map|LICENSE)$/)) {
      assetRequest = new Request(`${url.origin}/index.html`, request);
    }

    const response = await env.ASSETS.fetch(assetRequest);

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
    // If asset not found, try serving index.html for SPA
    try {
      const indexRequest = new Request(`${url.origin}/index.html`, request);
      const indexResponse = await env.ASSETS.fetch(indexRequest);

      return new Response(indexResponse.body, {
        status: 200,
        headers: indexResponse.headers,
      });
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  }
}
