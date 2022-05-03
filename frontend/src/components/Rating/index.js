import React, { useMemo } from 'react';
import './Rating.css';

const Rating = props => {

    const { count, onChange, value, width } = props;

    const outlines = useMemo(() => {
        return new Array(count).fill('').map((star, i) => <button onClick={onChange} key={i} name={i} className='star' value={i + 1} style={{cursor: onChange ? 'pointer' : '', zIndex:'1', backgroundColor: 'transparent', display: 'flex', height: width}}><svg style={{fill: '#b4c300', width: width, height: width, pointerEvents: 'none'}} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg></button>);
    }, [count, onChange, width]);

    const rating = useMemo(() => {
        return new Array(count).fill('').map((star, i) => <svg key={i} style={{zIndex:'0', fill: '#ebff00', minWidth: width, minHeight: width, width: width, height: width}} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><path d="M0,0h24v24H0V0z" fill="none"/><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"/></g></svg>);
    }, [count, width]);

    const percent = useMemo(() => {
        return (value / count) * 100;
    }, [count, value])

    return (
        <div className='rating' style={{position: 'relative', display: 'flex', width: 'fit-content'}}>
            <div className='value' style={{position: 'absolute', top: '0', display: 'flex', overflow: 'hidden', width: `${percent}%`, height: width}}>
                {rating}
            </div>
            {outlines}
        </div>
    );
};

export default Rating;