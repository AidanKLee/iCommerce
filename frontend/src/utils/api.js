import baseUrl from './baseUrl';

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

const auth = {};

auth.restoreUserSession = async (dispatcher, method) => {
    let user = await fetch(`${baseUrl}/api/auth`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (user) {
      user = await user.json();
      dispatcher(method(user));
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

auth.login = async form => {
    const data = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(form)
    });
    return await data.json();
};

auth.logout = async (dispatcher, method) => {
    await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST'
    });
    dispatcher(method({}))
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
    auth, categories, products, seller
};

export default api;