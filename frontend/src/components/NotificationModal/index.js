import React from 'react';
import './NotificationModal.css';

const NotificaitionModal = props => {

    const { children, text } = props;

    return (
        <div className='notification-modal'>
            { children || text }
        </div>
    )
}

export default NotificaitionModal;