import Link from "next/link";
import { Database } from "../interfaces";

type Props = {
  databases: Database[];
};

const Navigation = ({ databases }: Props) => {
  return (
    <div className="bg-gray-100 h-screen sticky top-0 p-1 pr-3">
      {databases.map((database) => (
        <Link href={`/database/${database.name}`} key={database.name}>
          <div className="cursor-pointer">{database.name}</div>
        </Link>
      ))}
    </div>
  );
};
export default Navigation;
