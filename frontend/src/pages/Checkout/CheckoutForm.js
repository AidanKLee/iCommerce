import React, { useMemo, useState } from 'react';
import { PaymentElement } from '@stripe/react-stripe-js';
import AddressForm from '../../components/AddressForm';
import { CSSTransition } from 'react-transition-group';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import baseUrl from '../../utils/baseUrl';
import api from '../../utils/api';
import { useOutletContext } from 'react-router-dom';

const { checkout: c, helper } = api;

const CheckoutForm = props => {
 
    const { 
        addresses, addressForm: [ addressForm, setAddressesForm ],
        addressSelect: [addressSelect, setAddressSelect],
        confirmAddress, handleAddressSelect,
        handleAddressSubmit, items, openAddressForm,
        order_id, prices, selected, shippingOption, user 
    } = useOutletContext();

    const stripe = useStripe();
    const elements = useElements();

    const [ error, setError ] = useState('');

    const orderBody = useMemo(() => {
        return {
            deliveryAddressId: addresses.length > 0 ? addresses[selected].id : null,
            cartId: user.cart.id,
            postage: {
                option: shippingOption,
                price: prices.shipping
            },
            items: items && items.length > 0 ? items.map(item => {
                return {
                    seller_id: item.seller.id,
                    item_id: item.id,
                    item_quantity: item.item_quantity,
                    item_price: item.price
                }
            }) : []
        }
    }, [addresses, selected, user.cart.id, shippingOption, prices.shipping, items])

    const submitDisabled = useMemo(() => {
        return !stripe || !elements
    }, [stripe, elements])

    const { 
        city, country = 'GB', line_1: line1, line_2: line2,
        county: state, postcode: postal_code
    } = useMemo(() => addresses.length > 0 ? addresses[selected] : (
        {city: '', country: '', line_1: '', line_2: '', county: '', postcode: ''}
    ), [addresses, selected])

    const handleSubmit = async e => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        await c.submitOrder(user.id, order_id, orderBody);
        const { err } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${baseUrl}/checkout/status`,
                shipping: {
                    address: {
                        city, country, line1, line2, state, postal_code
                    },
                    name: `${user.first_name} ${user.last_name}`
                }
            }
        })
        if (err) {
            setError(err.message)
        }
    }

    return (
        <div>
            <header className='header'>
                <h2>
                    Checkout
                </h2>
            </header>
            <div className='customer'>
                <div className='side'></div>
                <div className='wrapper'>
                    <div className='left'>
                        <div className='main'>
                            <h3>
                                Delivery Address
                            </h3>
                        </div>
                        <div className='addresses'>
                            {
                                addresses.length === 0 ? (
                                    <p className='none'>You currently have no addresses.</p>
                                ) : (
                                    <div className='selected'>
                                        <div className='item'>
                                            <p className='name'>{`${user.first_name} ${user.last_name}`}</p>
                                            <p>{addresses[selected].line_1}</p>
                                            {
                                                addresses[selected].line_2 ? <p>{addresses[selected].line_2}</p> : undefined
                                            }
                                            <p>{addresses[selected].city}</p>
                                            <p>{addresses[selected].county}</p>
                                            <p>{addresses[selected].postcode}</p>
                                        </div>
                                    </div>
                                    
                                )
                            }
                            <CSSTransition
                                timeout={500}
                                classNames={'grow'}
                                in={addressSelect}
                                mountOnEnter={true}
                                unmountOnExit={true}
                            >
                                <div className='selector'>
                                    <select onChange={handleAddressSelect} className='select' value={selected}>
                                        {
                                            addresses.map((address,i) => {
                                                return (
                                                    <option key={address.line_1} value={i}>
                                                        {`${address.line_1}, ${address.line_2 ? address.line_2 + ',' : ''} ${address.city}, ${address.county}, ${address.postcode}`}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </CSSTransition>
                            {
                                addresses.length > 1 ? (
                                        !addressSelect ? (
                                            <button onClick={() => setAddressSelect(!addressSelect)} className='add select'>
                                                Select Address
                                            </button>
                                        ) : (
                                            <button onClick={confirmAddress} className='add select'>
                                                Confirm Address
                                            </button>
                                        )
                                ) : undefined
                            }
                            <button onClick={openAddressForm} className='add'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                                Add New Address
                            </button>
                        </div>
                        <div className='main'>
                            <h3>
                                Payment
                            </h3>
                        </div>
                        <div className='payment'>
                            <PaymentElement/>
                        </div>
                        <CSSTransition 
                            timeout={500}
                            classNames={'fade'}
                            in={items.length > 0}
                            mountOnEnter={true}
                            unmountOnExit={true}
                        >
                            <div>
                                <div className='main'>
                                    <h3>
                                        Products
                                    </h3>
                                </div>
                                <ul className='items'>
                                    {
                                        items.length > 0 ? items.map(item => {
                                            return (
                                                <li key={item.id}>
                                                    <figure>
                                                        <img src={item.image.src} alt={item.name}/>
                                                        <figcaption>
                                                            <p>{item.name}</p>
                                                            <span>Qty:</span>{item.total / helper.currencyToInteger(item.price)}
                                                        </figcaption>
                                                    </figure>
                                                    <div>
                                                        <p>{helper.currencyFormatter(item.total)}</p>
                                                        { item.total / helper.currencyToInteger(item.price) > 1 ? <p>{`${item.price} each`}</p> : undefined }
                                                    </div>
                                                </li>
                                            )
                                        }) : undefined
                                    }
                                </ul>
                            </div>
                            
                        </CSSTransition>
                    </div>
                    <div className='right'>
                        <div className='sticky'>
                        <ul className='prices'>
                            <li className='total'>
                                <span>Total:</span>{prices.total}
                            </li>
                            <li>
                                <span>Sub-Total:</span>{prices.subtotal}
                            </li>
                            <li>
                                <span>VAT</span>{prices.vat}
                            </li>
                            <li>
                                <span>Shipping</span>{prices.shipping}
                            </li>
                        </ul>
                            <button onClick={handleSubmit} disabled={submitDisabled}>Complete Order</button>
                        </div>
                    </div>
                </div>
                <div className='side right'></div>
            </div>
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={addressForm.open}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <ul className='notifications'>
                    <li>{ error }</li>
                </ul>
            </CSSTransition>
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={addressForm.open}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <AddressForm handleSubmit={handleAddressSubmit} form={[addressForm, setAddressesForm]} />
            </CSSTransition>
        </div>
        
    )
}

export default CheckoutForm;