import React, { useState } from 'react';
import './MenuButton.css';

const MenuButton = props => {

    const { onClick } = props;

    const [ open, setOpen ] = useState(false);

    const handleClick = e => {
        setOpen(!open);
        onClick(e);
    }

    return (
        <div onClick={handleClick} className='menu-button'>
            <div className={`menu-button line one${open ? ' open': ''}`}></div>
            <div className={`menu-button line two${open ? ' open': ''}`}></div>
        </div>
    );
};

export default MenuButton