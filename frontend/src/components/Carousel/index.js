import React, { useEffect, useMemo, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Carousel.css';

const Carousel = props => {

    let { children, timed } = props;

    const [ card, setCard ] = useState(0);

    const updatedChildren = useMemo(() => {
        let updatedClasses = children.map((child, i) => {
            let newClass = child.props.className ? child.props.className.split(' ') : [];
            newClass.push('carousel card');
            newClass = newClass.join(' ');
            return {
                ...child,
                props: {
                    ...child.props,
                    className: newClass
                }
            };
        });
        return updatedClasses.map((child, i) => {
            return (
                <CSSTransition 
                    key={i} 
                    timeout={500}
                    classNames={'cycle'}
                    in={card === i}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                    {child}
                </CSSTransition>
            );
        });
    }, [children, card])

    useEffect(() => {
        if (timed) {
            const timer = setTimeout(() => {
                if (card < updatedChildren.length - 1) {
                    setCard(card + 1);
                } else {
                    setCard(0);
                }
            }, 30000)
            return () => clearTimeout(timer)
        }
    }, [card, timed, updatedChildren])

    return (
        <section className='carousel'>
            <div className='carousel select'>
                {
                    updatedChildren.map((child, i) => {
                        return (
                            <div
                                key={i}
                                className={`carousel select marker${card === i ? ' selected' : ''}`}
                                onClick={() => setCard(i)}
                            ></div>
                        )
                    })
                }
            </div>
            {updatedChildren}
        </section>
    )
}

export default Carousel;