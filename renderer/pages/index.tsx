import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios';

const IndexPage = () => {
  const [databases, setDatabases] = useState([]);
  useEffect(() => {
    async function fetchDatabases() {
      const response = await axios.post("/api/databases", {
        type: "mysql",
        host: "localhost",
        port: 8889,
        username: "root",
        password: "root",
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`);
      }
      setDatabases(response.data);
    }
    
    fetchDatabases();
  }, []);

  return (
    <Layout title="LeoparDB 🐆">
      <p>
        The easiest way to visualize your databases
      </p>
      <div>
        {databases.map((database) => (
          <div key={database.name}>
            {database.name}
            {database.tables.map((table) => (
              <p key={database.name + table}>{table}</p>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default IndexPage
