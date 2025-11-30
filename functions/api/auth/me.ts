import { Env, jsonResponse, errorResponse, getSession } from '../../utils';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
    const session = await getSession(request, env);

    if (!session) {
        return errorResponse('Unauthorized', 401);
    }

    const user = await env.DB.prepare('SELECT * FROM Users WHERE id = ?').bind(session.userId).first();
    const profile = await env.DB.prepare('SELECT * FROM Profiles WHERE user_id = ?').bind(session.userId).first();

    if (!user) {
        return errorResponse('User not found', 404);
    }

    return jsonResponse({ user, profile });
};
