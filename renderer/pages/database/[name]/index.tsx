import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TableView = () => {
  let data = [];
  let header = [];
  const router = useRouter();
  const { name, table, database } = router.query;

  if (name) {
    const { data: response, error: serversError } = useSWR(
      `/api/servers/${router.query.name}?database=${database}&table=${table}`,
      fetcher
    );
    data = response;
    if (data && data[0]) {
      header = Object.keys(data[0]);
    }
  }
  return (
    <>
      <h1 className='text-lg font-bold'>{table}</h1>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(1px,1fr))] bg-blue-200'>
        {header &&
          header.map((cell) => <div className='font-bold'>{cell}</div>)}
      </div>

      {data &&
        data.map((row, index) => (
          <div
            key={index + 'row'}
            className='grid grid-cols-[repeat(auto-fit,minmax(1px,1fr))] even:bg-blue-100'
          >
            {Object.keys(row).map((key, index) => (
              <div key={index + 'cell'}>{row[key]}</div>
            ))}
          </div>
        ))}
    </>
  );
};

export default TableView;
