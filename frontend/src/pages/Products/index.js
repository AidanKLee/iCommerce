import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Products.css';
import { CSSTransition } from 'react-transition-group';
import api from '../../utils/api';
import NewProduct from '../../components/ProductCreation';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/appSlice';
import ProductData from '../../components/ProductData';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Filter from './Filter';
import LoadingModal from '../../components/LoadingModal';
import PageNavigation from '../../components/PageNavigation';
const { products: p, categories: c } = api;

const Products = props => {

    const { type = 'browse' } = props;

    const user = useSelector(selectUser);

    const navigate = useNavigate();
    const location = useLocation();

    const { category = '' } = useParams();

    const [ categoryData, setCategoryData ] = useState({});
    const [ searchParams, setSearchParams ] = useSearchParams(location.search);

    useEffect(() => {
        if (category) {
            c.getByHref(category)
            .then(data => setCategoryData(data))
            .catch(err => console.error(err))
        } else {
            setCategoryData({});
        }
    }, [category])

    const queryParams = useMemo(() => {
        const params = {};
        for (let param of searchParams) {
            const [key, value] = param;
            if (key in params) {
                params[key] = [...params[key], value];
            } else {
                params[key] = [value];
            }
        }
        return params
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    const arrange = useMemo(() => {
        return {
            sort: queryParams.sort ? queryParams.sort[0] : 'popular',
            limit: queryParams.limit ? Number(queryParams.limit[0]) : 25,
            page: queryParams.page ? Number(queryParams.page[0]) : 1
        }
    }, [queryParams]);

    const filter = useMemo(() => {
        return {
            attributes: queryParams.attributes ? queryParams.attributes : [],
            query: queryParams.query ? queryParams.query[0] : ''
        }
    }, [queryParams])
    
    const [ search, setSearch ] = useState(filter.query || '');
    const searchTimer = useRef(null);
    const [ newProduct, setNewProduct ] = useState(false);
    const [ results, setResults ] = useState({});
    const [ loading, setLoading ] = useState(false);

    const { products = [], data = {} } = useMemo(() => results, [results]);
    
    const pages = useMemo(() => {
        return {
            current: arrange.page,
            total: Math.ceil((data.product_count ? data.product_count : 1) / arrange.limit)
        }
    }, [arrange.limit, arrange.page, data.product_count])

    const groupedProducts = useMemo(() => {
        const prods = products.map(product => {
            let itemGroups = [];
            product.items.forEach(item => {
                const index = itemGroups.findIndex(i => {
                    return i[0] && i[0].name === item.name
                })
                if (index === -1) {
                    itemGroups = [...itemGroups, [item]]
                } else {
                    itemGroups[index] = [...itemGroups[index], item]
                }
            })
            return {...product, items: itemGroups}
        })
        return prods;
    }, [products])
    
    useEffect(() => {
        setSearch(filter.query)
    }, [filter.query])

    const getProducts = async () => {
        let res;
        if (type === 'my-shop') {
            res = await p.getBySeller(user.id, category, location.search);
        } else if (type === 'shop') {
            // res = await p.getBySeller(seller.id, category, location.search);
        } else {
            res = await p.getAll(category, location.search);
        }
        setResults(res);
    }

    useEffect(() => {
        setLoading(true);
        getProducts()
        .then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    const handleChange = e => {
        if (searchTimer.current) {
            clearTimeout(searchTimer.current);
        }
        const value = e.target.value;
        setSearch(value)
        searchTimer.current = setTimeout(() => {
            if (value.length === 0) {
                const deleteQuery = queryParams;
                delete deleteQuery.query;
                setSearchParams(deleteQuery)
            } else {
                setSearchParams({
                    ...queryParams,
                    query: [value]
                })
            };
        }, 1000)
    }

    const handleArrange = e => {
        const name = e.target.name;
        const value = e.target.value;
        if (name !== 'attributes' && name !== 'category') {
            if (name === 'limit') {
                const params = queryParams;
                params.page = 1;
                params[name] = value
                setSearchParams(params)                    
            } else {
                setSearchParams({
                    ...searchParams,
                    [name]: value
                })
            }
        }
    }

    const handleSearchSelect = e => {
        navigate(`${type === 'my-shop' ? '/my-shop' : ''}/products${e.target.value}`)
    }

    const handlePageSelect = e => {
        let value = e.target.value;
        if (!Number.isNaN(Number(value))) {
            value = Number(value);
            setSearchParams({
                ...queryParams,
                page: value
            })
        } else {
            if (value === 'next') {
                setSearchParams({
                    ...queryParams,
                    page: Number(queryParams.page) + 1
                })
            } else {
                setSearchParams({
                    ...queryParams,
                    page: Number(queryParams.page) - 1
                })
            }
        }
    }

    return (
        <div className='products-wrapper'>
            <div className='products'>
                <div className='product-bar-wrapper'>
                    <div className='products-bar'>
                        {
                            type === 'my-shop' ? (
                                <button onClick={() => setNewProduct(!newProduct)} title='New Product' className='products-bar-button'>
                                    <div className='products-bar-button-icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                                    </div>
                                    <p>New Product</p>
                                </button> ) : undefined
                        }
                        <div className='products-bar-search'>
                            <select onChange={handleSearchSelect} name='category' value={category ? '/' + category : ''}>
                                <option value={''}>{'All Categories'}</option>
                                {
                                    data && data.parent_category && 'name' in data.parent_category > 0 ? (
                                        <option value={data.parent_category.href}>{data.parent_category.name}</option>
                                    ) : undefined
                                }
                                {
                                    categoryData.name ? (
                                        <option value={'/' + category}>{categoryData.name}</option>
                                    ) : undefined
                                }
                                {
                                    data && data.category && data.category.length > 0 ? (
                                        data.category.map(category => <option key={category.href} value={category.href}>{category.category_name}</option>)
                                    ) : undefined
                                }
                            </select>
                            <input onChange={handleChange} type='search' id='product-search' name='product-search' value={search}/>
                            <label htmlFor='product-search'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                            </label>
                        </div>
                    </div>
                </div>
                <section className='products-section'>
                    <div className='left'>
                        <Filter category={category} data={data} filter={filter} queryParams={queryParams} setSearchParams={setSearchParams} type={type}/>
                    </div>
                    <div className='products'>
                    <div className='arrange-wrapper'>
                        <div className='arrange'>
                            <div className='left'>
                                <select onChange={handleArrange} className='sort' name='sort' value={arrange.sort}>
                                    <option value='popular'>Popular</option>
                                    <option value='name-asc'>Name A-Z</option>
                                    <option value='name-desc'>Name Z-A</option>
                                    <option value='price-asc'>Price Low To High</option>
                                    <option value='price-desc'>Price High To Low</option>
                                    <option value='top-rated'>Top Rated</option>
                                    <option value='most-viewed'>Most Viewed</option>
                                </select>
                                <div className='filter-wrapper'>
                                    Filter
                                    <svg className='down' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg>
                                    <Filter category={category} data={data} filter={filter} queryParams={queryParams} setSearchParams={setSearchParams} type={type}/>
                                </div>
                            </div>
                            
                            <select onChange={handleArrange} className='limit' name='limit' value={arrange.limit}>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={75}>75</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>
                        {
                            groupedProducts.length > 0 ? groupedProducts.map((product, i) => {
                                return product.is_active || type !== 'browse' ? (
                                    <CSSTransition key={product.id} timeout={500} classNames='fade' in={groupedProducts.length > 0} mountOnEnter={true} unmountOnExit={true}>
                                        <ProductData index={i} product={product} products={products} type={type} refresh={getProducts}/>
                                    </CSSTransition>
                                ) : undefined
                            }) : undefined
                        }
                    </div>
                    <CSSTransition timeout={500} classNames='fade' in={newProduct} mountOnEnter={true} unmountOnExit={true}>
                        <NewProduct open={[newProduct, setNewProduct]} refresh={getProducts}/>
                    </CSSTransition>
                </section>
                <PageNavigation onClick={handlePageSelect} max={pages.total} value={pages.current} />
            </div>
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

export default Products;