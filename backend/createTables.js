const db = require('./model/database');

const tables = [
    { 
        name: 'customer', 
        columns: [
            'id UUID PRIMARY KEY NOT NULL',
            'first_name varchar(50) NOT NULL',
            'last_name varchar(50) NOT NULL',
            'birth_date integer NOT NULL',
            'email varchar(100) UNIQUE NOT NULL',
            'phone varchar(20) UNIQUE',
            'password varchar NOT NULL',
            'salt varchar NOT NULL'
        ]
    },
    {
        name: 'addresses',
        columns: [
            'id UUID PRIMARY KEY NOT NULL',
            'line_1 varchar(128) NOT NULL',
            'line_2 varchar(128)',
            'city varchar(64) NOT NULL',
            'county varchar(64) NOT NULL',
            'is_primary boolean NOT NULL DEFAULT false',
            'customer_id UUID NOT NULL REFERENCES customer(id)'
        ]
    },
    {
        name: 'categories',
        columns: [
            'id UUID PRIMARY KEY NOT NULL',
            'name varchar(50) NOT NULL UNIQUE',
            'parent_category_id UUID REFERENCES categories(id)'
        ]
    },
    {
        name: 'item',
        columns: [
            'id UUID PRIMARY KEY NOT NULL',
            'name varchar(100) NOT NULL',
            'description varchar NOT NULL',
            'category_id UUID NOT NULL REFERENCES categories(id)',
            'price money NOT NULL DEFAULT 0',
            'stock integer NOT NULL DEFAULT 0',
            'sold integer NOT NULL DEFAULT 0',
            'is_active boolean DEFAULT false'
        ]
    },
    {
        name: 'customer_saved_item',
        columns: [
            'customer_id UUID NOT NULL REFERENCES customer(id)',
            'item_id UUID NOT NULL REFERENCES item(id)'
        ]
    }
]

const createTable = async (tableName, columns, removeTable) => {
    await db.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`)
    if (!removeTable) {
        await db.query(`CREATE TABLE ${tableName} (${columns})`)
    };
}

const createTables = async () => {
    let count = 1;
    for (let table of tables) {
        try {
            await createTable(table.name, table.columns);
            console.log(count)
            count ++;
        } catch (err) {
            tables.push(table)
            console.error(err)
        }
    }
}

createTables()