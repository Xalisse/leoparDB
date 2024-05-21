import axios from 'axios'
import { ServerConnectionsInfosType } from '../../interfaces/servers'

const addServer = async ({
    name,
    type,
    host,
    port,
    username,
    password,
}: ServerConnectionsInfosType): Promise<{ status: number; data: any }> => {
    const res = await axios.post('/api/lowdb', {
        name,
        type,
        host,
        port,
        username,
        password,
    })

    return { status: res.status, data: res.data }
}

const removeServer = async (name: string): Promise<{ status: number }> => {
    const res = await axios.delete(`/api/lowdb/${name}`)
    return { status: res.status }
}

const modifyServer = async (
    name: string,
    values: ServerConnectionsInfosType
): Promise<{ status: number; data: any }> => {
    const res = await axios.put(`/api/lowdb/${name}`, values)
    return { status: res.status, data: res.data }
}

export { addServer, removeServer, modifyServer }
