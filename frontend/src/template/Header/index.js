import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import CategoriesList from '../../components/CategoriesList';
import MenuButton from '../../components/MenuButton';
import SearchBar from '../../components/SearchBar';
import UserActions from '../../components/UserActions';
import logo from '../../images/logo.svg';
import './Header.css';

const categories = [
    {name: 'Home', link:'/'},
    {name: 'House & Garden', link:'/'},
    {name: 'Electronics', link:'/'},
    {name: 'Fashion', link:'/'},
    {name: 'Sports & Leisure', link:'/'},
    {name: 'Health & Beauty', link:'/'},
    {name: 'Toys', link:'/'},
    {name: 'Motors', link:'/'},
    {name: 'Collectables', link:'/'},

    // {name: 'All Categories', link:'/'},
    // {name: 'Antiques', link:'/'},
    // {name: 'Art', link: '/'},
    // {name: 'Baby', link: '/'},
    // {name: 'Books, Comics & Magazines', link: '/'},
    // {name: 'Business, Office & Industrial', link: '/'},
    // {name: 'Cameras & Photography', link: '/'},
    // {name: 'Cars Motorcycles & Vehicles', link: '/'},
    // {name: 'Clothes & Shoes', link: '/'},
    // {name: 'Coins', link: '/'},
    // {name: 'Collectables', link: '/'},
    // {name: 'Computers & Tablets', link: '/'},
    // {name: 'Crafts', link: '/'},
    // {name: 'Dolls & Bears', link: '/'},
    // {name: 'DVDs, Films & TV', link: '/'},
    // {name: 'Event Tickets', link: '/'},
    // {name: 'Garden & Patio', link: '/'},
    // {name: 'Health & Beauty', link: '/'},
    // {name: 'Holidays & Travel', link: '/'},
    // {name: 'Home, Furniture & DIY', link: '/'},
    // {name: 'Jewellery & Watches', link: '/'},
    // {name: 'Mobile Phones', link: '/'},
    // {name: 'Music', link: '/'},
    // {name: 'Musical Instruments', link: '/'},
    // {name: 'Pet Supplies', link: '/'},
    // {name: 'Pottery, Porcelain & Glass', link: '/'},
    // {name: 'Property', link: '/'},
    // {name: 'Sound & Vision', link: '/'},
    // {name: 'Sporting Goods', link: '/'},
    // {name: 'Sports Memorabilia', link: '/'},
    // {name: 'Stamps', link: '/'},
    // {name: 'Toys & Games', link: '/'},
    // {name: 'Vehicle Parts & Accessories', link: '/'},
    // {name: 'Video Games & Consoles', link: '/'},
    // {name: 'Wholesale', link: '/'}
]

const Header = props => {

    const [ searchOpen, setSearchOpen ] = useState(false);

    return (
        <header className='app header'>
            <ul className='app header section'>
                <li className='app header section item menu-button'>
                    <MenuButton open={true}/>
                </li>
                <li className='app header section item'>
                    <Link to='/'>
                        <img className='app header section item logo' src={logo} alt='iCommerce Logo'/>
                    </Link>
                </li>
                <li className='app header section item logo-text'>
                    <Link to='/'>
                        iCommerce
                    </Link>
                </li>
                <li className='app header section item categories'>
                    <CategoriesList searchOpen={searchOpen} categories={categories}/>
                </li>
                <li className='app header section item search'>
                    <SearchBar open={[searchOpen, setSearchOpen]}/>
                </li>
                <li className='app header section item'>
                    <UserActions/>
                </li>
            </ul>
            <Breadcrumb/>
        </header>
    );
};

export default Header;