export const prerender = false

import type { APIRoute } from "astro";
import { env } from 'cloudflare:workers';

/**
 * @param offset the offset in page numbers to retrieve messages from
 */
const PAGE_LENGTH = 10;
export const GET = (async ({ params, request }) => {
  const offset = Number(params.offset) || 0;

  const stub = env.MESHCHAT_SERVER_DO.getByName("foo");
  const messageRows = await stub.get_last_messages_with_offset(PAGE_LENGTH, offset*PAGE_LENGTH);

  return new Response(JSON.stringify(messageRows), {status:200});
}) satisfies APIRoute;