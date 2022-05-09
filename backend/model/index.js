const db = require('./database');
const SQLQuery = require('../utils/SQLQuery');
const model = new SQLQuery(db.query);

const queries = [
    {
        name: 'selectImage',
        type: 'select',
        tables: {name: 'image', columns: ['id', 'src']},
        conditions: 'WHERE id ='
    },
    {
        name: 'selectItemImages',
        type: 'select',
        tables: [
            {name: 'image', columns: ['id', '"name"' ,'src', 'type']},
            {name: 'item_image', columns: ['"primary"']}
        ],
        conditions: ['WHERE item_id ='],
        params: {
            'left join': ['id', 'image_id']
        }
    },
    {
        name: 'insertImage',
        type: 'insert',
        tables: {name: 'image', columns: ['id', '"name"', 'src', 'type']}
    },
    {
        name: 'insertItemImage',
        type: 'insert',
        tables: {name: 'item_image', columns: ['item_id', 'image_id', '"primary"']}
    },
    {
        name: 'updateImage',
        type: 'update',
        tables: {name: 'image', columns: ['src']},
        conditions: ['WHERE id =']
    },
    {
        name: 'updateItemImage',
        type: 'update',
        tables: {name: 'item_image', columns: ['"primary"']},
        conditions: ['WHERE id =']
    },
    {
        name: 'deleteImage',
        type: 'delete',
        tables: {name: 'image'},
        conditions: ['WHERE id =']
    },
    {
        name: 'deleteItemImages',
        type: 'delete',
        tables: {name: 'item_image'},
        conditions: ['WHERE item_id =']
    },
    {
        name: 'selectUnusedImages',
        custom: 'SELECT image.id, image.src FROM image FULL OUTER JOIN item_image ON image.id = image_id WHERE item_image.item_id IS NULL'
    },
    {
        name: 'selectAllCustomers',
        type: 'select',
        tables: {name: 'customer', columns: '*'}
    },
    {
        name: 'selectCustomer',
        type: 'select',
        tables: [
            {name: 'customer', columns: '*'}
        ],
        conditions: 'WHERE id ='
    },
    {
        name: 'selectCustomerByEmail',
        type: 'select',
        tables: [
            {name: 'customer', columns: ['id', 'first_name', 'last_name', 'birth_date', 'email', 'phone', 'password', 'subscribed']}
        ],
        conditions: 'WHERE email ='
    },
    {
        name: 'insertCustomer',
        type: 'insert',
        tables: {name: 'customer', columns: ['id', 'first_name', 'last_name', 'birth_date', 'email', 'phone', 'password', 'subscribed']},
    },
    {
        name: 'selectOAuthSubject',
        type: 'select',
        tables: {name: 'oauth2', columns: ['*']},
        conditions: ['WHERE provider =', 'AND subject =']
    },
    {
        name: 'insertOAuthSubject',
        type: 'insert',
        tables: {name: 'oauth2', columns: ['customer_id', 'provider', 'subject']}
    },
    {
        name: 'deleteCustomerPerm',
        type: 'delete',
        tables: {name: 'customer'},
        conditions: ['WHERE id =']
    },
    {
        name: 'deleteCustomer',
        type: 'update',
        tables: {name: 'customer', columns: ['deleted', 'deleted_date']},
        conditions: ['WHERE id =']
    },
    {
        name: 'updateCustomer',
        type: 'update',
        tables: {name: 'customer', columns: ['first_name', 'last_name', 'birth_date', 'email', 'phone', 'password', 'subscribed', 'deleted', 'deleted_date']},
        conditions: ['WHERE id =']
    },
    {
        name: 'selectAddressById',
        type: 'select',
        tables: {name: 'address', columns: '*'},
        conditions: 'WHERE id ='
    },
    {
        name: 'selectCustomerAddresses',
        type: 'select',
        tables: {name: 'address', columns: '*'},
        conditions: 'WHERE customer_id ='
    },
    {
        name: 'selectSellerAddresses',
        type: 'select',
        tables: {name: 'address', columns: '*'},
        conditions: 'WHERE seller_id ='
    },
    {
        name: 'insertAddress',
        type: 'insert',
        tables: {name: 'address', columns: ['id', 'line_1', 'line_2', 'city', 'county', 'postcode', 'is_primary', 'customer_id', 'seller_id']},
    },
    {
        name: 'updateAddress',
        type: 'update',
        tables: {name: 'address', columns: ['line_1', 'line_2', 'county', 'postcode', 'is_primary']},
        conditions: ['WHERE id =']
    },
    {
        name: 'deleteAddress',
        type: 'delete',
        tables: {name: 'address'},
        conditions: ['WHERE id =']
    },
    {
        name: 'selectCart',
        type: 'select',
        tables: {name: 'cart', columns: '*'},
        conditions: ['WHERE customer_id =']
    },
    {
        name: 'insertCart',
        type: 'insert',
        tables: {name: 'cart', columns: ['id', 'customer_id']}
    },
    {
        name: 'updateCart',
        type: 'update',
        tables: {name: 'cart', columns: ['date_edited']},
        conditions: 'WHERE customer_id ='
    },
    {
        name: 'deleteCart',
        type: 'delete',
        tables: {name: 'cart'},
        conditions: 'WHERE customer_id ='
    },
    {
        name: 'selectCartProducts',
        custom: 'SELECT item_id, item_quantity FROM cart_item WHERE cart_id = $1'
    },
    {
        name: 'selectCartItems',
        type: 'select',
        tables: {name: 'cart_item', columns: '*'},
        conditions: 'WHERE cart_id ='
    },
    {
        name: 'selectCartItem',
        type: 'select',
        tables: {name: 'cart_item', columns: '*'},
        conditions: ['WHERE cart_id =', 'AND item_id =']
    },
    {
        name: 'insertCartItem',
        type: 'insert',
        tables: {name: 'cart_item', columns: ['cart_id', 'item_id', 'item_quantity']}
    },
    {
        name: 'updateCartItem',
        type: 'update',
        tables: {name: 'cart_item', columns: ['item_quantity']},
        conditions: ['WHERE cart_id =', 'AND item_id =']
    },
    {
        name: 'deleteCartItem',
        type: 'delete',
        tables: {name: 'cart_item'},
        conditions: ['WHERE cart_id =', 'AND item_id =']
    },
    {
        name: 'selectMainCategories',
        type: 'select',
        tables: {name: 'category WHERE parent_category_name IS NULL', columns: ['name, href']}
    },
    {
        name: 'selectSubCategories',
        type: 'select',
        tables: {name: 'category', columns: ['name, href']},
        conditions: ['WHERE parent_category_name =']
    },
    {
        name: 'insertCategory',
        type: 'insert',
        tables: {name: 'category', columns: ['name', 'href', 'parent_category_name']},
    },
    {
        name: 'deleteAllCategories',
        type: 'delete',
        tables: {name: 'category'}
    },
    {
        name: 'deleteCategory',
        type: 'delete',
        tables: {name: 'category'},
        conditions: ['WHERE name =']
    },
    {
        name: 'insertAttribute',
        type: 'insert',
        tables: {name: 'attribute', columns: ['name']}
    },
    {
        name: 'updateAttribute',
        type: 'update',
        tables: {name: 'attribute', columns: ['name']},
        conditions: ['WHERE name =']
    },
    {
        name: 'deleteAttribute',
        type: 'delete',
        tables: {name: 'attribute'},
        conditions: ['WHERE attribute =']
    },
    {
        name: 'deleteAllAttributes',
        type: 'delete',
        tables: {name: 'attribute'}
    },
    {
        name: 'selectAttributeValues',
        type: 'select',
        tables: {name: 'attribute_value', columns: 'value'},
        conditions: ['WHERE attribute =']
    },
    {
        name: 'insertAttributeValue',
        type: 'insert',
        tables: {name: 'attribute_value', columns: ['attribute', 'value']}
    },
    {
        name: 'updateAttributeValue', 
        type: 'update',
        tables: {name: 'attribute_value', columns: ['attribute', 'value']},
        conditions: ['WHERE attribute =', 'AND value =']
    },
    {
        name: 'deleteAttributeValue',
        type: 'delete',
        tables: {name: 'attribute_value'},
        conditions: ['WHERE attribute =', 'AND value =']
    },
    {
        name: 'deleteAllAttributeValues',
        type: 'delete',
        tables: {name: 'attribute_value'}
    },
    {
        name: 'selectCategoryAttributes',
        type: 'select',
        tables: {name: 'category_attribute', columns: 'attribute'},
        conditions: 'WHERE category_name ='
    },
    {
        name: 'selectCategoryByHref',
        type: 'select',
        tables: {name: 'category', columns: ['*']},
        conditions: 'WHERE href ='
    },
    {
        name: 'selectParentCategory',
        custom: 'SELECT category.name, href, parent_category_name, COUNT(DISTINCT(item.id)) FROM category LEFT JOIN product_category ON category.name = category_name LEFT JOIN item ON product_category.product_id = item.product_id WHERE category.name = $1 GROUP BY category.name'
    },
    {
        name: 'selectProductsByCategory',
        type: 'select',
        tables: [
            {name: 'product', columns: ['id', 'is_active', 'views', 'favourites']},
            {name: 'seller_product', columns: ['seller_id']},
            {name: 'product_category'}
        ],
        conditions: 'WHERE category_name =',
        params: {
            'left join': ['id', 'product_category.product_id'],
            'outer join': ['id', 'seller_product.product_id']
        }
    },
    {
        name: 'insertCategoryAttribute',
        type: 'insert',
        tables: {name: 'category_attribute', columns: ['category_name', 'attribute']}
    },
    {
        name: 'updateCategoryAttribute',
        type: 'update',
        tables: {name: 'category_attribute', columns: ['category_name', 'attribute']},
        conditions: ['WHERE category_name =', 'AND attribbute =']
    },
    {
        name: 'deleteCategoryAttribute',
        type: 'delete',
        tables: {name: 'category_attribute'},
        conditions: ['WHERE category_name =', 'AND attribbute =']
    },
    {
        name: 'deleteAllCategoriesAttributes',
        type: 'delete',
        tables: {name: 'category_attribute'}
    },
    {
        name: 'selectAllProducts',
        type: 'select',
        tables: {name: 'product', columns: '*'}
    },
    {
        name: 'selectProductById',
        type: 'select',
        tables: [
            {name: 'product', columns: ['id', 'is_active', 'views', 'favourites']},
            {name: 'seller_product', columns: ['seller_id']}
        ],
        conditions: 'WHERE product.id =',
        params: {
            'join': ['id', 'seller_product.product_id']
        }
    },
    {
        name: 'selectProductByItemId',
        custom: 'SELECT product.id AS id, is_active, views, favourites, item.id AS selected_item_id, seller_id FROM product JOIN seller_product ON product.id = seller_product.product_id JOIN item ON product.id = item.product_id WHERE item.id = $1'
    },
    {
        name: 'selectProductByCartItemId',
        custom: 'SELECT product.id AS id, is_active, views, favourites, item.id AS selected_item_id, seller_id, item_quantity FROM product JOIN seller_product ON product.id = seller_product.product_id JOIN item ON product.id = item.product_id JOIN cart_item ON item.id = cart_item.item_id WHERE item.id = $1 AND cart_item.cart_id = $2'
    },
    {
        name: 'selectProductByName',
        custom: 'SELECT * FROM product WHERE name LIKE %$1% OR DESCRIPTION LIKE %$1% ORDER BY (CASE WHEN name = "$1" THEN 1 WHEN name LIKE "%$1% " THEN 2 ELSE 3 END), name'
    },
    {
        name: 'selectProductsByCategory',
        type: 'select',
        tables: [
            {name: 'product', columns: ['id', 'is_active', 'views', 'favourites']},
            {name: 'seller_product', columns: ['seller_id']},
            {name: 'product_category'}
        ],
        conditions: 'WHERE category_name =',
        params: {
            'left join': ['id', 'product_category.product_id'],
            'outer join': ['id', 'seller_product.product_id']
        }
    },
    {
        name: 'insertProduct',
        type: 'insert',
        tables: {name: 'product', columns: ['id', 'is_active']}
    },
    {
        name: 'updateProduct',
        type: 'update',
        tables: {name: 'product', columns: ['is_active']},
        conditions: ['WHERE id =']
    },
    {
        name: 'incrememntProductViews',
        custom: 'UPDATE product SET views = views + 1 WHERE id = $1'
    },
    {
        name: 'incrememntProductFavourites',
        custom: 'UPDATE product SET favourites = favourites + 1 WHERE id = $1'
    },
    {
        name: 'deleteProduct',
        type: 'delete',
        tables: {name: 'product'},
        conditions: 'WHERE id ='
    },
    {
        name: 'selectProductCategories',
        type: 'select',
        tables: {name: 'product_category',  columns: 'category_name'},
        conditions: 'WHERE product_id ='
    },
    {
        name: 'insertProductCategory',
        type: 'insert',
        tables: {name: 'product_category',  columns: ['product_id', 'category_name']}
    },
    {
        name: 'updateProductCategory',
        type: 'update',
        tables: {name: 'product_category',  columns: ['category_name']},
        conditions: ['WHERE product_id =', 'AND category_name =']
    },
    {
        name: 'deleteProductCategory',
        type: 'delete',
        tables: {name: 'product_category'},
        conditions: ['WHERE product_id =', 'AND category_name =']
    },
    {
        name: 'deleteProductCategories',
        type: 'delete',
        tables: {name: 'product_category'},
        conditions: ['WHERE product_id =']
    },
    {
        name: 'selectItemById',
        type: 'select',
        tables: {name: 'item', columns: ['id', 'product_id', 'name', 'description', 'price', 'in_stock', 'ordered', 'awards']},
        conditions: ['WHERE id ='],
    },
    {
        name: 'selectItemPrimaryImage',
        custom: 'SELECT image.id, image.name, image.src, image.type FROM image LEFT JOIN item_image on image.id = item_image.image_id WHERE item_image.item_id = $1'
    },
    {
        name: 'selectItemsByProductId',
        type: 'select',
        tables: {name: 'item', columns: ['id', 'name', 'description', 'price', 'in_stock', 'ordered', 'awards']},
        conditions: 'WHERE product_id =',
    },
    {
        name: 'insertItem',
        type: 'insert',
        tables: {name: 'item', columns: ['id', 'product_id', 'name', 'description', 'price', 'in_stock']}
    },
    {
        name: 'updateItem',
        type: 'update',
        tables: {name: 'item', columns: ['name', 'description', 'price']},
        conditions: 'WHERE id ='
    },
    {
        name: 'itemsSold',
        custom: 'UPDATE item SET ordered = ordered + $1, in_stock = in_stock - $1 WHERE id = $2'
    },
    {
        name: 'itemsReturned',
        custom: 'UPDATE item SET ordered = ordered - $1, in_stock = in_stock + $1 WHERE id = $2'
    },
    {
        name: 'itemsInventoryAdd',
        custom: 'UPDATE item SET in_stock = in_stock + $1 WHERE id = $2'
    },
    {
        name: 'itemsInventoryMinus',
        custom: 'UPDATE item SET in_stock = in_stock - $1 WHERE id = $2'
    },
    {
        name: 'deleteItem',
        type: 'delete',
        tables: {name: 'item'},
        conditions: 'WHERE id ='
    },
    {
        name: 'selectItemAttributeValues',
        type: 'select',
        tables: {name: 'item_attribute_value', columns: ['attribute', 'value']},
        conditions: 'WHERE item_id ='
    },
    {
        name: 'insertItemAttributeValues',
        type: 'insert',
        tables: {name: 'item_attribute_value', columns: ['item_id', 'attribute', 'value']}
    },
    {
        name: 'updateItemAttributeValue',
        type: 'update',
        tables: {name: 'item_attribute_value', columns: ['value']},
        conditions: ['WHERE item_id =', 'AND attribute =']
    },
    {
        name: 'deleteItemAttributeValues',
        type: 'delete',
        tables: {name: 'item_attribute_value'},
        conditions: ['WHERE item_id =', 'AND attribute =', 'AND value =']
    },
    {
        name: 'selectCustomerSavedProducts',
        custom: 'SELECT item_id FROM customer_saved_item WHERE customer_id = $1'
    },
    {
        name: 'selectCustomerSavedItems',
        custom: 'SELECT id, product_id, name, description, price, in_stock, ordered, awards FROM item LEFT JOIN customer_saved_item ON id = item_id WHERE customer_id = $1'
    },
    {
        name: 'selectCustomerSavedItem',
        custom: 'SELECT item_id FROM customer_saved_item WHERE customer_id = $1 AND item_id = $2'
    },
    {
        name: 'insertCustomerSavedItem',
        type: 'insert',
        tables: {name: 'customer_saved_item', columns: ['customer_id', 'item_id']}
    },
    {
        name: 'deleteCustomerSavedItem',
        type: 'delete',
        tables: {name: 'customer_saved_item'},
        conditions: ['WHERE customer_id =', 'AND item_id =']
    },
    {
        name: 'deleteCustomerSavedItems',
        type: 'delete',
        tables: {name: 'customer_saved_item'},
        conditions: ['WHERE customer_id =']
    },
    {
        name: 'selectSaleOptions',
        type: 'select',
        tables: {name: 'sale', columns: '*'}
    },
    {
        name: 'insertSaleOption',
        type: 'insert',
        tables: {name: 'sale', columns: ['percent']}
    },
    {
        name: 'deleteSaleOptions',
        type: 'delete',
        tables: {name: 'sale'}
    },
    {
        name: 'selectItemSales',
        type: 'select',
        tables: {name: 'item_sale', columns: '*'},
        conditions: ['WHERE item_id =']
    },
    {
        name: 'insertItemSale',
        type: 'insert',
        tables: {name: 'item_sale', columns: ['item_id', 'sale_percent', 'start_date', 'end_date']}
    },
    {
        name: 'updateItemSale',
        type: 'update',
        tables: {name: 'item_sale', columns: ['sale_percent', 'start_date', 'end_date']},
        conditions: ['WHERE item_id =']
    },
    {
        name: 'deleteItemSale',
        type: 'delete',
        tables: {name: 'item_sale'},
        conditions: ['WHERE item_id =']
    },
    {
        name: 'selectProductSales',
        type: 'select',
        tables: {name: 'product_sale', columns: '*'},
        conditions: ['WHERE product_id =']
    },
    {
        name: 'insertProductSale',
        type: 'insert',
        tables: {name: 'product_sale', columns: ['product_id', 'sale_percent', 'start_date', 'end_date']}
    },
    {
        name: 'updateProductSale',
        type: 'update',
        tables: {name: 'product_sale', columns: ['sale_percent', 'start_date', 'end_date']},
        conditions: ['WHERE product_id =']
    },
    {
        name: 'deleteProductSale',
        type: 'delete',
        tables: {name: 'product_sale'},
        conditions: ['WHERE product_id =']
    },
    {
        name: 'selectSellers',
        type: 'select',
        tables: {name: 'seller', columns: '*'}
    },
    {
        name: 'selectSellerById',
        type: 'select',
        tables: {name: 'seller', columns: '*'},
        conditions: ['WHERE id =']
    },
    {
        name: 'selectSellerByName',
        custom: 'SELECT * FROM seller WHERE shop_name LIKE%$1% ORDER BY (CASE WHEN shop_name = "$1" THEN 1 WHEN shop_name LIKE "%$1% " THEN 2 ELSE 3 END), name'
    },
    {
        name: 'selectSellerName',
        custom: 'SELECT shop_name FROM seller WHERE shop_name = $1'
    },
    {
        name: 'selectSellerStats',
        type: 'select',
        tables: [
            {name: 'order_item', columns: 'SUM(item_quantity) AS sold_products'},
            {name: 'seller_review', columns: ['ROUND(AVG(rating), 2) AS average_rating', 'COUNT(*) AS review_count']}
        ],
        conditions: ['WHERE order_item.seller_id ='],
        params: {
            'left join': ['order_item.order_id', 'seller_review.order_id']
        }
    },
    {
        name: 'selectSellerByProduct',
        type: 'select',
        tables: [
            {name: 'seller', columns: ['id', 'shop_name']},
            {name: 'seller_product'}
        ],
        conditions: ['WHERE product_id ='],
        params: {
            'left join': ['id', 'seller_id']
        }
    },
    {
        name: 'insertSeller',
        type: 'insert',
        tables: {name: 'seller', columns: ['id', 'shop_name', 'image_id', 'description', 'business_email', 'business_phone', 'business_type', 'stripe_id']}
    },
    {
        name: 'updateStripeId',
        type: 'update',
        tables: {name: 'seller', columns: ['stripe_id']},
        conditions: ['WHERE id =']
    },
    {
        name: 'updateSeller',
        type: 'update',
        tables: {name: 'seller', columns: ['shop_name', 'image_id', 'description', 'business_email', 'business_phone']},
        conditions: 'WHERE id ='
    },
    {
        name: 'deleteSeller',
        type: 'delete',
        tables: {name: 'seller'},
        conditions: 'WHERE id ='
    },
    {
        name: 'selectSellerProducts',
        type: 'select',
        tables: [
            {name: 'product', columns: ['id', 'is_active', 'views', 'favourites']},
            {name: 'seller_product', columns: ['seller_id']}
        ],
        conditions: 'WHERE seller_id =',
        params: {
            'left join': ['id', 'product_id']
        }
    },
    {
        name: 'insertSellerProduct',
        type: 'insert',
        tables: {name: 'seller_product', columns: ['seller_id', 'product_id']}
    },
    {
        name: 'deleteSellerProduct',
        type: 'delete',
        tables: {name: 'seller_product'},
        conditions: ['WHERE seller_id =', 'AND product_id =']
    },
    {
        name: 'selectOrderById',
        type: 'select',
        tables: {name: '"order"', columns: '*'},
        conditions: ['WHERE id =']
    },
    {
        name: 'selectCustomerOrders',
        custom: `SELECT "order".id, customer_id, date, delivery_address_id, payment_complete, postage_option, postage_price FROM "order" LEFT JOIN order_item ON "order".id = order_id LEFT JOIN item ON item.id = item_id WHERE customer_id = $1 AND date_part('year', date) >= $2 AND date_part('year', date) <= $3 AND name ILIKE $4 GROUP BY "order".id ORDER BY date DESC LIMIT $5 OFFSET $6`
    },
    {
        name: 'selectCustomerOrderYears',
        custom: `SELECT DISTINCT(date_part('year', date)) AS year FROM "order" WHERE customer_id = $1 ORDER BY year DESC`
    },
    {
        name: 'selectCustomerOrderCount',
        custom: `SELECT COUNT(DISTINCT(id)) AS count FROM "order" WHERE customer_id = $1`
    },
    {
        name: 'selectSellerOrders',
        custom: `SELECT "order".id, customer_id, date, delivery_address_id, payment_complete, postage_option, postage_price FROM "order" LEFT JOIN order_item ON "order".id = order_id LEFT JOIN item ON item.id = item_id WHERE seller_id = $1 AND date_part('year', date) >= $2 AND date_part('year', date) <= $3 AND name ILIKE $4 GROUP BY "order".id ORDER BY date DESC LIMIT $5 OFFSET $6`
    },
    {
        name: 'selectSellerOrderYears',
        custom: `SELECT DISTINCT(date_part('year', date)) AS year FROM "order" LEFT JOIN order_item ON "order".id = order_id WHERE seller_id = $1 ORDER BY year DESC`
    },
    {
        name: 'selectSellerOrderCount',
        custom: `SELECT COUNT(DISTINCT("order".id)) AS count FROM "order" LEFT JOIN order_item ON "order".id = order_id WHERE seller_id = $1`
    },
    {
        name: 'insertCustomerOrder',
        type: 'insert',
        tables: {name: '"order"', columns: ['id', 'customer_id', 'date', 'delivery_address_id']}
    },
    {
        name: 'updateCustomerOrder',
        type: 'update',
        tables: {name: '"order"', columns: ['delivery_address_id']},
        conditions: ['WHERE id =']
    },
    {
        name: 'selectAllCustomerOrderedItem',
        type: 'select',
        tables: [
            {name: 'order_item', columns: '*'},
            {name: '"order"'}
        ],
        conditions: ['WHERE customer_id ='],
        params: {
            'left join': ['order.id', 'order_id']
        }
    },
    {
        name: 'selectCustomerOrderItems',
        type: 'select',
        tables: {name: 'order_item', columns: '*'},
        conditions: ['WHERE order_id =']
    },
    {
        name: 'selectSellerOrderItems',
        type: 'select',
        tables: {name: 'order_item', columns: '*'},
        conditions: ['WHERE order_id =', 'AND seller_id =']
    },
    {
        name: 'selectCustomerOrderItem',
        type: 'select',
        tables: {name: 'order_item', columns: '*'},
        conditions: ['WHERE order_id =', 'AND item_id =']
    },
    {
        name: 'selectAllSellerSoldItems',
        type: 'select',
        tables: {name: 'order_item', columns: '*'},
        conditions: 'WHERE seller_id ='
    },
    {
        name: 'selectOrderItemsIdBySeller',
        type: 'select',
        tables: {name: 'order_item', columns: ['id']},
        conditions: ['WHERE order_id =', 'AND seller_id =']
    },
    {
        name: 'selectOrderItemsIdByOrder',
        type: 'select',
        tables: {name: 'order_item', columns: ['id']},
        conditions: ['WHERE order_id =']
    },
    {
        name: 'insertOrder',
        type: 'insert',
        tables: {name: '"order"', columns: ['id', 'customer_id', 'delivery_address_id', 'postage_option', 'postage_price']}
    },
    {
        name: 'updateOrder',
        type: 'update',
        tables: {name: '"order"', columns: ['payment_complete']},
        conditions: ['WHERE id =']
    },
    {
        name: 'insertOrderItem', 
        type: 'insert',
        tables: {name: 'order_item', columns: ['id', 'order_id', 'seller_id', 'item_id', 'item_price', 'item_quantity']}
    },
    {
        name: 'updateItemDispatchDate',
        type: 'update',
        tables: {name: 'order_item', columns: ['dispatch_date']},
        conditions: ['WHERE id =']
    },
    {
        name: 'updateItemDeliveryDate',
        type: 'update',
        tables: {name: 'order_item', columns: ['delivery_date']},
        conditions: ['WHERE id =']
    },
    {
        name: 'updateItemCustomerReviewed',
        type: 'update',
        tables: {name: 'order_item', columns: ['reviewed_customer']},
        conditions: ['WHERE id =']
    },
    {
        name: 'updateItemReviewed',
        type: 'update',
        tables: {name: 'order_item', columns: ['reviewed_item']},
        conditions: ['WHERE id =']
    },
    {
        name: 'updateItemSellerReviewed',
        type: 'update',
        tables: {name: 'order_item', columns: ['reviewed_seller']},
        conditions: ['WHERE id =']
    },
    {
        name: 'cancelOrderItemCustomer',
        custom: 'UPDATE order_item SET cancelled = true WHERE id = $1'
    },
    {
        name: 'selectPendingTransfersByOrderId',
        custom: 'SELECT order_item.id, item_id, order_id, item_quantity, price, seller_id, stripe_id FROM order_item LEFT JOIN "order" on "order".id = order_id LEFT JOIN item ON item.id = item_id LEFT JOIN seller ON seller.id = seller_id WHERE payment_complete = true AND order_id = $1'
    },
    {
        name: 'markSellerAsPaid',
        custom: 'UPDATE order_item SET seller_paid = true, transfer_id = $1 WHERE id = $2'
    },
    {
        name: 'selectProductReviews',
        custom: 'SELECT product_review.id, product_review.date, rating, review, first_name, last_name, "order".date AS order_date FROM product_review LEFT JOIN customer ON user_id = customer.id LEFT JOIN "order" ON order_id = "order".id WHERE product_id = $1 AND product_review.id IS NOT NULL ORDER BY product_review.date DESC'
        // type: 'select',
        // tables: [
        //     {name: 'product_review', columns: ['product_review.id', 'product_review.date', 'rating', 'review']},
            // {name: 'customer', columns: ['first_name', 'last_name']},
            // {name: '"order"', columns: ['"order".date']}
        // ],
        // conditions: ['WHERE product_id ='],
        // params: {
        //     'left join': ['user_id', 'customer.id'],
        //     'join': ['order_id', '"order".id']
        // }
    },
    {
        name: 'selectProductStats',
        type: 'select',
        tables: [
            {name: 'product_review', columns: ['ROUND(AVG(rating), 2) AS average_rating', 'COUNT(*) AS count']},
            {name: 'order_item', columns: []}
        ],
        conditions: 'WHERE product_id =',
    },
    {
        name: 'selectCustomerProductReviews',
        type: 'select',
        tables: {name: 'product_review', columns: '*'},
        conditions: 'WHERE user_id ='
    },
    {
        name: 'insertProductReview',
        type: 'insert',
        tables: {name: 'product_review', columns: ['id', 'user_id', 'order_id', 'product_id', 'rating', 'review']}
    },
    {
        name: 'updateProductReview',
        type: 'update',
        tables: {name: 'product_review', columns: ['rating', 'review']},
        conditions: ['WHERE id =']
    },
    {
        name: 'deleteProductReview',
        type: 'delete',
        tables: {name: 'product_review'},
        conditions: ['WHERE id =']
    },
    {
        name: 'selectSellerReviews',
        type: 'select',
        tables: {name: 'seller_review', columns: '*'},
        conditions: 'WHERE seller_id ='
    },
    {
        name: 'selectCustomerSellerReviews',
        type: 'select',
        tables: {name: 'seller_review', columns: '*'},
        conditions: 'WHERE user_id ='
    },
    {
        name: 'insertSellerReview',
        type: 'insert',
        tables: {name: 'seller_review', columns: ['id', 'user_id', 'order_id', 'seller_id', 'rating', 'review']}
    },
    {
        name: 'updateSellerReview',
        type: 'update',
        tables: {name: 'seller_review', columns: ['rating', 'review']},
        conditions: ['WHERE id =']
    },
    {
        name: 'deleteSellerReview',
        type: 'delete',
        tables: {name: 'seller_review'},
        conditions: ['WHERE id =']
    },
    {
        name: 'selectCustomerReviews',
        type: 'select',
        tables: {name: 'customer_review', columns: '*'},
        conditions: 'WHERE customer_id ='
    },
    {
        name: 'selectSellerCustomerReviews',
        type: 'select',
        tables: {name: 'customer_review', columns: '*'},
        conditions: 'WHERE user_id ='
    },
    {
        name: 'insertCustomerReview',
        type: 'insert',
        tables: {name: 'customer_review', columns: ['id', 'user_id', 'order_id', 'customer_id', 'rating', 'review']}
    },
    {
        name: 'updateCustomerReview',
        type: 'update',
        tables: {name: 'customer_review', columns: ['rating', 'review']},
        conditions: ['WHERE id =']
    },
    {
        name: 'deleteCustomerReview',
        type: 'delete',
        tables: {name: 'customer_review'},
        conditions: ['WHERE id =']
    },
    {
        name: 'deleteAllProducts',
        type: 'delete',
        tables: {name: 'product'}
    },
    {
        name: 'deleteAllProductCategories',
        type: 'delete',
        tables: {name: 'product_category'}
    },
    {
        name: 'deleteAllItems',
        type: 'delete',
        tables: {name: 'item'}
    },
    {
        name: 'deleteAllItemsAttributes',
        type: 'delete',
        tables: {name: 'item_attribute_value'}
    },
    {
        name: 'deleteAllItemImages',
        type: 'delete',
        tables: {name: 'item_image'}
    }
    ,
    {
        name: 'deleteAllImages',
        type: 'delete',
        tables: {name: 'image'}
    }
]


queries.forEach(query => {
    model.build(query);
});

module.exports = model;