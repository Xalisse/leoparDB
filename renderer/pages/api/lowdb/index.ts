import { JSONFilePreset } from 'lowdb/node'
import { ServerConnectionsInfosType } from '../../../interfaces/servers'

const getServersInfos = async (): Promise<ServerConnectionsInfosType[]> => {
    const defaultData: { servers: ServerConnectionsInfosType[] } = {
        servers: [],
    }
    const db = await JSONFilePreset('lowdbStorage/servers.json', defaultData)
    return db.data.servers
}

export default async function handler(req, res) {
    const {
        body: { type, host, port, username, password },
        method,
    } = req

    if (method === 'GET') {
        const databases = await getServersInfos()
        res.status(200).json(databases)
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
