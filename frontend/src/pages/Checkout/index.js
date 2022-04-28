import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { selectUser } from '../../app/appSlice';
import api from '../../utils/api';
import Redirect from '../Redirect';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './Checkout.css';
import LoadingModal from '../../components/LoadingModal';

const { customer: c, checkout: check, helper } = api;
const stripePromise = loadStripe('pk_test_51KqCC6Akn0wgoOV8Ka8mzVNQl8GKwM9JlitRWG4R5pyrsXA49Q2ca1OJSka4GJUiHW6KFZzSGVo4H1yPwXBYjuF300tHQf9oeJ');

const Checkout = props => {

    const navigate = useNavigate();
    const location = useLocation();
    const bag = location.state;
    const user = useSelector(selectUser);
    const isLoggedIn = useMemo(() => 'id' in user, [user]);
    const sessionRestoreAttempt = useMemo(() => !user.pending, [user]);

    let [ addresses, setAddresses ] = useState([]);
    addresses = useMemo(() => {
        return addresses.sort((a,b) => a.primary ? -1 : 0);
    }, [addresses])

    const [ order_id, setOrderId ] = useState('');
    const [ clientSecret, setClientSecret ] = useState();
    const [ {items = [], total}, setData ] = useState({items: '', total: 0});
    const [ addressSelect, setAddressSelect ] = useState(false);
    const [ selected, setSelected ] = useState(0);
    const [ initialLoad, setInitialLoad ] = useState(false);
    const [ addressForm, setAddressesForm ] = useState({
        open: false,
        line_1: '',
        line_2: '',
        city: '',
        county: '',
        postcode: '',
        is_primary: true
    });

    const transitionIn = useMemo(() => {
        return typeof clientSecret === 'string' || location.pathname.includes('status')
    }, [clientSecret, location])

    const stripeOptions = useMemo (() => {
        return {
            clientSecret: clientSecret,
            appearance: {
                theme: 'stripe',
                variables: {
                    colorPrimary: '#6464ff',
                    colorText: '#1f1f1f',
                    borderRadius: '4px',
                    fontFamily: 'Poppins'
                }
            },
            loader: 'always',
            fonts: [{cssSrc: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap'}]
            
        }
    }, [clientSecret]) 

    const prices = useMemo(() => {
        return {
            total: helper.currencyFormatter(total),
            subtotal: helper.currencyFormatter(total * .8),
            vat: helper.currencyFormatter(total * .2),
            shipping: helper.currencyFormatter(bag ? bag.shipping === 'Next Day' ? 3.99 : bag.shipping === 'Standard' ? 1.99 : 0 : 0)
        }
    }, [bag, total])

    useEffect(() => {
        if (bag && 'items' in bag && 'shipping' in bag) {
            check.paymentIntent(bag, setClientSecret, setData, setOrderId);
        }
        // else {
        //     navigate('/bag', {replace: false})
        // }
    }, [bag, navigate])

    useEffect(() => {
        if (addresses.length > 0) {
            setAddressesForm(a => { 
                return {
                ...a, is_primary: false
                }
            })
        }
    }, [addresses])

    useEffect(() => {
        if ('id' in user && !initialLoad) {
            c.getAddresses(user.id, setAddresses);
            setInitialLoad(true);
        }
    }, [user, initialLoad])

    const openAddressForm = () => {
        setAddressesForm({...addressForm, open: !addressForm.open})
    }

    const handleAddressSubmit = e => {
        e.preventDefault();
        const form = addressForm;
        delete form.open;
        c.postAddress(user.id, form, setAddresses);
    }

    const confirmAddress = e => {
        setAddressSelect(!addressSelect);
    }

    const handleAddressSelect = e => {
        const value = e.target.value;
        setSelected(value);
    }

    return (
        <section className='checkout'>
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={transitionIn}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <Elements stripe={stripePromise} options={stripeOptions}>
                    <Outlet 
                        context={{
                            addresses, 
                            addressForm: [ addressForm, setAddressesForm ],
                            addressSelect: [addressSelect, setAddressSelect],
                            confirmAddress, handleAddressSelect,
                            handleAddressSubmit, items, openAddressForm, order_id,
                            prices, selected, shippingOption: bag ? bag.shipping : null, user
                        }}
                    />
                </Elements>
            </CSSTransition>
            <CSSTransition 
                    timeout={500}
                    classNames={'fade'}
                    in={!transitionIn}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                <LoadingModal />
            </CSSTransition>
            {
                !isLoggedIn && sessionRestoreAttempt ? <Redirect to={'/login'}/> : undefined
            }
        </section>
    )
}

export default Checkout;