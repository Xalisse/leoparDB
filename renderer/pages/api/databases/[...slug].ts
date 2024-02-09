import { NextApiRequest, NextApiResponse } from 'next'
import { DataSource } from 'typeorm'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const {
        method,
        body: { type, host, port, username, password },
        query: { slug },
    } = req

    const [databaseName, tableName] = slug as string[]

    if (method === 'POST') {
        const db = new DataSource({
            type,
            host,
            port,
            username,
            password,
            database: databaseName,
            logging: false,
            name: `databasestables${databaseName}`,
            keepAlive: 100,
        })

        const appDataSource = await db.initialize()
        const queryRunner = appDataSource.createQueryRunner()
        const data = await queryRunner.manager.query(
            `SELECT * FROM ${tableName} LIMIT ${20}`
        )

        db.destroy()
        res.status(200).json(data)
    }
}
