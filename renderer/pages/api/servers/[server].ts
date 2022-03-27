import { Low, JSONFile } from 'lowdb';
import { NextApiRequest, NextApiResponse } from 'next';
import { dirname, join } from 'path';
import { createConnection } from 'typeorm';
import { fileURLToPath } from 'url';
import { connect } from '../connect-utils';

type Data = {
  servers: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    method,
    query: { server, database, table },
  } = req;

  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Use JSON file for storage
  const file = join(__dirname, 'db.json');
  const adapter = new JSONFile<Data>(file);
  const low = new Low(adapter);
  // Read data from JSON file, this will set db.data content
  await low.read();

  switch (method) {
    case 'GET':
      const serverInfos = low.data.servers.find((serv) => serv.name === server);
      const db = await connect({
        name: `${database}-${table}`,
        ...serverInfos,
        database,
      });
      const data = await db.query(`SELECT * FROM ${table} LIMIT 100`);
      db.close();
      res.send(data);
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
