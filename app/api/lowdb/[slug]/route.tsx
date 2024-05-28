import { JSONFilePreset } from "lowdb/node"
import { ServerConnectionsInfosType } from "../../../interfaces/servers"

const removeServer = async (name: string) => {
    const defaultData: { servers: ServerConnectionsInfosType[] } = {
        servers: [],
    }
    const db = await JSONFilePreset('lowdbStorage/servers.json', defaultData)
    db.data.servers = db.data.servers.filter((server) => server.name !== name)
    console.log('🌿 ~ removeServer ~ db.data.servers:', db.data.servers)
    await db.write()
}

const modifyServer = async (name: string, values: ServerConnectionsInfosType) => {
    const defaultData: { servers: ServerConnectionsInfosType[] } = {
        servers: [],
    }
    const db = await JSONFilePreset('lowdbStorage/servers.json', defaultData)
    db.data.servers = db.data.servers.map((server) => {
        if (server.name === name) {
            return {
                ...server,
                ...values
            }
        }
        return server
    })
    await db.write()
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
    const name = params.slug
    await removeServer(name)
    return Response.json({ status: 'success' })
} 

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
    const name = params.slug
    const { name: newName, type, host, port, username, password } = await request.json()
    await modifyServer(name, { name: newName, type, host, port, username, password })
    return Response.json({ status: 'success' })
}
