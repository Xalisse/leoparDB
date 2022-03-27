import { Disclosure } from '@headlessui/react';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/solid';

import { DatabaseIcon, ServerIcon, TableIcon } from '@heroicons/react/outline';
import IServer from '../interfaces/server-interface';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Navigation = ({ addServer }) => {
  const { data: servers, error: serversError } = useSWR(
    '/api/servers',
    fetcher
  );

  useEffect(() => {
    const fetchDatabases = () => {
      if (servers && !serversError) {
        servers.forEach((server: IServer) => {
          const body = { ...server };
          delete body.databases;
          axios
            .post(
              '/api/databases',
              { ...body },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
            .then((res) => {
              server.databases = res.data;
            })
            .catch((error) => {
              console.error(error);
            });
        });
      }
    };

    fetchDatabases();
  }, [servers]);

  return (
    <div className='fixed top-0 h-full w-[250px] overflow-x-hidden bg-slate-300 p-1 pr-2 shadow-md'>
      {servers &&
        servers.map((server, index) => (
          <>
            <Disclosure key={`${server.name}-${index}`}>
              {({ open }) => (
                <>
                  <Disclosure.Button className='flex w-full cursor-pointer items-center gap-1 truncate rounded duration-200 hover:bg-slate-200'>
                    <ChevronRightIcon
                      className={`h-4 w-4 duration-200 ${
                        open && 'rotate-90 transform'
                      }`}
                    />
                    <ServerIcon className='h-4 w-4 text-gray-600' />
                    <div className='cursor-pointer'>{server.name}</div>
                  </Disclosure.Button>

                  <Disclosure.Panel className='ml-4 overflow-hidden'>
                    {server.databases &&
                      server.databases.map((database, index) => (
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
                                <div className='cursor-pointer'>
                                  {database.name}
                                </div>
                              </Disclosure.Button>
                              <Disclosure.Panel className='overflow-hidden'>
                                {database.tables.map((table) => (
                                  <Link
                                    key={table}
                                    href={{
                                      pathname: `/database/${server.name}`,
                                      query: { database: database.name, table },
                                    }}
                                    passHref
                                  >
                                    <div className='ml-8 flex cursor-pointer items-center gap-1 rounded duration-200 hover:bg-slate-200'>
                                      <TableIcon className='h-4 w-4 text-gray-600' />
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
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </>
        ))}

      <button
        onClick={() => addServer()}
        className='rounded-lg bg-blue-500 px-3 py-2 text-white'
      >
        Add a server
      </button>
    </div>
  );
};
export default Navigation;
