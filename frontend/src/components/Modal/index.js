import React from 'react';
import './Modal.css';

const Modal = props => {

    const { buttons, header, text } = props;

    return (
        <div className='modal-wrapper'>
            <div className='modal'>
                <p className='header'>
                    { header }
                </p>
                <p className='text'>
                    { text }
                </p>
                <div className='actions'>
                    {
                        buttons.map(button => {
                            const { onClick, primary, secondary, text } = button
                            return (
                                <button
                                key={text.split(' ').join('-').toLowerCase()}
                                    className={primary ? 'primary' : secondary ? 'secondary' : ''}
                                    onClick={onClick}
                                >{ text }</button>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Modal;