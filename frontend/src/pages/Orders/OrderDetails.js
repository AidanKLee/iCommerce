import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import LoadingModal from '../../components/LoadingModal';
import api from '../../utils/api';
import './OrderDetails.css';

const { customer: c, helper, seller: s } = api;

const OrderDetails = props => {

    const location = useLocation();
    const navigate = useNavigate();

    const { orderId } = useParams();
    const { user, isLoggedIn } = useOutletContext();

    const [ order, setOrder ] = useState({
        customer_id: '', date: '', id: '', delivery_address: '',
        payment_complete: '', postage_option: '', postage_price:'' , sellers: []
    });

    let {
        customer_id, date, id, delivery_address, payment_complete,
        postage_price, sellers
    } = useMemo(() => order, [order])

    sellers = useMemo(() => {
        return sellers.map(seller => {
            const { items } = seller;
            let dispatched = true;
            let delivered = true;
            let reviewed = false;
            let reviewedCustomer = false;
            let total = 0;
            let cancelled = true;
            items.forEach(item => {
                if (!item.dispatch_date) {
                    dispatched = false;
                }
                if (!item.delivery_date) {
                    delivered = false;
                }
                if (item.reviewed_customer) {
                    reviewedCustomer = true;
                }
                if (item.reviewed_seller) {
                    reviewed = true;
                }
                if (!item.cancelled) {
                    cancelled = false;
                }
                total += (item.item_quantity * helper.currencyToInteger(item.item_price))
            })
            seller.total = helper.currencyFormatter(total);
            seller.reviewed = reviewed;
            seller.dispatched = dispatched;
            seller.delivered = delivered;
            seller.cancelled = cancelled;
            seller.reviewedCustomer = reviewedCustomer;
            return seller;
        })
    }, [sellers])

    const status = useMemo(() => {
        let dispatched = true;
        let delivered = true;
        let cancelled = true;
        sellers.forEach(seller => {
            if (!seller.dispatched) {
                dispatched = false;
            }
            if (!seller.delivered) {
                delivered = false;
            }
            if (!seller.cancelled) {
                cancelled = false;
            }
        })
        return { dispatched, delivered, cancelled }
    }, [sellers])

    const type = useMemo(() => {
        return location.pathname.split('/')[1];
    }, [location.pathname])

    const cancellable = useMemo(() => {
        let cancellable = true;
        sellers.forEach(seller => {
            if (seller.dispatched) {
                cancellable = false;
            }
            if (seller.cancelled) {
                cancellable = false
            }
        })
        return cancellable;
    }, [sellers])

    const totals = useMemo(() => {
        let total = helper.currencyToInteger(postage_price);
        sellers.forEach(seller => total = total + helper.currencyToInteger(seller.total))
        return {
            total: helper.currencyFormatter(total),
            subTotal: helper.currencyFormatter(total - helper.currencyToInteger(postage_price)),
            vat: helper.currencyFormatter(total * .2),
            vatTotal: helper.currencyFormatter(total * .8),
            postage_price
        }
    }, [postage_price, sellers])

    const reviewState = useMemo(() => {
        return {
            user_id: user.id,
            order_id: id
        }
    }, [user, id])

    useEffect(() => {
        if (!order.customer_id && isLoggedIn) {
            if (type !== 'my-shop') {
                c.getOrderById(user.id, orderId, setOrder)
                .then(err => {
                    if (err && 'message' in err) {
                        navigate('/error')
                    }
                })
            } else {
                s.getOrderById(user.id, orderId, setOrder)
                .then(err => {
                    if (err && 'message' in err) {
                        navigate('/error')
                    }
                })
            }
        }
    }, [isLoggedIn, navigate, order, orderId, type, user.id])
    
    const handleCancel = (sellerId, orderItemId) => {
        c.cancelOrder(user.id, id, sellerId, orderItemId)
        .then(() => c.getOrderById(user.id, orderId, setOrder))
    }

    const handleUpdateOrderSeller = (orderItemId, { dispatched, delivered, reviewed }) => {
        s.updateOrder(user.id, id, orderItemId, dispatched, delivered, reviewed)
        .then(() => c.getOrderById(user.id, orderId, setOrder))
    }

    return (
        <section className='details'>
            <div className='top'>
                <div className='max'>
                    <div className='left'>
                        <p>{`Order ID: ${orderId}`}</p>
                        <p>{`Customer ID: ${customer_id}`}</p>
                    </div>
                    <p className='right'>{`Ordered on ${new Date(date).toDateString()}`}</p>
                </div>
            </div>
            <div className='customer max'>
                <div className='delivery'>
                    <p className='title'>Delivery Address</p>
                    <p>{`${user.first_name} ${user.last_name}`}</p>
                    <p>{delivery_address.line_1}</p>
                    { delivery_address.line_2 ? <p>{delivery_address.line_2}</p> : undefined }
                    <p>{delivery_address.city}</p>
                    <p>{delivery_address.county}</p>
                    <p>{delivery_address.postcode}</p>
                </div>
                <div className='price'>
                    <p className='title align-right'>Order Totals</p>
                    <div className='figure'>
                        <p>Sub-Total:</p>
                        <p>{totals.subTotal}</p>
                    </div>
                    <div className='figure underline'>
                        <p>Postage:</p>
                        <p>{totals.postage_price}</p>
                    </div>
                    <div className='figure'>
                        <p>VAT:</p>
                        <p>{totals.vat}</p>
                    </div>
                    <div className='figure underline'>
                        <p>Before VAT:</p>
                        <p>{totals.vatTotal}</p>
                    </div>
                    <div className='figure'>
                        <p>Total:</p>
                        <b>{totals.total}</b>
                    </div>
                </div>
            </div>
            <div className='payment'>
                {
                    !payment_complete ? (
                        !status.cancelled ? (
                            type === 'my-shop' ? (
                                <p><svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48"><path d="M7 40Q5.8 40 4.9 39.1Q4 38.2 4 37V11Q4 9.8 4.9 8.9Q5.8 8 7 8H41Q42.2 8 43.1 8.9Q44 9.8 44 11V37Q44 38.2 43.1 39.1Q42.2 40 41 40ZM7 16.45H41V11Q41 11 41 11Q41 11 41 11H7Q7 11 7 11Q7 11 7 11ZM7 22.9V37Q7 37 7 37Q7 37 7 37H41Q41 37 41 37Q41 37 41 37V22.9ZM7 37Q7 37 7 37Q7 37 7 37V11Q7 11 7 11Q7 11 7 11Q7 11 7 11Q7 11 7 11V37Q7 37 7 37Q7 37 7 37Z"/></svg>Awaiting Payment</p>
                            ) : (
                                <p className='action'><svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48"><path d="M7 40Q5.8 40 4.9 39.1Q4 38.2 4 37V11Q4 9.8 4.9 8.9Q5.8 8 7 8H41Q42.2 8 43.1 8.9Q44 9.8 44 11V37Q44 38.2 43.1 39.1Q42.2 40 41 40ZM7 16.45H41V11Q41 11 41 11Q41 11 41 11H7Q7 11 7 11Q7 11 7 11ZM7 22.9V37Q7 37 7 37Q7 37 7 37H41Q41 37 41 37Q41 37 41 37V22.9ZM7 37Q7 37 7 37Q7 37 7 37V11Q7 11 7 11Q7 11 7 11Q7 11 7 11Q7 11 7 11V37Q7 37 7 37Q7 37 7 37Z"/></svg>Complete Payment</p>
                            )
                        ) : undefined
                        
                    ) : <p><svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48"><path d="M7 40Q5.8 40 4.9 39.1Q4 38.2 4 37V11Q4 9.8 4.9 8.9Q5.8 8 7 8H41Q42.2 8 43.1 8.9Q44 9.8 44 11V37Q44 38.2 43.1 39.1Q42.2 40 41 40ZM7 16.45H41V11Q41 11 41 11Q41 11 41 11H7Q7 11 7 11Q7 11 7 11ZM7 22.9V37Q7 37 7 37Q7 37 7 37H41Q41 37 41 37Q41 37 41 37V22.9ZM7 37Q7 37 7 37Q7 37 7 37V11Q7 11 7 11Q7 11 7 11Q7 11 7 11Q7 11 7 11V37Q7 37 7 37Q7 37 7 37Z"/></svg>Payment Complete</p>
                }
            </div>
            {
                cancellable ? (
                    <div className='cancel-order'>
                        <p onClick={() => handleCancel()}>Cancel Order</p>
                    </div>
                ) : undefined
            }
            <div className='sellers'>
                {
                    sellers.map(seller => {
                        const {
                            cancelled, delivered, dispatched, id: seller_id, items,
                            reviewed, reviewedCustomer, shop_name, total
                        } = seller;
                        return (
                            <div key={seller_id} className='seller'>
                                <div className='top'>
                                    <p>{shop_name}</p>
                                    <p>{`Total: ${total}`}</p>
                                </div>
                                <div className='bottom'>
                                    <ul className='actions'>
                                        {
                                            !cancelled ? (
                                                payment_complete ? (
                                                    !dispatched ? (
                                                        type === 'my-shop' ? (
                                                            cancelled ? undefined : <li onClick={() => handleUpdateOrderSeller(null, {dispatched: true})}>Mark Order As Dispatched</li>
                                                        ) : (
                                                            <li className='done'>Awaiting Dispatch</li>
                                                        )
                                                    ) : <li className='done'>Order Dispatched</li>
                                                ) : <li className='done'>Awaiting payment</li>
                                            ) : undefined
                                        }
                                        {
                                            !dispatched ? (
                                                undefined
                                            ) : (
                                                !delivered ? (
                                                    type === 'my-shop' ? (
                                                        <li onClick={() => handleUpdateOrderSeller(null, {delivered: true})}>Mark Order As Delivered</li>
                                                    ) : (
                                                        <li className='done'>Awaiting Delivery</li>
                                                    )
                                                ) : <li className='done'>Order Delivered</li>
                                            )
                                        }
                                        {
                                            !delivered ? (
                                                undefined
                                            ) : (
                                                !reviewedCustomer ? (
                                                    type === 'my-shop' ? (
                                                        <li><Link to='/review' state={{...reviewState, customer_id, order_item_id: items[0].id}}>Review customer</Link></li>
                                                    ) : undefined
                                                ) : (
                                                    type === 'my-shop' ? (
                                                        <li className='done'>Reviewed Customer</li>
                                                    ) : (
                                                        <li className='done'>You have been reviewed</li>
                                                    )
                                                )
                                            )
                                        }{
                                            !delivered ? (
                                                undefined
                                            ) : (
                                                !reviewed ? (
                                                    type === 'my-shop' ? (
                                                        undefined
                                                    ) : <li><Link to='/review' state={{...reviewState, seller_id: seller_id, name: shop_name, order_item_id: items[0].id}}>Review Seller</Link></li>
                                                ) : (
                                                    type === 'my-shop' ? (
                                                        <li className='done'>You have been reviewed</li>
                                                    ) : (
                                                        <li className='done'>Seller Reviewed</li>
                                                    )
                                                )
                                            )
                                        }
                                        {
                                            cancelled ? (
                                                type === 'my-shop' ? (
                                                    <li className='done'>Order Cancelled</li>
                                                ) : (
                                                    <li className='done'>Seller Order Cancelled</li>
                                                )
                                            ) : (
                                                type === 'my-shop' ? (
                                                    undefined
                                                ) : (
                                                    !dispatched && !delivered ? (
                                                        <li onClick={() => handleCancel(seller_id)}>Cancel Seller Order</li>
                                                    ) : undefined
                                                )
                                            )
                                        }
                                    </ul>
                                    <ul className='items'>
                                        {
                                            items.map(item => {
                                                const {
                                                    cancelled, delivery_date, dispatch_date, id: orderItemId,
                                                    item: details, item_price, item_quantity, reviewed_item, seller_paid
                                                } = item;
                                                const { name, id: item_id, image, product_id } = details;
                                                return (
                                                    <li key={orderItemId}>
                                                        <div className='left'>
                                                            <Link to={`/product/${product_id}/${item_id}`}><img src={image.src} alt={name}/></Link>
                                                            <div className='item-details'>
                                                                <Link to={`/product/${product_id}/${item_id}`}><p>{name}</p></Link>
                                                                <p><span>Price:</span>{item_price}<span>Qty:</span>{item_quantity}<span>Total:</span>{helper.currencyFormatter(item_quantity * helper.currencyToInteger(item_price))}</p>
                                                            </div>
                                                        </div>
                                                        <div className='right'>
                                                            {
                                                                !cancelled && payment_complete ? (
                                                                    !dispatch_date ? (
                                                                        type === 'my-shop' ? (
                                                                            <p className='action' onClick={() => handleUpdateOrderSeller(orderItemId, {dispatched: true})}>Mark Item As Dispatched</p>
                                                                        ) : (
                                                                            <p className='action done'>Awaiting Dispatch</p>
                                                                        )
                                                                    ) : <p className='action done'>Item Dispatched</p>
                                                                ) : undefined
                                                            }
                                                            {
                                                                !cancelled && payment_complete && dispatch_date ? (
                                                                    !delivery_date ? (
                                                                        type === 'my-shop' ? (
                                                                            <p className='action' onClick={() => handleUpdateOrderSeller(orderItemId, {delivered: true})}>Mark Item As Delivered</p>
                                                                        ) : (
                                                                            <p className='action done'>Awaiting Delivery</p>
                                                                        )
                                                                    ) : <p className='action done'>Item Delivered</p>
                                                                ) : undefined
                                                            }
                                                            {
                                                                !cancelled && payment_complete && dispatch_date && delivery_date ? (
                                                                    !reviewed_item ? (
                                                                        type === 'my-shop' ? (
                                                                            undefined
                                                                        ) : (
                                                                            <p className='action'><Link to='/review' state={{...reviewState, product_id, name: name, order_item_id: items[0].id}}>Review item</Link></p>
                                                                        )
                                                                    ) : <p className='action done'>Item Reviewed</p>
                                                                ) : undefined
                                                            }
                                                            {
                                                                cancelled ? (
                                                                    <p className='action done'>Order Cancelled</p>
                                                                ) : type !== 'my-shop' ? (
                                                                    !dispatch_date ? (
                                                                        <p onClick={() => handleCancel(seller_id, orderItemId)} className='action'>Cancel Item</p>
                                                                    ) : undefined
                                                                ) : undefined
                                                            }
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {
                !isLoggedIn ? <LoadingModal/> : undefined
            }
        </section>
    )
}

export default OrderDetails;