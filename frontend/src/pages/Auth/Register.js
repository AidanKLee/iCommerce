import React, { useState } from 'react';
import './Auth.css';
import Button from '../../components/Button';
import ToggleSwitch from '../../components/ToggleSwitch';
import ShowPassword from '../../components/ShowPassword';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import LoadingModal from '../../components/LoadingModal';

const Register = props => {

    const navigate = useNavigate();
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
    const [ requesting, setRequesting ] = useState(false);

    const { 
        first_name, last_name, email, password,
        birth_date, phone, subscribed 
    } = form;

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setRequesting(true);
            await auth.register(form);
            setRequesting(false);
            navigate('/login', {replace: false});
        } catch (err) {
            setRequesting(false);
            console.log('Registration Failed')
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

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <section className='auth'>
            <h2>Register</h2>
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
                        <input onChange={handleChange} type='email' id='email' name='email' placeholder='E-Mail' value={email} required />
                    </div>
                    <div className='auth form double input'>
                        <label htmlFor='password'>
                            Password*
                        </label>
                        <input onChange={handleChange} type={showPassword ? 'text' : 'password'} id='password' name='password' placeholder='Password' value={password} required />
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
                    <input onChange={handleChange} type='tel' id='phone' name='phone' placeholder='07123456789 | +447123456789' value={phone} maxlength={16} />
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

export default Register;