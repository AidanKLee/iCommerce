const db = require('./model/database');

const tables = [
    {
        name: 'image',
        columns: [
            'id UUID NOT NULL PRIMARY KEY',
            'name varchar NOT NULL',
            'src varchar NOT NULL',
            'type varchar(20) NOT NULL'
        ]
    },
    { 
        name: 'customer', 
        columns: [
            'id UUID PRIMARY KEY NOT NULL',
            'first_name varchar(64) NOT NULL',
            'last_name varchar(64) NOT NULL',
            'birth_date date NOT NULL',
            'email varchar(128) UNIQUE NOT NULL',
            'phone varchar(20) UNIQUE',
            'password varchar NOT NULL',
            'subscribed boolean NOT NULL DEFAULT TRUE',
            'deleted boolean NOT NULL DEFAULT FALSE',
            'deleted_date TIMESTAMP'
        ]
    },
    {
        name: 'address',
        columns: [
            'id UUID PRIMARY KEY NOT NULL',
            'line_1 varchar(128) NOT NULL',
            'line_2 varchar(128)',
            'city varchar(64) NOT NULL',
            'county varchar(64) NOT NULL',
            'postcode varchar(8) NOT NULL',
            'is_primary boolean NOT NULL DEFAULT false',
            'customer_id UUID NOT NULL REFERENCES customer(id)',
            'seller_id UUID NOT NULL REFERENCES seller(id)',
            'CONSTRAINT user_id_chk CHECK (customer_id IS NOT NULL OR seller_id IS NOT NULL)'
        ]
    },
    {
        name: 'cart',
        columns: [
            'id UUID NOT NULL PRIMARY KEY',
            'customer_id UUID UNIQUE NOT NULL REFERENCES customer(id)',
            'date_created TIMESTAMP NOT NULL DEFAULT NOW()',
            'date_edited TIMESTAMP NOT NULL DEFAULT NOW()'
        ]
    },
    {
        name: 'cart_item',
        columns: [
            'cart_id UUID NOT NULL REFERENCES cart(id)',
            'item_id UUID NOT NULL REFERENCES item(id)',
            'item_quantity integer NOT NULL DEFAULT 1',
            'PRIMARY KEY (cart_id, item_id)'
        ]
    },
    {
        name: 'category',
        columns: [
            'name varchar(64) NOT NULL PRIMARY KEY',
            'href varchar(192) NOT NULL UNIQUE',
            'parent_category_name varchar(64) REFERENCES category(name)'
        ]
    },
    {
        name: 'attribute',
        columns: [
            'name varchar(64) NOT NULL PRIMARY KEY',
        ]
    },
    {
        name: 'attribute_value',
        columns: [
            'attribute varchar(64) NOT NULL REFERENCES attribute(name)',
            'value varchar(64) NOT NULL',
            'PRIMARY KEY (attribute, value)'
        ]
    },
    {
        name: 'category_attribute',
        columns: [
            'category_name varchar(64) NOT NULL',
            'attribute varchar(64) NOT NULL REFERENCES attribute(name)',
            'PRIMARY KEY (category_name, attribute)'
        ]
    },
    {
        name: 'product',
        columns: [
            'id UUID PRIMARY KEY NOT NULL',
            'is_active boolean DEFAULT false',
            'views integer DEFAULT 0 NOT NULL',
            'favourites integer DEFAULT 0 NOT NULL'
        ]
    },
    {
        name: 'product_category',
        columns: [
            'product_id UUID NOT NULL',
            'category_name varchar(64) NOT NULL',
            'PRIMARY KEY (product_id, category_name)'
        ]
    },
    {
        name: 'item',
        columns: [
            'id UUID PRIMARY KEY NOT NULL',
            'product_id UUID NOT NULL REFERENCES product(id)',
            'name varchar(192) NOT NULL',
            'description varchar NOT NULL',
            'price money NOT NULL',
            'in_stock integer DEFAULT 0 NOT NULL',
            'ordered integer DEFAULT 0 NOT NULL',
            'awards varchar(64)'
        ]
    },
    {
        name: 'item_attribute_value',
        columns: [
            'item_id UUID NOT NULL REFERENCES item(id)',
            'attribute varchar(64) NOT NULL',
            'value varchar(64) NOT NULL',
            'PRIMARY KEY (item_id, attribute)'
        ]
    },
    {
        name: 'item_image',
        columns: [
            'item_id UUID NOT NULL REFERENCES item(id)',
            'image_id UUID NOT NULL REFERENCES image(id)',
            '"primary" boolean NOT NULL DEFAULT false',
            'PRIMARY KEY (item_id, image_id)'
        ]
    },
    {
        name: 'customer_saved_item',
        columns: [
            'customer_id UUID NOT NULL REFERENCES customer(id)',
            'item_id UUID NOT NULL REFERENCES item(id)',
            'PRIMARY KEY (customer_id, item_id)'
        ]
    },
    {
        name: 'sale',
        columns: [
            'percent integer PRIMARY KEY NOT NULL'
        ]
    },
    {
        name: 'item_sale',
        columns: [
            'item_id UUID NOT NULL REFERENCES item(id) PRIMARY KEY',
            'sale_percent integer NOT NULL REFERENCES sale(percent)',
            'start_date TIMESTAMP NOT NULL',
            'end_date TIMESTAMP NOT NULL'
        ]
    },
    {
        name: 'product_sale',
        columns: [
            'product_id UUID NOT NULL REFERENCES product(id) PRIMARY KEY',
            'sale_percent integer NOT NULL REFERENCES sale(percent)',
            'start_date TIMESTAMP NOT NULL',
            'end_date TIMESTAMP NOT NULL'
        ]
    },
    {
        name: 'seller',
        columns: [
            'id UUID REFERENCES customer(id) NOT NULL PRIMARY KEY',
            'shop_name varchar(128) NOT NULL UNIQUE',
            'image_id UUID REFERENCES image(id)',
            'description varchar',
            'business_email varchar(256) NOT NULL',
            'business_phone varchar(24) NOT NULL',
            'business_type varcher(24) NOT NULL',
            'stripe_id varchar NOT NULL'
        ]
    },
    {
        name: 'seller_product',
        columns: [
            'seller_id UUID NOT NULL REFERENCES seller(id)',
            'product_id UUID NOT NULL REFERENCES product(id)',
            'PRIMARY KEY (seller_id, product_id)'
        ]
    },
    {
        name: '"order"',
        columns: [
            'id UUID NOT NULL PRIMARY KEY',
            'customer_id UUID NOT NULL REFERENCES customer(id)',
            'date TIMESTAMP NOT NULL DEFAULT NOW()',
            'delivery_address_id UUID NOT NULL',
            'payment_complete boolean NOT NULL DEFAULT false'
        ]
    },
    {
        name: 'order_item',
        columns: [
            'id UUID NOT NULL PRIMARY KEY',
            'order_id UUID NOT NULL REFERENCES "order"(id)',
            'seller_id UUID NOT NULL REFERENCES seller(id)',
            'item_id UUID NOT NULL REFERENCES item(id)',
            'item_quantity integer NOT NULL',
            'dispatch_date TIMESTAMP',
            'delivery_date TIMESTAMP',
            'cancelled boolean NOT NULL DEFAULT false',
            'reviewed_item boolean NOT NULL DEFAULT false',
            'reviewed_seller boolean NOT NULL DEFAULT false',
            'revieWed_customer boolean NOT NULL DEFAULT false',
            'seller_paid boolean NOT NULL DEFAULT false',
            'transfer_id varchar'
        ]
    },
    {
        name: 'product_review',
        columns: [
            'id UUID NOT NULL PRIMARY KEY',
            'user_id UUID NOT NULL REFERENCES customer(id)',
            'order_id UUID NOT NULL REFERENCES "order"(id)',
            'product_id UUID NOT NULL REFERENCES product(id)',
            'date TIMESTAMP NOT NULL DEFAULT NOW()',
            'rating integer NOT NULL check(rating > 0 AND rating <= 5)',
            'review varchar(1024) NOT NULL'
        ]
    },
    {
        name: 'seller_review',
        columns: [
            'id UUID NOT NULL PRIMARY KEY',
            'user_id UUID NOT NULL REFERENCES customer(id)',
            'order_id UUID NOT NULL REFERENCES "order"(id)',
            'seller_id UUID NOT NULL REFERENCES seller(id)',
            'date TIMESTAMP NOT NULL DEFAULT NOW()',
            'rating integer NOT NULL check(rating > 0 AND rating <= 5)',
            'review varchar(1024) NOT NULL'
        ]
    },
    {
        name: 'customer_review',
        columns: [
            'id UUID NOT NULL PRIMARY KEY',
            'user_id UUID NOT NULL REFERENCES seller(id)',
            'order_id UUID NOT NULL REFERENCES "order"(id)',
            'customer_id UUID NOT NULL REFERENCES customer(id)',
            'date TIMESTAMP NOT NULL DEFAULT NOW()',
            'rating integer NOT NULL check(rating > 0 AND rating <= 5)',
            'review varchar(1024) NOT NULL'
        ]
    },
    {
        name: 'oauth2',
        columns: [
            'customer_id UUID NOT NULL REFERENCES customer(id)',
            'provider varchar NOT NULL',
            'subject varchar NOT NULL',
            'PRIMARY KEY (customer_id, provider, subject)'
        ]
    }
]

const createTable = async (tableName, columns, removeTable) => {
    await db.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`)
    if (!removeTable) {
        await db.query(`CREATE TABLE ${tableName} (${columns})`)
    };
};

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
        };
    };
};

createTables();