import React, { useMemo, useState } from 'react';
import Rating from '../../components/Rating'
import { useLocation, useNavigate } from 'react-router-dom';
import Redirect from '../Redirect';
import api from '../../utils/api';
import './Review.css';

const { customer: c, seller: s } = api;

const Review = props => {

    const navigate = useNavigate();
    const location = useLocation();
    const { customer_id, name, order_id, order_item_id, product_id, seller_id, user_id } = location.state;

    const [ review, setReview ] = useState('');
    const [ rating, setRating ] = useState(3);

    const type = useMemo(() => {
        if (product_id) {
            return 'product_id'
        } else if (seller_id) {
            return 'seller_id'
        } else if (customer_id) {
            return 'customer_id'
        }
        return ''
    }, [customer_id, product_id, seller_id])

    const handleRatingChange = e => {
        setRating(Number(e.target.value))
    }

    const handleReviewChange = e => {
        setReview(e.target.value)
    }

    const reviewLength = useMemo(() => review.length, [review])

    const maxLength = 1024;

    const handleSubmit = e => {
        if (customer_id) {
            s.submitReview(user_id, {
                order_id, customer_id, order_item_id, rating, review
            })
            .then(() => navigate(-1))
        } else {
            c.submitReview(user_id, {
                order_id, order_item_id, product_id, seller_id, rating, review
            })
            .then(() => navigate(-1))
        }
    }

    return (
        <section className='review'>
            <header className='header'>
                <h2>
                    { `${type.split('_')[0].slice(0,1).toUpperCase() + type.split('_')[0].slice(1)} Review` }
                </h2>
            </header>
            <div className='main'>
                <div className='wrapper'>
                    <h3>
                        { `Rate ${name ? name : 'Your ' + type.split('_')[0].slice(0,1).toUpperCase() + type.split('_')[0].slice(1)}`}
                    </h3>
                    <Rating onChange={handleRatingChange} count={5} value={rating} width='32px'/>
                    <h3>
                        Write Your Review
                    </h3>
                    <textarea onChange={handleReviewChange} maxLength={maxLength}></textarea>
                    <p className='counter'>{`${maxLength - reviewLength} characters remaining.`}</p>
                    <div className='actions'>
                        <button className='submit' onClick={handleSubmit}>Submit Review</button>
                    </div>
                </div>
            </div>
            {
                !customer_id && !product_id && !seller_id ? (
                    <Redirect to={-1}/>
                ) : undefined
            }
        </section>
    )
}

export default Review;