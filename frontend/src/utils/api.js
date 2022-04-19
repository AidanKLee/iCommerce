import baseUrl from './baseUrl';

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
    const data = await fetch(`${baseUrl}/api/auth/registerShop`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(form)
    });
    return await data.json();
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
    await auth.syncItems(user, saved, bag);
    user = await auth.getUser();
    return user;
};

auth.syncItems = async (user, saved = [], bag = []) => {
    await Promise.all(saved.map(async item => {
        return await customer.saveItem(user.id, item.selected_item_id, true);
    }));
    await Promise.all(bag.map(async item => {
        return await customer.addItemToBag(user.id, user.cart.id, item.selected_item_id, item.item_quantity, true);
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
        pending: true,
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
    console.log(`${baseUrl}/api/categories/main`)
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

const helper = {};

helper.currencyFormatter = numberToFormat => new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'GBP',
  }).format(numberToFormat);

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
    let product = await fetch(`${baseUrl}/api/products/item/${itemId}${bagId}`);
    product = await product.json();
    return product[0];
}

const seller = {};

seller.createProduct = async form => {
    const categories = form.categories.one.concat(form.categories.two);
    form = { ...form, categories };
    await fetch(`${baseUrl}/api/seller/${form.userId}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(form)
    })
}

seller.createItems = async form => {
    await fetch(`${baseUrl}/api/seller/${form.userId}/products/${form.id}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(form)
    })
}

seller.editProduct = async form => {
    const categories = form.categories.one.concat(form.categories.two);
    form = { ...form, categories };
    await fetch(`${baseUrl}/api/seller/${form.userId}/products/${form.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(form)
    })
    return categories;
}

const api = {
    auth, categories, customer, helper, products, seller
};

export default api;