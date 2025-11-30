import { Env, jsonResponse, errorResponse, getSession } from '../../utils';

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const session = await getSession(request, env);
  if (!session) return errorResponse('Unauthorized', 401);
  
  const profileId = params.id;
  
  try {
    const profile = await env.DB.prepare(
      'SELECT * FROM Profiles WHERE user_id = ?'
    ).bind(profileId).first();
    
    if (!profile) return errorResponse('Profile not found', 404);
    
    return jsonResponse({
      ...profile,
      photos: JSON.parse(profile.photos as string || '[]'),
      preferences: JSON.parse(profile.preferences as string || '{}')
    });
    
  } catch (e) {
    return errorResponse('Internal Server Error', 500);
  }
};
