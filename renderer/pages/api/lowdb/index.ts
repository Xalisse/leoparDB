import { JSONFilePreset } from 'lowdb/node'
import { ServerConnectionsInfosType } from '../../../interfaces/servers'

const getServersInfos = async (): Promise<ServerConnectionsInfosType[]> => {
    const defaultData: { servers: ServerConnectionsInfosType[] } = {
        servers: [],
    }
    const db = await JSONFilePreset('lowdbStorage/servers.json', defaultData)
    return db.data.servers
}

const createServer = async (server: ServerConnectionsInfosType) => {
    const defaultData: { servers: ServerConnectionsInfosType[] } = {
        servers: [],
    }
    const db = await JSONFilePreset('lowdbStorage/servers.json', defaultData)
    db.data.servers.push(server)
    await db.write()
}

export default async function handler(req, res) {
    const {
        body: { name, type, host, port, username, password },
        method,
    } = req

    if (method === 'GET') {
        const databases = await getServersInfos()
        res.status(200).json(databases)
    } else if (method === 'POST') {
        await createServer({ name, type, host, port, username, password })
        res.status(201).json({ status: 'success' })
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
