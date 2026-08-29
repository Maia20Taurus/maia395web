export const prerender = false

import type { APIRoute } from "astro";
import { env } from 'cloudflare:workers';

export const POST = (async ({ request }) => {
  const stub = env.MESHCHAT_SERVER_DO.getByName("foo");
  return stub.replicateMessage(request.body.message);
}) satisfies APIRoute;