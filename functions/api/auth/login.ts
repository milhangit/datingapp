import { Env, generateOTP, jsonResponse, errorResponse } from '../../utils';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const { phoneNumber } = await request.json() as { phoneNumber: string };

        if (!phoneNumber) {
            return errorResponse('Phone number is required');
        }

        // Normalize phone number (basic)
        const normalizedPhone = phoneNumber.replace(/\D/g, '');

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 mins

        // Store in DB
        await env.DB.prepare(
            'INSERT INTO VerificationCodes (phone_number, code, expires_at) VALUES (?, ?, ?)'
        ).bind(normalizedPhone, otp, expiresAt).run();

        // In production, send SMS via Twilio/etc.
        // For dev, return it in response (or log it)
        console.log(`OTP for ${normalizedPhone}: ${otp}`);

        return jsonResponse({
            success: true,
            message: 'OTP sent',
            dev_otp: env.ENVIRONMENT !== 'production' ? otp : undefined
        });

    } catch (e) {
        return errorResponse('Internal Server Error', 500);
    }
};
