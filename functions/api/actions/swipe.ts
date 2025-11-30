import { Env, jsonResponse, errorResponse, getSession } from '../../utils';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    const session = await getSession(request, env);
    if (!session) return errorResponse('Unauthorized', 401);

    try {
        const { targetId, direction } = await request.json() as { targetId: number, direction: 'left' | 'right' };

        if (!targetId || !direction) return errorResponse('Invalid request');

        // Record Swipe
        await env.DB.prepare(
            'INSERT INTO Swipes (swiper_id, target_id, direction) VALUES (?, ?, ?)'
        ).bind(session.userId, targetId, direction).run();

        let isMatch = false;
        let matchId = null;

        if (direction === 'right') {
            // Check for match
            const otherSwipe = await env.DB.prepare(
                'SELECT * FROM Swipes WHERE swiper_id = ? AND target_id = ? AND direction = ?'
            ).bind(targetId, session.userId, 'right').first();

            if (otherSwipe) {
                isMatch = true;
                // Create Match
                const result = await env.DB.prepare(
                    'INSERT INTO Matches (user_id_1, user_id_2, status) VALUES (?, ?, ?)'
                ).bind(session.userId, targetId, 'matched').run();

                matchId = result.meta.last_row_id;

                // Create initial system message or chat room if needed
            }
        }

        return jsonResponse({ success: true, isMatch, matchId });

    } catch (e: any) {
        if (e.message && e.message.includes('UNIQUE constraint failed')) {
            return jsonResponse({ success: true, message: 'Already swiped' });
        }
        console.error(e);
        return errorResponse('Internal Server Error', 500);
    }
};
