import { PagesFunction } from "@cloudflare/workers-types";
import { Env } from "../../utils";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const db = context.env.DB;
    const url = new URL(context.request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    try {
        const { results } = await db.prepare(`
      SELECT u.id, u.msisdn, u.role, u.is_verified, p.full_name 
      FROM Users u 
      LEFT JOIN Profiles p ON u.id = p.user_id 
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();

        const total = await db.prepare("SELECT COUNT(*) as count FROM Users").first("count");

        return new Response(JSON.stringify({
            users: results,
            total,
            page,
            totalPages: Math.ceil((total as number) / limit)
        }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
