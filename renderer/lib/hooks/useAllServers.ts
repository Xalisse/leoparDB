import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    ServerConnectionsInfosType,
    ServerWithDatabasesType,
    UnreachableDatabaseType,
} from '../../interfaces/servers'
import { DatabaseType } from 'typeorm'

const useAllServers = () => {
    const [databases, setDatabases] = useState<
        (ServerWithDatabasesType | UnreachableDatabaseType)[]
    >([])
    const [serversConnections, setServersConnections] = useState<
        ServerConnectionsInfosType[]
    >([])

    const fetchServers = async () => {
        const response = await axios.get<ServerConnectionsInfosType[]>(
            '/api/lowdb'
        )

        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`)
        }

        setServersConnections(response.data)
    }

    const mutateData = () => {
        fetchServers()
    }

    useEffect(() => {
        fetchServers()
    }, [])

    useEffect(() => {
        serversConnections.forEach((server) => {
            if (databases.find((db) => db.name === server.name)) {
                return
            }

            async function fetchDatabases() {
                try {
                    const response = await axios.post<DatabaseType[]>(
                        '/api/databases',
                        server
                    )

                    setDatabases((prev) => [
                        ...prev,
                        {
                            ...server,
                            databases: response.data,
                        },
                    ])
                } catch (error) {
                    console.error(`Error: ${error}`)
                    setDatabases((prev) => [
                        ...prev,
                        {
                            ...server,
                            databases: null,
                            error: `Error: ${error}`,
                        },
                    ])
                }
            }
            fetchDatabases()
        })
    }, [serversConnections])

    return { databases, mutateData }
}

export default useAllServers
