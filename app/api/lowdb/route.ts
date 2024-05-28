import { JSONFilePreset } from 'lowdb/node'
import { ServerConnectionsInfosType } from '../../interfaces/servers'
import { NextResponse } from 'next/server'

export const getServersInfos = async (): Promise<ServerConnectionsInfosType[]> => {
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

export async function GET() {
    const databases = await getServersInfos()
    return Response.json(databases)
}

export async function POST(request: Request) {
    const { name, type, host, port, username, password } = await request.json()
    await createServer({ name, type, host, port, username, password })
    return NextResponse.json({ message: 'success' }, {
        status: 201,
    })
}
