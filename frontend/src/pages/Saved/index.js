import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { selectUser } from '../../app/appSlice';
import LoadingModal from '../../components/LoadingModal';
import ProductTile from '../../components/ProductTile';
import api from '../../utils/api';
import './Saved.css';

const { products: p } = api;

const Saved = props => {

    const user = useSelector(selectUser);
    
    const [ loading, setLoading ] = useState(false);
    const [ saved, setSaved ] = useState([]);
    const [ initialLoad, setInitialLoad ] = useState(false);
    const [ deleting, setDeleting ] = useState(-1);

    useEffect(() => {
        const getItems = async () => {
            setInitialLoad(true);
            setLoading(true);
            let products = await p.getByItemIdList(user.saved);
            setSaved(products);
            setLoading(false);
        }
        if (user.saved.length > 0 && !initialLoad) {
            getItems();
        } else if (user.saved.length > 0) {
            setSaved(saved.filter(product => {
                const inSaved = user.saved.map(item => item.item_id);
                return inSaved.includes(product.selected_item_id);
            }))
        } else {
            setSaved([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.saved, initialLoad])

    return (
        <section className='saved'>
            <header className='header'>
                <h2>
                    Saved Products
                </h2>
            </header>
            <div className='products'>
                {
                    saved.map((product, i) => {
                        return (
                            <CSSTransition 
                                key={product.selected_item_id}
                                timeout={500}
                                classNames={'grow-down3'}
                                in={i !== deleting}
                                mountOnEnter={true}
                                unmountOnExit={true}
                            >
                                <ProductTile index={i} product={product} setDeleting={setDeleting} type='saved'/>
                            </CSSTransition>
                        )
                    })
                }
            </div>
            <CSSTransition
                timeout={500}
                classNames={'fade'}
                in={!('id' in user) || saved.length === 0}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <div className='main'>
                    <CSSTransition
                        timeout={500}
                        classNames={'grow-down2'}
                        in={saved.length === 0}
                        mountOnEnter={true}
                        unmountOnExit={true}
                    >
                        <p className='no-saved'>No Saved Products</p>
                    </CSSTransition>
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
            </CSSTransition>
            <CSSTransition 
                    timeout={500}
                    classNames={'fade'}
                    in={loading}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                <LoadingModal />
            </CSSTransition>
        </section>
    )
}

export default Saved;