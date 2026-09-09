import * as z from "zod";

export const MeshMessage = z.object({
    nodeID: z.string(), // 9 chars
    rxTimestamp: z.coerce.number(), // unix timestamp
    message: z.string(), // up to 200 bytes
});
export type MeshMessageType = z.infer<typeof MeshMessage>;

export const NodeInfo = z.object({
    nodeID: z.string(), // 9 chars
    shortname: z.string().max(4), // up to 4 chars
    longname: z.string().max(36) // up to 36 chars
});
export type NodeInfoType = z.infer<typeof NodeInfo>;