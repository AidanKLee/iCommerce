import React from 'react';
import './ToggleSwitch.css'

const ToggleSwitch = props => {

    const {id, name, defaultChecked, checked, readOnly, onChange} = props;

    return (
        <label className="switch">
            <input onChange={onChange} id={id} name={name} type="checkbox" value={true} defaultChecked={defaultChecked} checked={checked} readOnly={readOnly}/>
            <span className="slider round"></span>
        </label>
    )
}

export default ToggleSwitch;