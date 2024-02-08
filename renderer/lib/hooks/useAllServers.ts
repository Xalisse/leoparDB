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
        const response =
            await axios.get<ServerConnectionsInfosType[]>('/api/lowdb')

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
        const newDb = databases.filter((db) =>
            serversConnections.find((server) => db.name === server.name)
        )

        const fetchPromises = []
        serversConnections.forEach((server) => {
            if (newDb.find((db) => db.name === server.name)) {
                return
            }

            async function fetchDatabases() {
                try {
                    const response = await axios.post<DatabaseType[]>(
                        '/api/databases',
                        server
                    )

                    newDb.push({
                        ...server,
                        databases: response.data,
                    })
                } catch (error) {
                    console.error(`Error: ${error}`)
                    newDb.push({
                        ...server,
                        databases: null,
                        error: `Error: ${error}`,
                    })
                }
            }
            fetchPromises.push(fetchDatabases())
        })

        Promise.all(fetchPromises).then(() => {
            // order databases by name
            newDb.sort((a, b) => {
                return a.name.localeCompare(b.name)
            })
            setDatabases(newDb)
        })
    }, [serversConnections])

    return { databases, mutateData }
}

export default useAllServers
