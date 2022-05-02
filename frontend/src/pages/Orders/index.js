import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { selectUser } from '../../app/appSlice';
import LoadingModal from '../../components/LoadingModal';
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
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        new Promise(res => {
            res(setLoading(true))
        })
        if (isLoggedIn) {
            c.getOrders(user.id, setOrders, location.search)
            .then(() => setLoading(false))
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
            {
                orders.length === 0 ? (
                    <p className='no-orders'>You have made no orders yet.</p>
                ) : undefined
            }
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={loading}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <LoadingModal />
            </CSSTransition>
        </section>
    )
}

export default Orders;