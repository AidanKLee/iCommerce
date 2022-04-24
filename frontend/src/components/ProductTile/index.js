import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToBag, deleteFromBag, saveItem, selectUser, updateItemBagQuantity } from '../../app/appSlice';
import api from '../../utils/api';
import Rating from '../Rating';
import './ProductTile.css';
const { customer: c, helper } = api;

const ProductTile = props => {
    
    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    const { product, type } = props;

    const item = useMemo(() => {
        return product.items.filter(item => item.id === product.selected_item_id)[0];
    }, [product])

    const image = useMemo(() => item.images.filter(image => image.primary)[0], [item]);

    const attributes = useMemo(() => {
        return Object.keys(item.attributes).sort((a,b) => a > b ? 1 : a < b ? -1 : 0).map(attribute => {
            return {
                key: attribute.split('-').map(word => word.slice(0,1).toUpperCase() + word.slice(1)).join(' '),
                value: item.attributes[attribute]
            }
        })
    }, [item])

    const [ quantity, setQuantity ] = useState(product.item_quantity);
    const [ changed, setChanged ] = useState(false);

    const handleChange = e => {
        setChanged(true);
        setQuantity(e.target.value);
    }

    useEffect(() => {
        if (changed) {
            const timer = setTimeout(() => {
                dispatch(updateItemBagQuantity({
                    itemId: item.id,
                    quantity
                }))
                updateQuantity();
            }, 500)
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quantity])

    const updateQuantity = async () => {
        if (user.id && user.cart.id) {
            await c.updateItemBagQuantity(user.id, user.cart.id, item.id, quantity);
        }
    }

    const handleItemDelete = async () => {
        dispatch(saveItem({itemId: item.id}));
        if (user.id) {
            await c.saveItem(user.id, item.id);
        }
    }

    const handleBagDelete = async () => {
        dispatch(deleteFromBag({
            itemId: item.id
        }));
        if (user.id && user.cart.id) {
            await c.deleteItemFromBag(user.id, user.cart.id, item.id)
        }
    }

    const handleMoveToSaved = async () => {
        dispatch(deleteFromBag({
            itemId: item.id
        }));
        dispatch(saveItem({
            itemId: item.id
        }));
        if (user.id && user.cart.id) {
            await c.deleteItemFromBag(user.id, user.cart.id, item.id);
            await c.saveItem(user.id, item.id);
        }
    }

    const handleAddToBag = async () => {
        dispatch(saveItem({itemId: item.id}));
        dispatch(addToBag({
            itemId: item.id, 
            quantity: 1
        }))
        if (user.id && user.cart.id) {
            await c.saveItem(user.id, item.id);
            await c.addItemToBag(user.id, user.cart.id, item.id, 1);
        }
    }

    return (
        <div className='tile'>
            <div className='top'>
                <Link className='img' to={`/product/${product.id}/${product.selected_item_id}`}><img src={image.src} alt={item.name}/></Link>
                <div className='data'>
                    <div className='top'>
                        <Link to={`/product/${product.id}/${product.selected_item_id}`}><h3>{item.name}</h3></Link>
                        <div className='rating'>
                            <Rating count={5} value={product.stats.average_rating || 2.5} width='16px'/> <span>{Number(product.stats.count) === 1 ? '1 Review' : `${product.stats.count} Reviews`}</span>
                        </div>
                        <p className='price'>{item.price}</p>
                    </div>
                    <div className='bottom'>
                        <div className='seller'>
                            <p>{product.seller.shop_name}</p>
                            <div className='rating'>
                                <Rating count={5} value={product.seller.stats.average_rating || 2.5} width='16px'/>
                            </div>
                        </div>
                        <p className='attributes'>
                            {
                                attributes.map((attribute, i) => {
                                    return (
                                        <span key={attribute.key}>
                                            <b>{`${attribute.key}: `}</b>{`${attribute.value}${i !== attributes.length - 1 ? ', ' : ''}`}
                                        </span>
                                    )
                                })
                            }
                        </p>
                    </div>
                </div>
            </div>
            {
                type === 'saved' ? (
                    <div className='actions'>
                        <button onClick={handleAddToBag} className='bag'>Add To Bag</button>
                        <button onClick={handleItemDelete} className='remove'>Remove Saved Item</button>
                    </div>
                ) : (
                    <div className='actions'>
                        <div className='action quantity'>
                            <div className='input'>
                                <label htmlFor={product.selected_item_id}><b>Qty:</b></label>
                                <input onChange={handleChange} id={product.selected_item_id} type='number' value={quantity} min={1}/>
                            </div>
                            <p className='price'>
                                <b>Price:</b>
                                <span>
                                    {
                                        helper.currencyFormatter(Number(item.price.slice(1).replace(',', '')) * quantity)
                                    }
                                </span>
                            </p>
                        </div>
                        <button onClick={handleBagDelete} className='action bag'>Remove From Bag</button>
                        <button onClick={handleMoveToSaved} className='action remove'>Move To Saved</button>
                    </div>
                )
            }
            
        </div>
    )
}

export default ProductTile;