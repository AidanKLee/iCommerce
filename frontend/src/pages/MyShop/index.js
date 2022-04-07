import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/appSlice';
import RegisterShop from '../Auth/RegisterShop';
import ManageShop from './ManageShop';
import './MyShop.css';

const MyShop = props => {

    const user = useSelector(selectUser);
    const shop = useMemo(() => user.shop, [user]);
    const isShop = useMemo(() => shop && shop.id ? true : false, [shop]);

    return (
        <section className='my-shop'>
            {
                !isShop ? <RegisterShop/> : <ManageShop shop={shop}/>
            }
        </section>
    )
}

export default MyShop;