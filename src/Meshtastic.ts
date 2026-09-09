import * as z from "zod";

export const MeshMessage = z.object({
    nodeID: z.string(), // 9 chars
    rxTimestamp: z.coerce.number(), // unix timestamp
    message: z.string(), // up to 200 bytes
});
export type MeshMessage = z.infer<typeof MeshMessage>;

export const NodeInfo = z.object({
    nodeID: z.string(), // 9 chars
    shortname: z.string(), // up to 4 chars
    longname: z.string() // up to 36 chars
});
export type NodeInfo = z.infer<typeof NodeInfo>;