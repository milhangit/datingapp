import { PagesFunction } from "@cloudflare/workers-types";
import { Env } from "../../utils";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const db = context.env.DB;

    try {
        const userCount = await db.prepare("SELECT COUNT(*) as count FROM Users").first("count");
        const matchCount = await db.prepare("SELECT COUNT(*) as count FROM Matches WHERE status = 'matched'").first("count");
        // Placeholder for reports as table doesn't exist yet, or we can count blocked matches
        const reportCount = await db.prepare("SELECT COUNT(*) as count FROM Matches WHERE status = 'blocked'").first("count");

        return new Response(JSON.stringify({
            totalUsers: userCount,
            totalMatches: matchCount,
            totalReports: reportCount
        }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
