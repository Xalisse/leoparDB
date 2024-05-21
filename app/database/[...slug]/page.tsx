'use client'

import { useEffect, useState } from 'react'
import useTableData from '../../lib/hooks/useTableData'
import { CircleStackIcon, TableCellsIcon } from '@heroicons/react/24/solid'
import { TableData } from '../../interfaces/tables'

type PropsRow = {
    row: Array<any>
    columns: Array<{columnName}>
}

const DynamicRow = ({ row, columns }: PropsRow) => {
    const cells: React.JSX.Element[] = []
    columns.forEach(({columnName}, index) => {
        if (row[columnName] instanceof Object) {
            cells.push(
                <td key={columnName + 'properror'} className='truncate'>
                    Object too complex to be displayed
                </td>
            )
        } else {
            cells.push(
                <td
                    className='truncate whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900'
                    key={index}
                >
                    {row[columnName]}
                </td>
            )
        }
    })

    return <tr className='border-b bg-white'>{cells}</tr>
}

const DynamicTable = ({ data, columns }: TableData) => {
    const rows: React.JSX.Element[] = []
    data.forEach((d, index) => {
        rows.push(<DynamicRow key={index + 'row'} row={d} columns={columns} />)
    })

    return (
        <table className='max-w-full'>
            <thead className='bg-gray-50 '>
                <tr>
                    {columns.map((column) => (
                        <th
                            scope='col'
                            className={`py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700`}
                            key={column.columnName}
                        >
                            {column.isPrimaryKey && '🔑'} {column.columnName} {column.isForeignKey && '*'}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    )
}

const Database = ({ params }: { params: { slug: string[] } }) => {
    const [databaseName, setDatabaseName] = useState<string>('')
    const [tableName, setTableName] = useState<string>('')
    const tableData = useTableData(databaseName, tableName)

    useEffect(() => {
        if (!params) return

        setDatabaseName(params.slug[0])
        setTableName(params.slug[1])
    }, [params])

    return (
        <div>
            <h1 className='flex items-center'>
                <CircleStackIcon className='h-4 w-4 text-gray-600' />
                {databaseName}
            </h1>
            <h2 className='flex items-center'>
                <TableCellsIcon className='h-4 w-4 text-gray-600' />
                {tableName}
            </h2>

            {tableData && (
                <DynamicTable {...tableData} />
            )}
        </div>
    )
}

export default Database
