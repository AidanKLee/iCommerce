import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../../pages/Home';
import Login from '../../pages/Auth/Login';
import Register from '../../pages/Auth/Register';
import './Body.css';
import MyShop from '../../pages/MyShop';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/appSlice';
import Products from '../../pages/Products';
import Product from '../../pages/Product';

const Body = props => {

    const user = useSelector(selectUser);
    const isLoggedIn = useMemo(() => user.id, [user]);

    const { style } = props;

    return (
        <section className='app body' style={style}>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/products' element={<div className='products-wrapper'><Products/></div>}>
                    <Route path='/products/:category' element={<div className='products-wrapper'><Products/></div>}/>
                </Route>
                <Route path='/product/:productId' element={<div className='products-wrapper'><Product/></div>}>
                    <Route path='/product/:productId/:itemId' element={<div className='products-wrapper'><Product/></div>}/>
                </Route>
                <Route path='/register' element={<Register/>}/>
                <Route path='/login' element={<Login/>}/>
                {isLoggedIn ? <Route path='/my-shop/*' element={<MyShop/>}/> : undefined}
            </Routes>
        </section>
        
    );
};

export default Body;