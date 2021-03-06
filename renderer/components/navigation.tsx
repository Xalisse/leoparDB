import { Disclosure } from '@headlessui/react';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Database } from '../interfaces';
import { ChevronRightIcon } from '@heroicons/react/solid';

import { DatabaseIcon, TableIcon } from '@heroicons/react/outline';

const Navigation = () => {
  const [databases, setDatabases] = useState<Database[]>([]);
  useEffect(() => {
    async function fetchDatabases() {
      const response = await axios.post(
        '/api/databases',
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
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`);
      }
      console.log(response.data);
      setDatabases(response.data);
    }

    fetchDatabases();
  }, []);

  return (
    <div className='pr-2shadow-md fixed top-0 h-full w-56 overflow-x-hidden bg-slate-100 p-1'>
      {databases.map((database, index) => (
        <Disclosure key={`${database.name}-${index}`}>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full cursor-pointer items-center gap-1 truncate rounded duration-200 hover:bg-slate-200'>
                <ChevronRightIcon
                  className={`h-4 w-4 duration-200 ${
                    open && 'rotate-90 transform'
                  }`}
                />
                <DatabaseIcon className='h-4 w-4 text-gray-600' />
                <div className='cursor-pointer'>{database.name}</div>
              </Disclosure.Button>
              <Disclosure.Panel className='overflow-hidden'>
                {database.tables.map((table) => (
                  <Link
                    key={table}
                    href={`/database/${database.name}/${table}`}
                    passHref
                  >
                    <div className='ml-8 flex cursor-pointer items-center gap-1 rounded duration-200 hover:bg-slate-200'>
                      <TableIcon className='h-4 w-4 text-gray-600' />
                      <span className='flex-1 truncate' title={table}>
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
    </div>
  );
};
export default Navigation;
