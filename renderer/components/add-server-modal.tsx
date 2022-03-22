import { Dialog } from '@headlessui/react';
import { Field, Form, Formik, FormikHelpers } from 'formik';

interface Server {
  database: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

const AddServerModal = ({ isOpen, setIsOpen }) => {
  return (
    <Dialog
      as='div'
      className='fixed inset-0 z-10 overflow-y-auto'
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className='min-h-screen px-4 text-center'>
        <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
        <div className='my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
          <Dialog.Title
            as='h3'
            className='mb-7 text-xl font-bold leading-6 text-gray-900'
          >
            Add a server
          </Dialog.Title>
          <Formik
            initialValues={{
              database: 'mysql',
              host: null,
              port: null,
              username: null,
              password: null,
            }}
            onSubmit={(
              values: Server,
              { setSubmitting }: FormikHelpers<Server>
            ) => {
              console.log(values);
            }}
          >
            <Form>
              <label>Database type (only MySQL available for now)</label>
              <Field
                as='select'
                name='database'
                className=' relative block w-full cursor-default rounded-lg border border-gray-300 bg-white p-2.5 py-2 pl-3 pr-10 text-left text-sm text-gray-900 sm:text-sm'
              >
                <option value='mysql'>MySQL</option>
              </Field>

              <label>Host</label>
              <Field name='host'></Field>
              <label>Port</label>
              <Field type='number' name='port'></Field>
              <label>Username</label>
              <Field name='username'></Field>
              <label>Password</label>
              <Field type='password' name='password'></Field>

              <div className='mt-7 flex justify-between'>
                <button
                  onClick={() => {}}
                  type='submit'
                  className='rounded-lg bg-red-600 px-3 py-2 text-white'
                >
                  Cancel
                </button>
                <button
                  onClick={() => {}}
                  type='submit'
                  className='rounded-lg bg-green-600 px-3 py-2 text-white'
                >
                  Validate
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </Dialog>
  );
};

export default AddServerModal;
