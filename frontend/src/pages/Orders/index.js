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

    const [ { orders, years, count }, setOrders ] = useState({orders: [], years: [], count: 0});
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        setLoading(true)
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
            <Outlet context={{ count, isLoggedIn, loading, location, orders, setOrders, user, years }}/>
            {
                !loginPending && !isLoggedIn ? <Redirect to='/login'/> : undefined
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