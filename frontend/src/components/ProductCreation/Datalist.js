import React, { useMemo } from 'react';

const Datalist = props => {

    const { attribute, form: [form, setForm], itemIndex, title } = props;

    const text = useMemo(() => {
        let formatted = attribute.attribute;
        if (formatted.includes('_')) {
            formatted = attribute.attribute.split('_').slice(0, 1).join('');
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

    const index = form.items[itemIndex].attributes.findIndex(att => {
        return att.key === attribute.attribute
    })

    const handleChange = e => {
        const value = e.target.value;
        const key = e.target.name;
        // let items = [...form.items]
        // items[itemIndex].attributes[index].value = value;
        const updatedForm = {
            ...form,
            items: form.items.map((item, i) => {
                if (i === itemIndex) {
                    const newAttributes = item.attributes.filter(att => {
                        return att.key !== key;
                    })
                    newAttributes.push({ key, value })
                    console.log(newAttributes)
                    return {
                        ...item,
                        attributes: newAttributes
                    };
                };
                return item;
            })
        };
        setForm(updatedForm)
    }
    //need to add a value param

    return (
        <div className='datalist' title={title}>
            <input onChange={handleChange} name={attribute.attribute} list={`${attribute.attribute}#${itemIndex}`} placeholder={text} value={form.items[itemIndex].attributes[index] && form.items[itemIndex].attributes[index].value ? form.items[itemIndex].attributes[index].value : ''}/>
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