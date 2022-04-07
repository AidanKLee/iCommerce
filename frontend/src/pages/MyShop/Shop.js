import React from 'react';

const Shop = props => {

    const { shop } = props;

    return (
        <div className='shop'>
            <h2>{shop.shop_name}</h2>
            <p>{shop.business_email}</p>
            <p>{shop.business_phone}</p>
            <h3>Description</h3>
            <p>{shop.description}</p>
        </div>
    )
}

export default Shop;