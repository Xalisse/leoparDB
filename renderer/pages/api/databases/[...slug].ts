import { NextApiRequest, NextApiResponse } from 'next';
import { createConnection } from 'typeorm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    method,
    body: { type, host, port, username, password },
    query: { slug },
  } = req;

  const [databaseName, tableName] = slug;

  if (method === 'POST') {
    const db = await createConnection({
      type,
      host,
      port,
      username,
      password,
      database: databaseName,
      logging: false,
      name: `databasestables${databaseName}`,
      keepAlive: 100,
    });

    const data = await db.query(`SELECT * FROM ${tableName} LIMIT ${20}`);
    db.close();
    res.status(200).json(data);
  }
}
