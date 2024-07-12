"use client";
import {useState, useEffect} from 'react';
import {fetchData} from '../utils/api';

function usePaginate(url, query) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPaginatedData = async () => {
        setLoading(true);
        try {
            const params = query && query.size !== 0 ? query.toString() : 'page=1';
            const response = await fetchData(`${url}?${params}`);
            setData(response);
        } catch (error) {
            console.error('Error fetching paginated data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaginatedData();
    }, [url, query]);

    return {data, loading, refetch: fetchPaginatedData};
}

export default usePaginate;