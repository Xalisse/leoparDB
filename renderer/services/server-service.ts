import axios from 'axios';
import IServer from '../interfaces/server-interface';

const addServer = (server: IServer) => {
  const formData = new FormData();
  Object.keys(server).forEach((key) => formData.append(key, server[key]));
  axios
    .post('/api/servers', server, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {});
};

export { addServer };
