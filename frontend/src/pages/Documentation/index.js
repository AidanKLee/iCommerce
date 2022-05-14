import React, { useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import { contents } from './Documentation';
import './Documentation.css';

const Documentation = props => {

    const [ contentsOpen, setContentsOpen ] = useState(false);
    const [ menus, setMenus ] = useState([]);
    const [ search, setSearch ] = useState('');

    const list = useMemo(() => {
        const list = [];
        contents.forEach(doc => {
            const r1 = {};
            Object.keys(doc.routes).forEach(route => {
                const name = route;
                route = doc.routes[name];
                const r2 = [];
                route.routes.forEach((route, i) => {
                    const methods = {};
                    Object.keys(route.method).forEach(method => {
                        const name = method;
                        method = route.method[name];
                        if (method.name.toLowerCase().includes(search.toLowerCase())) {
                            methods[name] = method;
                        }
                    })
                    if (Object.keys(methods).length > 0) {
                        r2.push({...route, method: methods})
                    }
                })
                if (r2.length > 0) {
                    r1[name] = {...route, routes: r2};
                }
            })
            if (Object.keys(r1).length > 0) {
                list.push({...doc, routes: r1})
            }
        })
        return list;
    }, [search])
    console.log(list)

    useEffect(() => {
        const r1 = list && list[0] && list[0].routes ? list[0].routes : {}
        const dropdowns = Object.keys(r1).map(menu => {
            menu = r1[menu];
            return { id: menu.uri, open: false }
        })
        setMenus(dropdowns)
    }, [list])

    const handleScroll = e => {
        e.preventDefault();
        const href = e.target.href.split('#').slice(1).join('');
        const top = document.getElementById(href).offsetTop - 4;
        document.querySelector('.view').scrollTo({
            top,
            left: 0,
            behavior: 'smooth'
        })
    }

    const handleClick = e => {
        const id = e.target.id;
        const newMenus = menus.map((menu, i) => {
            if (menu.id === id) {
                menu.open = !menu.open;
                return menu;
            }
            return menu;
        })
        setMenus(newMenus);
    }

    const handleSearch = e => {
        setSearch(e.target.value);
    }

    return (
        <section className='docs'>
            <header className='header'>
                <h2>
                    <svg className={`contents${contentsOpen ? ' open' : ''}`} onClick={() => setContentsOpen(!contentsOpen)} xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox='0 0 48 48'><path d="M4.7 36.95V32.8H31.95V36.95ZM4.7 26V21.8H25.9V26ZM4.7 15.2V11.05H31.95V15.2ZM40.4 34.25 30.1 23.95 40.35 13.7 43.3 16.7 36.05 23.95 43.35 31.25Z"/></svg>
                    Documentation
                </h2>
            </header>
            <div className='main'>
                <ul className={`contents${contentsOpen ? ' open' : ''}`}>
                    <li className='search'>
                        <div className='input'>
                            <input id='doc-search' onChange={handleSearch} type='search' value={search}/>
                            <label htmlFor='doc-search'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox='0 0 48 48'><path d="M39.95 42.75 26.7 29.5Q25.2 30.75 23.125 31.45Q21.05 32.15 18.8 32.15Q13.1 32.15 9.2 28.225Q5.3 24.3 5.3 18.7Q5.3 13.1 9.2 9.2Q13.1 5.3 18.7 5.3Q24.3 5.3 28.225 9.2Q32.15 13.1 32.15 18.7Q32.15 20.95 31.475 22.925Q30.8 24.9 29.4 26.7L42.75 39.95ZM18.75 28.25Q22.75 28.25 25.5 25.475Q28.25 22.7 28.25 18.7Q28.25 14.7 25.5 11.925Q22.75 9.15 18.75 9.15Q14.65 9.15 11.9 11.925Q9.15 14.7 9.15 18.7Q9.15 22.7 11.9 25.475Q14.65 28.25 18.75 28.25Z"/></svg>
                            </label>
                        </div>
                    </li>
                    {
                        list.map((doc, i) => {
                            const link = `/docs#${doc.name.replaceAll(' ','-').replaceAll('/','-').toLowerCase()}`;
                            return (
                                <li key={`countents-${link}`}>
                                    <a href={link} onClick={handleScroll}>{doc.name}</a>
                                    {
                                        doc && doc.routes && menus.length > 0 && menus.length === Object.keys(list[i].routes).length ? (
                                            <ul className='route'>
                                                {
                                                    Object.keys(doc.routes).map((route,i) => {
                                                        route = doc.routes[route];
                                                        const link = `/docs#${route.name.replaceAll(' ', '-').replaceAll('/','-').toLowerCase()}`;
                                                        return (
                                                            <li key={`countents-${link}`} className={`tab${menus[i].id === route.uri && menus[i].open ? ' open' : ''}`}>
                                                                <div className={`dropdown`}>
                                                                    <a href={link} onClick={handleScroll}>{route.name}</a>
                                                                    <svg id={route.uri} onClick={handleClick} className={menus[i].id === route.uri && menus[i].open ? 'r180' : ''} xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox='0 0 48 48'><path d="M24 31.4 11.3 18.7 14.15 15.9 24 25.8 33.85 15.95 36.7 18.75Z"/></svg>
                                                                </div>
                                                                {
                                                                    route.routes.length > 0 ? (
                                                                        <ul>
                                                                            {
                                                                                route.routes.map(route => {
                                                                                    return (
                                                                                        Object.keys(route.method).map(method => {
                                                                                            method = route.method[method];
                                                                                            const link = `/docs#${method.name.replaceAll(' ', '-').replaceAll('/','-').toLowerCase()}`;
                                                                                            return(
                                                                                                <li key={`countents-${link}`}>
                                                                                                    <a href={link} onClick={handleScroll}>{method.name}</a>
                                                                                                </li>
                                                                                            )
                                                                                        })
                                                                                    )
                                                                                    
                                                                                })
                                                                            }
                                                                        </ul>
                                                                    ) : undefined
                                                                }
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        ) : undefined
                                    }
                                </li>
                            )
                        })
                    }
                    {
                        list.length === 0 ? (
                            <li className='tab'>
                                <p className='none'>No results</p>
                            </li>
                        ) : undefined
                    }
                </ul>
                <div className='view'>
                    {
                        list.map((doc, i) => {
                            const id = doc.name.replaceAll(' ','-').replaceAll('/','-').toLowerCase();
                            return(
                                <div key={id} className='doc'>
                                    <h3 id={id}>
                                        { doc.name }
                                    </h3>
                                    {
                                        doc && doc.routes && menus.length > 0 && menus.length === Object.keys(list[i].routes).length ? (
                                            <ul>
                                                {
                                                    Object.keys(doc.routes).map(route => {
                                                        route = doc.routes[route];
                                                        const id = route.name.replaceAll(' ', '-').replaceAll('/','-').toLowerCase();
                                                        return (
                                                            <li key={id} className='route-item'>
                                                                <div key={id} className='route' id={id}>
                                                                    <h4>
                                                                        { route.name }
                                                                    </h4>
                                                                    <div>
                                                                        {
                                                                            route.routes.map(sub => {
                                                                                return (
                                                                                    <div key={sub.uri} id={id}>
                                                                                        {
                                                                                            Object.keys(sub.method).map(method => {
                                                                                                const type = method;
                                                                                                method = sub.method[method];
                                                                                                const id = method.name.replaceAll(' ', '-').replaceAll('/','-').toLowerCase();
                                                                                                return (
                                                                                                    <div className='sub-route' key={id} id={id}>
                                                                                                        <h5>
                                                                                                            { method.name }
                                                                                                        </h5>
                                                                                                        <span className='grey'>{type.toUpperCase()}</span> <span>{`${doc.uri}${route.uri}${sub.uri}`}</span>
                                                                                                        <div className='body'>
                                                                                                            <p className='description'>{ method.description }</p>
                                                                                                        </div>
                                                                                                        {
                                                                                                            method.body ? (
                                                                                                                <div className='params'>
                                                                                                                    <p className='type'>Body <span className='white'>{ method.body.type }</span></p>
                                                                                                                    {
                                                                                                                        Object.keys(method.body.params).map(param => {
                                                                                                                            const name = param;
                                                                                                                            param = method.body.params[param];
                                                                                                                            return (
                                                                                                                                <div key={v4()} className='param'>
                                                                                                                                    <p className='title'><b>{ name }</b> { param.required ? <span className='mr8'>required</span> : undefined } {param.type ? <span className='grey'>{ param.type } </span> : undefined}</p>
                                                                                                                                    <div className='details'>
                                                                                                                                        <p>{ param.description }</p>
                                                                                                                                        {
                                                                                                                                            param.options ? (
                                                                                                                                                <p>
                                                                                                                                                    <b>Options:</b>
                                                                                                                                                    {
                                                                                                                                                        param.options.join(', ')
                                                                                                                                                    }
                                                                                                                                                </p>
                                                                                                                                            ) : undefined
                                                                                                                                        }
                                                                                                                                        {
                                                                                                                                            param.default ? (
                                                                                                                                                <p>
                                                                                                                                                    <b>Default:</b>
                                                                                                                                                    { param.default }
                                                                                                                                                </p>
                                                                                                                                            ) : undefined
                                                                                                                                        }
                                                                                                                                    </div>
                                                                                                                                    {
                                                                                                                                        param.params ? (
                                                                                                                                            Object.keys(param.params).map(par => {
                                                                                                                                                const name = par;
                                                                                                                                                par = param.params[par];
                                                                                                                                                return (
                                                                                                                                                    <div key={v4()} className='param'>
                                                                                                                                                        <p className='title'><b>{ name }</b> { par.required ? <span className='mr8'>required</span> : undefined } {par.type ? <span className='grey'>{ par.type } </span> : undefined}</p>
                                                                                                                                                        <div className='details'>
                                                                                                                                                            <p>{ par.description }</p>
                                                                                                                                                            {
                                                                                                                                                                par.options ? (
                                                                                                                                                                    <p>
                                                                                                                                                                        <b>Options:</b>
                                                                                                                                                                        {
                                                                                                                                                                            par.options.join(', ')
                                                                                                                                                                        }
                                                                                                                                                                    </p>
                                                                                                                                                                ) : undefined
                                                                                                                                                            }
                                                                                                                                                            {
                                                                                                                                                                par.default ? (
                                                                                                                                                                    <p>
                                                                                                                                                                        <b>Default:</b>
                                                                                                                                                                        { par.default }
                                                                                                                                                                    </p>
                                                                                                                                                                ) : undefined
                                                                                                                                                            }
                                                                                                                                                        </div>
                                                                                                                                                    </div>
                                                                                                                                                )
                                                                                                                                            })
                                                                                                                                            
                                                                                                                                        ) : undefined
                                                                                                                                    }
                                                                                                                                </div>
                                                                                                                            )
                                                                                                                        })
                                                                                                                    }
                                                                                                                </div>
                                                                                                            ) : undefined
                                                                                                        }
                                                                                                        {
                                                                                                            method.params ? (
                                                                                                                <div className='params'>
                                                                                                                    <p className='type'>Params</p>
                                                                                                                    {
                                                                                                                        Object.keys(method.params).map(param => {
                                                                                                                            const name = param;
                                                                                                                            param = method.params[param];
                                                                                                                            return (
                                                                                                                                <div key={v4()} className='param'>
                                                                                                                                    <p className='title'><b>{ name }</b> { param.required ? <span className='mr8'>required</span> : undefined } {param.type ? <span className='grey'>{ param.type } </span> : undefined}</p>
                                                                                                                                    <div className='details'>
                                                                                                                                        <p>{ param.description }</p>
                                                                                                                                        {
                                                                                                                                            param.options ? (
                                                                                                                                                <p>
                                                                                                                                                    <b>Options:</b>
                                                                                                                                                    {
                                                                                                                                                        param.options.join(', ')
                                                                                                                                                    }
                                                                                                                                                </p>
                                                                                                                                            ) : undefined
                                                                                                                                        }
                                                                                                                                        {
                                                                                                                                            param.default ? (
                                                                                                                                                <p>
                                                                                                                                                    <b>Default:</b>
                                                                                                                                                    { param.default }
                                                                                                                                                </p>
                                                                                                                                            ) : undefined
                                                                                                                                        }
                                                                                                                                    </div>
                                                                                                                                    {
                                                                                                                                        param.params ? (
                                                                                                                                            Object.keys(param.params).map(par => {
                                                                                                                                                const name = par;
                                                                                                                                                par = param.params[par];
                                                                                                                                                return (
                                                                                                                                                    <div key={v4()} className='param'>
                                                                                                                                                        <p className='title'><b>{ name }</b> { par.required ? <span className='mr8'>required</span> : undefined } {par.type ? <span className='grey'>{ par.type } </span> : undefined}</p>
                                                                                                                                                        <div className='details'>
                                                                                                                                                            <p>{ par.description }</p>
                                                                                                                                                            {
                                                                                                                                                                par.options ? (
                                                                                                                                                                    <p>
                                                                                                                                                                        <b>Options:</b>
                                                                                                                                                                        {
                                                                                                                                                                            par.options.join(', ')
                                                                                                                                                                        }
                                                                                                                                                                    </p>
                                                                                                                                                                ) : undefined
                                                                                                                                                            }
                                                                                                                                                            {
                                                                                                                                                                par.default ? (
                                                                                                                                                                    <p>
                                                                                                                                                                        <b>Default:</b>
                                                                                                                                                                        { par.default }
                                                                                                                                                                    </p>
                                                                                                                                                                ) : undefined
                                                                                                                                                            }
                                                                                                                                                        </div>
                                                                                                                                                    </div>
                                                                                                                                                )
                                                                                                                                            })
                                                                                                                                            
                                                                                                                                        ) : undefined
                                                                                                                                    }
                                                                                                                                </div>
                                                                                                                            )
                                                                                                                        })
                                                                                                                    }
                                                                                                                </div>
                                                                                                            ) : undefined
                                                                                                        }
                                                                                                        {
                                                                                                            method.queries ? (
                                                                                                                <div className='params'>
                                                                                                                    <p className='type'>Queries</p>
                                                                                                                    {
                                                                                                                        Object.keys(method.queries).map(param => {
                                                                                                                            const name = param;
                                                                                                                            param = method.queries[param];
                                                                                                                            return (
                                                                                                                                <div key={v4()} className='param'>
                                                                                                                                    <p className='title'><b>{ name }</b> { param.required ? <span className='mr8'>required</span> : undefined } {param.type ? <span className='grey'>{ param.type } </span> : undefined}</p>
                                                                                                                                    <div className='details'>
                                                                                                                                        <p>{ param.description }</p>
                                                                                                                                        {
                                                                                                                                            param.options ? (
                                                                                                                                                <p>
                                                                                                                                                    <b>Options:</b>
                                                                                                                                                    {
                                                                                                                                                        param.options.join(', ')
                                                                                                                                                    }
                                                                                                                                                </p>
                                                                                                                                            ) : undefined
                                                                                                                                        }
                                                                                                                                        {
                                                                                                                                            param.default ? (
                                                                                                                                                <p>
                                                                                                                                                    <b>Default:</b>
                                                                                                                                                    { param.default }
                                                                                                                                                </p>
                                                                                                                                            ) : undefined
                                                                                                                                        }
                                                                                                                                    </div>
                                                                                                                                    {
                                                                                                                                        param.params ? (
                                                                                                                                            Object.keys(param.params).map(par => {
                                                                                                                                                const name = par;
                                                                                                                                                par = param.params[par];
                                                                                                                                                return (
                                                                                                                                                    <div key={v4()} className='param'>
                                                                                                                                                        <p className='title'><b>{ name }</b> { par.required ? <span className='mr8'>required</span> : undefined } {par.type ? <span className='grey'>{ par.type } </span> : undefined}</p>
                                                                                                                                                        <div className='details'>
                                                                                                                                                            <p>{ par.description }</p>
                                                                                                                                                            {
                                                                                                                                                                par.options ? (
                                                                                                                                                                    <p>
                                                                                                                                                                        <b>Options:</b>
                                                                                                                                                                        {
                                                                                                                                                                            par.options.join(', ')
                                                                                                                                                                        }
                                                                                                                                                                    </p>
                                                                                                                                                                ) : undefined
                                                                                                                                                            }
                                                                                                                                                            {
                                                                                                                                                                par.default ? (
                                                                                                                                                                    <p>
                                                                                                                                                                        <b>Default:</b>
                                                                                                                                                                        { par.default }
                                                                                                                                                                    </p>
                                                                                                                                                                ) : undefined
                                                                                                                                                            }
                                                                                                                                                        </div>
                                                                                                                                                    </div>
                                                                                                                                                )
                                                                                                                                            })
                                                                                                                                            
                                                                                                                                        ) : undefined
                                                                                                                                    }
                                                                                                                                </div>
                                                                                                                            )
                                                                                                                        })
                                                                                                                    }
                                                                                                                </div>
                                                                                                            ) : undefined
                                                                                                        }
                                                                                                    </div>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                </div>
                                                                {
                                                                    route.responses && route.responses.length > 0 ? (
                                                                        <div className='responses'>
                                                                            <div className='sticky'>
                                                                                {
                                                                                    route.responses.map(response => {
                                                                                        return (
                                                                                            <div key={response.name} className='response'>
                                                                                                <h6>
                                                                                                    { `${response.name} Response` }
                                                                                                </h6>
                                                                                                <pre className='prettyprint'>
                                                                                                    { response.response }
                                                                                                </pre>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    ) : undefined
                                                                }
                                                                
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        ) : undefined
                                    }
                                </div>
                            )
                        })
                    }
                    {
                        list.length === 0 ? (
                            <div className='doc'>
                                <h3 className='centre'>No results</h3>
                            </div>
                        ) : undefined
                    }
                </div>
            </div>
        </section>
    )
}

export default Documentation;