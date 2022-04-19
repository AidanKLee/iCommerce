import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { selectUser } from '../../app/appSlice';
import LoadingModal from '../../components/LoadingModal';
import RegisterShop from '../Auth/RegisterShop';
import Redirect from '../Redirect';
import ManageShop from './ManageShop';
import './MyShop.css';

const MyShop = props => {

    const user = useSelector(selectUser);

    const loginPending = useMemo(() => user.pending, [user.pending]);
    const isLoggedIn = useMemo(() => 'id' in user, [user]);

    const shop = useMemo(() => user.shop, [user]);
    const isShop = useMemo(() => shop && 'id' in shop, [shop]);

    return (
        <section className='my-shop'>
            {
                loginPending ? undefined : !isLoggedIn ? <Redirect to='/login'/> : isShop ? <ManageShop shop={shop}/> : <RegisterShop/>
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