import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Redirect.css';

const Redirect = props => {

    const { to, state } = props;

    const navigate = useNavigate();

    useEffect(() => {
        navigate(to, {state});
    })

    return (
        <section className='redirect'>
            Redirecting
        </section>
    )
}

export default Redirect;