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
        <td key={prop + "properror"}>Object too complex to be displayed</td>
      );
    } else {
      cells.push(<td key={prop}>{row[prop]}</td>);
    }
  }
  return <tr>{cells}</tr>;
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
    <table>
      <thead>
        {Object.getOwnPropertyNames(data[0]).map((property) => (
          <th key={property}>{property}</th>
        ))}
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
          port: 8889,
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
      console.log(data);
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
