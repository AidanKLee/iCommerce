import React from 'react';
import './MenuButton.css';

const MenuButton = props => {

    const {open: [ open, setOpen ]} = props;

    const handleClick = e => {
        setOpen(!open);
    }

    return (
        <div onClick={handleClick} className='menu-button'>
            <div className={`menu-button line one${open ? ' open': ''}`}></div>
            <div className={`menu-button line two${open ? ' open': ''}`}></div>
        </div>
    );
};

export default MenuButton