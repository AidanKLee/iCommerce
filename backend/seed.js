const model = require('./model');
// const { v4: uuid } = require('uuid');

// console.log(uuid())

const categories = require('./model/tables/categories');
const itemAttributeValue = require('./model/tables/itemAttributeValue');
// const user = require('./model/tables/user');
// const products = require('./model/tables/products');

// console.log(products)

console.log(model.queries)

// DELETE ROWS FROM TABLES
const deleteAll = async () => {
    // await model.deleteAllItemImages();
    // await model.deleteAllImages();
    // await model.deleteAllItemsAttributes();
    // await model.deleteAllItems();
    // await model.deleteAllProductCategories();
    // await model.deleteAllProducts();
    // await model.deleteSeller(['1601aa9a-c866-4702-902b-fdc0afa315f7']);
    // await model.deleteCustomerPerm(['1601aa9a-c866-4702-902b-fdc0afa315f7']);
    await model.deleteAllCategoriesAttributes();
    await model.deleteAllAttributeValues();
    await model.deleteAllAttributes();
    await model.deleteAllCategories();
    await model.deleteSaleOptions();
}

// CREATING PRODUCT CATEGORIES
const createCategories = async () => {
    const createCategoriesFromArray = async (array, parent) => {
        for (let c of array) {
            await model.insertCategory([c.name, '/' + c.name.split(' ').filter(word => word !== '&').join('-').split(',').join('').toLowerCase(), parent ? parent : c.parent ? c.parent : null]);
            if (c.sub) {
                await createCategoriesFromArray(c.sub, c.name);
            };
        };
    };
    for (let group in categories) {
        createCategoriesFromArray(categories[group]);
    };
};

// CREATING PRODUCT ATTRIBUTES & ATTRIBUTE VALUES
const createAttributesValues = async () => {
    const createAttributesValuesFromObject = async (object, prevName) => {
        for (let att in object) {
            const name = prevName ? `${prevName}_${att}` : att;
            if (Array.isArray(object[att])) {
                await model.insertAttribute(name);
                for (let value of object[att]) {
                    await model.insertAttributeValue([name, value]);
                }
            } else {
                await createAttributesValuesFromObject(object[att], name);
            };
        };
    };
    await createAttributesValuesFromObject(itemAttributeValue);
};

// CREATING CATEGORY & ATTRIBUTE LINKS
const createCategoriesAttributes = async () => {
    const createCategoryAttributesFromArray = async (array) => {
        for (let c of array) {
            if (c.attributes) {
                for (let att of c.attributes) {
                    await model.insertCategoryAttribute([c.name, att]);
                };
            };
            if (c.sub) {
                await createCategoryAttributesFromArray(c.sub);
            };
        };
    };
    for (let group in categories) {
        await createCategoryAttributesFromArray(categories[group]);
    };
};

// CREATING SALES PERCENTAGES
const salePercentages = new Array(20).fill(0).map((x, i) => 5 + (i * 5));
const createSalePercentages = async () => {
    for (let sale of salePercentages) {
        await model.insertSaleOption([sale])
    };
};

// CREATING PRODUCTS
// const createProducts = async () => {
//     for (let product of products) {
//         await model.insertProduct(product.product);
//         for (let category of product.productCategories) {
//             await model.insertProductCategory([product.id, category]);
//         };
//         for (let item of product.items) {
//             await model.insertItem(item.item);
//             for (let attribute in item.attributes) {
//                 const insert = [item.id, attribute, item.attributes[attribute]];
//                 await model.insertItemAttributeValues(insert);
//             };
//             for (let image of item.images.names) {
//                 await model.insertImage([image[0], `${item.images.url}${image[1]}`]);
//                 await model.insertItemImage([item.id, image[0], image[2] || false])
//             };
//         };
//     };
// };

const enterInitialData = async () => {
    await deleteAll();
    await createSalePercentages();
    await createCategories();
    await createAttributesValues();
    await createCategoriesAttributes();
    // await createMainUser();
    // await createProducts();
}
enterInitialData();