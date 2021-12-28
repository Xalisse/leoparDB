import Link from "next/link";
import { Database } from "../interfaces";

type Props = {
  databases: Database[];
};

const Navigation = ({ databases }: Props) => {
  return (
    <div>
      {databases.map((database) => (
        <Link href={`/database/${database.name}`} key={database.name}>
          <div>{database.name}</div>
        </Link>
      ))}
    </div>
  );
};
export default Navigation;
