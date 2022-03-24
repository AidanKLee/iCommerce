import React, { useEffect } from 'react';
import Header from '../template/Header';
import Body from '../template/Body';
import Footer from '../template/Footer';
import './App.css';
import './transitions.css';
import { useDispatch } from 'react-redux';
import { login } from './appSlice';
import api from '../utils/api';

function App() {

  const { auth } = api;
  const dispatch = useDispatch();

  useEffect(() => {
    auth.restoreUserSession(dispatch, login);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id="app">
      <Header/>
      <Body/>
      <Footer/>
    </div>
  );
}

export default App;
