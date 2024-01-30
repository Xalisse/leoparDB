import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Database } from '../../interfaces'
import { DatabaseIcon, TableIcon } from '@heroicons/react/outline'
import useTableData from '../../hooks/useTableData'
type PropsRow = {
    row: Array<any>
}

type PropsTable = {
    data: Array<any>
}

const DynamicRow = ({ row }: PropsRow) => {
    const cells = []
    for (const prop in row) {
        if (row[prop] instanceof Object) {
            cells.push(
                <td key={prop + 'properror'} className='truncate'>
                    Object too complex to be displayed
                </td>
            )
        } else {
            cells.push(
                <td
                    className='truncate whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900'
                    key={prop}
                >
                    {row[prop]}
                </td>
            )
        }
    }
    return <tr className='border-b bg-white'>{cells}</tr>
}

const DynamicTable = ({ data }: PropsTable) => {
    if (!data[0]) {
        return <div></div>
    }
    const rows = []
    for (const [index, d] of data.entries()) {
        rows.push(<DynamicRow key={index + 'row'} row={d} />)
    }

    return (
        <table className='max-w-full'>
            <thead className='bg-gray-50 '>
                <tr>
                    {Object.getOwnPropertyNames(data[0]).map((property) => (
                        <th
                            scope='col'
                            className='py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 '
                            key={property}
                        >
                            {property}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    )
}

const Database = () => {
    const router = useRouter()
    const [databaseName, setDatabaseName] = useState<string>()
    const [tableName, setTableName] = useState<string>()
    const tableData = useTableData(databaseName, tableName)

    useEffect(() => {
        if (!router.isReady) return

        setDatabaseName(router.query.slug[0])
        setTableName(router.query.slug[1])
    }, [router.isReady, router.asPath])

    return (
        <div>
            <h1 className='flex items-center'>
                <DatabaseIcon className='h-4 w-4 text-gray-600' />
                {databaseName}
            </h1>
            <h2 className='flex items-center'>
                <TableIcon className='h-4 w-4 text-gray-600' />
                {tableName}
            </h2>

            <DynamicTable data={tableData} />
        </div>
    )
}

export default Database
