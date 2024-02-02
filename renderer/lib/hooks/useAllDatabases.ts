import { useEffect, useState } from 'react'
import { DatabaseType } from '../../interfaces'
import axios from 'axios'

const useAllDatabases = () => {
    const [databases, setDatabases] = useState<DatabaseType[]>([])

    useEffect(() => {
        async function fetchServers() {
            const response = await axios.get('/api/lowdb')
            console.log('🌿 ~ fetchServers ~ response:', response.data)

            if (response.status !== 200) {
                throw new Error(`Error: ${response.status}`)
            }
        }

        fetchServers()

        async function fetchDatabases() {
            const response = await axios.post(
                '/api/databases',
                {
                    type: 'mysql',
                    host: 'localhost',
                    port: 3306,
                    username: 'root',
                    password: 'root',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (response.status !== 200) {
                throw new Error(`Error: ${response.status}`)
            }
            setDatabases(response.data)
        }

        fetchDatabases()
    }, [])

    return databases
}

export default useAllDatabases
