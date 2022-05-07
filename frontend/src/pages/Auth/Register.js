import React, { useMemo, useState } from 'react';
import './Auth.css';
import baseUrl from '../../utils/baseUrl';
import Button from '../../components/Button';
import ToggleSwitch from '../../components/ToggleSwitch';
import ShowPassword from '../../components/ShowPassword';
import api from '../../utils/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import LoadingModal from '../../components/LoadingModal';
import Redirect from '../Redirect';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/appSlice';

const Register = props => {

    const navigate = useNavigate();

    const location = useLocation();
    const redirect = useMemo(() => {
        return location.search ? location.search.slice(1).split('&').filter(param => param.includes('redirect'))[0].split('=')[1] : undefined;
    }, [location])

    const user = useSelector(selectUser);
    const isLoggedIn = useMemo(() => 'id' in user, [user]);

    const { auth } = api;

    const initialForm = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        birth_date: '',
        phone: '',
        subscribed: true
    }

    const [ showPassword, setShowPassword ] = useState(false);
    const [ form, setForm ] = useState(initialForm);
    const [ confirm, setConfirm ] = useState({
        email: '',
        password: ''
    })
    const [ requesting, setRequesting ] = useState(false);
    const [ warning, setWarning ] = useState(false);

    const { 
        first_name, last_name, email, password,
        birth_date, phone, subscribed 
    } = form;

    const confirmed = useMemo(() => {
        const confirmed = {};
        Object.keys(confirm).forEach(key => {
            confirmed[key] = form[key] === confirm[key];
        })
        return confirmed;
    }, [form, confirm])

    const allConfirmed = useMemo(() => {
        return !Object.keys(confirmed)
            .map(key => confirmed[key])
            .includes(false);
    }, [confirmed])

    const confirmedStyle = key => !confirmed[key] && warning ? { outline: '2px solid rgb(200,0,0)', borderRadius: '4px' } : {};

    const handleSubmit = async e => {
        e.preventDefault();
        if (allConfirmed) {
            try {
                setRequesting(true);
                await auth.register(form);
                setRequesting(false);
                navigate(redirect ? `/login?redirect=${redirect}` : '/login', {replace: false});
            } catch (err) {
                setRequesting(false);
                console.log('Registration Failed')
            }
        } else {
            setWarning(true);
        }
    }

    const handleReset = e => {
        e.preventDefault();
        setForm(initialForm)
    }

    const handleChange = e => {
        const input = e.target.id;
        let value = e.target.value;
        if (input === 'subscribed') {
            value = !subscribed
        }
        setForm({...form, [input]: value})
    }

    const handleConfirmChange = e => {
        const input = e.target.id.split('_').slice(1).join('_');
        let value = e.target.value;
        setConfirm({...confirm, [input]: value});
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleOauth = async e => {
        window.open(`${baseUrl}/api/auth/login/${e.target.value}`);
        window.OAuth2 = true;
        window.syncItems = async customer => await auth.syncItems(customer, user.saved, user.cart.items);
    }

    console.log(confirmed)

    return (
        <section className='auth'>
            <h2>Let's Get Started!</h2>
            <div className='register'>
                <div className='third r'>
                    <button onClick={handleOauth} className='party google' value='google' title='Login With Google'>
                        <div className='container'>
                            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
                            <p>Login With Google</p>
                        </div>
                    </button>
                    <button onClick={handleOauth} className='party facebook' value='facebook' title='Login With Facebook'>
                        <div className='container'>
                            <svg width="256px" height="256px" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><g><path d="M241.871,256.001 C249.673,256.001 256,249.675 256,241.872 L256,14.129 C256,6.325 249.673,0 241.871,0 L14.129,0 C6.324,0 0,6.325 0,14.129 L0,241.872 C0,249.675 6.324,256.001 14.129,256.001 L241.871,256.001" fill="#ffffff"></path><path d="M176.635,256.001 L176.635,156.864 L209.912,156.864 L214.894,118.229 L176.635,118.229 L176.635,93.561 C176.635,82.375 179.742,74.752 195.783,74.752 L216.242,74.743 L216.242,40.188 C212.702,39.717 200.558,38.665 186.43,38.665 C156.932,38.665 136.738,56.67 136.738,89.736 L136.738,118.229 L103.376,118.229 L103.376,156.864 L136.738,156.864 L136.738,256.001 L176.635,256.001" fill="#4267B2"></path></g></svg>
                            <p>Login With Facebook</p>
                        </div>
                    </button>
                </div>
                <p>or</p>
                <form onReset={handleReset} onSubmit={handleSubmit} id='auth' className='auth form' method='post'>
                    <div className='auth form double'>
                        <div className='auth form double input'>
                            <label htmlFor='first_name'>
                                First Name*
                            </label>
                            <input onChange={handleChange} type='text' id='first_name' name='first_name' placeholder='First Name' value={first_name} required />
                        </div>
                        <div className='auth form double input'>
                            <label htmlFor='last_name'>
                                Last Name*
                            </label>
                            <input onChange={handleChange} type='text' id='last_name' name='last_name' placeholder='Last Name' value={last_name} required />
                        </div>
                    </div>
                    <div className='auth form double'>
                        <div className='auth form double input'>
                            <label htmlFor='email'>
                                E-Mail*
                            </label>
                            <input onChange={handleChange} type='email' id='email' name='email' placeholder='E-Mail' value={email} required style={confirmedStyle('email')} />
                        </div>
                        <div className='auth form double input'>
                            <label htmlFor='confirm_email'>
                                Confirm E-Mail*
                            </label>
                            <input onChange={handleConfirmChange} type='email' id='confirm_email' name='confirm_email' placeholder='Confirm E-Mail' value={confirm.email} required style={confirmedStyle('email')} />
                        </div>
                    </div>
                    <div className='auth form double'>
                        <div className='auth form double input'>
                            <label htmlFor='password'>
                                Password*
                            </label>
                            <input onChange={handleChange} type={showPassword ? 'text' : 'password'} id='password' name='password' placeholder='Password' value={password} required style={confirmedStyle('password')} />
                            <ShowPassword className='show' visible={showPassword} onClick={handleShowPassword}/>
                        </div>
                        <div className='auth form double input'>
                            <label htmlFor='confirm_password'>
                                Confirm Password*
                            </label>
                            <input onChange={handleConfirmChange} type={showPassword ? 'text' : 'password'} id='confirm_password' name='confirm_password' placeholder='Confirm Password' value={confirm.password} required style={confirmedStyle('password')} />
                            <ShowPassword className='show' visible={showPassword} onClick={handleShowPassword}/>
                        </div>
                    </div>
                    <div className='auth form single'>
                        <label htmlFor='birth_date'>
                            Date Of Birth*
                        </label>
                        <input onChange={handleChange} type='date' id='birth_date' name='birth_date' placeholder='Date Of Birth' value={birth_date} required />
                    </div>
                    <div className='auth form single'>
                        <label htmlFor='phone'>
                            Phone
                        </label>
                        <input onChange={handleChange} type='tel' id='phone' name='phone' placeholder='07123456789 | +447123456789' value={phone} maxLength={16} />
                    </div>
                    <div className='auth form subscribe'>
                        <label htmlFor='subscribed'>
                            <b>I want to subscribe to the newsletter to recieve news and deals!</b>
                        </label>
                        <ToggleSwitch onChange={handleChange} id='subscribed' name='subscribed' checked={subscribed} />
                    </div>
                    <div className='auth form actions'>
                        <Button primary='rgb(30, 30, 30)' type='submit' design='invert'>Submit</Button>
                        <Button primary='rgb(200, 0, 0)' type='reset'>Reset</Button>
                    </div>
                </form>
                <div className='link-wrapper'>
                    <p>Already have an account? </p>
                    <Link to='/login'>Login here</Link>.
                </div>
            </div>
            <CSSTransition
                timeout={500}
                classNames={'fade'}
                in={requesting}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <LoadingModal />
            </CSSTransition>
            {
                isLoggedIn ? <Redirect to={redirect ? `/${redirect}` : '/'}/> : undefined
            }
        </section>
    )
}

export default Register;