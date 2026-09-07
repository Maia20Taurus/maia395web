export const prerender = false

import type { APIRoute } from "astro";
import { env } from 'cloudflare:workers';

export const GET = (async ({ request }) => {
  const stub = env.MESHCHAT_SERVER_DO.getByName("foo");
  const messageRows = await stub.get_last_messages_with_offset(100, 0);

  return new Response(JSON.stringify(messageRows), {status:200});
}) satisfies APIRoute;