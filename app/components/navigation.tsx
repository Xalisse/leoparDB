'use client'

import { Disclosure } from '@headlessui/react'
import Link from 'next/link'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ChevronRightIcon, CircleStackIcon, PlusIcon, TableCellsIcon, XMarkIcon } from '@heroicons/react/24/solid'
import Modal from './common/modal'
import { addServer } from '../lib/api/api'
import toast, { Toaster } from 'react-hot-toast'
import { Formik, Form, Field } from 'formik'
import { ServersContext } from '../contexts/servers'
import { ServerConnectionsInfosType } from '../interfaces/servers'
import { usePathname } from 'next/navigation'

const Navigation = () => {
    const pathname = usePathname()
    
    const { servers, mutateData } = useContext(ServersContext)
    const [selectedTable, setSelectedTable] =
        useState<{ database: string; table: string }>()
    const [isOpenModal, setIsOpenModal] = useState(false)


    const createServer = useCallback(async (values: ServerConnectionsInfosType) => {
        const res = await addServer(values)
        if (res.status === 201) {
            setIsOpenModal(false)
            toast.success('Server added successfully', { position: 'bottom-left' })
            mutateData()
        }
    }, [])

    const isNameUnique = useCallback((name: string) => {
        return !servers?.find((server) => server.name === name)
    }, [servers])
    const isNameValid = useCallback((name: string) => {
        return isNameUnique(name) ? null : 'Name already exists'
    }, [])

    useEffect(() => {
        const slugs = pathname.split('/').filter(Boolean)
        if (slugs[0] === 'database' && slugs.length === 3) {
            setSelectedTable({
                database: slugs[1],
                table: slugs[2],
            })

        }
    }, [pathname])

    return (
        <div className='h-screen max-h-screen overflow-scroll flex flex-col gap-4 bg-slate-100 px-2 shadow-md'>
            {servers?.map((server) => (<div key={server.name}>
                <Link href={`/server/${server.name}`}><p className='text-lg font-bold cursor-pointer'>{server.name}</p></Link>

                {'error' in server && (
                    <div className='text-red-400'>{server.error}</div>
                )}

                {!('error' in server) && server.databases.map((database) => (
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

            <button className='flex border items-center' onClick={() => setIsOpenModal(true)}>Add server<PlusIcon width={20} /></button>

            <Modal isOpen={isOpenModal}>
                <div className='flex items-center justify-between'>
                    <h1>Add a server</h1>
                    <button><XMarkIcon height={20} onClick={() => setIsOpenModal(false)} /></button>
                </div>

                <Formik
                    initialValues={{
                        name: '',
                        type: 'mysql',
                        host: '',
                        port: 0,
                        username: '',
                        password: '',
                    }}
                    onSubmit={createServer}
                >
                    {({ errors, touched }) => (
                        <Form className='flex flex-col'>
                            <label htmlFor='name'>Name</label>
                            <Field id='name' name='name' type='text' validate={isNameValid} />
                            {errors.name && touched.name && (
                                <div className='text-red-400'>{errors.name}</div>
                            )}

                            <label htmlFor='type'>Type</label>
                            <Field id='type' name='type' as='select'>
                                <option value='mysql'>MySQL</option>
                                <option value='postgres' disabled>PostgreSQL</option>
                            </Field>

                            <label htmlFor='host'>Host</label>
                            <Field id='host' name='host' type='text' />

                            <label htmlFor='port'>Port</label>
                            <Field id='port' name='port' type='number' />

                            <label htmlFor='username'>Username</label>
                            <Field id='username' name='username' type='text' />

                            <label htmlFor='password'>Password</label>
                            <Field id='password' name='password' type='password' autoComplete="current-password" />

                            <button type='submit' className='mt-10 border rounded-md' disabled={!!errors.name}>Confirm</button>
                        </Form>
                    )}
                </Formik>
            </Modal>

            <Toaster />
        </div>
    )
}
export default Navigation
