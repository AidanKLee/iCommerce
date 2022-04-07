import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import LoadingModal from '../../components/LoadingModal';
import './Product.css';
import Rating from '../../components/Rating';
import Gallery from '../../components/Gallery';
const { products: p } = api;

const Product = props => {

    const { productId, itemId } = useParams();

    const [ product, setProduct ] = useState({});
    let { 
        categories, favourites, id, is_active,
        items = [], stats, seller, views 
    } = product;
    items = useMemo(() => items ? items.sort((a,b) => (Number(a.price.slice(1).replace(',', '')) > Number(b.price.slice(1).replace(',', ''))) ? 1 : ((Number(b.price.slice(1).replace(',', '')) > Number(a.price.slice(1).replace(',', ''))) ? -1 : 0)) : undefined, [items])

    const [ loading, setLoading ] = useState(true);

    const selected = useMemo(() => {
        return itemId && items ? items.findIndex(item => item.id === itemId) : 0;
    }, [items, itemId])

    console.log(selected)

    useEffect(() => {
        getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[productId])

    const getProducts = async () => {
        try {
            const product = await p.getById(productId);
            setProduct(product);
            setLoading(false);
        } catch (err) {
            console.log(err)
        }
    }

    console.log(items)

    return (
        <section className='product-page'>
            <CSSTransition 
                timeout={500}
                classNames={'fade'}
                in={!loading}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <Top items={items} selected={selected} stats={stats}/>
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

const Top = props => {

    const { items, selected, stats } = props;
    const { averageRating, reviewCount } = useMemo(() => {
        return {
            averageRating: Number(stats.average_rating) || 2.5,
            reviewCount: Number(stats.count) || 0
        }
    }, [stats]);
    
    const images = useMemo(() => {
        let images = items[selected].images.map((image, i) => { return {src: image.src, primary: image.primary} });
        images = images.sort((a,b) => a.primary === true ? -1 : 0);
        return images.map((image, i) => {return {...image, name: `${items[selected].name}_${i}`} })
    }, [items, selected])

    return (
        <div className='top'>
            <div className='left'>
                <h2>
                    {items[selected].name}
                </h2>
                <div className='rating-wrapper'><Rating count={5} value={averageRating} width={'20px'}/><p>{`${reviewCount} Reviews`}</p></div>
                <Gallery images={images}/>
            </div>
            <div className='right'>
                <p className='price'>{items[selected].price}</p>
                <div className='item-select'>
                    {/* {
                        items.map((item, i) => {
                            return <img key={item.id} name={i} className={`image${i === selected ? ' selected': ''}`} src={item.images.filter(image => image.primary)[0].src} alt={item.name}/>
                        })
                    } */}
                </div>
            </div>
        </div>
    )
}

export default Product;