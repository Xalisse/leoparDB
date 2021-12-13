import Layout from '../components/Layout'
import {createConnection} from "typeorm";

const IndexPage = ({ tableNames, dbNames }) => {
  return (
    <Layout title="LeoparDB 🐆">
      <p>
        The easiest way to visualize your databases
      </p>
      {tableNames.map((table, index) => (
       <span className='indent' key={index} > {table.table_name} </span>
      ))}
      {dbNames.map((db, index) => (
       <span className='indent' key={index + 'db'} > {db.Database} </span>
      ))}
    </Layout>
  )
}

// This gets called on every request
export async function getServerSideProps() {
    const db = await createConnection({
      type: "mysql",
      host: "localhost",
      port: 8889,
      username: "root",
      password: "root",
      logging: false,
    });
    const tableNames = await db.query('SELECT table_name FROM information_schema.tables WHERE table_schema = "M3104"');
    const dbNames = await db.query('SHOW DATABASES');
  return { props: { tableNames, dbNames } }
}


export default IndexPage
