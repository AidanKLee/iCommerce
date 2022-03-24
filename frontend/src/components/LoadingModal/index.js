import React from 'react';
import './LoadingModal.css';

const LoadingModal = props => {
    return (
        <div className='modal-overlay'>
            <svg className='modal-loading' xmlns="http://www.w3.org/2000/svg" width="128px" height="128px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><path d="M10 50A40 40 0 0 0 90 50A40 45 0 0 1 10 50" stroke="none"><animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 52.5;360 50 52.5"></animateTransform></path></svg>
        </div>
    )
}

export default LoadingModal;