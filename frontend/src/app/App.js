import React, { useEffect, useRef, useState } from 'react';
import Header from '../template/Header';
import Body from '../template/Body';
import Footer from '../template/Footer';
import './App.css';
import './transitions.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectUser, setBagItems, setSavedItems } from './appSlice';
import api from '../utils/api';
import Menu from '../template/Menu';
import { CSSTransition } from 'react-transition-group';
import AddToModal from '../components/AddToModal';

function App() {

  const { auth } = api;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const timer = useRef(null);

  const [ initialLoad, setInitialLoad ] = useState(false);
  const [ menuOpen, setMenuOpen ] = useState(false);
  const [ addToModal, setAddToModal ] = useState({
    showing: false,
    fulfilled: false,
    rejected: false,
    message: ''
  })

  // Attempt to restore user session if available
  useEffect(() => {
    auth.restoreUserSession(dispatch, login, user)
    .then(() => setInitialLoad(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Create bag and saved if not in local memory else set state from local memory
  useEffect(() => {
    if (!('id' in user)) {
      let saved = localStorage.getItem('saved');
      if (!saved) {
        localStorage.setItem('saved', JSON.stringify([]));
      } else {
        saved = JSON.parse(saved);
        dispatch(setSavedItems(saved));
      }

      let bag = localStorage.getItem('bag');
      if (!bag) {
        localStorage.setItem('bag', JSON.stringify([]));
      } else {
        bag = JSON.parse(bag);
        dispatch(setBagItems(bag));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoad])

  // Save changes from state to local memory
  useEffect(() => {
    if (initialLoad) {
      localStorage.setItem('saved', JSON.stringify(user.saved || []));
    }
  }, [user.saved, initialLoad])

  useEffect(() => {
    if (initialLoad) {
      localStorage.setItem('bag', JSON.stringify(user.cart.items || []));
    }
  })

  useEffect(() => {
    if (user.cart.pending) {
      setAddToModal({
        showing: true,
        fulfilled: user.cart.fulfilled,
        rejected: user.cart.rejected,
        message: user.cart.message
      })
    } else if (initialLoad && !user.cart.pending) {
      setAddToModal({
        ...addToModal,
        fulfilled: user.cart.fulfilled,
        rejected: user.cart.rejected,
        message: user.cart.message
      })
      timer.current = setTimeout(() => {
        setAddToModal({
          showing: false,
          fulfilled: user.cart.fulfilled,
          rejected: user.cart.rejected,
          message: user.cart.message
        })
      }, 2000);
    }
    return () => clearTimeout(timer.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.cart.message])

  useEffect(() => {
    if (user.savedStatus.pending) {
      setAddToModal({
        showing: true,
        fulfilled: user.savedStatus.fulfilled,
        rejected: user.savedStatus.rejected,
        message: user.savedStatus.message
      })
    } else if (initialLoad && !user.savedStatus.pending) {
      setAddToModal({
        ...addToModal,
        fulfilled: user.savedStatus.fulfilled,
        rejected: user.savedStatus.rejected,
        message: user.savedStatus.message
      })
      timer.current = setTimeout(() => {
        setAddToModal({
          showing: false,
          fulfilled: user.savedStatus.fulfilled,
          rejected: user.savedStatus.rejected,
          message: user.savedStatus.message
        })
      }, 2000);
    }
    return () => clearTimeout(timer.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.savedStatus.message])

  return (
    <div id="app">
      <Header menuOpen={[menuOpen, setMenuOpen]}/>
      <Body/>
      <Menu open={[menuOpen, setMenuOpen]}/>
      <Footer/>
      <CSSTransition timeout={500} classNames='fade' in={addToModal.showing} mountOnEnter={true} unmountOnExit={true}>
        <AddToModal fulfilled={addToModal.fulfilled} rejected={addToModal.rejected} message={addToModal.message}/>
      </CSSTransition>
    </div>
  );
}

export default App;
