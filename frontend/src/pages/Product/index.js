import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../../utils/api';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import LoadingModal from '../../components/LoadingModal';
import './Product.css';
import Rating from '../../components/Rating';
import Gallery from '../../components/Gallery';
import Button from '../../components/Button';
import Paragraph from '../../components/Paragraph';
import { useDispatch, useSelector } from 'react-redux';
import { addToBag, saveItem, selectCategories, selectUser } from '../../app/appSlice';
import NotificaitionModal from '../../components/NotificationModal';
import Select from '../../components/ProductCreation/Select';
import Redirect from '../Redirect';
const { products: p, customer: c } = api;

const Product = props => {

    const navigate = useNavigate();
    const location = useLocation();

    const { productId, itemId } = useParams();

    const [ cart, setCart ] = useState(1);
    const [ product, setProduct ] = useState({});
    let { 
        categories, favourites, id, is_active,
        items = [], stats, seller, views 
    } = product;

    const groupedItems = useMemo(() => {
        let itemGroups = [];
        items.forEach(item => {
            const index = itemGroups.findIndex(i => {
                return i[0] && i[0].name === item.name
            })
            if (index === -1) {
                itemGroups = [...itemGroups, [item]]
            } else {
                itemGroups[index] = [...itemGroups[index], item]
            }
        })
        return itemGroups.sort((a,b) => {
            if (Number(a[0].price.slice(1).replace(',', '')) > Number(b[0].price.slice(1).replace(',', ''))) {
                return 1
            } else if (Number(b[0].price.slice(1).replace(',', '')) > Number(a[0].price.slice(1).replace(',', ''))) {
                return -1
            } else if (a[0].name > b[0].name) {
                return 1
            } else {
                return -1
            }
        })
    }, [items])

    const [ loading, setLoading ] = useState(true);

    const selected = useMemo(() => {
        const index = itemId && groupedItems ? groupedItems.findIndex(group => {
            let match = false;
            group.forEach(item => {
                if (item.id === itemId) {
                    match = true;
                }
            })
            return match;
        }) : 0;
        if (index > -1) {
            return index;
        } else {
            return 0;
        }
    }, [groupedItems, itemId])

    useEffect(() => {
        getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[productId])

    const getProducts = async () => {
        try {
            const product = await p.getById(productId);
            if ('message' in product) {
                navigate('/error', {state: location.pathname})
            }
            setProduct(product);
            setLoading(false);
        } catch (err) {
            navigate('/error', {state: location.pathname})
        }
    }

    return (
        <div className='product-wrapper'>
            <section className='product-page'>
                <CSSTransition 
                    timeout={500}
                    classNames={'fade'}
                    in={!loading}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                    <Top cart={[cart, setCart]} itemId={itemId} items={groupedItems} product={product} productId={productId} selected={selected} stats={stats}/>
                </CSSTransition>
            </section>
            <section className='details'>
                <CSSTransition 
                    timeout={500}
                    classNames={'fade'}
                    in={!loading}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                    <Bottom itemId={itemId} items={groupedItems} product={product} productId={productId} selected={selected} stats={stats}/>
                </CSSTransition>
            </section>
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={loading}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <LoadingModal />
            </CSSTransition>
        </div>
    )
}

const Top = props => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const user = useSelector(selectUser);
    const categories = useSelector(selectCategories);

    const [ stockNotification, setStockNotification ] = useState(false);

    const notificationTimer = useRef(null);

    useEffect(() => {
        if (stockNotification !== false) {
            notificationTimer.current = setTimeout(() => {
                setStockNotification(false);
            }, 5000)
            return () => clearTimeout(notificationTimer.current);
        }
    })

    const { cart: [cart, setCart], itemId, items, product, productId, selected, stats } = props;
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

    const { seller } = product;

    const { averageRating, reviewCount } = useMemo(() => {
        return {
            averageRating: Number(stats.average_rating) || 2.5,
            reviewCount: Number(stats.count) || 0
        }
    }, [stats]);

    const selectedItem = useMemo(() => {
        const index = items && items[selected] ? items[selected].findIndex(item => {
            return itemId === item.id;
        }) : 0;
        if (index > -1) {
            return index;
        } else {
            return 0;
        }
    }, [items, selected, itemId])

    const images = useMemo(() => {
        let images = items[selected][selectedItem].images;
        images = images.sort((a, b) => {
            if (a.primary === true) {
                return -1
            } else if (a.name > b.name) {
                return 1
            } else if (!a.primary && !b.primary && b.name > a.name) {
                return -1
            } else {
                return 0
            }
        });
        return images;
    }, [items, selected, selectedItem])

    const selectableItems = useMemo(() => {
        let selectable = {};
        let values = {}
        items[selected].forEach((item, i) => {
            Object.keys(item.attributes).forEach(key => {
                if (!(key in values)) {
                    values[key] = [item.attributes[key]]
                } else {
                    if (!values[key].includes(item.attributes[key])) {
                        values[key] = [...values[key], item.attributes[key]]
                    }
                }
            })
        })
        Object.keys(values).forEach(key => {
            if (values[key].length > 1) {
                selectable[key] = items[selected];
            }
        })
        return selectable;
    }, [items, selected])

    const selectableOptions = useMemo(() => {
        return Object.keys(selectableItems).map(key => key);
    }, [selectableItems])

    const selectedOptions = useMemo(() => {
        return selectableOptions.map(option => {
            let value = items[selected][selectedItem].attributes[option];
            if (!Number.isNaN(Number(value))) {
                value = Number(value);
            }
            return {
                name: option, value
            };
        });
    }, [items, selectableOptions, selected, selectedItem])

    const options = useMemo(() => {
        return Object.keys(selectableItems).map(key => {
            let values = [];
            selectableItems[key].forEach(item => {
                let option = item.attributes[key];
                if (!Number.isNaN(Number(option))) {
                    option = Number(option);
                }
                if (!values.includes(option)) {
                    values.push(option);
                }
            })
            values = values.sort((a,b) => a < b ? -1 : a > b ? 1 : 0);
            return {
                name: key,
                options: values.map(value => { return {value, name: value} })
            };
        })
    }, [selectableItems])

    const handleChange = e => {
        try {
            let value = e.target.value;
            const name = e.target.name;
            if (!Number.isNaN(Number(value))) {
                value = Number(value);
            }
            let selectedAttributes = {};
            selectedOptions.forEach(option => {
                selectedAttributes[option.name] =  option.value;
            })
            selectedAttributes = {...selectedAttributes, [name]: value}
            let item = items[selected].filter(item => {
                let isMatch = true;
                Object.keys(selectedAttributes).forEach(attribute => {
                    const itemValue = Number.isNaN(Number(item.attributes[attribute])) ? item.attributes[attribute] : Number(item.attributes[attribute]);
                    const selectedValue = Number.isNaN(Number(selectedAttributes[attribute])) ? selectedAttributes[attribute] : Number(selectedAttributes[attribute]);
                    if (itemValue !== selectedValue) {
                        isMatch = false
                    }
                })
                return isMatch;
            })
            if (item.length === 0) {
                item = items[selected].filter(item => {
                    const itemValue = Number.isNaN(Number(item.attributes[name])) ? item.attributes[name] : Number(item.attributes[name]);
                    return itemValue === value;
                })
            }
            if (item.length === 1 && item[0] && item[0].id) {
                return navigate(`/product/${productId}/${item[0].id}`, { replace: true })
            } else {
                setStockNotification(0)
            }
        } catch (err) {
            console.error(err);
            setStockNotification(0);
        }
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
    }, [items, selected, user])

    const handleCartChange = e => {
        const value = e.target.value === '' ? '' : Number(e.target.value);
        if (value === '') {
            setCart('');
        } else if (value < 1) {
            setCart(1);
        } else if (value > items[selected][selectedItem].in_stock) {
            setCart(items[selected][selectedItem].in_stock);
            setStockNotification(true);
        } else {
            setCart(value);
        }
    }

    const handleQuantityBlur = e => {
        const value = e.target.value;
        if (value === '') {
            setCart(1);
        }
    }

    const handleItemSave = async itemId => {
        if (user.id) {
            c.saveItem(user.id, itemId)
        }
        const its = user.saved.filter(it => items[selected].map(item => item.id).includes(it.item_id))
        if (its.length > 0) {
            itemId = its[0].item_id;
        }
        dispatch(saveItem({itemId}));
    }

    const handleAddToCart = async () => {
        if (items[selected][selectedItem].in_stock >= cart) {
            if (user.id && user.cart.id) {
                c.addItemToBag(user.id, user.cart.id, itemId, cart)
            }
            dispatch(addToBag({
                itemId, 
                quantity: cart
            }))
        } else {
            setStockNotification(true)
        }
    }

    const warningStyle = {outline: '2px solid rgb(200,0,0)', borderRadius: '8px'}

    try {
        return (
            <div className='top'>
                <div className='left'>
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
                    
                    <h2>
                        {items[selected][selectedItem].name}
                    </h2>
                    <div className='rating-wrapper'><Rating count={5} value={averageRating} width={'20px'}/><p>{reviewCount === 1 ? '1 Review' : `${reviewCount} Reviews`}</p></div>
                    <Gallery images={images}/>
                </div>
                <div className='right-wrapper'>
                    <div className='sticky'>
                        <div className='right'>
                            <p className='price'>{items[selected][selectedItem].price}</p>
                            <div className='item-select'>
                                {
                                    items.map((item, i) => {
                                        return (
                                            <Link to={`/product/${productId}/${item[selectedItem].id}`} replace={true} className={`item${selected === i ? ' selected' : ''}`} key={item[selectedItem].id}>
                                                <img name={i} className={`image`} src={item[selectedItem].images.filter(image => image.primary)[0].src} alt={item[selectedItem].name} title={item[selectedItem].name}/>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                            <div className='attributes'>
                                {
                                    options.map((option) => {
                                        const label = option.name.split('-').map(word => word.slice(0,1).toUpperCase() + word.slice(1)).join(' ');
                                        return (
                                            <div className='select' key={option.name}>
                                                <label htmlFor={option.name}>
                                                    { label }
                                                </label>
                                                <Select id={option.name} onChange={handleChange} hidden={`Select ${label}...`} options={option.options} value={items[selected][selectedItem].attributes[option.name] || null} />
                                                {/* <select onChange={handleChange} id={item} name={item} value={itemId}>
                                                    {
                                                        options.map(option => {
                                                            
                                                        })
                                                    }
                                                    {
                                                        selectableItems[item].map((option, i) => {
                                                            return(
                                                                <option value={option.id} key={option.attributes[item]}>
                                                                    {
                                                                        option.attributes[item]
                                                                    }
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </select> */}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {
                                items[selected][selectedItem].in_stock < 10 && items[selected][selectedItem].in_stock > 0 ? (
                                    <p className='stock'>{` Only ${items[selected][selectedItem].in_stock} left in stock!`}</p>
                                ) : items[selected][selectedItem].in_stock === 0 ? (
                                    <p className='stock'>Sold out! We'll have some more for you soon.</p>
                                ) : undefined
                            }
                            <div className='actions'>
                                <div className={`cart${items[selected][selectedItem].in_stock === 0 ? ' disabled' : ''}`}>
                                    <Button
                                        disabled={items[selected][selectedItem].in_stock === 0}
                                        onClick={handleAddToCart}
                                        type='button'
                                        leftIcon={<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/><path d="M18,6h-2c0-2.21-1.79-4-4-4S8,3.79,8,6H6C4.9,6,4,6.9,4,8v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8C20,6.9,19.1,6,18,6z M12,4c1.1,0,2,0.9,2,2h-4C10,4.9,10.9,4,12,4z M18,20H6V8h2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V8h4v2c0,0.55,0.45,1,1,1s1-0.45,1-1V8 h2V20z"/></g></svg>}
                                        title='Add To Bag'
                                        primary='#e69600'
                                    >
                                        Add To Bag
                                    </Button>
                                    <input onChange={handleCartChange} onBlur={handleQuantityBlur} className='add' style={stockNotification ? warningStyle : {}} type='number' name='cart-add' min={1} max={items[selected][selectedItem].in_stock} value={cart} disabled={items[selected][selectedItem].in_stock === 0}/>
                                </div>
                                <Button
                                    design='invert'
                                    primary='#1f1f1f'
                                    onClick={() => handleItemSave(itemId)}
                                    secondary='white'
                                    title='Save Product'
                                    style={{borderRadius: '50%'}}
                                    icon={
                                        !isSavedItem ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                                        )
                                    }
                                />
                            </div>
                            <CSSTransition 
                                timeout={500}
                                classNames={'grow-down'}
                                in={stockNotification !== false}
                                mountOnEnter={true}
                                unmountOnExit={true}
                            >
                                <NotificaitionModal >
                                    <p>{`Sorry there's ${stockNotification !== 0 && stockNotification !== false ? items[selected][selectedItem].in_stock : 0} in stock at the moment!`}</p>
                                </NotificaitionModal>
                            </CSSTransition>
                        </div>
                        <div className='seller'>
                                <Link onClick={e => e.preventDefault()} to={`/${seller.shop_name}/products`} className='name'>{seller.shop_name}</Link>
                                <Rating count={5} value={seller.stats.average_rating || 2.5} width='16px'/>
                            </div>
                        <div className='info'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5l1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
                            <p>Free Shipping & Other Options Available.</p>
                        </div>
                        <div className='info'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 14h4v-4h-4V7l-5 5 5 5zm7-11h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04-.39.08-.74.28-1.01.55-.18.18-.33.4-.43.64-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"/></svg>
                            <p>30 Day Satisfaction Guarantee.</p>
                        </div>
                        <div className='info'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 15h7v2H7zm0-4h10v2H7zm0-4h10v2H7zm12-4h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04-.39.08-.74.28-1.01.55-.18.18-.33.4-.43.64-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"/></svg>
                            <p>Ts&Cs Apply.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (err) {
        return <Redirect to='/error' state={{err, message: `There was an internal issue, we'll review our logs and try to fix this as soon as possible!`, status: 500}}/>
    }
}

const Bottom = props => {

    const { itemId, items, product, productId, selected, stats } = props;

    const { reviews } = product;

    const selectedItem = useMemo(() => {
        const index = items && items[selected] ? items[selected].findIndex(item => {
            return itemId === item.id;
        }) : 0;
        if (index > -1) {
            return index;
        } else {
            return 0;
        }
    }, [items, selected, itemId])

    return (
        <div className='bottom'>
            <div className='description'>
            <div className='left'>
                <h3>
                    Product Description
                </h3>
                <p>
                    {items[selected][selectedItem].description}
                </p>
            </div>
            <table className='variables'>
                <tbody>
                    {
                        Object.keys(items[selected][selectedItem].attributes).map(attribute => {
                            return (
                                <tr key={attribute}>
                                    <th className='key'>
                                        {attribute.split('-').map(word => word.slice(0,1).toUpperCase() + word.slice(1)).join(' ')}
                                    </th>
                                    <td className='value'>
                                        {items[selected][selectedItem].attributes[attribute]}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            </div>
            <div className='reviews'>
                <div className='header'>
                    <h3>
                        Reviews <span>({reviews.length})</span>
                    </h3>
                </div>
                
                <ul className='cards'>
                    {
                        reviews.length === 0 ? (
                            <li className='none'>
                                This product hasn't been reviewed yet.
                            </li>
                        ) : undefined
                    }
                    {
                        reviews.map((rev, i) => {
                            const { date, first_name, last_name, id: order_id, order_date, rating, review } = rev;
                            return (
                                <li key={order_id} className='card'>
                                    <p className='name'>{`${first_name} ${last_name}`}</p>
                                    <p className='dates'>{`Reviewed on ${new Date(date).toDateString()}, purchased on ${new Date(order_date).toDateString()}`}</p>
                                    <Rating count={5} value={rating} width='16px'/>
                                    {review ? <Paragraph className='text' index={i}>{review}</Paragraph> : undefined}
                                </li>
                            )
                            
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default Product;