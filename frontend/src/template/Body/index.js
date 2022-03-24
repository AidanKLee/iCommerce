import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../../pages/Home';
import Login from '../../pages/Auth/Login';
import Register from '../../pages/Auth/Register';
import './Body.css';

const Body = props => {
    return (
        <section className='app body'>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/login' element={<Login/>}/>
            </Routes>
        </section>
        
    );
};

export default Body;