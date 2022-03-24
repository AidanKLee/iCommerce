import React, { useEffect, useMemo, useState } from 'react';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { Link } from 'react-router-dom';
import './CategoriesList.css';
import { CSSTransition } from 'react-transition-group';

const CategoriesList = props => {

    const { categories, searchOpen } = props;

    const { width } = useWindowDimensions();

    const mediaPositions = useMemo(() => {
        let positions = [1280, 1260, 1200, 1160, 1040, 920, 860, 780, 660];
        if (searchOpen) positions = positions.map(position => position + 280);
        let statements = {};
        positions.forEach(statement => {
            const statementPx = `${statement}px`
            statements = {...statements, [statementPx]: width < statement}
        });
        return statements;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchOpen])

    const [ showing, setShowing ] = useState(categories);
    const [ more, setMore ] = useState([]);
    const [ moreHover, setMoreHover ] = useState(false);

    const [ media, setMedia ] = useState(mediaPositions)

    const matches = useMemo(() => {
        let count = 0;
        for (let match in media) {
            if (media[match]) {
                count ++;
            }
        }
        return count;
    }, [media])

    useEffect(() => {
        if (!searchOpen) {
            setTimeout(() => {
                setMedia(mediaPositions) 
            }, 300)
        } else {
            setMedia(mediaPositions)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mediaPositions])

    useEffect(() => {
        let current = {}
        for (let match in media) {
            const number = Number(match.split('p')[0]);
            if (number > width && !media[match]) {
                current[match] = true;
            } else if (number < width && media[match]) {
                current[match] = false;
            }
            setMedia({...media, ...current})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[width])

    useEffect(() => {
        setShowing(categories.slice(0, matches === 0 ? categories.length : - matches));
        if (matches > 0) {
            setMore(categories.slice(- matches));
        } else {
            setMore([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matches])

    return (
        <ul className='categories'>
            <li className='categories item'>
                <Link to={'/'}>Home</Link>
            </li>
            {
                showing.map(category => {
                    return (
                        <li key={category.name} className='categories item'>
                            <Link to={category.href}>{category.name}</Link>
                        </li>
                    )
                })
            }
            {
                more.length > 0 ? (
                    <li className='categories item more' onMouseOver={() => setMoreHover(true)} onMouseLeave={() => setMoreHover(false)}>
                        <div className='dropdown'>
                            More
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg> 
                        </div>
                        <CSSTransition classNames={'fade'} timeout={500} in={moreHover} mountOnEnter={true} unmountOnExit={true}>
                            <ul className='dropdown list'>
                                {
                                    more.map(category => {
                                        return (
                                            <li key={category.name} className='dropdown list item'>
                                                <Link to={category.href}>{category.name}</Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </CSSTransition>                      
                    </li>
                ) : undefined
            }
        </ul>
    );
};

export default CategoriesList;