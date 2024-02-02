type ServerConnectionsInfosType = {
    name: string
    type: 'mysql'
    host: string
    port: number
    username: string
    password: string
}

type ServerWithDatabasesType = ServerConnectionsInfosType & {
    databases: DatabaseType[]
}

export { ServerConnectionsInfosType, ServerWithDatabasesType }
