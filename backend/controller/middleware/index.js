const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
const model = require('../../model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const parser = {};
parser.json = bodyParser.json({limit: 100000000});
parser.urlEncoded = bodyParser.urlencoded({ extended: false });
parser.multi = multer.diskStorage({
    destination: (req, file, next) => {
        if (!req.params.productId) {
            req.params.productId = uuid();
        }
        let dir = path.join(__dirname, `../../../frontend/public/images/products/${req.params.userId}`);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        dir = `${dir}/${req.params.productId}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        next(null, dir);
      },
      filename: (req, file, next) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        next(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
      }
})

const helper = {};

helper.isAuthenticated = (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.status(401).json({message: 'Not authorized.'});
        }
    } catch (err) {
        next(err);
    }
}

helper.getSubCategories = async (categories) => {
    categories = await Promise.all(categories.map(async category => {
        let subCategories = await model.selectSubCategories([category.name]);
        if (subCategories && subCategories.length > 0) {
            subCategories = await helper.getSubCategories(subCategories);
        }
        return { ...category, subCategories}
    }))
    return categories;
}

helper.getAllUserData = async (req, res, next) => {
    try {
        const customer = req.user;
        let cart = await model.selectCart([customer.id]);
        if (cart.length < 1) {
            await model.insertCart([uuid(), customer.id]);
            cart = await model.selectCart([customer.id])
        }
        customer.cart = cart[0];
        customer.cart.items = await model.selectCartProducts([customer.cart.id]);
        // customer.cart.items = await helper.getProductsById(customer.cart.items);
        customer.saved = await model.selectCustomerSavedProducts([customer.id]);
        // customer.saved = await helper.getProductsById(customer.saved);
        const shop = await model.selectSellerById([customer.id]);
        customer.shop = shop.length > 0 ? shop[0] : {};
        if (!req.oauth) {
            res.status(200).json(customer);
        } else {
            res.redirect('/');
        }
        
    } catch (err) {
        next(err);
    }
}

helper.getProductsById = async (productsArray) => {
    return await Promise.all(productsArray.map(async product => {
        const categories = await model.selectProductCategories([product.id]);
        product.categories = categories.map(category => category.category_name);
        product.reviews = await model.selectProductReviews([product.id]);
        const stats = await model.selectProductStats([product.id]);
        product.stats = stats[0];
        const sale = await model.selectProductSales([product.id]);
        product.sale = sale[0];
        const seller = await model.selectSellerByProduct([product.id]);
        product.seller = seller[0];
        const sellerStats = await model.selectSellerStats([seller.id]);
        product.seller.stats = sellerStats[0];
        delete product.seller_id;
        const items = await model.selectItemsByProductId([product.id]);
        product.items = await Promise.all(items.map(async item => {
            const attributes = await model.selectItemAttributeValues([item.id]);
            item.attributes = {};
            attributes.forEach(attribute => item.attributes = {
                ...item.attributes,
                [attribute.attribute]: attribute.value
            });
            item.images = await model.selectItemImages([item.id])
            const sale = await model.selectItemSales([item.id]);
            item.sale = sale[0] || {};
            return item;
        }));
        return product;
    }));
}

module.exports = {
    parser, helper
}