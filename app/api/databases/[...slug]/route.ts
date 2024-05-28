import { DataSource } from 'typeorm'
import { ServerConnectionsInfosType } from '../../../interfaces/servers'

export const getData = async (
    serverInfos: Omit<ServerConnectionsInfosType, 'name'>,
    databaseName, 
    tableName
) => {
    const db = new DataSource({
        type: serverInfos.type,
        host: serverInfos.host,
        port: serverInfos.port,
        username: serverInfos.username,
        password: serverInfos.password,
        database: databaseName,
        logging: false,
        name: `databasestables${databaseName}`,
    })

    const appDataSource = await db.initialize()

    // TODO: gérer erreur de connexion à la base de données

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

    columns = columns.map((column: { columnName: any }) => {
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
    return { data, columns }
}


export async function POST(request: Request, { params }: { params: { slug: string[] } }) {
    const [databaseName, tableName] = params.slug
    const { type, host, port, username, password } = await request.json()
    
    const { data, columns } = await getData(
        { type, host, port, username, password },
        databaseName,
        tableName
    )
    
    return Response.json({ data, columns })
}
