import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import './NewProduct.css';
import { NewItem } from '.';
import Button from '../Button';
import { selectUser } from '../../app/appSlice';
import { CSSTransition } from 'react-transition-group';
import LoadingModal from '../LoadingModal';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import ImageInput from './ImageInput';

const { categories: c, helper, seller: s } = api;

const item = {
    name: '',
    description: '',
    image_ids: [],
    image_id_primary: '',
    price: '',
    in_stock: '',
    attributes: []
}

const AddItems = props => {

    const user = useSelector(selectUser);

    const {categories, id, open: [ open, setOpen ], product, refresh} = props;

    const initialState = {
        categories,
        images: [],
        items: [item]
    }

    let [ attributes, setAttributes ] = useState([]);
    const [ form, setForm ] = useState(initialState);
    const [ submitting, setSubmitting ] = useState(false);

    const images = useMemo(() => {
        let imageArray = form.images.map(image => {
            return <img id={image.id} src={image.src} title={image.name} alt={image.name}/>
        })
        return imageArray;
    }, [form])

    const currentImages = useMemo(() => {
        const current = [];
        product.items.forEach(group => {
            group.forEach(item => {
                item.images.forEach(image => {
                    const inCurrent = current.filter(img => {
                        return img.id === image.id;
                    }).length > 0;
                    if (!inCurrent) {
                        current.push(image);
                    }
                })
            })
        })
        return current;
    }, [product]);

    const [ imagesWarning, setImageWarning ] = useState(false);
    const itemsHaveImage = useMemo(() => {
        let itemsHaveImage = true;
        form.items.forEach(item => {
            if (item.image_ids.length === 0) {
                itemsHaveImage = false;
            }
        })
        return itemsHaveImage;
    }, [form.items])

    useEffect(() => {
        if (currentImages.length > 0) {
            setForm({...form, currentImages})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentImages])

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
        let cats = [...categories[0]]
        if (categories[1] && categories[1].length > 0) {
            cats = [...cats, ...categories[1]];
        }
        c.getAttributes(setAttributes, cats.map(cat => cat.name));
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
            if (itemsHaveImage) {
                setSubmitting(true);
                await s.createItems({...form, id: id, userId: user.id});
                await refresh();
                setOpen(false);
            } else {
                setImageWarning(true);
            }
        } catch (err) {
            console.log(err)
        }
        setSubmitting(false);
    }

    const handleImages = async e => {
        const key = e.target.name;
        let value = e.target.files;
        value = await Promise.all(Array.from(value).map(async image => {
            const base64 = await helper.fileToBase64(image);
            image.src = base64;
            image.id = uuid();
            return image;
        }))
        setForm({...form, [key]: [...form[key], ...value]})
    }

    const handleRemoveImage = e => {
        const [ , index ] = e.target.id.split('-');
        let id;
        const images = form.images.filter((img, i) => {
            if (i === Number(index)) {
                id = img.id;
            }
            return i !== Number(index);
        })
        const items = form.items.map(item => {
            item.image_ids = item.image_ids.filter(id => id !== e.target.id)
            if (item.image_id_primary === id) {
                if (item.image_ids.length > 0) {
                    item.image_id_primary = item.image_ids[0]
                } else {
                    item.image_id_primary = ''
                }
            }
            return item;
        })
        setForm({...form, items, images})
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
                <form className='form' onSubmit={handleSubmit} onReset={handleReset} encType="multipart/form-data">
                    <div className='images'>
                        <h2>
                            Images
                        </h2>
                        <ul className='current'>
                            {
                                currentImages.map(img => {
                                    const name = img.name;
                                    return (
                                        <li key={name} title={name}>
                                            <img src={img.src} alt={name}/>
                                            <div className='overlay'>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <ImageInput 
                            accept='.jpg, .jpeg, .png'
                            files={form.images}
                            handleRemove={handleRemoveImage}
                            images={images}
                            multiple={true}
                            name='images'
                            onChange={handleImages}
                        />
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
                                    <NewItem imageWarning={imagesWarning} key={i} attributes={attributes} current={currentImages} form={[form, setForm]} index={i} item={item}/>
                                </div>
                            )
                        })
                    }
                    <CSSTransition 
                        timeout={500}
                        classNames={'grow-down2'}
                        in={imagesWarning}
                        mountOnEnter={true}
                        unmountOnExit={true}
                    >
                        <p className='warning'>Select at least one image for every item.</p>
                    </CSSTransition>
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