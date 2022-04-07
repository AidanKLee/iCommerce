import React, { useEffect, useState } from 'react';
import Header from '../template/Header';
import Body from '../template/Body';
import Footer from '../template/Footer';
import './App.css';
import './transitions.css';
import { useDispatch } from 'react-redux';
import { login } from './appSlice';
import api from '../utils/api';
import Menu from '../template/Menu';

function App() {

  const { auth } = api;
  const dispatch = useDispatch();

  const [ menuOpen, setMenuOpen ] = useState(false);

  useEffect(() => {
    auth.restoreUserSession(dispatch, login);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const menuBlur = menuOpen ? {filter: 'blur(8px)'} : {}

  return (
    <div id="app">
      <Header menuOpen={[menuOpen, setMenuOpen]}/>
      <Body/>
      <Menu open={[menuOpen, setMenuOpen]}/>
      <Footer/>
    </div>
  );
}

export default App;
