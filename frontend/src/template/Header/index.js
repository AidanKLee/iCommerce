import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { fetchCategories, selectCategories } from '../../app/appSlice';
// import Breadcrumb from '../../components/Breadcrumb';
import CategoriesList from '../../components/CategoriesList';
import MenuButton from '../../components/MenuButton';
import SearchBar from '../../components/SearchBar';
import UserActions from '../../components/UserActions';
import logo from '../../images/logo.svg';
import './Header.css';

const Header = props => {

    const dispatch = useDispatch();
    const categories = useSelector(selectCategories);

    const { menuOpen: [menuOpen, setMenuOpen], style} = props;

    const [ searchOpen, setSearchOpen ] = useState(false);

    useEffect(() => {
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCategories = async () => {
        dispatch(fetchCategories());
    }

    return (
        <header style={style} className='app header'>
            <ul className='app header section'>
                <li className='app header section item menu-button'>
                    <MenuButton open={[menuOpen, setMenuOpen]}/>
                </li>
                <li className='app header section item'>
                    <Link to='/' title='iCommerce Home'>
                        <img className='app header section item logo' src={logo} alt='iCommerce Logo'/>
                    </Link>
                </li>
                <li className='app header section item logo-text'>
                    <Link to='/' title='iCommerce Home'>
                        <h1>iCommerce</h1>
                    </Link>
                </li>
                <li className='app header section item categories'>
                    <CSSTransition
                        timeout={500}
                        classNames={'fade'}
                        in={categories.data && categories.data.length > 0}
                        mountOnEnter={true}
                        unmountOnExit={true}
                    >
                        <CategoriesList searchOpen={searchOpen} categories={categories.data}/>
                    </CSSTransition>
                </li>
                <li className='app header section item search'>
                    <SearchBar open={[searchOpen, setSearchOpen]}/>
                </li>
                <li className='app header section item'>
                    <UserActions/>
                </li>
            </ul>
            {/* <Breadcrumb/> */}
        </header>
    );
};

export default Header;