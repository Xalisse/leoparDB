import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    ServerConnectionsInfosType,
    ServerWithDatabasesType,
} from '../../interfaces/servers'
import { DatabaseType } from 'typeorm'

const useAllServers = () => {
    const [databases, setDatabases] = useState<ServerWithDatabasesType[]>([])
    const [serversConnections, setServersConnections] = useState<
        ServerConnectionsInfosType[]
    >([])

    useEffect(() => {
        async function fetchServers() {
            const response = await axios.get<ServerConnectionsInfosType[]>(
                '/api/lowdb'
            )

            if (response.status !== 200) {
                throw new Error(`Error: ${response.status}`)
            }

            setServersConnections(response.data)
        }
        fetchServers()
    }, [])

    useEffect(() => {
        serversConnections.forEach((server) => {
            if (databases.find((db) => db.name === server.name)) {
                return
            }

            async function fetchDatabases() {
                const response = await axios.post<DatabaseType[]>(
                    '/api/databases',
                    server
                )

                if (response.status !== 200) {
                    throw new Error(`Error: ${response.status}`)
                }

                setDatabases((prev) => [
                    ...prev,
                    {
                        ...server,
                        databases: response.data,
                    },
                ])
            }
            fetchDatabases()
        })
    }, [serversConnections])

    return databases
}

export default useAllServers
