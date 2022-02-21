import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Database } from "../../interfaces";
type PropsRow = {
  row: Array<any>;
};

type PropsTable = {
  data: Array<any>;
};

const DynamicRow = ({ row }: PropsRow) => {
  const cells = [];
  for (const prop in row) {
    if (row[prop] instanceof Object) {
      cells.push(
        <td key={prop + "properror"} className="truncate">
          Object too complex to be displayed
        </td>
      );
    } else {
      cells.push(
        <td
          className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap truncate"
          key={prop}
        >
          {row[prop]}
        </td>
      );
    }
  }
  return <tr className="bg-white border-b">{cells}</tr>;
};

const DynamicTable = ({ data }: PropsTable) => {
  if (!data[0]) {
    return <div></div>;
  }
  const rows = [];
  for (const [index, d] of data.entries()) {
    rows.push(<DynamicRow key={index + "row"} row={d} />);
  }

  return (
    <table className="max-w-full">
      <thead className="bg-gray-50 ">
        <tr>
          {Object.getOwnPropertyNames(data[0]).map((property) => (
            <th
              scope="col"
              className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase "
              key={property}
            >
              {property}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

const Database = () => {
  const router = useRouter();
  const { name } = router.query;
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    if (!router.isReady) return;
    async function fetchTables() {
      const { data, status } = await axios.post(
        `/api/databases/${name}`,
        {
          type: "mysql",
          host: "localhost",
          port: 3306,
          username: "root",
          password: "root",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (status !== 200) {
        throw new Error(`Error: ${status}`);
      }
      setTables(data);
    }

    fetchTables();
  }, [router.isReady, name]);

  return (
    <div>
      {tables.map((table, index) => (
        <div key={index}>
          <div>{table.tableName}</div>
          <DynamicTable data={table.data} />
        </div>
      ))}
      {name}
    </div>
  );
};

export default Database;
