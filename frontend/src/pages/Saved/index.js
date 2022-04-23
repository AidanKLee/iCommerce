import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUser } from '../../app/appSlice';
import ProductTile from '../../components/ProductTile';
import api from '../../utils/api';
import './Saved.css';

const { products: p } = api;

const Saved = props => {

    const user = useSelector(selectUser);
    
    const [ saved, setSaved ] = useState([]);

    useEffect(() => {
        const getItems = async () => {
            let products = await p.getByItemIdList(user.saved);
            setSaved(products)
        }
        if (user.saved.length > 0) {
            getItems();
        } else {
            setSaved([]);
        }
    }, [user.saved])

    return (
        <section className='saved'>
            <header className='header'>
                <h2>
                    Saved Products
                </h2>
            </header>
            {
                saved.length > 0 ? (
                    <div className='products'>
                        {
                            saved.map(product => <ProductTile key={product.selected_item_id} product={product} type='saved'/>)
                        }
                    </div>
                ) : undefined
            }
            {
                !('id' in user) || saved.length === 0 ? (
                    <div className='main'>
                        {
                            saved.length === 0 ? (
                                <p className='no-saved'>No Saved Products</p>
                            ) : undefined
                        }
                        {
                            !('id' in user) ? (
                                <div className='login'>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M.01 0h24v24h-24V0z" fill="none"/><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
                                    <p>
                                        Login To Sync With Your Accounts Saved Items
                                    </p>
                                    <Link to='/login' title='Login'>
                                        Login
                                    </Link>
                                </div>
                            ) : undefined
                        }
                    </div>
                ) : undefined
            }
        </section>
    )
}

export default Saved;