import { NextApiRequest, NextApiResponse } from "next";
import { createConnection } from "typeorm";
import { Database } from "../../../interfaces";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    body: { type, host, port, username, password },
    method,
  } = req;
  if (method === "POST") {
    const db = await createConnection({
      type,
      host,
      port,
      username,
      password,
      logging: false,
    });
    const databases: { table_name: string; table_schema: string }[] =
      await db.query(
        "SELECT table_name, table_schema FROM information_schema.tables"
      );
    let groups = {};
    for (let database of databases) {
      const groupName = database.table_schema;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(database.table_name);
    }
    const result: Database[] = [];
    for (let groupName in groups) {
      result.push({ name: groupName, tables: groups[groupName] });
    }

    db.close();
    res.status(200).json(result);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
