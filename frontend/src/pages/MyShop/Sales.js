import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Sales = props => {

    const { shop } = useOutletContext();

    return (
        <div className='page'>
            <p>Sales</p>
        </div>
    )
}

export default Sales;