import { XMarkIcon } from '@heroicons/react/24/solid'
import { Field, Form, Formik } from 'formik'
import { createPortal } from 'react-dom'

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (values: {
        name: string
        type: string
        host: string
        port: string
        username: string
        password: string
    }) => void
}

const Modal = ({ isOpen, onClose, onSubmit }: Props) => {
    if (!isOpen) return null

    return createPortal(<div className='absolute top-0 h-full w-full flex items-center justify-center'>
        <div className='bg-white w-1/2 h-1/2 my-shadow py-4 px-8 flex flex-col'>
            <div className='flex items-center justify-between'>
                <h1>Add a server</h1>
                <button><XMarkIcon height={20} onClick={onClose} /></button>
            </div>

            <Formik
                initialValues={{
                    name: '',
                    type: 'MySQL',
                    host: '',
                    port: '',
                    username: '',
                    password: '',
                }}
                onSubmit={onSubmit}
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

                    <button type='submit' className='mt-10 border rounded-md'>Confirm</button>
                </Form>
            </Formik>
        </div>
    </div>, document.body)
}

export default Modal
