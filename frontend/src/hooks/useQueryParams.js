import React, { useMemo, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

const useQueryParams = ({ searchTimeout, searchSetter, exceptions }) => {

    const location = useLocation();

    const searchTimer = useRef(null);

    const [ searchParams, setSearchParams ] = useSearchParams(location);

    const queryParams = useMemo(() => {
        const params = {};
        for (let param of searchParams) {
            const [key, value] = param;
            if (key in params) {
                params[key] = [...params[key], value];
            } else {
                params[key] = [value];
            }
        }
        return params
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, location])

    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === 'search') {
            if (searchTimer.current) {
                clearTimeout(searchTimer.current);
            }
            searchSetter(value);
            searchTimer.current = setTimeout(() => {
                if (value.length === 0) {
                    const deleteQuery = queryParams;
                    delete deleteQuery.query;
                    setSearchParams(deleteQuery)
                } else {
                    setSearchParams({
                        ...queryParams,
                        query: [value]
                    })
                };
            }, searchTimeout)
        } else {
            
        }
    }

    return [ queryParams, handleChange ];

}

export { useQueryParams };