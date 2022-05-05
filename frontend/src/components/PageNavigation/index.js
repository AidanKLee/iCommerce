import React, { useMemo } from 'react';
import './PageNavigation.css';

const PageNavigation = props => {

    let { max, onClick, onSelect, value } = props;

    const pages = useMemo(() => {
        let pages = new Array(max).fill(0).map((num, i) => {
            num = i + 1;
            const selected = value === num;
            return (
                <li key={num}>
                    <button
                        className={selected ? 'selected' : ''} 
                        onClick={onClick}
                        onSelect={onSelect}
                        value={num}
                    >
                        { num }
                    </button>
                </li>
                
            )
        });
        if (pages.length > 9) {
            const selectedIndex = value - 1;
            const start = pages[0];
            const end = pages.at(-1);
            
            let front = pages.slice(1, selectedIndex - 2);
            let middle = pages.slice(selectedIndex - 2, selectedIndex + 3);
            let back = pages.slice(selectedIndex + 3, pages.length - 1);

            if (selectedIndex < 5) {
                front = pages[1];
                middle = pages.slice(2, 7);
                back = pages.slice(7, pages.length - 1);
            } else if (selectedIndex > pages.length - 6) {
                front = pages.slice(1, pages.length - 7)
                middle = pages.slice(pages.length - 7, pages.length - 2)
                back = pages.at(-2)
            }
            pages = [start, front, ...middle, back, end]
        }
        return pages;
    }, [max, onClick, onSelect, value])

    return (
        <ul className='page-navigation'>
            {
                value > 1 ? (
                    <li>
                        <button onClick={onClick} onSelect={onSelect} value='back'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox='0 0 20 20'><path d="M11.688 15.625 6.042 10 11.688 4.333 13.562 6.208 9.792 10 13.562 13.75Z"/></svg>
                        </button>
                    </li>
                ) : undefined
            }
            {
                pages.map((page, i) => {
                    if (!Array.isArray(page)) {
                        return page;
                    } else {
                        return (
                            <li className='more' key={'more ' + i}>
                                ...
                                <ul className='page-list'>
                                    { page }
                                </ul>
                            </li>
                        )
                    }
                })
            }
            {
                pages.length > 1 && value < max ? (
                    <li>
                        <button onClick={onClick} onSelect={onSelect} value='next'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox='0 0 20 20'><path d="M7.833 15.625 5.958 13.75 9.75 10 5.958 6.208 7.833 4.333 13.479 10Z"/></svg>
                        </button>
                    </li>
                ) : undefined
            }
            
        </ul>
    )
}

export default PageNavigation;