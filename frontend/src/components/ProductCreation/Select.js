import React from 'react';

const Select = props => {

    const { defaultValue, disabled = false, id, onChange, options, required = false, value } = props;

    return (
        <select id={id} name={id} onChange={onChange} required={required} disabled={disabled} defaultValue={defaultValue} value={value}>
            <option default hidden value=''>Select a category</option>
            {
                options.length > 0 ? (
                    options.map(option => <option key={option.value} value={option.value}>{option.name}</option>)
                ) : undefined
            }
        </select>
    )
}

export default Select;