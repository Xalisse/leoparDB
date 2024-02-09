type TableData = {
    data: Array<any>
    columns: Array<{
        columnName: string
        dataType: string
        isNullable: string
        columnType: string
        isPrimaryKey: boolean
        isForeignKey: boolean
        referencedTableName?: string
    }>
}

export { TableData }
