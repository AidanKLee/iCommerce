import React, { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import './PaymentStatus.css';
import { CSSTransition } from 'react-transition-group';
import api from '../../utils/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/appSlice';
import { useNavigate } from 'react-router-dom';

const { checkout: c } = api;

const PaymentStatus = props => {

    const navigate = useNavigate();
    const stripe = useStripe();

    const user = useSelector(selectUser);

    const [ status, setStatus ] = useState('processing');
    const [ processing, setProcessing ] = useState(true);

    const confirmPayment = async (userId, orderId) => {
        let confirmed = false;
        let count = 0;
        while (confirmed === false && count < 3) {
            try {
                await c.confirmPayment(userId, orderId);
                confirmed = true;
            } catch (err) {
                count ++
            }
        }
    }

    useEffect(() => {
        if (stripe && 'id' in user) {
            try {
                const clientSecret = new URLSearchParams(window.location.search).get(
                    'payment_intent_client_secret'
                );
                stripe
                .retrievePaymentIntent(clientSecret)
                .then(({paymentIntent}) => {
                    const { description } = paymentIntent;
                    const { order_id } = JSON.parse(description);
                    if (paymentIntent.status === 'processing') {
                        setProcessing(true);
                        setStatus('processing');
                    } else if (paymentIntent.status === 'succeeded') {
                        confirmPayment(user.id, order_id)
                        .then(() => c.transferPaymentToSellers(order_id))
                        .then(() => setStatus('succeeded'))

                    } else if (paymentIntent.status === 'requires_payment_method') {
                        setStatus('requires_payment_method');
                    } else {
                        setStatus('error');
                    }
                })
            } catch(err) {
                setStatus('error');
            }
        }
    }, [stripe, user])
    
    useEffect(() => {
        if (status === 'succeeded' ) {
            const timer = setTimeout(() => {
                navigate('/', { replace: false })
            }, 6000)
            return () => clearTimeout(timer);
        } else if (status !== 'processing' && status !== 'succeeded') {
            const timer = setTimeout(() => {
                navigate(-1);
            }, 6000)
            return () => clearTimeout(timer);
        }
    }, [navigate, status])

    return (
        <section className='payment-status'>
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={status === 'processing'}
                mountOnEnter={true}
                unmountOnExit={true}
                onExited={() => setProcessing(false)}
            >
                <div className='message processing'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="128px" height="128px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><path d="M10 50A40 40 0 0 0 90 50A40 45 0 0 1 10 50" stroke="none"><animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 52.5;360 50 52.5"></animateTransform></path></svg>
                    <p className='line1'>Payment Processing!</p>
                    <p>We'll let you know when we've recieved your payment.</p>
                    <p>Almost there now...</p>
                </div>
            </CSSTransition>
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={status === 'succeeded' && !processing}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <div className='message success'>
                    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M22,5.18L10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l10-10L22,5.18z M19.79,10.22C19.92,10.79,20,11.39,20,12 c0,4.42-3.58,8-8,8s-8-3.58-8-8c0-4.42,3.58-8,8-8c1.58,0,3.04,0.46,4.28,1.25l1.44-1.44C16.1,2.67,14.13,2,12,2C6.48,2,2,6.48,2,12 c0,5.52,4.48,10,10,10s10-4.48,10-10c0-1.19-0.22-2.33-0.6-3.39L19.79,10.22z"/></svg>
                    <p className='line1'>Payment Successful!</p>
                    <p>Your order's on its way to you now.</p>
                    <p>Taking you home...</p>
                </div>
            </CSSTransition>
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={status === 'requires_payment_method' && !processing}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <div className='message requires'>
                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M6.83,4H20c1.11,0,2,0.89,2,2v12c0,0.34-0.08,0.66-0.23,0.94L20,17.17V12h-5.17l-4-4H20V6H8.83 L6.83,4z M20.49,23.31L17.17,20H4c-1.11,0-2-0.89-2-2L2.01,6c0-0.34,0.08-0.66,0.23-0.93L0.69,3.51L2.1,2.1l19.8,19.8L20.49,23.31z M4,6.83V8h1.17L4,6.83z M15.17,18l-6-6H4v6H15.17z" enable-background="new"/></svg>
                    <p className='line1'>Payment Failed!</p>
                    <p>Please try again or give another payment method a try, we're taking you back in a moment.</p>
                    <p>Don't worry, nothings left your account yet!</p>
                </div>
            </CSSTransition>
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={status !== 'requires_payment_method' && status !== 'processing' && status !== 'succeeded' && !processing}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <div className='message error'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 0 48 48" width="48"><path d="M22.65 26.35H25.65V13.7H22.65ZM24 34Q24.7 34 25.175 33.525Q25.65 33.05 25.65 32.35Q25.65 31.65 25.175 31.175Q24.7 30.7 24 30.7Q23.3 30.7 22.825 31.175Q22.35 31.65 22.35 32.35Q22.35 33.05 22.825 33.525Q23.3 34 24 34ZM24 44Q19.75 44 16.1 42.475Q12.45 40.95 9.75 38.25Q7.05 35.55 5.525 31.9Q4 28.25 4 24Q4 19.8 5.525 16.15Q7.05 12.5 9.75 9.8Q12.45 7.1 16.1 5.55Q19.75 4 24 4Q28.2 4 31.85 5.55Q35.5 7.1 38.2 9.8Q40.9 12.5 42.45 16.15Q44 19.8 44 24Q44 28.25 42.45 31.9Q40.9 35.55 38.2 38.25Q35.5 40.95 31.85 42.475Q28.2 44 24 44ZM24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24ZM24 41Q31 41 36 36Q41 31 41 24Q41 17 36 12Q31 7 24 7Q17 7 12 12Q7 17 7 24Q7 31 12 36Q17 41 24 41Z"/></svg>
                    <p className='line1'>Something Went Wrong!</p>
                    <p>Please try again, we're taking you back in a moment.</p>
                    <p>Don't worry, nothings left your account yet!</p>
                </div>
            </CSSTransition>
        </section>
    )
}

export default PaymentStatus;