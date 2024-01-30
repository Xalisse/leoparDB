import { Disclosure } from '@headlessui/react';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Database } from '../interfaces';
import { ChevronRightIcon } from '@heroicons/react/solid';

import { DatabaseIcon, TableIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';

const Navigation = () => {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [selectedTable, setSelectedTable] =
    useState<{ database: string; table: string }>();
  const router = useRouter();

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
      setDatabases(response.data);
    }

    fetchDatabases();
  }, []);

  useEffect(() => {
    if (router.query.slug && router.query.slug.length === 2) {
      setSelectedTable({
        database: router.query.slug[0] as string,
        table: router.query.slug[1] as string,
      });
    }
  }, [router.query.slug]);

  return (
    <div className='h-screen max-h-screen overflow-scroll bg-slate-100 pr-2 shadow-md'>
      {databases.map((database, index) => (
        <Disclosure
          key={`${database.name}-${index}`}
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
                    <div
                      className={`ml-8 flex cursor-pointer items-center gap-1 rounded duration-200 hover:bg-slate-200 ${
                        selectedTable?.database === database.name &&
                        selectedTable?.table === table
                          ? 'font-black'
                          : ''
                      }`}
                    >
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
