import { Disclosure } from "@headlessui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Database } from "../interfaces";


const Navigation = () => {
  const [databases, setDatabases] = useState<Database[]>([]);
  useEffect(() => {
    async function fetchDatabases() {
      const response = await axios.post(
        "/api/databases",
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

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`);
      }
      console.log(response.data)
      setDatabases(response.data);
    }

    fetchDatabases();
  }, []);

  return (
    <div className="bg-gray-100 h-full sticky top-0 p-1 pr-3 w-[200px] overflow-hidden">
      {databases.map((database) => (
      <Disclosure>
        <Disclosure.Button className="py-2 truncate">
          <div className="cursor-pointer">{database.name}</div>
        </Disclosure.Button>
          <Disclosure.Panel>
            {database.tables.map((table) => (
              <div className="ml-4 truncate">
                <Link href={`/database/${database.name}/${table}`} key={table}>
                  {table}
                </Link>
              </div>
            ))}
        </Disclosure.Panel>
      </Disclosure>
      ))}
    </div>
  );
};
export default Navigation;
