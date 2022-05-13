import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const Filter = props => {

    const { category, data, filter, queryParams, setSearchParams, type } = props;

    const attributes = useMemo(() => {
        if (data && data.attributes) {
            const keys = Object.keys(data.attributes);
            const atts = keys.map(key => {
                const text = key.split('-').map(word => word.slice(0, 1).toUpperCase() + word.slice(1)).join(' ');
                return {key: key, text, value: data.attributes[key]};
            });
            return atts;
        }
        return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.attributes])

    const [ selected, setSelected ] = useState(attributes.map(() => 0));

    useEffect(() => {
        setSelected(attributes.map((x, i) => selected[i] || 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attributes])

    const handleToggle = e => {
        const name = e.target.name;
        const checked = e.target.checked;
        const value = e.target.value;
        if (checked) {
            if (name in queryParams) {
                setSearchParams({
                    ...queryParams,
                    page: 1,
                    [name]: [...queryParams[name], value]
                })
            } else {
                setSearchParams({
                    ...queryParams,
                    page: 1,
                    [name]: [value]
                });
            }
        } else {
            const newAttributes = queryParams[name].filter(att => att !== value);
            setSearchParams({
                ...queryParams,
                page: 1,
                [name]: newAttributes
            })
        }
    }

    const handleClick = e => {
        const value = Number(e.target.value);
        const height = e.target.parentElement.children[1].clientHeight;
        if (selected[value] > 0) {
            setSelected(selected.map((x, i) => {
                if (i === value) {
                    return 0;
                }
                return x;
            }));
        } else {
            setSelected(selected.map((x, i) => {
                if (i === value) {
                    return height;
                }
                return x
            }))
        }
    }
    
    return (
        <div className='filter'>
            <p className='title'>Filters</p>
            <div className='categories'>
                {
                    (data && data.category && data.category.length > 0) || category.length > 0 ? (
                        <div className='container cat'>
                            <p className='subtitle'>Categories</p>
                            {
                                category.length > 0 ? <Link to={`${type === 'my-shop' ? '/my-shop' : ''}/products`} className='category'>All</Link> : undefined
                            }
                            {
                                data && data.parent_category && 'name' in data.parent_category ? <Link to={`${type === 'my-shop' ? '/my-shop' : ''}/products${data.parent_category.href}`} className='category'><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/><path d="M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z"/></svg>{data.parent_category.name} ({data.parent_category.count})</Link> : undefined
                            }
                            {
                                data && data.category && data.category.length > 0 && data.category.map(cat => {
                                    return <Link to={`${type === 'my-shop' ? '/my-shop' : ''}/products${cat.href}`} key={cat.category_name} className={`category ${category.length > 0 ? 'main' : ''}`}>{cat.category_name} ({cat.count})</Link>
                                })
                            }
                        </div>
                    ) : undefined
                }
                {
                    attributes.length > 0 ? (
                        attributes.map((attribute, i) => {
                            return (
                                <div key={attribute.key} className='container' style={selected[i] > 0 ? {height: `${37 + selected[i]}px`} : {height: '29px'}}>
                                    <button onClick={handleClick} value={i} className='subtitle'>
                                        {attribute.text}
                                        <svg className={selected[i] > 0 ? 'deg180' : ''} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg>
                                    </button>
                                    <div className='values'>
                                        {
                                            attribute.value.map((value, i) => {
                                                return (
                                                    <div key={value.value + i} className='checkbox'>
                                                        <input onChange={handleToggle} type='checkbox' id={value.value} name='attributes' value={`${attribute.key}~${value.value}`} checked={filter.attributes && filter.attributes.includes(`${attribute.key}~${value.value}`)}/>
                                                        <label htmlFor={value.value}>
                                                            <p>{value.value} ({value.count})</p>
                                                        </label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    ) : undefined
                }
            </div>
        </div>
    )
}

export default Filter;