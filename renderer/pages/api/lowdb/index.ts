import { JSONFilePreset } from 'lowdb/node'

type DatabaseConnectionsInfosType = {
    databases: {
        name: string
        type: 'mysql'
        host: string
        port: number
        username: string
        password: string
    }[]
}

const getServersInfos = async (): Promise<DatabaseConnectionsInfosType> => {
    const defaultData: DatabaseConnectionsInfosType = { databases: [] }
    const db = await JSONFilePreset('lowdbStorage/settings.json', defaultData)
    return db.data
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
