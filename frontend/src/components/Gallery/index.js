import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Gallery.css';

const Gallery = props => {

    const { images } = props;

    const [ selectedImage, setSelectedImage ] = useState(0);
    const [ displayDirection, setDisplayDirection ] = useState('next');

    console.log(images)

    const selectImage = e => {
        let i = e.target.id;
        i = Number(i.split('_')[1]);
        if (i > selectedImage && displayDirection !== 'next') {
            setDisplayDirection('next')
        } else if (i < selectedImage && displayDirection !== 'back') {
            setDisplayDirection('back')
        }
        setSelectedImage(i);
    }

    const handleNavigate = e => {
        const direction = e.target.value;
        setDisplayDirection(direction);
        let index;
        if (direction === 'next') {
            index = selectedImage === images.length - 1 ? 0 : selectedImage + 1;
        } else {
            index = selectedImage === 0 ? images.length - 1 : selectedImage - 1;
        }
        setSelectedImage(index)
    }

    return (
        <div className='gallery'>
            <div className='display'>
                {
                    images.map((img, i) => {
                        return (
                            <CSSTransition 
                                key={i} 
                                timeout={500}
                                classNames={displayDirection}
                                in={selectedImage === i}
                                mountOnEnter={true}
                                unmountOnExit={true}
                            >
                                <img key={img.name} src={img.src} alt={`${img.name}`}/>
                            </CSSTransition>
                        )
                    })
                }
                <button onClick={handleNavigate} className='navigate back' value='back'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.61 7.41L14.2 6l-6 6 6 6 1.41-1.41L11.03 12l4.58-4.59z"/></svg>
                </button>
                <button onClick={handleNavigate} className='navigate next' value='next'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z"/></svg>
                </button>
            </div>
            <ul className='select'>
                {
                    images.map((img, i) => {
                        return (
                            <li onClick={selectImage} id={img.name} key={img.name} style={i === selectedImage ? {outline: '4px solid rgba(100, 100, 255, .6)'} : {}}>
                                <img src={img.src} alt={`${img.name}`}/>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Gallery;