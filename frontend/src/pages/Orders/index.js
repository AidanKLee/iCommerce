import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { selectUser } from '../../app/appSlice';
import api from '../../utils/api';
import Redirect from '../Redirect';
import './Orders.css';

const { customer: c } =api;

const Orders = props => {

    const location = useLocation();
    const user = useSelector(selectUser);
    const isLoggedIn = useMemo(() => 'id' in user, [user]);
    const loginPending = useMemo(() => user.pending, [user.pending]);

    const [ { orders, years }, setOrders ] = useState({orders: [], years: []});

    useEffect(() => {
        if (isLoggedIn) {
            c.getOrders(user.id, setOrders, location.search);
        }
    }, [isLoggedIn, location.search, user.id])

    return (
        <section className='orders'>
            <header className='header'>
                <h2>
                    Orders
                </h2>
            </header>
            <Outlet context={{ isLoggedIn, orders, user, years }}/>
            {
                !loginPending && !isLoggedIn ? <Redirect to='/login'/> : undefined
            }
        </section>
    )
}

export default Orders;