import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './SearchBar.css';

const SearchBar = props => {

    const {
        open: [ open, setOpen ]
    } = props;

    const navigate = useNavigate();

    const [ padding, setPadding ] = useState(false);
    const [ search, setSearch ] = useState('');

    const handleClick = () => {
        if (!open) {
            setOpen(!open)
        } else {
            setPadding(!padding)
        }
    }

    const handleChange = e => {
        const value = e.target.value;
        setSearch(value);
    }

    const handleSearch = e => {
        if (e.keyCode === 13) {
            navigate(`/products?query=${search}`);
            setSearch('');
        }
    }

    return (
        <CSSTransition
            in={open}
            timeout={300}
            classNames={'search-bar'}
            onEntered={() => setPadding(true)}
        >
            <div className='search'>
            <CSSTransition
            in={padding}
            timeout={300}
            classNames={'search-bar-input'}
            onExit={() => setOpen(false)}
            >
                <input onKeyDown={handleSearch} onChange={handleChange} id='search' name='search' type='search' value={search}/>
            </CSSTransition>
                
                <label onClick={() => handleClick()} htmlFor='search'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                </label>
            </div>
        </CSSTransition>
        
    );
};

export default SearchBar;