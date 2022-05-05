import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import LoadingModal from '../../components/LoadingModal';
import Redirect from '../Redirect';
import api from '../../utils/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/appSlice';

const { seller: s } = api;

const Sold = props => {

    const location = useLocation();
    const user = useSelector(selectUser);
    const isLoggedIn = useMemo(() => 'id' in user, [user]);
    const loginPending = useMemo(() => user.pending, [user.pending]);

    const [ { orders, years, count }, setOrders ] = useState({orders: [], years: [], count: 0});
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        new Promise(res => {
            res(setLoading(true))
        })
        if (isLoggedIn) {
            s.getOrders(user.id, setOrders, location.search)
            .then(() => setLoading(false))
        }
    }, [isLoggedIn, location.search, user.id])

    return (
        <div className='page'>
            <Outlet context={{ count, isLoggedIn, location, orders, setOrders, user, years }}/>
            {/* //location, orders = [], setOrders, years = [], user */}
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
        </div>
    )
}

export default Sold;