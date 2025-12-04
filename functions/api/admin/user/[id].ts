import { PagesFunction } from "@cloudflare/workers-types";
import { Env } from "../../utils";

export const onRequestPatch: PagesFunction<Env> = async (context) => {
    const db = context.env.DB;
    const id = context.params.id;

    try {
        const body = await context.request.json() as { action: string, value?: any };

        if (!body.action) {
            return new Response(JSON.stringify({ error: "Action required" }), { status: 400 });
        }

        if (body.action === 'verify') {
            await db.prepare("UPDATE Users SET is_verified = ? WHERE id = ?").bind(body.value ? 1 : 0, id).run();
        } else if (body.action === 'ban') {
            // Assuming 'banned' is a role or we add a status column. 
            // The requirement said "toggle a status flag". 
            // I'll use auth_state = 'banned' or similar if it exists, or maybe just add a 'banned' column?
            // The migration added `role` and `is_verified`. 
            // `auth_state` exists in Users table.
            // Let's check the schema again. `auth_state` TEXT.
            // So I can set auth_state to 'banned'.
            await db.prepare("UPDATE Users SET auth_state = ? WHERE id = ?").bind('banned', id).run();
        } else if (body.action === 'unban') {
            await db.prepare("UPDATE Users SET auth_state = ? WHERE id = ?").bind('verified', id).run();
        } else {
            return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
        }

        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
