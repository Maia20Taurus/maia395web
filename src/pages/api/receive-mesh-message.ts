export const prerender = false

import type { APIRoute } from "astro";
import { env } from 'cloudflare:workers';

/**
 * @param offset the offset in page numbers to retrieve messages from
 */
const PAGE_LENGTH = 6;
export const GET = (async ({ params, request }) => {
  const url = new URL(request.url);
  let query_offset = url.searchParams.get('offset');

  if (!query_offset && Number(query_offset) != 0) {
    return new Response("Invalid offset", {status:400});
  }
  const offset = Number(query_offset);

  const stub = env.MESHCHAT_SERVER_DO.getByName("foo");
  const messageRows = await stub.get_last_messages_with_offset(PAGE_LENGTH, offset*PAGE_LENGTH);

  return new Response(JSON.stringify(messageRows), {status:200});
}) satisfies APIRoute;