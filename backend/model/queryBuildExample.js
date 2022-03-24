const example = {
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
}

const template = {
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
}