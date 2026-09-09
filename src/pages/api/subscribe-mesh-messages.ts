export const prerender = false

import type { APIRoute } from "astro";
import { env } from 'cloudflare:workers';
import { MeshMessage, NodeInfo } from "../../Meshtastic";
import type { NodeInfoType, MeshMessageType } from "../../Meshtastic";
import type { ZodSafeParseResult } from "astro:schema";

export const GET = (async ({ request }) => {
  const stub = env.MESHCHAT_SERVER_DO.getByName("foo");
  return stub.fetch(request);
}) satisfies APIRoute;