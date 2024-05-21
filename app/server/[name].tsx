import { useRouter } from "next/router"
import Modal from "../components/common/modal"
import { useContext, useMemo, useState } from "react"
import { modifyServer, removeServer } from "../lib/api/api"
import toast, { Toaster } from "react-hot-toast"
import { ServersContext } from "../contexts/servers"
import { Formik, Form, Field } from "formik"
import { ServerConnectionsInfosType } from "../interfaces/servers"

const Server = () => {
    const {servers, mutateData} = useContext(ServersContext)
    const router = useRouter()
    const { name } = router.query as { name: string }
    const [isOpenModalRemove, setIsOpenModalRemove] = useState(false)
    const [isOpenModalModify, setIsOpenModalModify] = useState(false)

    const server = useMemo(() => servers?.find((server) => server.name === name), [servers, name])

    const removeServerFromList = () => {
        removeServer(name).then(() => {
            toast.success('Server removed successfully', { position: 'bottom-left' })
            mutateData()
            setIsOpenModalRemove(false)
            router.push('/')
        }).catch((err) => {
            toast.error('Error removing server', { position: 'bottom-left' })
            console.error(err)
        })
    }

    const modifyServerFromList = (values: ServerConnectionsInfosType) => {
        modifyServer(name, values).then(() => {
            toast.success('Server modified successfully', { position: 'bottom-left' })
            mutateData()
            router.push(`/server/${values.name}`)
            setIsOpenModalModify(false)
        }).catch((err) => {
            toast.error('Error modifying server', { position: 'bottom-left' })
            console.error(err)
        })
    }

    return (
        <div>
            <h1>{name}</h1>

            <button className="border px-4 py-2 rounded" onClick={() => setIsOpenModalModify(true)}>Modify server</button>

            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setIsOpenModalRemove(true)}>Remove server</button>

            <Modal isOpen={isOpenModalRemove}>
                <div>
                    <h1>Remove server</h1>
                    <p>Are you sure you want to remove this server? This action will be permanent.</p>
                    <div className="flex gap-4">
                        <button className="border border-green-400 px-4 py-2 rounded" onClick={() => setIsOpenModalRemove(false)}>Cancel</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={removeServerFromList}>Remove server</button>
                    </div>
                </div>
            </Modal>

            {server &&
                <Modal isOpen={isOpenModalModify}>
                    <div>
                        <h1>Modify Server</h1>

                        <Formik
                            initialValues={{
                                name,
                                type: server.type,
                                host: server.host,
                                port: server.port,
                                username: server.username,
                                password: server.password,
                            }}
                            onSubmit={modifyServerFromList}
                        >
                            <Form className='flex flex-col'>
                                <label htmlFor='name'>Name</label>
                                <Field id='name' name='name' type='text' />

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

                                <div className="flex gap-4">
                                    <button type='button' className='mt-10 p-2 border rounded-md' onClick={() => setIsOpenModalModify(false)}>Cancel</button>
                                    <button type='submit' className='mt-10 p-2 border rounded-md'>Confirm</button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </Modal>
            }

            <Toaster />
        </div>
    )
}

export default Server
