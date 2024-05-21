import axios from 'axios'
import { useEffect, useState } from 'react'
import { TableData } from '../../interfaces/tables'

const useTableData = (databaseName: string, tableName: string) => {
    const [tableData, setTableData] = useState<TableData>()

    useEffect(() => {
        if (!databaseName || !tableName) return

        async function getData() {
            const { data, status } = await axios.post(
                `/api/databases/${databaseName}/${tableName}`,
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

            if (status !== 200) {
                throw new Error('Erreur lors du fetch des data')
            }

            setTableData(data)
        }

        getData()
    }, [databaseName, tableName])

    return tableData
}

export default useTableData
