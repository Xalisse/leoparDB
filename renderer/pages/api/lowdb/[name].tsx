import { JSONFilePreset } from "lowdb/node"
import { ServerConnectionsInfosType } from "../../../interfaces/servers"

const removeServer = async (name: string) => {
    const defaultData: { servers: ServerConnectionsInfosType[] } = {
        servers: [],
    }
    const db = await JSONFilePreset('lowdbStorage/servers.json', defaultData)
    db.data.servers = db.data.servers.filter((server) => server.name !== name)
    await db.write()
}


export default async function handler(req, res) {
    const {
        method,
    } = req
    const { name } = req.query

    if (req.method === 'DELETE') {
        await removeServer(name)
        res.status(200).end()
    } else {
        res.setHeader('Allow', ['DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
