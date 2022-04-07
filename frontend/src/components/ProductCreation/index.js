import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import './NewProduct.css';
import Select from './Select';
import Datalist from './Datalist';
import ToggleSwitch from '../ToggleSwitch';
import Button from '../Button';
import { selectUser } from '../../app/appSlice';
import { CSSTransition } from 'react-transition-group';
import LoadingModal from '../LoadingModal';
import { useSelector } from 'react-redux';

const { categories: c, seller: s } = api;

const item = {
    name: '',
    description: '',
    src: '',
    price: '',
    in_stock: '',
    attributes: []
}

const initialState = {
    categories: {
        one: [],
        two: []
    },
    items: [item],
    is_active: false
}

const NewProduct = props => {

    const user = useSelector(selectUser);

    console.log(user)

    const {open: [ open, setOpen ], refresh} = props;

    const [ categories, setCategories ] = useState({
        main: []
    });
    let [ attributes, setAttributes ] = useState([]);
    const [ form, setForm ] = useState(initialState);
    const [ submitting, setSubmitting ] = useState(false);

    const oneCategories = useMemo(() => (form.categories.one.length > 0 && categories[form.categories.one[form.categories.one.length - 1]].length > 0) || form.categories.one.length === 0 , [form, categories]);
    const selectedCategories = useMemo(() => form.categories.one.concat(form.categories.two), [form.categories]);
    attributes = useMemo(() => {
        if (attributes.length > 0) {
            let newAttributes = [];
            attributes.forEach(attribute => {
                let match;
                newAttributes.forEach(att => {
                    if (attribute.attribute === att.attribute) {
                        match = true;
                    }
                })
                if (!match) {
                    newAttributes.push(attribute);
                };
            })

            let attributesToMerge = newAttributes.filter(attribute => attribute.attribute.includes('_'));
            newAttributes = newAttributes.filter(attribute => !attribute.attribute.includes('_'));
            let attributeByType = [];
            attributesToMerge.forEach(attribute => {
                attribute.attribute = attribute.attribute.split('_').slice(0, 1).join('');
                let match;
                attributeByType.forEach(att => {
                    if (att.attribute === attribute.attribute) {
                        match = true;
                    }
                })
                if (match) {
                    const index = attributeByType.findIndex(att => att.attribute === attribute.attribute);
                    attributeByType[index].values = attributeByType[index].values.concat(attribute.values);
                } else {
                    attributeByType.push(attribute)
                }
            })
            return newAttributes.concat(attributeByType);
        } else {
            return [];
        }
    }, [attributes])

    useEffect(() => {
        c.getMain([categories, setCategories]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const last = selectedCategories[selectedCategories.length - 1];
        if (last && categories[last].length === 0) {
            c.getAttributes(setAttributes, selectedCategories);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategories])

    useEffect(() => {
        if (attributes.length > 0) {
            let items = [...form.items];
            let itemAttributes = attributes.map(attribute => {
                return {key: attribute.attribute, value: ''}
            })
            items = items.map(item => {
                return {
                    ...item,
                    attributes: itemAttributes
                }
            })
            setForm({
                ...form,
                items
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attributes])

    const handleChange = async e => {
        const value = e.target.value;
        let id = e.target.id;
        let cat = await c.getSub(value);
        const items = [...form.items];
        items.map(item => {
            item.attributes = [];
            return item
        })
        setForm({
            ...form,
            items
        })
        setCategories({
            ...categories,
            [value]: cat
        })
        id = id.split('-')
        let newList = form[id[0]][id[1]];
        newList = newList.filter((item, i) => i < id[2]);
        newList.push(value);
        let newForm = {
            ...form,
            [id[0]]: {
                ...form[id[0]],
                [id[1]]: newList
            }
        }
        if (id[1] === 'one') {
            newForm.categories.two = [];
        }
        setForm(newForm);
    }

    const handleCountClick = e => {
        const action = e.target.id;
        let newForm = {...form}
        if (action === 'add-item') {
            newForm = {
                ...form, items: [
                    ...form.items, form.items.at(-1)
                ]
            }
            
        } else if (form.items.length > 1) {
            newForm.items.pop();
        }
        setForm(newForm)
    }

    const handleReset = e => {
        e.preventDefault();
        setForm(initialState);
    }

    const handleSubmit = async e => {
        try {
            e.preventDefault();
            setSubmitting(true);
            await s.createProduct({...form, userId: user.id});
            await refresh();
            setOpen(false);
        } catch (err) {
            console.log(err);
        }
        setSubmitting(false);
    }

    return (
        <div className='new-product'>
            <div className='card'>
                <header className='header'>
                    <ul className='tabs'>
                        <li className='item'>
                            Create Product
                        </li>
                    </ul>
                    <button onClick={() => setOpen(!open)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                    </button>
                </header>
                <form className='form' onSubmit={handleSubmit} onReset={handleReset}>
                    <h2>
                        Categories
                    </h2>
                    <div className='columns'>
                        <div className='column'>
                            <Select id='categories-one-0' onChange={handleChange} required={true} value={form.categories.one[0] || ''} options={categories.main.map(category => {return {name: category.name, value: category.name}})}/>
                            {
                                form.categories.one.length > 0 ? (
                                    form.categories.one.map((select, i) => {
                                        if (categories[select].length > 0) {
                                            return <Select key={select} id={`categories-one-${i + 1}`} onChange={handleChange} required={true} value={form.categories.one[i + 1] || ''} options={categories[select].map(category => {return {name: category.name, value: category.name}})}/>
                                        } else {
                                            return undefined
                                        }
                                    })
                                ) : undefined
                            }
                        </div>
                        <div className='column'>
                            <Select id='categories-two-0' onChange={handleChange} required={false} value={form.categories.two[0] || ''} options={categories.main.map(category => {return {name: category.name, value: category.name}})} disabled={oneCategories}/>
                            {
                                form.categories.two.length > 0 ? (
                                    form.categories.two.map((select, i) => {
                                        if (categories[select].length > 0) {
                                            return <Select key={select} id={`categories-two-${i + 1}`} onChange={handleChange} required={true} value={form.categories.two[i + 1] || ''} options={categories[select].map(category => {return {name: category.name, value: category.name}})}/>
                                        } else {
                                            return undefined
                                        }
                                    })
                                ) : undefined
                            }
                        </div>
                    </div>
                    <div className='items'>
                        <h2>
                            Item & Variations
                        </h2>
                        <div className='actions'>
                            <div onClick={handleCountClick} className='action' id='remove-item' title='Remove Item'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>
                            </div>
                            <p>{form.items.length}</p>
                            <div onClick={handleCountClick} className='action' id='add-item' title='Add Item'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                            </div>
                        </div>
                    </div>
                    {
                        form.items.map((item, i) => {
                            return (
                                <div key={i}>
                                    {i > 0 ? <br className='break'/> : undefined}
                                    <NewItem key={i} attributes={attributes} form={[form, setForm]} index={i} item={item}/>
                                </div>
                            )
                        })
                    }
                    <div className='active'>
                        <label htmlFor='is_active'>
                            Make this product active (viewable to all users/customers)?
                        </label>
                        <ToggleSwitch onChange={() => setForm({...form, is_active: !form.is_active})} checked={form.is_active}/>
                    </div>
                    <div className='actions'>
                        <Button primary='rgb(30, 30, 30)' type='submit' design='invert'>Submit</Button>
                        <Button primary='rgb(200, 0, 0)' type='reset'>Reset</Button>
                    </div>
                </form>
                <CSSTransition 
                    timeout={500}
                    classNames={'fade'}
                    in={submitting}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                <LoadingModal />
            </CSSTransition>
            </div>
        </div>
    )
}

export const NewItem = props => {

    const { attributes, form: [form, setForm], index, item } = props;

    const handleChange = e => {
        const key = e.target.name;
        const value = e.target.value;
        let items = [...form.items];
        items[index] = {
            ...items[index],
            [key]: value
        }
        setForm({
            ...form,
            items
        })
    }

    return (
        <div className='new-item'>
            <input onChange={handleChange} type='text' name='name' placeholder='Item Name' value={item.name} required maxLength={192}/>
            <textarea onChange={handleChange} type='text' name='description' placeholder='Item Description' value={item.description} required></textarea>
            <input onChange={handleChange} type='text' name='src' placeholder='Image Source' value={item.src} required/>
            <div className='numbers'>
                <input onChange={handleChange} type='number' name='price' placeholder='Price (99.99)' value={item.price} required step={.01}/>
                <input onChange={handleChange} type='number' name='in_stock' placeholder='Stock Count' value={item.in_stock} required min={0} step={1}/>
            </div>
            <div className='attributes'>
                {
                    attributes.length > 0  ? attributes.map((attribute, i) => {
                        const isInForm = form.items[index].attributes.length > 0 ? form.items[index].attributes.filter(att => att.key === attribute.attribute)[0].key === attribute.attribute : false;
                        return isInForm ? <Datalist key={attribute.attribute} attribute={attribute} form={[form, setForm]} index={i} itemIndex={index}/> : undefined
                    }) : undefined
                }
            </div>
            
        </div>
    )
}

export default NewProduct;