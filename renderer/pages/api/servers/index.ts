import { Low, JSONFile } from 'lowdb';
import { NextApiRequest, NextApiResponse } from 'next';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

type Data = {
  servers: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { body, method } = req;

  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Use JSON file for storage
  const file = join(__dirname, 'db.json');
  console.log(file);
  const adapter = new JSONFile<Data>(file);
  const db = new Low(adapter);
  // Read data from JSON file, this will set db.data content
  await db.read();

  switch (method) {
    case 'POST':
      // TODO: Add a server
      break;

    case 'GET':
      // TODO: Get all servers stored
      console.log(db.data);
      res.send(db.data);
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
