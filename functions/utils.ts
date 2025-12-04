import { SignJWT, jwtVerify } from 'jose';
import { parse, serialize } from 'cookie';

export interface Env {
    DB: D1Database;
    JWT_SECRET: string;
    ENVIRONMENT: string;
}

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
};

export const errorResponse = (message: string, status = 400) => {
    return jsonResponse({ error: message }, status);
};

export const getSession = async (request: Request, env: Env) => {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return null;

    const cookies = parse(cookieHeader);
    const token = cookies['auth_token'];

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(env.JWT_SECRET || 'dev-secret-key');
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (e) {
        return null;
    }
};

export const createSessionCookie = async (userId: number, env: Env) => {
    const secret = new TextEncoder().encode(env.JWT_SECRET || 'dev-secret-key');
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30d')
        .sign(secret);

    return serialize('auth_token', token, {
        httpOnly: true,
        secure: env.ENVIRONMENT === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
};

export const verifyToken = async (token: string, secretKey: string) => {
    const secret = new TextEncoder().encode(secretKey || 'dev-secret-key');
    const { payload } = await jwtVerify(token, secret);
    return payload;
};
