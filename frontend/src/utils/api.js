import baseUrl, { currency } from './baseUrl';

const auth = {};

auth.getUser = async () => {
    const user = async () => {
        const data = await fetch(`${baseUrl}/api/auth`);
        return await data.json()
    }
    return await user();
};

auth.restoreUserSession = async (dispatcher, method, user) => {
    let data = await fetch(`${baseUrl}/api/auth`);
    data = await data.json();
    const opener = window.opener;
    if (opener && opener.OAuth2) {
        window.addEventListener('beforeunload', async () => {
            await opener.syncItems(data)
            opener.location.reload();
        })
        window.close();
    }
    if ('id' in data) {
        dispatcher(method({ ...data, pending: false }));
    } else {
        dispatcher(method({ ...user, pending: false }));
    }
}

auth.register = async form => {
    const data = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(form)
    });
    return await data.json();
};

auth.registerShop = async form => {
    let data = await fetch(`${baseUrl}/api/auth/register/shop`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(form)
    });
    data = await data.json();
    window.location.href = data.url;
}

auth.registerStripe = async () => {
    let data = await fetch(`${baseUrl}/api/auth/stripe/account`, {
        method: 'POST'
    });
    data = await data.json();
    window.location.href = data.url;
}

auth.retrieveStripe = async setter => {
    let data = await fetch(`${baseUrl}/api/auth/stripe/account`);
    data = await data.json();
    setter(data);
}

auth.login = async ({form, saved, bag}) => {
    const login = async () => {
        const data = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });
        return await data.json()
    }
    let user = await login();
    if (user.message) {
        return user;
    }
    await auth.syncItems(user, saved, bag);
    user = await auth.getUser();
    return user;
};

auth.syncItems = async (user, saved = [], bag = []) => {
    await Promise.all(saved.map(async item => {
        return await customer.saveItem(user.id, item.item_id, true);
    }));
    await Promise.all(bag.map(async item => {
        return await customer.addItemToBag(user.id, user.cart.id, item.item_id, item.item_quantity, true);
    }));
}

auth.logout = async (dispatcher, method) => {
    await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST'
    });
    dispatcher(method({
        cart: {
            items: [],
            pending: false,
            fulfilled: false,
            rejected: false
        },
        pending: false,
        saved: [],
        savedStatus: {
            pending: false,
            fulfilled: false,
            rejected: false
        }
    }));
}

const categories = {};

categories.getMain = async setter => {
    const [ cat, setCat ] = setter;
    let categories = await fetch(`${baseUrl}/api/categories/main`);
    categories = await categories.json();
    setCat({
        ...cat,
        main: categories
    });
}

categories.getByHref = async (href) => {
    let categories = await fetch(`${baseUrl}/api/categories/main/${href}`);
    categories = await categories.json();
    return categories
}

categories.getSub = async category => {
    let categories = await fetch(`${baseUrl}/api/categories/${category}`);
    categories = await categories.json();
    return categories
}

categories.getAttributes = async (setter, cats) => {
    let attributes = await Promise.all(cats.map(async cat => {
        let catAtt = await fetch(`${baseUrl}/api/categories/${cat}/attributes`);
        return await catAtt.json();
    }));
    const mergeAttributes = [];
    attributes.forEach(array => {
        array.forEach(attribute => {
            mergeAttributes.push(attribute);
        });
    })
    setter(mergeAttributes);
}

const customer = {};

customer.saveItem = async (customerId, itemId, login) => {
    let item = await fetch(`${baseUrl}/api/customer/${customerId}/save-item/${itemId}${login ? '?no_delete=true' : ''}`, {
        method: 'POST'
    });
    item = await item.json();
    return item[0];
}

customer.addItemToBag = async (customerId, bagId, itemId, quantity, login) => {
    let query = '';
    let joiner = '?'
    if (quantity) {
        query = `${joiner}quantity=${quantity}`;
        joiner = '&';
    };
    if (login) {
        query = `${query}${joiner}no_update=true`
    };
    let item = await fetch(`${baseUrl}/api/customer/${customerId}/cart/${bagId}/${itemId}${query}`, {
        method: 'POST'
    });
    item = await item.json();
    return item[0];
}

customer.updateItemBagQuantity = async (customerId, bagId, itemId, quantity) => {
    let item = await fetch(`${baseUrl}/api/customer/${customerId}/cart/${bagId}/${itemId}?quantity=${quantity}`, {
        method: 'PUT'
    });
    item = await item.json();
    return item[0];
}

customer.deleteItemFromBag = async (customerId, bagId, itemId) => {
    await fetch(`${baseUrl}/api/customer/${customerId}/cart/${bagId}/${itemId}`, {
        method: 'DELETE'
    });
}

customer.getAddresses = async (customerId, setter) => {
    let addresses = await fetch(`${baseUrl}/api/customer/${customerId}/addresses`);
    addresses = await addresses.json();
    setter(addresses);
}

customer.postAddress = async (customerId, form, setter) => {
    let addresses = await fetch(`${baseUrl}/api/customer/${customerId}/addresses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    });
    addresses = await addresses.json();
    setter(addresses);
}

customer.getOrders = async (customerId, setter, params) => {
    let orders = await fetch(`${baseUrl}/api/customer/${customerId}/orders${params ? params : ''}`);
    orders = await orders.json();
    orders = { ...orders, orders: helper.groupOrdersItemsBySeller(orders.orders) };
    setter(orders);
}

customer.getOrderById = async (customerId, orderId, setter) => {
    let orders = await fetch(`${baseUrl}/api/customer/${customerId}/orders/${orderId}`);
    orders = await orders.json();
    orders = { ...orders, orders: helper.groupOrdersItemsBySeller(orders.orders) };
    const { orders: order } = orders;
    setter(order[0]);
}

customer.cancelOrder = async (customerId, orderId, sellerId, orderItemId) => {
    let url;
    if (orderId && sellerId) {
        url = `${baseUrl}/api/customer/${customerId}/orders/${orderId}/?seller=${sellerId}`;
    } else if (orderId && !orderItemId) {
        url = `${baseUrl}/api/customer/${customerId}/orders/${orderId}`;
    } else if (orderId && orderItemId) {
        url = `${baseUrl}/api/customer/${customerId}/orders/${orderId}?item=${orderItemId}`;
    } else {
        return;
    }
    await fetch(url, { method: 'DELETE' });
}

customer.submitReview = async (customerId, form) => {
    await fetch(`${baseUrl}/api/customer/${customerId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
    })
}

const checkout = {};

checkout.paymentIntent = async (data, clientSetter, dataSetter, orderIdSetter) => {
    try {
        data = await fetch(`${baseUrl}/api/checkout/intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        data = await data.json();
        clientSetter(data.paymentIntent.client_secret);
        orderIdSetter(data.paymentIntent.metadata.order_id);
        delete data.paymentIntent;
        dataSetter(data);
    } catch (err) {
        console.error(err)
    }
}

checkout.submitOrder = async (customerId, orderId, body) => {
    await fetch(`${baseUrl}/api/customer/${customerId}/orders/${orderId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}

checkout.confirmPayment = async (customerId, orderId) => {
    await fetch(`${baseUrl}/api/customer/${customerId}/orders/${orderId}`, {
        method: 'PUT'
    });
}

checkout.transferPaymentToSellers = async (orderId) => {
    await fetch(`${baseUrl}/api/checkout/transfers/${orderId}`, {
        method: 'POST'
    });
}

const helper = {};

helper.currencyFormatter = numberToFormat => new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol'
}).format(numberToFormat);

helper.currencyToInteger = currencyToFormat => {
    return Number(currencyToFormat.slice(1).replace(',',''));
}

helper.fileToBase64 = async file => {
    return await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => res(reader.result);
        reader.onerror = err => rej(err);
    });
}

helper.groupOrdersItemsBySeller = orders => {
    return orders.map(order => {
        let itemsByShop = [];
        order.items.forEach(item => {
            let { seller } = item;
            const index = itemsByShop.findIndex(shop => {
                return shop.id === seller.id;
            })
            const itemWithoutSeller = {...item};
            delete itemWithoutSeller.seller;
            if (index === -1) {
                seller = {...seller, items: [itemWithoutSeller]}
                itemsByShop.push(seller);
            } else {
                itemsByShop[index].items.push(itemWithoutSeller);
            }
        })
        delete order.items;
        order.sellers = itemsByShop;
        return order;
    })
}

const products = {};

products.getBySeller = async (userId, category, queryString) => {
    if (category === '') { category = '*' }
    let products = await fetch(`${baseUrl}/api/seller/${userId}/products/${category}${queryString}`);
    products = await products.json();
    return products;
}

products.getAll = async (category, queryString) => {
    if (category === '') { category = '*' }
    let products = await fetch(`${baseUrl}/api/products/${category}${queryString}`);
    products = await products.json();
    return products;
}

products.getById = async (productId) => {
    let product = await fetch(`${baseUrl}/api/products/product/${productId}`);
    product = await product.json();
    return product[0];
}

products.getByItemId = async (itemId, bagId) => {
    bagId = bagId ? `?cart_id=${bagId}` : '';
    let product = await fetch(`${baseUrl}/api/products/items/${itemId}${bagId}`);
    product = await product.json();
    return product[0];
}

products.getByItemIdList = async (itemList, bagId) => {
    bagId = bagId ? `?cart_id=${bagId}` : '';
    let products = await fetch(`${baseUrl}/api/products/items${bagId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemList)
    });
    return await products.json();
}

const seller = {};

seller.createProduct = async form => {
    const categories = form.categories.one.concat(form.categories.two);
    form = { ...form, categories };
    form.images = form.images.map(image => {
        return {
            id: image.id,
            name: image.name,
            src: image.src,
            type: image.type
        }
    })
    await fetch(`${baseUrl}/api/seller/${form.userId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
    })
}

seller.createItems = async form => {
    delete form.categories;
    form.images = form.images.map(image => {
        return {
            id: image.id,
            name: image.name,
            src: image.src,
            type: image.type
        }
    })
    await fetch(`${baseUrl}/api/seller/${form.userId}/products/${form.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
    })
}

seller.editProduct = async form => {
    const categories = form.categories.one.concat(form.categories.two);
    form = { ...form, categories };
    form.images = form.images.map(image => {
        return {
            id: image.id,
            name: image.name,
            src: image.src,
            type: image.type
        }
    })
    await fetch(`${baseUrl}/api/seller/${form.userId}/products/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
    })
    return categories;
}

seller.purgeUnusedImages = async (userId) => {
    await fetch(`${baseUrl}/api/seller/${userId}/products/images`, {
        method: 'DELETE'
    })
}

seller.getOrders = async (userId, setter, params) => {
    let orders = await fetch(`${baseUrl}/api/seller/${userId}/orders${params ? params : ''}`);
    orders = await orders.json();
    orders = { ...orders, orders: helper.groupOrdersItemsBySeller(orders.orders) };
    setter(orders);
}

seller.getOrderById = async (userId, orderId, setter) => {
    let orders = await fetch(`${baseUrl}/api/seller/${userId}/orders/${orderId}`);
    orders = await orders.json();
    orders = { ...orders, orders: helper.groupOrdersItemsBySeller(orders.orders) };
    const { orders: order } = orders;
    setter(order[0]);
}

seller.updateOrder = async (userId, orderId, orderItemId, dispatched, delivered, reviewed) => {
    let url;
    let params = [];

    if (orderId && userId) {
        url = `${baseUrl}/api/seller/${userId}/orders/${orderId}`;
    } else {
        return;
    }

    if (orderItemId) {
        params.push(`item=${orderItemId}`);
    }
    if (dispatched === true || dispatched === false) {
        params.push(`dispatched=${dispatched}`);
    }
    if (delivered === true || delivered === false) {
        params.push(`delivered=${delivered}`);
    }
    if (reviewed === true || reviewed === false) {
        params.push(`reviewed=${reviewed}`);
    }

    if (params.length > 0) {
        params = `?${params.join('&')}`;
    } else {
        params = '';
    }

    await fetch(url + params, { method: 'PUT' });
}

seller.submitReview = async (sellerId, form) => {
    await fetch(`${baseUrl}/api/seller/${sellerId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
    })
}

const api = {
    auth, categories, checkout, customer, helper, products, seller
};

export default api;