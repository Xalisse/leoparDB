import { Dialog } from '@headlessui/react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import IServer from '../interfaces/server-interface';
import { addServer } from '../services/server-service';

const AddServerSchema = Yup.object().shape({
  type: Yup.string().required('Required'),
  name: Yup.string().required('Required'),
  host: Yup.string().required('Required'),
  port: Yup.number().required('Required'),
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const AddServerModal = ({ isOpen, setIsOpen }) => {
  const handleAddServer = (server: IServer) => {
    addServer(server);
  };

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
              name: '',
              type: 'mysql',
              host: '',
              port: undefined,
              username: '',
              password: '',
              databases: null,
            }}
            validationSchema={AddServerSchema}
            onSubmit={(
              values: IServer,
              { setSubmitting }: FormikHelpers<IServer>
            ) => {
              handleAddServer(values);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <label>Database type (only MySQL available for now)</label>
                <Field
                  as='select'
                  name='database'
                  className=' relative block w-full cursor-default rounded-lg border border-gray-300 bg-white p-2.5 py-2 pl-3 pr-10 text-left text-sm text-gray-900 sm:text-sm'
                >
                  <option value='mysql'>MySQL</option>
                </Field>

                <label>Name</label>
                <Field name='name'></Field>
                {errors.name && touched.name ? (
                  <div className='text-red-500'>{errors.name}</div>
                ) : null}
                <label>Host</label>
                <Field name='host'></Field>
                {errors.host && touched.host ? (
                  <div className='text-red-500'>{errors.host}</div>
                ) : null}
                <label>Port</label>
                <Field type='number' name='port'></Field>
                {errors.port && touched.port ? (
                  <div className='text-red-500'>{errors.port}</div>
                ) : null}
                <label>Username</label>
                <Field name='username'></Field>
                {errors.username && touched.username ? (
                  <div className='text-red-500'>{errors.username}</div>
                ) : null}

                <div className='mt-7 flex justify-between'>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    type='submit'
                    className='rounded-lg bg-red-600 px-3 py-2 text-white'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='rounded-lg bg-green-600 px-3 py-2 text-white'
                  >
                    Validate
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Dialog>
  );
};

export default AddServerModal;
