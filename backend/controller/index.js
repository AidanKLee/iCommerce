const model = require('../model');
const middleware = require('./middleware');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();
const { helper } = middleware;

const attributes = {};



const auth = {};

auth.restoreSession = async (req, res, next) => {
    try {
        let customer = await model.selectCustomerByEmail([req.session.passport.user.email]);
        customer = customer[0];
        delete customer.password;
        req.user = customer;
        next();
    } catch (err) {
        next(err)
    }
}

auth.login = async (email, password, next) => {
    try {
        const user = await model.selectCustomerByEmail([email]);
        if (user.length === 0) {
            const err = new Error('Incorrect E-Mail.');
            err.status = 404;
            return next(err, false, {message: 'Incorrect email.'});
        }
        const match = await bcrypt.compare(password, user[0].password);
        if (!match) {
            const err = new Error('Incorrect password.');
            err.status = 400;
            return next(err, false, {message: 'Incorrect password.'});
        }
        return next(null, user[0]);
    } catch (err) {
        return next(err);
    };
};

auth.register = async (req, res, next) => {
    const { first_name, last_name, birth_date, email, phone, password, subscribed } = req.body;
    const saltRounds = 16;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        await model.insertCustomer([uuid(), first_name, last_name, birth_date, email, phone, hash, subscribed]);
        res.status(201).json({message: 'Success'});
    } catch (err) {
        next(err);
    }
}

auth.google = async (req, accessToken, refreshToken, profile, next) => {
    try {
        let user = await model.selectOAuthSubject([profile.provider, profile.id]);
        let customer = await model.selectCustomerByEmail([profile.email]);
        if (user.length === 0) {
            if (customer.length === 0) {
                let people = await fetch(`https://people.googleapis.com/v1/people/me?personFields=birthdays,phoneNumbers&key=${process.env['GOOGLE_API_KEY']}&access_token=${refreshToken.access_token}`);
                people = await people.json();
                const {birthdays/*, phoneNumbers*/} = people;
                let birthday;
                let phoneNumber = null;
                if (birthdays) {
                    birthday = birthdays.filter(birth => {
                        return birth.date.day && birth.date.month && birth.date.year
                    })[0].date;
                }
                birthday = birthday && birthday.year ? new Date(`${birthday.year}-${birthday.month}-${birthday.day}`).toDateString() : new Date('2001-01-01').toDateString();
                await model.insertCustomer([uuid(), profile.given_name, profile.family_name, birthday, profile.email, phoneNumber, uuid(), true]);
                customer = await model.selectCustomerByEmail([profile.email]);
            }
            await model.insertOAuthSubject([customer[0].id, profile.provider, profile.id]);
        }
        next(null, customer[0]);
    } catch (err) {
        next(err);
    }
}

auth.facebook = async (accessToken, refreshToken, profile, next) => {
    try {
        let people = await fetch(`https://graph.facebook.com/v13.0/me?fields=email,birthday&access_token=${accessToken}`);
        people = await people.json();
        let user = await model.selectOAuthSubject([profile.provider, profile.id]);
        let customer = await model.selectCustomerByEmail([people.email]);
        if (user.length === 0) {
            if (customer.length === 0) {
                let phoneNumber = null;
                let birthday = new Date('2001-01-01').toDateString();
                let { family_name, given_name } = profile.name;
                if (!family_name) {
                    family_name = profile.displayName.split(' ').at(-1);
                }
                if (!given_name) {
                    given_name = profile.displayName.split(' ')[0];
                }
                await model.insertCustomer([uuid(), given_name, family_name, birthday, people.email, phoneNumber, uuid(), true]);
                customer = await model.selectCustomerByEmail([people.email]);
            }
            await model.insertOAuthSubject([customer[0].id, profile.provider, profile.id]);
        }
        next(null, customer[0]);
    } catch (err) {
        next(err);
    }
}

auth.registerShop = async (req, res, next) => {
    const { shop_name, description, business_email, business_phone } = req.body;
    try {
        await model.insertSeller([req.session.passport.user.id, shop_name, null, description, business_email, business_phone]);
        let user = await model.selectCustomerByEmail([req.session.passport.user.email]);
        delete user[0].password;
        req.user = user[0];
        next();
    } catch (err) {
        next(err);
    }
}

const categories = {};

categories.getAll = async (req, res, next) => {
    try {
        let categories = await model.selectMainCategories();
        categories = await helper.getSubCategories(categories);
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    };
};

categories.getMain = async (req, res, next) => {
    try {
        let categories = await model.selectMainCategories();
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    };
}

categories.getSub = async (req, res, next) => {
    try {
        let categories = await model.selectSubCategories([req.params.category]);
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    };
};

categories.getByHref = async (req, res, next) => {
    try {
        let category = await model.selectCategoryByHref(['/' + req.params.href])
        category = category[0];
        res.status(200).json(category);
    } catch (err) {
        next(err)
    };
};

categories.getAttributes = async (req, res, next) => {
    try {
        let attributes = await model.selectCategoryAttributes([req.params.category]);
        attributes = attributes.map(attribute => attribute.attribute);
        const attributesValues = [];
        for (let attribute of attributes) {
            let values = await model.selectAttributeValues([attribute]);
            values = values.map(value => value.value);
            attributesValues.push({attribute,  values});
        };
        res.status(200).json(attributesValues);
    } catch (err) {
        next(err);
    };
};

const customer = {};

customer.saveItem = async (req, res, next) => {
    try {
        const { customerId, itemId } = req.params;
        const { no_delete } = req.query;
        const savedItem = await model.selectCustomerSavedItem([customerId, itemId]);
        if (savedItem.length === 0) {
            await model.insertCustomerSavedItem([customerId, itemId]);
            next();
        } else if (!no_delete) {
            await model.deleteCustomerSavedItem([customerId, itemId]);
            next();
        } else {
            res.status(409).json({message: 'Already exists'})
        }
    } catch (err) {
        next(err);
    }
}

customer.addCartItem = async (req, res, next) => {
    try {
        const { customerId, cartId, itemId } = req.params;
        req.query.cart_id = cartId;
        let { quantity, no_update } = req.query;
        quantity = Number(quantity);
        let cartItem = await model.selectCartItem([cartId, itemId]);
        if (cartItem.length === 0) {
            await model.insertCartItem([cartId, itemId, quantity]);
            await model.updateCart([new Date().toISOString(), customerId]);
            next();
        } else if (!no_update) {
            let { item_quantity } = cartItem[0];
            item_quantity = Number(item_quantity);
            await model.updateCartItem([item_quantity + quantity, cartId, itemId]);
            await model.updateCart([new Date().toISOString(), customerId]);
            next()
        } else {
            res.status(409).json({message: 'Already exists'});
        }
    } catch (err) {
        next(err);
    }
}

customer.updateCartItem = async (req, res, next) => {
    try {
        const { customerId, cartId, itemId } = req.params;
        req.query.cart_id = cartId;
        const { quantity } = req.query;
        await model.updateCartItem([Number(quantity), cartId, itemId]);
        await model.updateCart([new Date().toISOString(), customerId]);
        next();
    } catch (err) {
        next(err);
    }
}

customer.deleteCartItem = async (req, res, next) => {
    try {
        const { customerId, cartId, itemId } = req.params;
        await model.deleteCartItem([cartId, itemId]);
        await model.updateCart([new Date().toISOString(), customerId]);
        res.status(200).json({message: 'Item deleted from cart.'});
    } catch (err) {
        next(err);
    }
}

const products = {};

products.get = async (req, res, next) => {
    try {
        let { userId = '', category } = req.params;
        let { attributes = [], query, sort = 'popular', limit = 25, page = 1 } = req.query;

        if (category === '*') {
            category = ''
        }

        let attributeConditions = [];
        let conditions = [];
        let dbQuery = [];
        //offset
        let queryCount = 1;
        let conditionJoin = 'WHERE';

        let categoryIndex;
        let parentCategory = {};
        if (category && category.length > 0) {
            const categoryName = await model.selectCategoryByHref(['/' + category]);
            parentCategory = await model.selectParentCategory([categoryName[0].parent_category_name]);
            dbQuery.push(categoryName[0].name);
            conditions.push(`${conditionJoin} category.name = $${queryCount}`);
            categoryIndex = queryCount;
            queryCount ++;
            conditionJoin = 'AND'
        }
                
        if (userId && userId.length > 0) {
            dbQuery.push(userId);
            conditions.push(`${conditionJoin} seller_id = $${queryCount}`);
            queryCount ++;
            conditionJoin = 'AND'
        }

        if (query && query.length > 0) {
            dbQuery.push(query);
            conditions.push(`${conditionJoin} item.name ILIKE '%' || $${queryCount} || '%'`);
            queryCount ++;
            conditionJoin = 'AND'
        }

        attributes = typeof attributes === 'string' ? [attributes] : attributes;
        attributes = attributes.map(attribute => {
            attribute = attribute.split('~');
            return {key: attribute[0], value: attribute[1]}
        });
        if (attributes.length > 0) {
            let queryAttributes = {};
            attributes.forEach((attribute) => {
                if (queryAttributes[attribute.key]) {
                    queryAttributes[attribute.key] = [...queryAttributes[attribute.key], attribute.value]
                } else {
                    queryAttributes[attribute.key] = [attribute.value]
                }
            })
            const queryAttributeKeys = Object.keys(queryAttributes);
            let attributeCount = 1;
            queryAttributeKeys.forEach(key => {
                let condition = [];
                if (queryAttributes[key].length === 1) {
                    condition.push(`${conditionJoin} a${attributeCount}.value = $${queryCount}`);
                    dbQuery.push(queryAttributes[key][0]);
                    conditionJoin = 'AND'
                    queryCount ++;
                    attributeCount ++;
                } else {
                    queryAttributes[key].forEach((attribute, i) => {
                        if (i === 0) {
                            condition.push(`${conditionJoin} (a${attributeCount}.value = $${queryCount}`);
                            conditionJoin = 'OR'
                        } else if (i === queryAttributes[key].length - 1) {
                            condition.push(`${conditionJoin} a${attributeCount}.value = $${queryCount})`);
                            conditionJoin = 'AND'
                        } else {
                            condition.push(`${conditionJoin} a${attributeCount}.value = $${queryCount}`);
                        }
                        dbQuery.push(attribute);
                        queryCount ++;
                        attributeCount ++;
                    })
                }
                attributeConditions.push(condition.join(' '));
            })
        }
        if (sort && sort.length > 0) {
            if (sort === 'name-asc') {
                sort = `ORDER BY STRING_AGG(item.name, '-') ASC`
            } else if (sort === 'name-desc') {
                sort = `ORDER BY STRING_AGG(item.name, '-') DESC`
            } else if (sort === 'price-asc') {
                sort = `ORDER BY MIN(item.price) ASC`
            } else if (sort === 'price-desc') {
                sort = `ORDER BY MAX(item.price) DESC`
            } else if (sort === 'top-rated') {
                sort = `ORDER BY CASE WHEN AVG(rating) IS NULL THEN 1 ELSE 0 END, AVG(rating) DESC`
            } else if (sort === 'most-viewed') {
                sort = `ORDER BY CASE WHEN AVG(views) IS NULL THEN 1 ELSE 0 END, AVG(views) DESC`
            } else if (sort === 'popular') {
                sort = `ORDER BY CASE WHEN AVG(ordered) IS NULL THEN 1 ELSE 0 END, AVG(ordered) DESC`
            }
        }
        const productsSelect = `SELECT product.id, is_active, views, favourites, seller_id`;
        const itemSelect = `SELECT item.id, item.name, description, price, in_stock, ordered, awards`;
        const productCount = `SELECT SUM(product_count) AS product_count FROM (SELECT product.id, COUNT(DISTINCT(product.id)) AS product_count`;
        const itemCount = `SELECT SUM(item_count) AS item_count FROM (SELECT COUNT(DISTINCT(item.id)) AS item_count`;
        let productCategories = `SELECT category_name, href, parent_category_name, COUNT(DISTINCT(item.name))`;
        let itemAttributes = `SELECT DISTINCT(item_attribute_value.attribute)`;
        let attributeValues = `SELECT item_attribute_value.attribute, item_attribute_value.value, COUNT(DISTINCT(item.name))`;
        const tables = `FROM product`;
        let join = `JOIN seller_product ON product.id = seller_product.product_id JOIN product_category ON product.id = product_category.product_id JOIN category ON category.name = category_name JOIN item ON product.id = item.product_id JOIN item_attribute_value ON item_attribute_value.item_id = item.id FULL OUTER JOIN product_review ON product.id = product_review.product_id`;
        if (attributes.length > 0) {
            const attributeJoins = attributes.map((attribute, i) => {
                return `LEFT JOIN item_attribute_value a${i + 1} ON item.id = a${i + 1}.item_id AND a${i + 1}.attribute = '${attribute.key}'`
            }).join(' ');
            join = `${join} ${attributeJoins}`;
        };
        
        let categoryConditions = conditions.length > 0 ? conditions.filter(condition => !condition.includes('category.name')).join(' ') : '';
        attributeConditions = attributeConditions.length > 0 ? attributeConditions.join(' ') : '';
        conditions = conditions.length > 0 ? conditions : [];
        const productGroup = `GROUP BY product.id, seller_product.seller_id`;
        const itemGroup = `GROUP BY item.id`;
        dbQuery.push(limit);
        const limiter = `LIMIT $${queryCount}`;
        queryCount ++;
        const offset = `OFFSET $${queryCount}`;
        dbQuery.push((page * limit) - limit);
        queryCount ++;

        let productQuery = [productsSelect, tables, join];
        let itemQuery = [itemSelect, tables, join];
        let productCounter = [productCount, tables, join];
        let itemCounter = [itemCount, tables, join];
        productCategories = [productCategories, tables, join];
        itemAttributes = [itemAttributes, tables, join];
        attributeValues = [attributeValues, tables, join];

        productCategories.push([`WHERE ${!categoryIndex ? `parent_category_name IS NULL` : `parent_category_name = $${categoryIndex}`}`, categoryConditions.includes('WHERE') ? categoryConditions.replace('WHERE', 'AND') : categoryConditions].filter(statement => statement !== '').join(' '));

        if (conditions.length > 0) {
            productQuery.push(conditions.join(' '));
            itemQuery.push(conditions.join(' '));
            productCounter.push(conditions.join(' '));
            itemCounter.push(conditions.join(' '));
            itemAttributes.push(conditions.join(' '));
            attributeValues.push(conditions.join(' '));
        }

        if (attributeConditions.length > 0) {
            productQuery.push(attributeConditions);
            itemQuery.push(attributeConditions);
            productCounter.push(attributeConditions);
            itemCounter.push(attributeConditions);
            productCategories.push(attributeConditions.includes('WHERE') ? attributeConditions.replace('WHERE', 'AND') : attributeConditions);
            itemAttributes.push(attributeConditions);
        }

        productQuery = [...productQuery, productGroup, sort, limiter, offset].join(' ');
        itemQuery = [...itemQuery, `${conditionJoin} item.product_id = $${queryCount}`, itemGroup, sort].join(' ');
        productCounter = [...productCounter, productGroup + ') AS product_counter'].join(' ');
        itemCounter = [...itemCounter, itemGroup, sort + ') AS item_counter'].join(' ');
        productCategories = [...productCategories, `GROUP BY category_name, href, parent_category_name`].join(' ');
        itemAttributes = [...itemAttributes].join(' ');
        attributeValues = [...attributeValues, `GROUP BY item_attribute_value.attribute, item_attribute_value.value`].join(' ');

        model.build({
            name: 'selectProducts',
            custom: productQuery
        })

        model.build({
            name: 'selectProductItems',
            custom: itemQuery
        })

        model.build({
            name: 'selectCountProducts',
            custom: productCounter
        })

        model.build({
            name: 'selectCountProductItems',
            custom: itemCounter
        })

        model.build({
            name: 'selectProductCategoriesByQuery',
            custom: productCategories
        })

        model.build({
            name: 'selectItemAttributesByQuery',
            custom: itemAttributes
        })

        model.build({
            name: 'selectItemAttributeValuesByQuery',
            custom: attributeValues
        })

        let products = await model.selectProducts(dbQuery);
        let data = {
            products: await model.selectCountProducts(dbQuery),
            items: await model.selectCountProductItems(dbQuery),
            categories: await model.selectProductCategoriesByQuery(dbQuery),
            attributes: await model.selectItemAttributeValuesByQuery(dbQuery)
        }

        let atts = {};
        data.attributes.forEach(val => {
            const { attribute, value, count } = val;
            if (atts[attribute]) {
                atts[attribute] = [...atts[attribute], {value, count}]
            } else {
                atts[attribute] = [{value, count}]
            }
        })

        data = {
            product_count: data.products[0].product_count,
            item_count: data.items[0].item_count,
            parent_category: parentCategory[0] || {},
            category: data.categories,
            attributes: atts
        }

        products = await Promise.all(products.map(async product => {
            const categories = await model.selectProductCategories([product.id]);
            const items = await model.selectProductItems([...dbQuery, product.id]);
            const sale = await model.selectProductSales([product.id]);
            const seller = await model.selectSellerByProduct([product.id]);
            const sellerStats = await model.selectSellerStats([seller.id]);
            const stats = await model.selectProductStats([product.id]);
            delete product.seller_id;
            return {
                ...product,
                categories: categories.map(category => category.category_name),
                items: await Promise.all(items.map(async item => {
                    const attributes = await model.selectItemAttributeValues([item.id]);
                    item.attributes = {};
                    attributes.forEach(attribute => item.attributes = {
                        ...item.attributes,
                        [attribute.attribute]: attribute.value
                    });
                    item.images = await model.selectItemImages([item.id]);
                    item.image_ids = item.images.map(image => image.id);
                    const sale = await model.selectItemSales([item.id]);
                    item.sale = sale[0] || {};
                    return item;
                })),
                reviews: await model.selectProductReviews([product.id]),
                sale: sale[0],
                seller: {...seller[0], stats: sellerStats[0]},
                stats: stats[0]
            }
        }));
        res.status(200).json({products, data})
    } catch (err) {
        next(err);
    }
}

products.getById = async (req, res, next) => {
    try {
        const product = await model.selectProductById([req.params.productId]);
        req.products = product;
        next();
    } catch(err) {
        next(err);
    };
};

products.getByItemId = async (req, res, next) => {
    try {
        const product = await model.selectProductByItemId([req.params.itemId]);
        req.products = product;
        next();
    } catch(err) {
        next(err);
    };
};

products.getByCartItemId = async (req, res, next) => {
    try {
        const product = await model.selectProductByCartItemId([req.params.itemId, req.query.cart_id]);
        req.products = product;
        next();
    } catch(err) {
        next(err);
    };
};

products.getDataAndItems = async (req, res, next) => {
    try {
        const products = await helper.getProductsById(req.products);
        res.status(200).json(products);
    } catch(err) {
        next(err);
    }
}

products.create = async (req, res, next) => {
    try {
        let id = req.params.productId;
        if (!req.params.productId) {
            id = uuid();
            req.params.productId = id;
        }
        await model.insertProduct([id, req.body.is_active]);
        await model.insertSellerProduct([req.params.userId, id]);
        await Promise.all(req.body.categories.map(async category => {
            return await model.insertProductCategory([id, category]);
        }))
        next();
    } catch (err) {
        next(err);
    };
};

products.createItems = async (req, res, next) => {
    try {
        await Promise.all(req.body.images.map(async image => {
            return await model.insertImage([image.id, image.name, image.src, image.type]); 
        }))
        const id = req.params.productId;
        await Promise.all(req.body.items.map(async item => {
            const { attributes, name, description, price, in_stock, image_ids, image_id_primary } = item;
            const itemId = uuid();
            await model.insertItem([itemId, id, name, description, price, in_stock]);
            let removeAttributes = [];
            attributes.forEach((attribute, i) => {
                if (attribute.value === '') {
                    removeAttributes.push(i)
                };
            });
            removeAttributes.reverse().forEach(attribute => {
                attributes.splice(attribute, 1);
            });
            if (attributes.length > 0) {
                await Promise.all(attributes.map(async attribute => {
                    return await model.insertItemAttributeValues([itemId, attribute.key, attribute.value]);
                }));
            };
            if (image_ids.length > 0) {
                await Promise.all(image_ids.map(async (id, i) => {
                    let imgToAdd = req.body.images.filter(img => {
                        return img.id === id;
                    });
                    if (imgToAdd.length === 0 && req.body.currentImages) {
                        imgToAdd = req.body.currentImages.filter(img => {
                            return img.id === id
                        })
                    }
                    imgToAdd = imgToAdd[0];
                    await model.insertItemImage([itemId, imgToAdd.id, imgToAdd.id === image_id_primary]);
                }));
            };
        }));
        res.sendStatus(201);
    } catch (err) {
        next(err);
    }
}

products.edit = async (req, res, next) => {
    try {
        await Promise.all(req.body.images.map(async image => {
            return await model.insertImage([image.id, image.name, image.src, image.type]); 
        }))
        const { productId: id } = req.params;
        const { categories, is_active, items } = req.body;
        await model.updateProduct([is_active, id]);
        await model.deleteProductCategories([id]);
        await Promise.all(categories.map(async category => {
            return await model.insertProductCategory([id, category]);
        }));
        let allImages = [];
        items.forEach(item => {
            allImages = [...allImages, ...item.images]
        })
        await Promise.all(items.map(async item => {
            const { attributes, description, id: itemId, name, price, image_ids, image_id_primary } = item;
            await model.updateItem([name, description, price, itemId]);
            await Promise.all(attributes.map(async attribute => {
                return await model.updateItemAttributeValue([attribute.value, itemId, attribute.key]);
            }));
            await model.deleteItemImages([itemId]);
            await Promise.all(image_ids.map(async id => {
                let imgToAdd = req.body.images.filter(img => {
                    return img.id === id;
                });
                if (imgToAdd.length === 0) {
                    imgToAdd = allImages.filter(img => {
                        return img.id === id; 
                    });
                };
                imgToAdd = imgToAdd[0];
                await model.insertItemImage([itemId, imgToAdd.id, imgToAdd.id === image_id_primary]);
            }))
        }));
        res.status(200).json({message: 'updated'});
    } catch (err) {
        next(err);
    }
}

products.purgeUnusedImages = async (req, res, next) => {
    try {
        const unusedImages = await model.selectUnusedImages();
        await Promise.all(unusedImages.map(async image => {
            // const filePath = path.join(__dirname, ['../../frontend/public/images/products', ...image.src.split('/').slice(5)].join('/'));
            // if (image.src.split('/').at(-3) === req.params.userId) {
                await model.deleteImage([image.id]);
                // await fs.unlink(filePath);
            // }
            
        }))
        res.sendStatus(204);
    } catch (err) {
        next(err)
    }
}

const cart = {};



module.exports = {
    attributes, auth, categories, customer, products, cart
}