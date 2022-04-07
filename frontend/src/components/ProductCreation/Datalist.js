import React, { useMemo } from 'react';

const Datalist = props => {

    const { attribute, form: [form, setForm], index, itemIndex } = props;

    const text = useMemo(() => {
        let formatted;
        if (attribute.attribute.includes('_')) {
            formatted = attribute.attribute.split('_').slice(0, 1).join('');
        } else {
            formatted = attribute.attribute;
        };
        if (formatted.includes('-')) {
            formatted = formatted.split('-');
        } else {
            formatted = [formatted];
        }
        formatted = formatted.map(word => {
            const firstLetter = word.slice(0, 1).toUpperCase();
            return firstLetter + word.slice(1);
        }).join(' ');
        return formatted
    }, [attribute])

    const handleChange = e => {
        const value = e.target.value;
        // let items = [...form.items]
        // items[itemIndex].attributes[index].value = value;
        const updatedForm = {
            ...form,
            items: form.items.map((item, i) => {
                if (i === itemIndex) {
                    return {
                        ...item,
                        attributes: item.attributes.map((attribute, j) => {
                            if(j === index) {
                                return {
                                    ...attribute, value
                                };
                            };
                            return attribute;
                        })
                    };
                };
                return item;
            })
        };
        setForm(updatedForm)
    }
    //need to add a value param

    return (
        <div className='datalist'>
            <input onChange={handleChange} name={`${attribute.attribute}#${itemIndex}`} list={`${attribute.attribute}#${itemIndex}`} placeholder={text} value={form.items[itemIndex].attributes[index].value}/>
            <datalist id={`${attribute.attribute}#${itemIndex}`}>
                {
                    attribute.values.map(option => {
                        return <option key={option} value={option.split(' ').map(word => {
                            return word.slice(0,1).toUpperCase() + word.slice(1)
                        }).join(' ')}/>
                    })
                }
            </datalist>
        </div>
    )
}

export default Datalist;