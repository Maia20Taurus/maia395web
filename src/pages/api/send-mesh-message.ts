export const prerender = false

import type { APIRoute } from "astro";
import { env } from 'cloudflare:workers';

export const POST = (async ({ request }) => {
  const stub = env.MESHCHAT_SERVER_DO.getByName("foo");
  const body: JSON = await request.json();
  await stub.replicateMessage(body);
  return new Response(JSON.stringify(body), {status:200, headers:{"Content-Type":"application/json"}});
}) satisfies APIRoute;