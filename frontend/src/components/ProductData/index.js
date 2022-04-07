import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Button from '../Button';
import AddItems from '../ProductCreation/AddItems';
import EditProduct from '../ProductCreation/EditProduct';
import Rating from '../Rating';
import './Product.css';

const ProductData = props => {

    const { index, product, products, type, refresh } = props;

    let { 
        categories, favourites, id, is_active,
        items, stats, seller, views 
    } = product;
    items = useMemo(() => items.sort((a,b) => (Number(a[0].price.slice(1).replace(',', '')) > Number(b[0].price.slice(1).replace(',', ''))) ? 1 : ((Number(b[0].price.slice(1).replace(',', '')) > Number(a[0].price.slice(1).replace(',', ''))) ? -1 : 0)), [items]);
    products[index].items = useMemo(() => products[index].items.sort((a,b) => (Number(a.price.slice(1).replace(',', '')) > Number(b.price.slice(1).replace(',', ''))) ? 1 : ((Number(b.price.slice(1).replace(',', '')) > Number(a.price.slice(1).replace(',', ''))) ? -1 : 0)), [products, index]);
    
    const [ addItems, setAddItems ] = useState(false);
    const [ editProduct, setEditProduct ] = useState(false);
    const [ selected, setSelected ] = useState(0);

    const { averageRating, reviewCount } = useMemo(() => {
        return {
            averageRating: Number(stats.average_rating) || 2.5,
            reviewCount: Number(stats.count)
        }
    }, [stats]);

    const primaryImage = useMemo(() => {
        try {
            return items[selected][0].images.filter(image => image.primary)[0].src;
        } catch (err) {
            return null;
        };
    }, [items, selected])

    const handleSelect = e => {
        const name = Number(e.target.name);
        setSelected(name);
    }

    // const handleChange = e => {
    //     setAddToCart(e.target.value)
    // }

    const handleToggle = toggler => {
        const [ toggle, setToggle ] = toggler;
        setToggle(!toggle);
    }

    return (
        <div className='product'>
            <div className='main-image'>
                {
                    primaryImage ? (
                        <Link to={`/product/${id}/${items[selected][0].id}`}><img src={primaryImage} alt={product.items[selected][0].name}/></Link>
                    ) : undefined
                }
            </div>
            <div className='details'>
                <div className='top'>
                    <Link to={`/product/${id}/${items[selected][0].id}`}><p className='name'>{product.items[selected][0].name}</p></Link>
                    <div className='rating-wrapper'><Rating count={5} value={averageRating} width={'20px'}/><p>{`${reviewCount} Reviews`}</p></div>
                    <p className='price'>{product.items[selected][0].price}</p>
                    <div className='item-select'>
                        {
                            items.map((item, i) => {
                                return (
                                    <div key={item[0].id} className={`image${i === selected ? ' selected': ''}`}>
                                        <img onClick={handleSelect} name={i} src={item[0].images.filter(image => image.primary)[0].src} alt={item[0].name}/>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        {
                            type === 'my-shop' ? (
                                <div className='actions'>
                                    <Button onClick={() => handleToggle([addItems, setAddItems])} design='invert' secondary='white' title='Add Items'>Add Items</Button>
                                    <div className='cart'>
                                        <Button 
                                            onClick={() => handleToggle([editProduct, setEditProduct])}
                                            title='Edit Product & Items' 
                                            icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg>
                                        }/>
                                        <Button 
                                            title='Delete Product & Items'
                                            primary='rgb(200, 0, 0)'
                                            icon={
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                                            }
                                        />
                                    </div>
                                    {is_active ? <p className='published'>ACTIVE</p> : <p className='published not'>HIDDEN</p>}
                                </div>
                            ) : (
                                <div className='actions'>
                                    <Button href={`/product/${id}/${items[selected][0].id}`} type='link' title={`View ${items[selected][0].name}`}>View Product</Button>
                                    <Button
                                        design='invert'
                                        primary='#1f1f1f'
                                        secondary='white'
                                        title='Add To Favourites'
                                        icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
                                        }
                                    />
                                    {/* <div className='cart'>
                                        <Button 
                                            type='button'
                                            icon={<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/><path d="M18,6h-2c0-2.21-1.79-4-4-4S8,3.79,8,6H6C4.9,6,4,6.9,4,8v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8C20,6.9,19.1,6,18,6z M12,4c1.1,0,2,0.9,2,2h-4C10,4.9,10.9,4,12,4z M18,20H6V8h2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V8h4v2c0,0.55,0.45,1,1,1s1-0.45,1-1V8 h2V20z"/></g></svg>}
                                            title='Add To Basket'
                                            primary='#e69600'
                                        >
                                            Add To Basket
                                        </Button>
                                        <input onChange={handleChange} className='add' type='number' name='cart-add' min={1} max={items[selected].in_stock} value={addToCart}/>
                                    </div> */}
                                    
                                </div>
                            )
                        }
                    </div>
                    <p className='views'><b>{views}</b> views | <b>{favourites}</b> favourites</p>                  
                </div>
                <div className='bottom'>
                    <div className='seller'>
                        <Link to={`/${seller.shop_name}/products`} className='name'>{seller.shop_name}</Link>
                        <Rating count={5} value={seller.stats.average_rating || 2.5} width='16px'/>
                    </div>
                    <p>{`${categories[0]}${categories.slice(1).map(c => ` > ${c}`).join('')}`}</p>
                </div>
            </div>
            <CSSTransition timeout={500} classNames='fade' in={addItems} mountOnEnter={true} unmountOnExit={true}>
                <AddItems open={[addItems, setAddItems]} categories={categories} id={id} refresh={refresh}/>
            </CSSTransition>
            <CSSTransition timeout={500} classNames='fade' in={editProduct} mountOnEnter={true} unmountOnExit={true}>
                <EditProduct open={[editProduct, setEditProduct]} product={products[index]} refresh={refresh}/>
            </CSSTransition>
        </div>
    )
}

export default ProductData;