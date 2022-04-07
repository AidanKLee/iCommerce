class SQLQuery {
    constructor(runSQLFunction) {
        this.run = async (queryString, values) => {
            return await runSQLFunction(queryString, values);
        };
    };

    queries = {};

    build = query => {
        const { name, custom, type } = query;

        if (type && type.toLowerCase() === 'select') {
            query = this.buildSelectQuery(query);
        } else if (type && type.toLowerCase() === 'insert') {
            query = this.buildInsertQuery(query);
        } else if (type && type.toLowerCase() === 'update') {
            query = this.buildUpdateQuery(query);
        } else if (type && type.toLowerCase() === 'delete') {
            query = this.buildDeleteQuery(query);
        } else if (name && custom) {
            query = custom;
        } 

        this.queries[name] = query;
        this[name] = async (values) => {
            return await this.run(query, values);
        };
    };

    buildSelectQuery = query => {
        let { tables, params } = query;
        if (params) {
            params = this.handleParams(query);
        }
        let table = Array.isArray(tables) ? [tables.shift()] : [tables];
        table = this.getSelectQuery({...query, tables: table});
        query = this.buildParams({...query, tables, params, table})
        return query;
    };

    buildParams = query => {
        let { tables, params, table: t } = query;
        let [ table, condition ] = t[0];
        table = [ table ];
        [query] = table;
        query = `${table}${condition ? ' ' + condition : ''}`
        for (let param in params) {
            if (param.toLowerCase().includes('union')) {
                tables = this.getSelectQuery({...query, tables});
                tables = tables.map(table => table[0]);
                tables = table.concat(tables).map(table => `${table}${condition ? ' ' + condition : ''}`);
                query = tables.join(` ${param.toUpperCase()} `);
            }
            if (param.toLowerCase().includes('join')) {
                console.log(tables)
                let columns = tables.map(table => table.columns);
                columns = columns ? typeof columns === 'string' ? columns : columns.filter(col => col !== undefined).join(', ') : '';
                // columns = columns.join(', ');
                if (columns) {
                    table[0] = table[0].split(' FROM ');
                    table[0] = `${table[0][0]}, ${columns} FROM ${table[0][1]}`;
                }
                tables = tables.map(table => table.name);
                // eslint-disable-next-line no-loop-func
                params[param] = params[param].map((join, i) => `${param.toUpperCase()} ${tables[i]} ${join}`);
                query = `${table[0]} ${params[param].join(' ')} ${condition ? condition : ''}`;
            }
        }
        for (let param in params) {
            if (param.toLowerCase().includes('group by')) {
                params[param] = typeof params[param] === 'string' ? params[param] : params[param].join(', ');
                query = query + ` ${param.toUpperCase()} ${params[param]}`;
            }
        }
        for (let param in params) {
            if (param.toLowerCase().includes('order by')) {
                params[param] = typeof params[param] === 'string' ? params[param] : params[param].join(', ');
                const offset = params.offset ? `OFFSET ${params.offset}` : '';
                const limit = params.limit ? `LIMIT ${params.limit}` : '';
                query = query + ` ${param.toUpperCase()} ${params[param]} ${limit} ${offset}`;
            }
        }
        return query;
    }

    getSelectQuery = query => {
        let { tables, conditions } = query;
        query = tables.map((table, i) => {
            let { name, columns } = table;
            columns = !columns ? '' : columns;
            columns = typeof columns === 'string' ? columns : columns.join(', ');
            conditions = typeof conditions === 'string' ? [conditions] : conditions;
            conditions = conditions ? conditions.map((condition, i) => `${condition} $${i + 1}`).join(' ') : '';
            return [`SELECT ${columns} FROM ${name}`, conditions];
        })
        
        return query;
    }

    handleParams = query => {
        let { params } = query;
        for (let param in params) {
            if (Array.isArray(params[param])) {
                if (param.toLowerCase().includes('join')) {
                    if (typeof params[param][0] === 'string') {
                        params[param] = [`ON ${params[param][0]} = ${params[param][1]}`];
                    } else {
                        params[param] = params[param].map(p => `ON ${p[0]} = ${p[1]}`);
                    }
                } else {
                    params[param] = `${params[param].join(', ')}`;
                }
            }
        }
        return params;
    }

    buildInsertQuery = query => {
        const { tables } = query;
        const table = tables[0] || tables;
        let { name, columns } = table;
        const template = typeof columns === 'string' ? `$[${columns}]` : columns.map((column, i) => `$${i + 1}`).join(', ');
        columns = typeof columns === 'string' ? columns : columns.join(', ');
        query = `INSERT INTO ${name} (${columns}) VALUES (${template})`
        return query;
    };

    buildUpdateQuery = query => {
        let { tables, conditions } = query;
        const table = tables[0] || tables;
        let { name, columns } = table;
        conditions = typeof conditions === 'string' ? [conditions] : conditions;
        conditions = conditions ? conditions.map((condition, i) => `${condition} $${columns.length > 0 ? columns.length + 1 + i : 1}`).join(' ') : '';
        columns = typeof columns === 'string' ? [columns] : columns;
        columns = columns.map((column, i) => `${column} = $${i + 1}`).join(', ');
        query = `UPDATE ${name} SET ${columns} ${conditions}`
        return query;
    };

    buildDeleteQuery = query => {
        let { tables, conditions } = query;
        const table = tables[0] || tables;
        const { name } = table;
        if (conditions) {
            conditions = typeof conditions === 'string' ? [conditions] : conditions;
            conditions = conditions.map((condition, i) => `${condition} $${i + 1}`).join(' ');
        }
        query = `DELETE FROM ${name}${conditions ? ' ' + conditions : ''}`;
        return query;
    };

};

module.exports = SQLQuery;