import { NextApiRequest, NextApiResponse } from 'next'
import { DataSource } from 'typeorm'
import { TableData } from '../../../interfaces/tables'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TableData>
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

        // const constraints = await queryRunner.manager.query(
        //     `select COLUMN_NAME as columnName, CONSTRAINT_NAME as constraintName, REFERENCED_COLUMN_NAME as referencedColumnName, REFERENCED_TABLE_NAME as referencedTableName
        //     from information_schema.KEY_COLUMN_USAGE
        //     where TABLE_NAME = '${tableName}'
        //     ORDER BY columnName;`
        // )

        const primaryKeys = await queryRunner.manager.query(
            `SELECT COLUMN_NAME as columnName, CONSTRAINT_NAME as constraintName
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_NAME = '${tableName}' AND CONSTRAINT_NAME = 'PRIMARY'
            ORDER BY columnName;`
        )

        const foreignKeys = await queryRunner.manager.query(
            `SELECT RefCons.referenced_table_name as referencedTableName, RefCons.constraint_name as constraintName, KeyCol.column_name as columnName
            FROM information_schema.referential_constraints RefCons
            JOIN information_schema.key_column_usage KeyCol ON RefCons.constraint_schema = KeyCol.table_schema
                AND RefCons.table_name = KeyCol.table_name
                AND RefCons.constraint_name = KeyCol.constraint_name
            WHERE RefCons.constraint_schema = '${databaseName}' AND RefCons.table_name = '${tableName}';`
        )

        let columns = await queryRunner.manager.query(
            `SELECT COLUMN_NAME as columnName, DATA_TYPE as dataType, IS_NULLABLE as isNullable, COLUMN_TYPE as columnType
            FROM information_schema.COLUMNS
            WHERE TABLE_NAME = '${tableName}'
            ORDER BY columnName;`
        )

        columns = columns.map((column) => {
            const primaryKey = primaryKeys.find(
                (key) => key.columnName === column.columnName
            )
            const foreignKey = foreignKeys.find(
                (key) => key.columnName === column.columnName
            )
            return {
                ...column,
                isPrimaryKey: !!primaryKey,
                isForeignKey: !!foreignKey,
                referencedTableName: foreignKey?.referencedTableName,
            }
        })

        db.destroy()
        res.status(200).json({ data, columns })
    }
}
