import { Env, jsonResponse, errorResponse, createSessionCookie } from '../../utils';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const { phoneNumber, otp } = await request.json() as { phoneNumber: string, otp: string };

        if (!phoneNumber || !otp) {
            return errorResponse('Phone number and OTP are required');
        }

        const normalizedPhone = phoneNumber.replace(/\D/g, '');

        // Verify OTP
        const stored = await env.DB.prepare(
            'SELECT * FROM VerificationCodes WHERE phone_number = ? AND code = ? AND expires_at > ? ORDER BY created_at DESC LIMIT 1'
        ).bind(normalizedPhone, otp, new Date().toISOString()).first();

        if (!stored) {
            return errorResponse('Invalid or expired OTP');
        }

        // Check if user exists, else create
        let user = await env.DB.prepare('SELECT * FROM Users WHERE msisdn = ?').bind(normalizedPhone).first();

        if (!user) {
            const result = await env.DB.prepare(
                'INSERT INTO Users (msisdn, auth_state, last_active) VALUES (?, ?, ?)'
            ).bind(normalizedPhone, 'verified', new Date().toISOString()).run();

            // Get the new user
            user = await env.DB.prepare('SELECT * FROM Users WHERE id = ?').bind(result.meta.last_row_id).first();

            // Create empty profile
            await env.DB.prepare(
                'INSERT INTO Profiles (user_id) VALUES (?)'
            ).bind(user.id).run();
        } else {
            // Update last active
            await env.DB.prepare('UPDATE Users SET last_active = ? WHERE id = ?').bind(new Date().toISOString(), user.id).run();
        }

        // Create Session
        const cookie = await createSessionCookie(user.id as number, env);

        const response = jsonResponse({ success: true, user });
        response.headers.append('Set-Cookie', cookie);

        return response;

    } catch (e) {
        console.error(e);
        return errorResponse('Internal Server Error', 500);
    }
};
