import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import './NewProduct.css';
import { NewItem } from '.';
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

const AddItems = props => {
    

    const user = useSelector(selectUser);

    const {categories, id, open: [ open, setOpen ], refresh} = props;

    const initialState = {
        categories,
        items: [item]
    }

    let [ attributes, setAttributes ] = useState([]);
    const [ form, setForm ] = useState(initialState);
    const [ submitting, setSubmitting ] = useState(false)
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
        c.getAttributes(setAttributes, categories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        const defaultAttributes = form.items[0].attributes.map(attribute => {return {key: attribute.key, value: ''}});
        const defaultItem = {...item, attributes: defaultAttributes}
        setForm({...initialState, items: [defaultItem]});
    }

    const handleSubmit = async e => {
        try {
            e.preventDefault();
            setSubmitting(true);
            await s.createItems({...form, id: id, userId: user.id});
            await refresh();
            setOpen(false);
        } catch (err) {
            console.log(err)
        }
        setSubmitting(false);
    }

    return (
        <div className='new-product'>
            <div className='card'>
                <header className='header'>
                    <ul className='tabs'>
                        <li className='item'>
                            Create Product Items
                        </li>
                    </ul>
                    <button onClick={() => setOpen(!open)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                    </button>
                </header>
                <form className='form' onSubmit={handleSubmit} onReset={handleReset}>
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

export default AddItems;