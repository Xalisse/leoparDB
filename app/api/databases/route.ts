import { DataSource } from 'typeorm'
import { DatabaseType } from '../../interfaces/databases'

export async function POST(request: Request) {
    const {type, host, port, username, password} = await request.json()

    const db = new DataSource({
        type, 
        host,
        port,
        username,
        password,
        logging: false,
        keepAlive: 100,
    })
    
    try {
        const appDataSource = await db.initialize()
        const queryRunner = appDataSource.createQueryRunner()
        const databases: { table_name: string; table_schema: string }[] =
            await queryRunner.manager.query(
                "SELECT table_name as table_name, table_schema as table_schema FROM information_schema.tables WHERE table_type='BASE TABLE'"
            )
        let groups = {}
        for (let database of databases) {
            const groupName = database.table_schema
            if (!groups[groupName]) {
                groups[groupName] = []
            }
            groups[groupName].push(database.table_name)
        }
        const result: DatabaseType[] = []
        for (let groupName in groups) {
            result.push({ name: groupName, tables: groups[groupName] })
        }
        db.destroy()
        return Response.json(result)
    } catch (err) {
        console.error(err)
        db.destroy()
        return new Response('Error while fetching database', { status: 500 })
    }
}
