export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { MeshMessage, NodeInfo } from "../../Meshtastic";
import type { NodeInfoType, MeshMessageType } from "../../Meshtastic";
import type { ZodSafeParseResult } from "astro:schema";

export const POST = (async ({ request }) => {
  const stub = env.MESHCHAT_SERVER_DO.getByName("foo");
  const body: MeshMessageType = await request.json();
  await stub.replicateMessage(body);
  await stub.saveMessage(body);
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}) satisfies APIRoute;
