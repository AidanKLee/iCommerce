const db = require('./model/database');
const { v4: uuid } = require('uuid');
const SQLQuery = require('./utils/SQLQuery');


const dbQuery = new SQLQuery(db.query);

const queries = [
    {
        name: 'selectCustomers',
        type: 'select',
        tables: [
            {name: 'customer', columns: ['id', 'first_name', 'last_name']},
            {name: 'customer_saved_item', columns: 'item_id'}
        ],
        // conditions: ['WHERE first_name ='],
        params: {
            // 'order by': 'first_name ASC',
            // 'group by': ['first_name'],
            // limit: 3,
            // offset: 1,
            // 'union': ['id', 'customer_saved_item.customer_id']
        }
    },
    {
        // camelCaseName
        name: 'insertCustomer',
        // SELECT, SELECT DISTINCT (AS), INSERST INTO, UPDATE, DELETE
        type: 'insert',
        tables: [
            {name: 'customer', columns: ['id', 'first_name', 'last_name']},
        ],
        // WHERE, AND, OR, NOT, LIKE(%, _), BETWEEN _ AND _ [String or Array of Strings]
        conditions: {},
        // ORDER BY, GROUP BY, LIMIT, WITH, JOIN, LEFT JOIN, CROSS JOIN, UNION, UNION ALL
        params: {}
    },
    {
        name: 'deleteCustomer',
        type: 'delete',
        tables: {name: 'customer'},
        conditions: ['WHERE first_name =']
    },
    {
        name: 'updateCustomer',
        type: 'update',
        tables: {name: 'customer', columns: ['id', 'first_name']},
        conditions: ['WHERE last_name =']
    }
]

queries.forEach(query => {
    dbQuery.build(query);
});

// const customers = [
//     [uuid(), 'Jade', 'Davey'],
//     [uuid(), 'Aidan', 'Lee'],
//     [uuid(), 'Eliot', 'Lee'],
//     [uuid(), 'Sophie', 'Hamilton']
// ]
// customers.forEach(customer => {
//     dbQuery.insertCustomer(customer);
// });

// const deleteCustomers = [
//     ['Jade', 'Davey'],
//     ['Aidan', 'Lee'],
//     ['Eliot', 'Lee'],
//     ['Sophie', 'Hamilton']
// ]
// deleteCustomers.forEach(customer => {
//     dbQuery.deleteCustomer(customer);
// });

// const select = async () => {
//     const data = await dbQuery.selectCustomers();
//     console.log(data)
// }
// select();


// console.log(dbQuery.queries)