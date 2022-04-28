import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Sold = props => {

    const { shop } = useOutletContext();

    console.log(shop)

    return (
        <div className='page'>
            <p>Sold Items</p>
        </div>
    )
}

export default Sold;