import axios from 'axios'

const addServer = async ({
    name,
    type,
    host,
    port,
    username,
    password,
}: {
    name: string
    type: string
    host: string
    port: string
    username: string
    password: string
}): Promise<{ status: number; data: any }> => {
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

export { addServer }
