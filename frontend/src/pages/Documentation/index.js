import React, { useState } from 'react';
import { v4 } from 'uuid';
import docs, { contents } from './Documentation';
import './Documentation.css';

const dropdowns = [];

for (let doc in docs) {
    doc = docs[doc];
    for (let route in doc.routes) {
        route = doc.routes[route];
        dropdowns.push({id: route.uri, open: false});
    }
}

const Documentation = props => {

    const [ menus, setMenus ] = useState(dropdowns);

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

    return (
        <section className='docs'>
            <header className='header'>
                <h2>
                    iCommerce Documentation
                </h2>
            </header>
            <div className='main'>
                <ul className='contents'>
                    {
                        contents.map(doc => {
                        const link = `/docs#${doc.name.replaceAll(' ','-').replaceAll('/','-').toLowerCase()}`;
                            return (
                                <li key={`countents-${link}`}>
                                    <a href={link} onClick={handleScroll}>{doc.name}</a>
                                    {
                                        doc.routes ? (
                                            <ul className='route'>
                                                {
                                                    Object.keys(doc.routes).map((route,i) => {
                                                        route = doc.routes[route];
                                                        const link = `/docs#${route.name.replaceAll(' ', '-').replaceAll('/','-').toLowerCase()}`;
                                                        return (
                                                            <li key={`countents-${link}`} className={`tab${menus[i].id === route.uri && menus[i].open ? ' open' : ''}`}>
                                                                <div className={`dropdown`}>
                                                                    <a href={link} onClick={handleScroll}>{route.name}</a>
                                                                    <svg id={route.uri} onClick={handleClick} xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox='0 0 48 48'><path d="M24 31.4 11.3 18.7 14.15 15.9 24 25.8 33.85 15.95 36.7 18.75Z"/></svg>
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
                </ul>
                <div className='view'>
                    {
                        contents.map(doc => {
                            const id = doc.name.replaceAll(' ','-').replaceAll('/','-').toLowerCase();
                            return(
                                <div key={id} className='route'>
                                    <h3 id={id}>
                                        { doc.name }
                                    </h3>
                                    {
                                        doc.routes ? (
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
                </div>
            </div>
        </section>
    )
}

export default Documentation;