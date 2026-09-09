import * as z from "zod";

const MeshMessage = z.object({
    nodeID: z.string(), // 9 chars
    rxTimestamp: z.coerce.number(), // unix timestamp
    message: z.string(), // up to 200 bytes
});
type MeshMessage = z.infer<MeshMessage>;

const NodeInfo = {
    nodeID: z.string(), // 9 chars
    shortname: z.string(), // up to 4 chars
    longname: z.string() // up to 36 chars
}
type NodeInfo = z.inf<NodeInfo>;