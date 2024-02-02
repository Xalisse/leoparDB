import { Disclosure } from '@headlessui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronRightIcon, CircleStackIcon, TableCellsIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import useAllServers from '../lib/hooks/useAllServers'

const Navigation = () => {
    const servers = useAllServers()
    const [selectedTable, setSelectedTable] =
        useState<{ database: string; table: string }>()
    const router = useRouter()

    useEffect(() => {
        if (router.query.slug && router.query.slug.length === 2) {
            setSelectedTable({
                database: router.query.slug[0],
                table: router.query.slug[1],
            })
        }
    }, [router.query.slug])

    return (
        <div className='h-screen max-h-screen overflow-scroll bg-slate-100 pr-2 shadow-md'>
            {servers?.map((server) => (<div key={server.name}>
                <h1>{server.name}</h1>

                {server.databases.map((database, index) => (
                    <Disclosure
                        key={database.name}
                        defaultOpen={selectedTable?.database === database.name}
                    >
                        {({ open }) => (
                            <>
                                <Disclosure.Button className='flex w-full cursor-pointer items-center gap-1 truncate rounded duration-200 hover:bg-slate-200'>
                                    <ChevronRightIcon
                                        className={`h-4 w-4 duration-200 ${
                                            open && 'rotate-90 transform'
                                        }`}
                                    />
                                    <CircleStackIcon className='h-4 w-4 text-gray-600' />
                                    <div className='cursor-pointer'>
                                        {database.name}
                                    </div>
                                </Disclosure.Button>
                                <Disclosure.Panel className='overflow-hidden'>
                                    {database.tables.map((table) => (
                                        <Link
                                            key={table}
                                            href={`/database/${database.name}/${table}`}
                                            passHref
                                        >
                                            <div
                                                className={`ml-8 flex cursor-pointer items-center gap-1 rounded duration-200 hover:bg-slate-200 ${
                                                    selectedTable?.database ===
                                                        database.name &&
                                                    selectedTable?.table === table
                                                        ? 'font-black'
                                                        : ''
                                                }`}
                                            >
                                                <TableCellsIcon className='h-4 w-4 text-gray-600' />
                                                <span
                                                    className='flex-1 truncate'
                                                    title={table}
                                                >
                                                    {table}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                ))}
            </div>))}
        </div>
    )
}
export default Navigation
