import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { saveItem, selectCategories, selectUser } from '../../app/appSlice';
import Button from '../Button';
import AddItems from '../ProductCreation/AddItems';
import EditProduct from '../ProductCreation/EditProduct';
import Rating from '../Rating';
import './Product.css';

const ProductData = props => {

    const dispatch = useDispatch();

    const { index, product, products, type, refresh } = props;

    const categories = useSelector(selectCategories);
    const user = useSelector(selectUser);

    let { 
        favourites, id, is_active,
        items, stats, seller, views 
    } = product;

    const selectedCategories = useMemo(() => {

        let cats;

        if (categories.data && product.categories) {
            cats = categories.data.filter(category => {
                return product.categories.includes(category.name);
            }) || [];

            cats = cats.map(cat => {
                let array = [cat];
                const getSubCategories = (cat) => {
                    if (cat.subCategories.length > 0) {
                        let nextCat = cat.subCategories.filter(sub => {
                            return product.categories.includes(sub.name);
                        })
                        if (nextCat[0]) {
                            array.push(nextCat[0]);
                            getSubCategories(nextCat[0]);
                        }
                    }
                }
                getSubCategories(cat);
                return array;
            })
        } else {
            cats = [];
        }

        return cats;

    }, [product, categories])

    items = useMemo(() => {
        return items.sort((a,b) => {
            if (Number(a[0].price.slice(1).replace(',', '')) > Number(b[0].price.slice(1).replace(',', ''))) {
                return 1
            } else if (Number(b[0].price.slice(1).replace(',', '')) > Number(a[0].price.slice(1).replace(',', ''))) {
                return -1
            } else if (a[0].name > b[0].name) {
                return 1
            } else if (b[0].name > a[0].name) {
                return -1
            } else {
                return 0
            }
        })
    }, [items]);
    
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
            return items[selected][0].images.filter(image => image.primary)[0];
        } catch (err) {
            return null;
        };
    }, [items, selected])

    const handleSelect = e => {
        const name = Number(e.target.name);
        setSelected(name);
    }

    const handleToggle = toggler => {
        const [ toggle, setToggle ] = toggler;
        setToggle(!toggle);
    }

    const handleItemSave = async () => {
        let index = 0;
        user.saved.forEach(item => {
            items[selected].forEach((it, i) => {
                if (item.selected_item_id === it.id) {
                    index = i;
                }
            })
        });
        dispatch(saveItem({customerId: user.id, itemId: items[selected][index].id}));
    }

    const isSavedItem = useMemo(() => {
        const saved = items[selected].filter(item => {
            return user.saved ? user.saved.map(it => {
                if (it.item_id === item.id) {
                    return true;
                }
                return false;
            }).includes(true) : false;
        }).length > 0
        return saved;
    }, [items, selected, user.saved])
    

    return (
        <div className='product'>
            <div className='main-image'>
                {
                    primaryImage ? (
                        <Link to={`/product/${id}/${items[selected][0].id}`}><img src={primaryImage.src} alt={primaryImage.name}/></Link>
                    ) : undefined
                }
            </div>
            <div className='details'>
                <div className='top'>
                    <Link to={`/product/${id}/${items[selected][0].id}`}><p className='name'>{product.items[selected][0].name}</p></Link>
                    <div className='rating-wrapper'><Rating count={5} value={averageRating} width={'20px'}/><p>{reviewCount === 1 ? '1 Review' : `${reviewCount} Reviews`}</p></div>
                    <p className='price'>{product.items[selected][0].price}</p>
                    <div className='item-select'>
                        {
                            items.map((item, i) => {
                                return (
                                    <div key={item[0].id} className={`image${i === selected ? ' selected': ''}`}>
                                        { item[0].images.length > 0 ?<img onClick={handleSelect} name={i} src={item[0].images.filter(image => image.primary)[0].src} alt={item[0].name}/> : undefined }
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
                                        onClick={handleItemSave}
                                        primary='#1f1f1f'
                                        secondary='white'
                                        title='Save Product'
                                        icon={
                                            !isSavedItem ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                                            )
                                        }
                                    />
                                    
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
                    {
                        selectedCategories.map((categories, i) => {
                            return (
                                <ul key={i} className='categories'>
                                    <li>
                                        <Link to={`/products`}>
                                            Products
                                        </Link>
                                    </li>
                                    {
                                        categories.map((category, i) => {
                                            return (
                                                <li key={category.name}>
                                                    <span>/</span>
                                                    <Link to={`/products${category.href}`}>
                                                        {category.name}
                                                    </Link>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            )
                        })
                    }
                </div>
            </div>
            <CSSTransition timeout={500} classNames='fade' in={addItems} mountOnEnter={true} unmountOnExit={true}>
                <AddItems open={[addItems, setAddItems]} categories={selectedCategories} id={id} product={product} refresh={refresh}/>
            </CSSTransition>
            <CSSTransition timeout={500} classNames='fade' in={editProduct} mountOnEnter={true} unmountOnExit={true}>
                <EditProduct open={[editProduct, setEditProduct]} product={products[index]} refresh={refresh}/>
            </CSSTransition>
        </div>
    )
}

export default ProductData;