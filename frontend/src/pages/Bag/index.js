import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { selectUser } from '../../app/appSlice';
import LoadingModal from '../../components/LoadingModal';
import ProductTile from '../../components/ProductTile';
import api from '../../utils/api';
import './Bag.css';
const { helper, products: p } = api;

const Bag = props => {

    const user = useSelector(selectUser);

    const shippingOptions = useMemo(() => {
        return {
            'Next Day': 3.99,
            'Standard': 1.99,
            'Upto 7 Days': 0
        }
    }, []) 

    const [ shipping, setShipping ] = useState('Next Day');
    const [ bagItems, setBagItems ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const getItems = async () => {
            setLoading(true);
            let products = await p.getByItemIdList(user.cart.items, user.cart.id);
            products = products.map(product => {
                const item_quantity = Number(user.cart.items.filter(it => {
                    return it.item_id === product.selected_item_id
                })[0].item_quantity);
                let price_total = Number(product.items.filter(item => {
                    return item.id === product.selected_item_id
                })[0].price.slice(1).replace(',', ''));
                price_total *= item_quantity;
                return {...product, item_quantity, price_total}
            })
            setBagItems(products);
            setLoading(false);
        }
        if (user.cart.items.length > 0) {
            getItems();
        } else {
            setBagItems([]);
        }
    }, [user.cart])

    const prices = useMemo(() => {
        let total = shippingOptions[shipping];
        bagItems.forEach(product => {
            total += product.price_total;
        })
        return {
            shipping: helper.currencyFormatter(shippingOptions[shipping]),
            subTotal: helper.currencyFormatter(total * .8),
            vat: helper.currencyFormatter(total * .2),
            total: helper.currencyFormatter(total)
        }
    }, [bagItems, shipping, shippingOptions])

    const handleChange = e => {
        const value = e.target.value;
        setShipping(value);
    }

    return (
        <section className='bag'>
            <header className='header'>
                <h2>
                    Shopping Bag
                </h2>
            </header>
            {
                bagItems.length > 0 ? (
                    <div className='products'>
                        <div className='left'>
                           {
                                bagItems.map(product => <ProductTile key={product.selected_item_id} product={product} type='bag'/>)
                            } 
                        </div>
                        <div className='right'>
                            <div className='sticky'>
                                <h3>
                                    Totals
                                </h3>
                                <div className='prices'>
                                    <select onChange={handleChange} value={shipping}>
                                        {
                                            Object.keys(shippingOptions).map(option => {
                                                return <option key={option} value={option}>{`${option} (${helper.currencyFormatter(shippingOptions[option])})`}</option>
                                            })
                                        }
                                    </select>
                                    <p className='sub total'>Shipping:<span>{prices.shipping}</span></p>
                                    <p className='sub total'>Sub-Total:<span>{prices.subTotal}</span></p>
                                    <p className='sub total'>VAT:<span>{prices.vat}</span></p>
                                    <p className='total'>Total:<b>{prices.total}</b></p>
                                </div>
                                <div className='actions'>
                                    <Link to='/checkout' className='checkout'>Proceed To Checkout</Link>
                                    <Link to='/' className='shop'>Return To Shopping</Link>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                ) : undefined
            }
            {
                !('id' in user) || bagItems.length === 0 ? (
                    <div className='main'>
                        {
                            bagItems.length === 0 ? (
                                <p className='no-bag'>No Products In Your Shopping Bag</p>
                            ) : undefined
                        }
                        {
                            !('id' in user) ? (
                                <div className='login'>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M.01 0h24v24h-24V0z" fill="none"/><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
                                    <p>
                                        Login To Sync With Your Accounts Shopping Bag
                                    </p>
                                    <Link to='/login' title='Login'>
                                        Login
                                    </Link>
                                </div>
                            ) : undefined
                        }
                    </div>
                ) : undefined
            }
            <CSSTransition 
                    timeout={500}
                    classNames={'fade'}
                    in={loading}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                <LoadingModal />
            </CSSTransition>
        </section>
    )
}

export default Bag;