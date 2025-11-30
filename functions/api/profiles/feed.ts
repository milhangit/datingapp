import { Env, jsonResponse, errorResponse, getSession } from '../../utils';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
    const session = await getSession(request, env);
    if (!session) return errorResponse('Unauthorized', 401);

    try {
        // Get current user's preferences
        const currentUserProfile = await env.DB.prepare(
            'SELECT * FROM Profiles WHERE user_id = ?'
        ).bind(session.userId).first();

        // Basic feed logic:
        // 1. Exclude self
        // 2. Exclude already swiped users
        // 3. (Optional) Filter by gender/preferences

        const query = `
      SELECT p.*, u.last_active 
      FROM Profiles p
      JOIN Users u ON p.user_id = u.id
      WHERE p.user_id != ?
      AND p.user_id NOT IN (
        SELECT target_id FROM Swipes WHERE swiper_id = ?
      )
      LIMIT 20
    `;

        const { results } = await env.DB.prepare(query)
            .bind(session.userId, session.userId)
            .all();

        // Parse JSON fields
        const profiles = results.map(p => ({
            ...p,
            photos: JSON.parse(p.photos as string || '[]'),
            preferences: JSON.parse(p.preferences as string || '{}')
        }));

        return jsonResponse({ profiles });

    } catch (e) {
        console.error(e);
        return errorResponse('Internal Server Error', 500);
    }
};
