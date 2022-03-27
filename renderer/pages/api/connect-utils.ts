import { createConnection, getConnection, ConnectionOptions } from 'typeorm';

export async function connect({
  name,
  type,
  host,
  port,
  username,
  password,
  database,
}) {
  const options: ConnectionOptions = {
    name,
    type,
    host,
    port,
    username,
    password,
    database,
    synchronize: true,
    logging: false,
  };

  if (process.env.NODE_ENV === 'production') {
    try {
      return getConnection(options.name);
    } catch (error) {
      return createConnection(options);
    }
  } else {
    try {
      await getConnection(options.name).close();
      return createConnection(options);
    } catch (error) {
      return createConnection(options);
    }
  }
}
