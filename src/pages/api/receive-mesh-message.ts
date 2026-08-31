export const prerender = false

import type { APIRoute } from "astro";
import { env } from 'cloudflare:workers';

export const GET = (async ({ request }) => {
  const stub = env.MESHCHAT_SERVER_DO.getByName("foo");
  const messageRows = stub.getLastNMessages(100);
  console.log(messageRows)

  return new Response(null, {status:200});
}) satisfies APIRoute;