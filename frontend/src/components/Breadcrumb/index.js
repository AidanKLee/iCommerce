import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = props => {

    const location = useLocation();
    const path = useMemo(() => {
        return location.pathname.split('/').slice(1);
    }, [location])

    return (
        <div className='breadcrumb'>
            <ul className='breadcrumb list'>
                <li className='breadcrumb list item'>
                    <Link to='/'>Home</Link>
                </li>
            </ul>
        </div>
    );
};

export default Breadcrumb;