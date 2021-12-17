import { Database } from "../interfaces";

type Props = {
  databases: Database[];
};

const Navigation = ({ databases }: Props) => {
  return (
    <div>
      {databases.map((database) => (
        <div key={database.name}>{database.name}</div>
      ))}
    </div>
  );
};
export default Navigation;
