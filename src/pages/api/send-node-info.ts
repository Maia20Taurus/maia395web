export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { MeshMessage, NodeInfo } from "../../Meshtastic";
import type { NodeInfoType, MeshMessageType } from "../../Meshtastic";
import type { ZodSafeParseResult } from "astro:schema";

export const POST = (async ({ request }) => {
  const data = await request.json();
  const result: ZodSafeParseResult<NodeInfoType> = NodeInfo.safeParse(data);
  if (!result.success) {
    return Response.json(result.error.issues, { status: 400 });
  }
  const body: NodeInfoType = result.data;

  const stub = env.MESHCHAT_SERVER_DO.getByName("foo");
  await stub.writeNodeInfo(body);
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}) satisfies APIRoute;
