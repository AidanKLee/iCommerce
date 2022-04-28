import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Shop = props => {

    const shop = useOutletContext();

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