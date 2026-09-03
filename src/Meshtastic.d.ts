type MeshMessage = {
    nodeID: string, // 9 chars
    rxTimestamp: number, // unix timestamp
    message: string, // up to 200 bytes
    nodeInfo: NodeInfo | null
}

type NodeInfo = {
    nodeID: string, // 9 chars
    shortname: string, // up to 4 chars
    longname: string // up to 36 chars
}