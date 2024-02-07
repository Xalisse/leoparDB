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

type UnreachableDatabaseType = ServerConnectionsInfosType & {
    databases: null
    error: string
}

export {
    ServerConnectionsInfosType,
    ServerWithDatabasesType,
    UnreachableDatabaseType,
}
