import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Paragraph.css';

const Paragraph = props => {

    // const ref = useRef(null);
    // const lineHeight = useRef(18)

    // const [ pRef, setPRef ] = useState(null);
    const [ show, setShow ] = useState(false);
    let { children, className, index, style } = props;

    // const lines = useMemo(() => {
    //     return pRef ? Number(pRef.height) / lineHeight.current : 0
    // }, [pRef])

    const renderText = () => {
        let text = children;
        let button;
        if (children.length > 140) {
            text = children.slice(0,140);
            button = show ? <span>{`${children.slice(140)} `}<span className='show' onClick={() => setShow(!show)}>Show Less</span></span> : <span>{`... `}<span className='show' onClick={() => setShow(!show)}>Show More</span></span>
        }
        return <p>{text}{button ? button : ''}</p>
    }

    return (
        <span className={`${className}`} /*ref={ref}*/ style={style}>{renderText()}</span>
    )
}

export default Paragraph;