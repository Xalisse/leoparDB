import axios from 'axios'
import { useEffect, useState } from 'react'
import { TableData } from '../../interfaces/tables'
import { ServerConnectionsInfosType } from '../../interfaces/servers'

const useTableData = (databaseName: string, tableName: string, database: ServerConnectionsInfosType) => {
    console.log('🌿 ~ useTableData ~ database:', database)
    const [tableData, setTableData] = useState<TableData>()

    useEffect(() => {
        if (!databaseName || !tableName || !database) return

        async function getData() {
            const { data, status } = await axios.post(
                `/api/databases/${databaseName}/${tableName}`,
                database,
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
