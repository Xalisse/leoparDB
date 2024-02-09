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

const modifyServer = async (name: string, values: ServerConnectionsInfosType) => {
    const defaultData: { servers: ServerConnectionsInfosType[] } = {
        servers: [],
    }
    const db = await JSONFilePreset('lowdbStorage/servers.json', defaultData)
    db.data.servers = db.data.servers.map((server) => {
        if (server.name === name) {
            console.log('new values', {
                ...server,
                ...values
            })
            return {
                ...server,
                ...values
            }
        }
        return server
    })
    await db.write()
}


export default async function handler(req, res) {
    const {
        method,
        body
    } = req
    const { name } = req.query

    if (req.method === 'DELETE') {
        await removeServer(name)
        res.status(200).end()
    } else if (req.method === 'PUT') {
        const { name: newName, type, host, port, username, password } = body
        await modifyServer(name, { name: newName, type, host, port, username, password })
        res.status(200).end()
    }  else {
        res.setHeader('Allow', ['DELETE', 'PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
