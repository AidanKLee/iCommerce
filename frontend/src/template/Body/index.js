import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../../pages/Home';
import Login from '../../pages/Auth/Login';
import Register from '../../pages/Auth/Register';
import './Body.css';
import MyShop from '../../pages/MyShop';
import Products from '../../pages/Products';
import Product from '../../pages/Product';
import Saved from '../../pages/Saved';
import Bag from '../../pages/Bag';
import Checkout from '../../pages/Checkout';
import PaymentStatus from '../../pages/paymentStatus';
import CheckoutForm from '../../pages/Checkout/CheckoutForm';

const Body = props => {

    const { style } = props;

    return (
        <section className='app body' style={style}>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/products' element={<Products/>}>
                    <Route path='/products/:category' element={<Products/>}/>
                </Route>
                <Route path='/product/:productId' element={<Product/>}>
                    <Route path='/product/:productId/:itemId' element={<Product/>}/>
                </Route>
                <Route path='/checkout' element={<Checkout/>}>
                    <Route path='/checkout' element={<CheckoutForm/>}/>
                    <Route path='/checkout/status' element={<PaymentStatus/>}/>
                </Route>
                <Route path='/register' element={<Register/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/my-shop/*' element={<MyShop/>}/>
                <Route path='/saved' element={<Saved/>}/>
                <Route path='/bag' element={<Bag/>}/>
            </Routes>
        </section>
        
    );
};

export default Body;