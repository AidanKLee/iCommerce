import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { selectUser } from '../../app/appSlice';
import LoadingModal from '../../components/LoadingModal';
import RegisterShop from '../Auth/RegisterShop';
import Redirect from '../Redirect';
import ManageShop from './ManageShop';
import api from '../../utils/api';
import './MyShop.css';
import { useLocation } from 'react-router-dom';

const { auth, seller } = api;

const MyShop = props => {

    const location = useLocation();
    const user = useSelector(selectUser);

    const loginPending = useMemo(() => user.pending, [user.pending]);
    const isLoggedIn = useMemo(() => 'id' in user, [user]);
    
    const isSeller = useMemo(() => 'shop' in user && 'id' in user.shop, [user.shop]);

    const shop = useMemo(() => user.shop, [user]);
    const isShop = useMemo(() => user && user.shop && user.shop.id, [user]);

    const [ stripe, setStripe ] = useState({});

    const stripeRedirect = useMemo(() => {
        return location.search ? location.search.slice(1).split('&').filter(param => param.includes('redirect')).filter(param => param.includes('stripe')).length > 0 : undefined;
    }, [location])

    useEffect(() => {
        if (stripeRedirect) {
            const stripe = async () => await auth.registerStripe(user.shop);
            stripe();
        }
    }, [stripeRedirect, user.shop])

    useEffect(() => {
        if (isLoggedIn) {
            if (isSeller) {
                seller.purgeUnusedImages(user.id);
                auth.retrieveStripe(setStripe);
            }
        }
    }, [isLoggedIn, isSeller, user])

    return (
        <section className='my-shop'>
            {
                loginPending ? undefined : !isLoggedIn ? <Redirect to='/login'/> : isShop ? <ManageShop shop={{...shop, stripe}}/> : <RegisterShop/>
            }
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={loginPending}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <LoadingModal />
            </CSSTransition>
        </section>
    )
}

export default MyShop;