import React from 'react';
import './Checkout.css';

const Checkout = props => {
    return (
        <section className='checkout'>
            <header className='header'>
                <h2>
                    Checkout
                </h2>
            </header>
            <div className='customer'>
                <div className='main'>
                    <h3>
                        Customer Details
                    </h3>
                </div>
            </div>
        </section>
    )
}

export default Checkout;