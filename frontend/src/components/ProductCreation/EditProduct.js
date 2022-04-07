import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import './NewProduct.css';
import Select from './Select';
import ToggleSwitch from '../ToggleSwitch';
import Button from '../Button';
import { selectUser } from '../../app/appSlice';
import { CSSTransition } from 'react-transition-group';
import LoadingModal from '../LoadingModal';
import { useSelector } from 'react-redux';
import { NewItem } from '.';

const { categories: c, seller: s } = api;

const EditProduct = props => {

    const user = useSelector(selectUser);

    const {open: [ open, setOpen ], product, refresh} = props;
    const { categories: cats, id, items, is_active } = product;

    const initialState = {
        id,
        categories: {
            one: [],
            two: []
        },
        items: [],
        is_active: is_active
    }

    const [ initialLoad, setInitialLoad ] = useState({
        stage1: false,
        stage2: false,
        stage3: false,
        stage4: false
    });
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
        c.getMain([categories, setCategories])
        .then(() => setInitialLoad({...initialLoad, stage1: true}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //fix edit need to load all categories on edit

    useEffect(() => {
        if (initialLoad.stage1) {
            const getStartingCategories = async () => {
                let subs = {};
                for (let cat of cats) {
                    const sub = await c.getSub(cat);
                    subs = {...subs, [cat]: sub}
                }
                setCategories({...categories, ...subs})
                // const matchCategory = (cats, categories) => {
                //     let match;
                //     cats.forEach(cat => {
                //         categories.forEach(category => {

                //         })
                //     })
            }
                // let catsLength = cats.length;
            
            
            getStartingCategories()
            .then(() => setInitialLoad({...initialLoad, stage1: false, stage2: true}))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialLoad])

    useEffect(() => {
        if (initialLoad.stage2) {
            const one = [];
            const two = [];
            let pushTo = 'one';
            let pushed = 0;
            const arrangeCategories = (cats, categoryArray) => {
                let next;
                cats.forEach(cat => {
                    categoryArray.forEach(category => {
                        if (cat === category.name) {
                            pushTo === 'one' ? one.push(cat) : two.push(cat);
                            next = categories[cat]
                            if (categories[cat].length === 0) {
                                pushTo = 'two'
                                next = categories['main']
                            }
                        }
                    })
                })
                pushed ++;
                if (pushed < cats.length) {
                    arrangeCategories(cats, next);
                }
            }
            arrangeCategories(cats, categories.main);
            setForm({
                ...form,
                categories: { one, two }
            })
            setInitialLoad({...initialLoad, stage2: false, stage3: true})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialLoad])

    useEffect(() => {
        if (initialLoad.stage3) {
            const newItems = items.map(item => {
                let attributes = []
                for (let key in item.attributes) {
                    attributes.push({key: key, value: item.attributes[key]})
                }
                let src = item.images.map(image => image.src.split('/').at(-1)).join(' ');
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: Number(item.price.slice(1).split(',').join('')),
                    in_stock: item.in_stock,
                    images: item.images,
                    src,
                    attributes
                }
            })
            setForm({
                ...form,
                items: newItems
            })
            setInitialLoad({...initialLoad, stage3: false, stage4: true})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialLoad])

    useEffect(() => {
        const last = selectedCategories[selectedCategories.length - 1];
        if (last && categories[last].length === 0) {
            c.getAttributes(setAttributes, selectedCategories);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategories])

    useEffect(() => {
        if (attributes.length > 0 && !initialLoad.stage4) {
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
        setInitialLoad({...initialLoad, stage4: false})
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

    const handleReset = e => {
        e.preventDefault();
        setForm(initialState);
        setInitialLoad({...initialLoad, stage1: true})
    }

    const handleSubmit = async e => {
        try {
            e.preventDefault();
            setSubmitting(true);
            await s.editProduct({...form, userId: user.id});
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
                            Edit Product
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

export default EditProduct;