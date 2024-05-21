'use client'

import { createContext } from "react"
import { ServerWithDatabasesType, UnreachableDatabaseType } from "../interfaces/servers"
import useAllServers from "../lib/hooks/useAllServers"

const ServersContext = createContext({
    servers: [] as Array<ServerWithDatabasesType | UnreachableDatabaseType>,
    mutateData: () => { },
})

const ServersProvider = ({ children }) => {
    const { databases: servers, mutateData } = useAllServers()

    return (
        <ServersContext.Provider value={{ servers, mutateData }}>
            {children}
        </ServersContext.Provider>
    )
}

export { ServersContext, ServersProvider }
