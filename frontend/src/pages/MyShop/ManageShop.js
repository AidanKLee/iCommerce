import React, { useMemo } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Products from '../Products';
import Sales from './Sales';
import Shop from './Shop';
import Sold from './Sold';

const ManageShop = props => {

    const location = useLocation();

    const { shop } = props;

    const page = useMemo(() => {
        const page = location.pathname.split('/')[2];
        return !page ? 'shop' : page;
    }, [location.pathname])

    return (
        <div className='my-shop manage'>
            <header className='my-shop manage header'>
                <Link to='/my-shop' id='shop' title='My Shop' className={`my-shop manage header logo${page === 'shop' ? ' active' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18.36 9l.6 3H5.04l.6-3h12.72M20 4H4v2h16V4zm0 3H4l-1 5v2h1v6h10v-6h4v6h2v-6h1v-2l-1-5zM6 18v-4h6v4H6z"/></svg>
                </Link>
                <ul className='my-shop manage header actions'>
                    <Link to='/my-shop/products' id='products' title='Products' className={`my-shop manage header actions item${page === 'products' ? ' active' : ''}`}>                        
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/></svg>
                        <p>Products</p>
                    </Link>
                    <Link to='/my-shop/sold' id='sold' title='Sold' className={`my-shop manage header actions item${page === 'sold' ? ' active' : ''}`}>                        
                        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/><g><path d="M19,5v14H5V5H19 M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3L19,3z"/></g><path d="M14,17H7v-2h7V17z M17,13H7v-2h10V13z M17,9H7V7h10V9z"/></g></svg>
                        <p>Sold</p>
                    </Link>
                    <Link to='/my-shop/sales' id='sales' title='Sales' className={`my-shop manage header actions item${page === 'sales' ? ' active' : ''}`}>                        
                        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M21.41,11.41l-8.83-8.83C12.21,2.21,11.7,2,11.17,2H4C2.9,2,2,2.9,2,4v7.17c0,0.53,0.21,1.04,0.59,1.41l8.83,8.83 c0.78,0.78,2.05,0.78,2.83,0l7.17-7.17C22.2,13.46,22.2,12.2,21.41,11.41z M12.83,20L4,11.17V4h7.17L20,12.83L12.83,20z"/><circle cx="6.5" cy="6.5" r="1.5"/></g></g></svg>
                        <p>Sales</p>
                    </Link>
                </ul>
            </header>
            <section className='my-shop manage main'>
                {/* {renderPage()} */}
                <Routes>
                    <Route path='/' element={<Shop shop={shop}/>}/>
                    <Route path='/products' element={<Products shop={shop} type='my-shop'/>}>
                        <Route path='/products/:category' element={<Products shop={shop} type='my-shop'/>}/>
                    </Route>
                    <Route path='/sold' element={<Sold shop={shop}/>}/>
                    <Route path='/sales' element={<Sales shop={shop}/>}/>
                </Routes>
            </section>
        </div>
    );
};

export default ManageShop;