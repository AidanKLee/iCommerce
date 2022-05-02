import React, { useMemo, useRef, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Select from '../../components/ProductCreation/Select';
import OrderTile from './OrderTile';

const OrderList = props => {

    const { type } = props;

    // const location = useLocation();
    const searchTimer = useRef(null);

    const limits = useMemo(() => [
        { name: 25, value: 25 },
        { name: 50, value: 50 },
        { name: 75, value: 75 },
        { name: 100, value: 100 }
    ], []);

    let { location, orders = [], setOrders, years = [], user } = useOutletContext();

    years = useMemo(() => {
        const y = [{name: 'All Time', value: null}];
        years.forEach(year => y.push({name: year, value: year}))
        return y;
    }, [years])

    let [ searchParams, setSearchParams ] = useSearchParams(location.search);
    searchParams = useMemo(() => {
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
    }, [searchParams, location])

    const [ search, setSearch ] = useState('');

    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === 'search') {
            if (searchTimer.current) {
                clearTimeout(searchTimer.current);
            }
            setSearch(value);
            searchTimer.current = setTimeout(() => {
                if (value.length > 0) {
                    setSearchParams({
                        ...searchParams,
                        [name]: value
                    })
                } else {
                    const newParams = searchParams;
                    delete newParams[name];
                    setSearchParams(newParams)
                }
            }, 1000);
        } else {
            if (value === 'All Time') {
                const newParams = searchParams;
                delete newParams[name];
                setSearchParams(newParams)
            }   else {
                setSearchParams({
                    ...searchParams,
                    [name]: value
                })
            }
        }
    }

    return (
        <section className='main'>
            <div className='filter-wrapper'>
                <header className='filter'>
                    <Select id='year' onChange={handleChange} options={years}/>
                    <div className='search'>
                        <input onChange={handleChange} type='search' id='order-search' name='search' value={search}/>
                        <label htmlFor='order-search'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        </label>
                    </div>
                    <Select className='limit' id='limit' onChange={handleChange} options={limits}/>
                </header>
            </div>
            <CSSTransition timeout={500} classNames='fade' in={orders.length > 0} mountOnEnter={true} unmountOnExit={true}>
                <ul className='list'>
                    {
                        orders.map(order => {
                            return <OrderTile key={order.id} location={location} order={order} setOrders={setOrders} type={type} user={user}/>
                        })
                    }
                </ul>
            </CSSTransition>
        </section>
    )
}

export default OrderList;