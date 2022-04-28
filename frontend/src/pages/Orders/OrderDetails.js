import React, { useEffect, useState } from 'react';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import api from '../../utils/api';

const { customer: c } = api;

const OrderDetails = props => {

    const { orderId } = useParams();
    const { user, isLoggedIn } = useOutletContext();

    const [ order, setOrder ] = useState(useLocation().state);

    useEffect(() => {
        if (!order && isLoggedIn) {
            c.getOrderById(user.id, orderId, setOrder);
        }
    }, [isLoggedIn, order, orderId, user.id])

    return (
        <section className='details'>
            {orderId}
        </section>
    )
}

export default OrderDetails;