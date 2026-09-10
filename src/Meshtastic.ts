import * as z from "zod";

const meshRegistry = z.registry<{ description: string }>();

const nodeID = z.string().meta({description:"The ID of the node that sent the message"});

export const MeshMessage = z.object({
  nodeID,
  rxTimestamp: z.coerce.number().meta({description:"The unix timestamp of the time the message was received"}), // unix timestamp
  message: z.string().meta({description:"The text sent by the node"}), // up to 200 bytes
});
meshRegistry.add(MeshMessage, {description:"A message sent by a node over the mesh"});
export type MeshMessageType = z.infer<typeof MeshMessage>;

export const NodeInfo = z.object({
  nodeID,
  shortname: z.string().max(4), // up to 4 chars
  longname: z.string().max(36), // up to 36 chars
});
meshRegistry.add(NodeInfo, {description:"The identifiers of a node"})
export type NodeInfoType = z.infer<typeof NodeInfo>;