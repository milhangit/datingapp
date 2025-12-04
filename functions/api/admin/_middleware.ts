import { PagesFunction } from "@cloudflare/workers-types";
import { verifyToken, Env } from "../../utils";

export const onRequest: PagesFunction<Env> = async (context) => {
    const request = context.request;
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = await verifyToken(token, context.env.JWT_SECRET);

        // Check if user is admin
        const db = context.env.DB;
        const user = await db.prepare("SELECT role FROM Users WHERE id = ?").bind(payload.sub).first();

        if (!user || user.role !== 'admin') {
            return new Response(JSON.stringify({ error: "Forbidden: Admin access only" }), { status: 403 });
        }

        // Pass user info to next handlers if needed, or just proceed
        return context.next();
    } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }
};
