import React, { useState } from 'react';
import './Auth.css';
import Button from '../../components/Button';
import ShowPassword from '../../components/ShowPassword';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../../components/LoadingModal'
import { CSSTransition } from 'react-transition-group';
import { useDispatch } from 'react-redux';
import { login } from '../../app/appSlice';

const Login = props => {

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { auth } = api;

    const initialForm = {
        email: '',
        password: ''
    }

    const [ showPassword, setShowPassword ] = useState(false);
    const [ form, setForm ] = useState(initialForm);
    const [ requesting, setRequesting ] = useState(false);
    const [ incorrect, setIncorrect ] = useState();

    const { 
        email, password
    } = form;

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setRequesting(true);
            let user = await auth.login(form);
            setRequesting(false);
            if (user.message) {
                return setIncorrect(user.message);
            }
            dispatch(login(user));
            navigate('/', {replace: false});
        } catch (err) {
            setIncorrect(err.message);
        }
    }

    const handleReset = e => {
        e.preventDefault();
        setForm(initialForm);
    }

    const handleChange = e => {
        const input = e.target.id;
        let value = e.target.value;
        setForm({...form, [input]: value})
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <section className='auth'>
            <h2>Login</h2>
            <form onReset={handleReset} onSubmit={handleSubmit} id='auth' className='auth form login' method='post'>
                <div className='auth form single'>
                    <label htmlFor='email'>
                        E-Mail*
                    </label>
                    <input onChange={handleChange} type='email' id='email' name='email' placeholder='E-Mail' value={email} required/>
                </div>
                <div className='auth form single'>
                    <label htmlFor='password'>
                        Password*
                    </label>
                    <input onChange={handleChange} type={showPassword ? 'text' : 'password'} id='password' name='password' placeholder='Password' value={password} required/>
                    <ShowPassword className='show' visible={showPassword} onClick={handleShowPassword}/>
                </div>
                <CSSTransition timeout={500} classNames={'fade'} in={typeof incorrect === 'string'} mountOnEnter={true} unmountOnExit={true}><p className='incorrect'>{incorrect}</p></CSSTransition>
                <div className='auth form actions login'>
                    <Button primary='rgb(30, 30, 30)' type='submit' design='invert'>Sign In</Button>
                    <Button primary='rgb(200, 0, 0)' type='reset'>Reset</Button>
                </div>
            </form>
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={requesting}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <LoadingModal />
            </CSSTransition>
        </section>
    )
}

export default Login;