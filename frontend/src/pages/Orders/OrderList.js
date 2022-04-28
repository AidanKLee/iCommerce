import React, { useMemo, useState } from 'react';
import { useLocation, useOutletContext, useSearchParams } from 'react-router-dom';
import Select from '../../components/ProductCreation/Select';

const OrderList = props => {

    const location = useLocation();

    const limits = useMemo(() => [
        { name: 25, value: 25 },
        { name: 50, value: 50 },
        { name: 75, value: 75 },
        { name: 100, value: 100 }
    ], []);

    let { isLoggedIn, orders, user, years = [] } = useOutletContext();

    console.log(years)

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

    return (
        <section className='main'>
            <header className='filter'>
                <Select options={years}/>
                <Select options={limits}/>
            </header>
        </section>
    )
}

export default OrderList;