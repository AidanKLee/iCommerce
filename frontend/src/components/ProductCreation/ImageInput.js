import React, { useState } from 'react';
import './ImageInput.css';

const ImageInput = props => {

    const { accept, handleRemove, id, images = [], multiple, name, onChange, ref } = props;
    const [ dragOver, setDragOver ] = useState(false);

    const handleDrag = e => {
        if (e.type === 'dragover' && !dragOver) {
            setDragOver(true);
        } else if (e.type !== 'dragover') {
            setDragOver(false);
        }
    }

    const style = dragOver ? {backgroundColor: 'rgba(0, 0, 0, .05)', border: '2px solid rgba(0, 0, 0, .1)'} : {}

    return (
        <div className='wrapper'>
            <div className='upload' onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrag} style={style}>
                <input 
                    accept={accept} 
                    id={id} 
                    multiple={multiple} 
                    name={name} 
                    onChange={onChange}
                    ref={ref} 
                    type='file'
                />
                <p>Drag and drop files here</p>
                <p>or</p>
                <p className='button'>Browse files</p>
            </div>
            {
                images.length > 0 ? (
                    <ul className='display'>
                        { 
                            images.map((img, i) => {
                                return (
                                    <li key={`images-${i}`} onClick={handleRemove} id={`images-${i}`} title={img.props.title}>
                                        { img }
                                        <div className='overlay'>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                ) : undefined
            }
        </div>
        
    )
}

export default ImageInput;