import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { login, selectCategories, selectUser } from '../../app/appSlice';
import MenuButton from '../../components/MenuButton';
import logo from '../../images/logo.svg';
import api from '../../utils/api';
import './Menu.css';

const Menu = props => {

    const { auth } = api;

    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const isLoggedIn = useMemo(() => {
        if ('email' in user) {
            return true;
        }
        return false;
    }, [user])
    let categories = useSelector(selectCategories);
    categories = useMemo(() => categories.data || [], [categories]);

    const { open: [open, setOpen] } = props;
    const [ menu, setMenu ] = useState(false);

    const closeMenu = e => {
        setOpen(false);
    }

    const handleLogout = e => {
        auth.logout(dispatch, login);
        closeMenu();
    }

    return (
        <CSSTransition timeout={500} classNames='fade' in={open} mountOnEnter={true} unmountOnExit={true} onEntered={() => setMenu(!menu)} onExit={() => setMenu(!menu)}>
            <div className='menu-overlay'>
            <CSSTransition timeout={500} classNames='slide' in={menu} mountOnEnter={true} unmountOnExit={true}>
                    <aside className='menu'>
                        <div className='top'>
                            <div className='logo'>
                            <Link onClick={closeMenu} to='/' title='iCommerce Home'>
                                <img src={logo} alt='iCommerce Logo'/>
                            </Link>
                            <Link onClick={closeMenu} to='/' title='iCommerce Home'>
                                <p className='text'>iCommerce</p>
                            </Link>
                            </div>
                            <MenuButton open={[open, setOpen]}/>
                        </div>
                        <div className='user'>
                            {
                                isLoggedIn ? (
                                    <div className='auth'>
                                        <div className='person'>
                                            <div className='img'>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                            </div>
                                            <p>{`${user.first_name} ${user.last_name}`}</p>
                                        </div>
                                        
                                        <ul className='actions'>
                                            <li>
                                                <Link onClick={closeMenu} to='/account'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M4,18v-0.65c0-0.34,0.16-0.66,0.41-0.81C6.1,15.53,8.03,15,10,15c0.03,0,0.05,0,0.08,0.01c0.1-0.7,0.3-1.37,0.59-1.98 C10.45,13.01,10.23,13,10,13c-2.42,0-4.68,0.67-6.61,1.82C2.51,15.34,2,16.32,2,17.35V20h9.26c-0.42-0.6-0.75-1.28-0.97-2H4z"/><path d="M10,12c2.21,0,4-1.79,4-4s-1.79-4-4-4C7.79,4,6,5.79,6,8S7.79,12,10,12z M10,6c1.1,0,2,0.9,2,2s-0.9,2-2,2 c-1.1,0-2-0.9-2-2S8.9,6,10,6z"/><path d="M20.75,16c0-0.22-0.03-0.42-0.06-0.63l1.14-1.01l-1-1.73l-1.45,0.49c-0.32-0.27-0.68-0.48-1.08-0.63L18,11h-2l-0.3,1.49 c-0.4,0.15-0.76,0.36-1.08,0.63l-1.45-0.49l-1,1.73l1.14,1.01c-0.03,0.21-0.06,0.41-0.06,0.63s0.03,0.42,0.06,0.63l-1.14,1.01 l1,1.73l1.45-0.49c0.32,0.27,0.68,0.48,1.08,0.63L16,21h2l0.3-1.49c0.4-0.15,0.76-0.36,1.08-0.63l1.45,0.49l1-1.73l-1.14-1.01 C20.72,16.42,20.75,16.22,20.75,16z M17,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S18.1,18,17,18z"/></g></g></svg>
                                                    Account
                                                </Link>
                                            </li>
                                            <li>
                                                <Link onClick={closeMenu} to='/orders'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 7h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zM20.1 3H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM19 19H5V5h14v14z"/></svg>
                                                    Orders
                                                </Link>
                                            </li>
                                            <li>
                                                <Link onClick={closeMenu} to='/my-shop'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18.36 9l.6 3H5.04l.6-3h12.72M20 4H4v2h16V4zm0 3H4l-1 5v2h1v6h10v-6h4v6h2v-6h1v-2l-1-5zM6 18v-4h6v4H6z"/></svg>
                                                    My Shop
                                                </Link>
                                            </li>
                                            <li onClick={handleLogout}>
                                                <Link to='#'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M17,8l-1.41,1.41L17.17,11H9v2h8.17l-1.58,1.58L17,16l4-4L17,8z M5,5h7V3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h7v-2H5V5z"/></g></svg>
                                                    Log Out
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className='login'>
                                        <Link onClick={closeMenu} to='/login'>Login</Link> or <Link onClick={closeMenu} to='/register'>Register</Link>
                                    </div>
                                )
                            }
                        </div>
                        <ul className='categories'>
                            {
                                categories.map(category => {
                                    return (
                                        <li className='item' key={category.href}>
                                            <Link onClick={closeMenu} to={`products${category.href}`}>
                                                {category.name}
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z"/></svg>
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </aside>
                </CSSTransition>
            </div>
        </CSSTransition>
    );
};

export default Menu;