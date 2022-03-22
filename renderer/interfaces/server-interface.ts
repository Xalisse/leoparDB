import IDatabase from './database-interface';

interface IServer {
  name: string;
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  databases: IDatabase[];
}

export default IServer;
