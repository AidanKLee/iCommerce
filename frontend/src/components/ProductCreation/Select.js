import React from 'react';

const Select = props => {

    const { className, defaultValue, hidden, disabled = false, id, onChange, options, required = false, value } = props;

    return (
        <select id={id} className={className} name={id} onChange={onChange} required={required} disabled={disabled} defaultValue={defaultValue} value={value}>
            { hidden ? <option default hidden value=''>{hidden}</option> : undefined }
            {
                options.length > 0 ? (
                    options.map(option => <option key={option.value} value={option.value}>{option.name}</option>)
                ) : undefined
            }
        </select>
    )
}

export default Select;