import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Button.css';

const Button = props => {

    let { 
        children,
        className = '',
        design = 'default',
        disabled = false,
        icon,
        href = '/',
        leftIcon,
        onClick,
        rightIcon,
        loading,
        primary = 'rgb(100, 100, 255)',
        secondary = '#f1f1f1',
        danger = 'rgb(200, 0, 0)',
        shape = '',
        size = '',
        style = {},
        text,
        type = 'button'
    } = props;

    const userStlye = {...style};
    const loader = <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="128px" height="128px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><path d="M10 50A40 40 0 0 0 90 50A40 45 0 0 1 10 50" stroke="none"><animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 52.5;360 50 52.5"></animateTransform></path></svg>;

    className = `button${className ? ' ' + className : ''}`;

    if (design === 'invert') style = {
        backgroundColor: style.backgroundColor || secondary,
        color: style.color || primary,
        fill: style.fill || primary,
        border: style.border || `2px solid ${primary}`
    }
    else if (design === 'danger') style = {
        backgroundColor: style.backgroundColor || 'transparent',
        color: style.color || danger,
        fill: style.fill || danger,
        border: style.border || `2px solid ${danger}`
    }
    else if (design === 'clear') style = {
        backgroundColor: style.backgroundColor || 'transparent',
        color: style.color || primary,
        fill: style.fill || primary,
        border: style.border || `2px solid ${primary}`
    }
    else if (design === 'link') style = {
        backgroundColor: style.backgroundColor || 'transparent',
        color: style.color || primary,
        fill: style.fill || primary
    }
    else style = {
        backgroundColor: style.backgroundColor || primary,
        color: style.color || secondary,
        fill: style.fill || secondary,
        border: style.border || `2px solid ${secondary}`
    }

    style = {
        ...style,
        ...userStlye
    }

    if (design === 'link') className = className + ' link';

    if (shape === 'curved') className = className + ' curved'
    else if (shape === 'round') className = className + ' circle';

    if (size === 'small') className = className + ' small'
    else if (size === 'large') className = className + ' large';

    if (leftIcon) className = className + ' leftIcon';
    if (rightIcon) className = className + ' rightIcon';
    if (icon) className = className + ' icon';

    const noFunction = () => {};

    const renderButton = () => {
        if (type === 'navlink') {
            return <Link 
                to={href}
                className={className}
                style={style}
            >
                { icon }
                { leftIcon }
                { !icon ? text || children : '' }
                { rightIcon }
            </Link>
        } else if (type === 'navlink') {
            return <NavLink 
                to={href}
                className={className}
                style={style}
            >
                { icon }
                { leftIcon }
                { !icon ? text || children : '' }
                { rightIcon }
            </NavLink>
        } else if (type === 'external') {
            return <a 
                href={href}
                className={className}
                style={style}
                target='_blank'
                rel="noopener noreferrer"
            >
                { icon }
                { leftIcon }
                { !icon ? text || children : '' }
                { rightIcon }
            </a>
        } else {
            return <button 
                type={type}
                className={className}
                disabled={disabled}
                onClick={e => onClick ? onClick(e) : noFunction()}
                style={style}
            >
                { loading && leftIcon ? loader : leftIcon }
                { !icon ? loading ? loader : text || children : loading ? loader : icon }
                { loading && rightIcon ? loader : rightIcon }
            </button>
        }
    }

    return renderButton();

};

export default Button;