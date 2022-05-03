import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const { customer: c, helper, seller: s } = api;

const OrderTile = props => {

    const { location, order, setOrders, type, user } = props;
    
    let { 
        customer_id, date, delivery_address, id, payment_complete,
        postage_option, postage_price, sellers
    } = useMemo(() => order, [order]);

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

    const total = useMemo(() => {
        let total = helper.currencyToInteger(postage_price);
        sellers.forEach(seller => {
            seller.items.forEach(item => {
                total = total + (helper.currencyToInteger(item.item_price) * item.item_quantity);
            })
        })
        return helper.currencyFormatter(total);
    }, [postage_price, sellers])

    const reviewState = useMemo(() => {
        return {
            user_id: user.id,
            order_id: id
        }
    }, [user, id])

    const handleCancel = (sellerId, orderItemId) => {
        c.cancelOrder(user.id, id, sellerId, orderItemId)
        .then(() => c.getOrders(user.id, setOrders, location.search))
    }

    const handleUpdateOrderSeller = (orderItemId, { dispatched, delivered, reviewed }) => {
        s.updateOrder(user.id, id, orderItemId, dispatched, delivered, reviewed)
        .then(() => s.getOrders(user.id, setOrders, location.search))
    }

    return (
        <li className='item'>
            <div className='top blue'>
                <div className='left'>
                    <figure className='date'>
                        <p>Order date:</p>
                        <figcaption>
                            { new Date(date).toLocaleDateString() }
                        </figcaption>
                    </figure>
                    <figure className='head add'>
                        <p>Delivery Address:</p>
                        <figcaption>
                            { `${delivery_address.line_1}, ${delivery_address.postcode}` }
                        </figcaption>
                    </figure>
                    <figure className='head postage'>
                        <p>Postage:</p>
                        <figcaption>
                            { `${postage_option}: ${postage_price}` }
                        </figcaption>
                    </figure>
                    <figure className='head total'>
                        <p>Total:</p>
                        <figcaption>
                            { total }
                        </figcaption>
                    </figure>
                </div>
                <div className='right'>
                    <figure className='head order-id'>
                        <p>Order ID:</p>
                        <figcaption className='id'>
                            <Link to={`/orders/${id}`} state={order}>{ id }</Link>
                        </figcaption>
                    </figure>
                    {
                        type !== 'my-shop' ? (
                            <div className='more'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.1 14.35Q4.125 14.35 3.438 13.662Q2.75 12.975 2.75 12Q2.75 11.025 3.438 10.337Q4.125 9.65 5.1 9.65Q6.075 9.65 6.763 10.337Q7.45 11.025 7.45 12Q7.45 12.975 6.763 13.662Q6.075 14.35 5.1 14.35ZM12 14.35Q11.025 14.35 10.338 13.662Q9.65 12.975 9.65 12Q9.65 11.025 10.338 10.337Q11.025 9.65 12 9.65Q12.975 9.65 13.663 10.337Q14.35 11.025 14.35 12Q14.35 12.975 13.663 13.662Q12.975 14.35 12 14.35ZM18.9 14.35Q17.925 14.35 17.238 13.662Q16.55 12.975 16.55 12Q16.55 11.025 17.238 10.337Q17.925 9.65 18.9 9.65Q19.875 9.65 20.562 10.337Q21.25 11.025 21.25 12Q21.25 12.975 20.562 13.662Q19.875 14.35 18.9 14.35Z"/></svg>
                                {
                                    !status.cancelled && !status.dispatched ? (
                                        <div className='dropdown'>
                                            <div className='arrow'></div>
                                            <ul className='actions'>
                                                <li onClick={() => handleCancel()}>
                                                    Cancel order
                                                </li>
                                            </ul>
                                        </div>
                                    ) : undefined
                                }
                            </div>
                        ) : undefined
                    }
                </div>
            </div>
            <ul className='bottom'>
                {
                    sellers.map(seller => {
                        const { cancelled, delivered, dispatched, items, reviewed, reviewedCustomer, id: sellerId, shop_name, total } = seller;
                        return(
                            <li className='seller' key={sellerId}>
                                <div className='top'>
                                    <div><p>{ shop_name }</p><p className='total'>Total: <span>{ total }</span></p></div>
                                    <div className='right'>
                                        {
                                            cancelled ? (
                                                type !== 'my-shop' ? <p>Seller order cancelled</p> : <p>Order cancelled</p>
                                            ) : reviewed ? (
                                                type !== 'my-shop' ? <p>Seller Reviewed</p> : <p>You have been reviewed</p>
                                            ) : delivered ? (
                                                type !== 'my-shop' ? <p>Seller order fulfilled</p> : <p>Order delivered</p>
                                            ) : dispatched ? (
                                                type !== 'my-shop' ? <p>Seller has dispatched order</p> : <p>Order dispatched</p>
                                            ) : payment_complete ? (
                                                type !== 'my-shop' ? <p>Preparing your order</p> : <p>Payment complete</p>
                                            ) : (
                                                <p>Awaiting payment</p>
                                            )
                                        }
                                        <div className='more invert'>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.1 14.35Q4.125 14.35 3.438 13.662Q2.75 12.975 2.75 12Q2.75 11.025 3.438 10.337Q4.125 9.65 5.1 9.65Q6.075 9.65 6.763 10.337Q7.45 11.025 7.45 12Q7.45 12.975 6.763 13.662Q6.075 14.35 5.1 14.35ZM12 14.35Q11.025 14.35 10.338 13.662Q9.65 12.975 9.65 12Q9.65 11.025 10.338 10.337Q11.025 9.65 12 9.65Q12.975 9.65 13.663 10.337Q14.35 11.025 14.35 12Q14.35 12.975 13.663 13.662Q12.975 14.35 12 14.35ZM18.9 14.35Q17.925 14.35 17.238 13.662Q16.55 12.975 16.55 12Q16.55 11.025 17.238 10.337Q17.925 9.65 18.9 9.65Q19.875 9.65 20.562 10.337Q21.25 11.025 21.25 12Q21.25 12.975 20.562 13.662Q19.875 14.35 18.9 14.35Z"/></svg>
                                            {
                                                type !== 'my-shop' ? (
                                                    (!cancelled && !dispatched) || (!cancelled && delivered && !reviewed) ? (
                                                        <div className='dropdown'>
                                                            <div className='arrow'></div>
                                                            <ul className='actions'>
                                                                {
                                                                    !cancelled && !dispatched ? (
                                                                        <li onClick={() => handleCancel(sellerId)}>Cancel order from this seller</li>
                                                                    ) : !cancelled && delivered && !reviewed ? (
                                                                        <li><Link to='/review' state={{...reviewState, seller_id: sellerId, name: shop_name, order_item_id: items[0].id}}>Review Seller</Link></li>
                                                                    ) : undefined
                                                                }
                                                            </ul>
                                                        </div>
                                                    ) : undefined
                                                ) : (
                                                    !cancelled && payment_complete && ((!reviewedCustomer && payment_complete) || (!dispatched || !delivered) || (!reviewed && (dispatched || delivered))) ? (
                                                        <div className='dropdown'>
                                                            <div className='arrow'></div>
                                                            <ul className='actions'>
                                                                {
                                                                    !reviewedCustomer && payment_complete ? (
                                                                        <li><Link to='/review' state={{...reviewState, customer_id, order_item_id: items[0].id}}>Review customer</Link></li>
                                                                    ) : undefined
                                                                }
                                                                {
                                                                    !dispatched ? (
                                                                        <li onClick={() => handleUpdateOrderSeller(null, {dispatched: true})}>Mark order as dispatched</li>
                                                                    ) : !delivered ? (
                                                                        <li onClick={() => handleUpdateOrderSeller(null, {delivered: true})}>Mark order as delivered</li>
                                                                    ) : undefined
                                                                }
                                                                {
                                                                    !reviewed ? (
                                                                        delivered ? (
                                                                            <li onClick={() => handleUpdateOrderSeller(null, {delivered: false})}>Unmark order as delivered</li>
                                                                        ) : dispatched ? (
                                                                            <li onClick={() => handleUpdateOrderSeller(null, {dispatched: false})}>Unmark order as dispatched</li>
                                                                        ) : undefined
                                                                    ) : undefined
                                                                    
                                                                }
                                                            </ul>
                                                        </div>
                                                    ) : undefined
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <ul className='bottom'>
                                    {
                                        items.map(i => {
                                            console.log(i)
                                            const { 
                                                cancelled, delivery_date, dispatch_date, id: orderItemId, item,
                                                item_price, item_quantity, reviewed_item, reviewed_customer, reviewed_seller
                                            } = i;
                                            return (
                                                <li key={item.id} className='item'>
                                                    <div className='left'>
                                                        <Link to={`/product/${item.product_id}/${item.id}`}><img src={item.image.src} title={item.name} alt={item.name}/></Link>
                                                        <div className='details'>
                                                            <Link to={`/product/${item.product_id}/${item.id}`}><p>{ item.name }</p></Link>
                                                            <p className='total'><span>Price:</span>{item_price}<span>Qty:</span>{item_quantity}<span>Total:</span>{helper.currencyFormatter(item_quantity * helper.currencyToInteger(item_price))}</p>
                                                        </div>
                                                    </div>
                                                    <div className='right'>
                                                        <figure className='head status'>
                                                            <span>Status:</span>
                                                            <figcaption>
                                                                {
                                                                    cancelled ? (
                                                                        <p>Cancelled</p>
                                                                    ) : !payment_complete ? (
                                                                        <p>Awaiting Payment</p>
                                                                    ) : delivery_date ? (
                                                                        <p>{`Delivered on ${new Date(delivery_date).toLocaleDateString()}`}</p>
                                                                    ) : dispatch_date ? (
                                                                        <p>{`Dispatched on ${new Date(dispatch_date).toLocaleDateString()}`}</p>
                                                                    ) : <p>Processing</p>
                                                                }
                                                            </figcaption>
                                                        </figure>
                                                        <div className='more invert'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.1 14.35Q4.125 14.35 3.438 13.662Q2.75 12.975 2.75 12Q2.75 11.025 3.438 10.337Q4.125 9.65 5.1 9.65Q6.075 9.65 6.763 10.337Q7.45 11.025 7.45 12Q7.45 12.975 6.763 13.662Q6.075 14.35 5.1 14.35ZM12 14.35Q11.025 14.35 10.338 13.662Q9.65 12.975 9.65 12Q9.65 11.025 10.338 10.337Q11.025 9.65 12 9.65Q12.975 9.65 13.663 10.337Q14.35 11.025 14.35 12Q14.35 12.975 13.663 13.662Q12.975 14.35 12 14.35ZM18.9 14.35Q17.925 14.35 17.238 13.662Q16.55 12.975 16.55 12Q16.55 11.025 17.238 10.337Q17.925 9.65 18.9 9.65Q19.875 9.65 20.562 10.337Q21.25 11.025 21.25 12Q21.25 12.975 20.562 13.662Q19.875 14.35 18.9 14.35Z"/></svg>
                                                            {
                                                                type !== 'my-shop' ? (
                                                                    (!cancelled && !dispatch_date && !delivery_date) || (!cancelled && delivery_date && !reviewed_item) ? (
                                                                        <div className='dropdown'>
                                                                            <div className='arrow'></div>
                                                                            <ul className='actions'>
                                                                                {
                                                                                    !cancelled && !dispatch_date && !delivery_date ? (
                                                                                        <li onClick={() => handleCancel(sellerId, orderItemId)}>Cancel item</li>
                                                                                    ) : !cancelled && delivery_date && !reviewed_item ? (
                                                                                        <li><Link to='/review' state={{...reviewState, product_id: item.product_id, name: item.name, order_item_id: items[0].id}}>Review item</Link></li>
                                                                                    ) : undefined
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    ) : undefined
                                                                ) : (
                                                                    !cancelled && payment_complete && ((!dispatch_date || !delivery_date) || (!reviewed_item && (delivery_date || dispatch_date))) ? (
                                                                        <div className='dropdown'>
                                                                            <div className='arrow'></div>
                                                                            <ul className='actions'>
                                                                                {
                                                                                    !dispatch_date ? (
                                                                                        <li onClick={() => handleUpdateOrderSeller(orderItemId, {dispatched: true})}>Mark item as dispatched</li>
                                                                                    ) : !delivery_date ? (
                                                                                        <li onClick={() => handleUpdateOrderSeller(orderItemId, {delivered: true})}>Mark item as delivered</li>
                                                                                    ) : undefined
                                                                                }
                                                                                {
                                                                                    !reviewed_item ? (
                                                                                        delivery_date ? (
                                                                                            <li onClick={() => handleUpdateOrderSeller(orderItemId, {delivered: false})}>Unmark item as delivered</li>
                                                                                        ) : dispatch_date ? (
                                                                                            <li onClick={() => handleUpdateOrderSeller(orderItemId, {dispatched: false})}>Unmark item as dispatched</li>
                                                                                        ) : undefined
                                                                                    ) : undefined
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    ) : undefined
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    
                                                    
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </li>
                        )
                    })
                }
            </ul>
            {
                !payment_complete && type !== 'my-shop' ? (
                    <div className='payment'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48"><path d="M7 40Q5.8 40 4.9 39.1Q4 38.2 4 37V11Q4 9.8 4.9 8.9Q5.8 8 7 8H41Q42.2 8 43.1 8.9Q44 9.8 44 11V37Q44 38.2 43.1 39.1Q42.2 40 41 40ZM7 16.45H41V11Q41 11 41 11Q41 11 41 11H7Q7 11 7 11Q7 11 7 11ZM7 22.9V37Q7 37 7 37Q7 37 7 37H41Q41 37 41 37Q41 37 41 37V22.9ZM7 37Q7 37 7 37Q7 37 7 37V11Q7 11 7 11Q7 11 7 11Q7 11 7 11Q7 11 7 11V37Q7 37 7 37Q7 37 7 37Z"/></svg>
                        <p>Complete Payment</p>
                    </div>
                ) : undefined
            }
        </li>
    )
}

export default OrderTile;