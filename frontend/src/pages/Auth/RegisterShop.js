import React, { useState } from 'react';
import './Auth.css';
import Button from '../../components/Button';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import LoadingModal from '../../components/LoadingModal';
import { useDispatch } from 'react-redux';
import { login } from '../../app/appSlice';

const RegisterShop = props => {

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { auth } = api;

    const initialForm = {
        shop_name: '',
        description: '',
        business_email: '',
        business_phone: ''
    }

    const [ form, setForm ] = useState(initialForm);
    const [ requesting, setRequesting ] = useState(false);

    const { 
        shop_name, description, business_email, business_phone
    } = form;

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setRequesting(true);
            await auth.registerShop(form);
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
        setForm({...form, [input]: value})
    }

    return (
        <section className='auth'>
            <h2>Create Your Shop</h2>
            <form onReset={handleReset} onSubmit={handleSubmit} id='auth' className='auth form' method='post'>
                <div className='auth form single'>
                    <label htmlFor='shop_name'>
                        Shop Name
                    </label>
                    <input onChange={handleChange} type='text' id='shop_name' name='shop_name' placeholder='Shop Name' value={shop_name} maxLength={128} />
                </div>
                <div className='auth form single'>
                    <label htmlFor='description'>
                        Shop Description
                    </label>
                    <textarea onChange={handleChange} id='description' name='description' placeholder='Shop Description' value={description}></textarea>
                </div>
                <div className='auth form single'>
                    <label htmlFor='business_email'>
                        Business E-Mail
                    </label>
                    <input onChange={handleChange} type='email' id='business_email' name='business_email' placeholder='Business E-Mail' value={business_email} maxLength={256} />
                </div>
                <div className='auth form single'>
                    <label htmlFor='business_phone'>
                        Business Phone
                    </label>
                    <input onChange={handleChange} type='tel' id='business_phone' name='business_phone' placeholder='07123456789 | +447123456789' value={business_phone} maxLength={16} />
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

export default RegisterShop;