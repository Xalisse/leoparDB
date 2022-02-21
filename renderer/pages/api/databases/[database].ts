import { NextApiRequest, NextApiResponse } from "next";
import { createConnection, getConnection } from "typeorm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    method,
    body: { type, host, port, username, password },
    query: { database },
  } = req;
  if (method === "POST") {
    const db = await createConnection({
      type,
      host,
      port,
      username,
      password,
      database: database as string,
      logging: false,
      name: `databasestables${database}`,
      keepAlive: 100,
    });

    try {
      const tablesNames = await db.query(
        "SELECT table_name as table_name FROM information_schema.tables WHERE table_type='BASE TABLE' AND table_schema = ?",
        [database]
      );
      const allPromises = [];
      const limit = tablesNames.length > 10 ? 10 : 20;
      tablesNames.forEach((table) => {
        allPromises.push(
          db.query(`SELECT * FROM ${table.table_name} LIMIT ${limit}`)
        );
      });
      const tables = await Promise.all(allPromises);
      const result = tables.map((table, index) => ({
        tableName: tablesNames[index].table_name,
        data: table,
      }));
      db.close();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      db.close();
      res.status(500).end(error);
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
