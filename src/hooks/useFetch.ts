'use client'
import { useState, useCallback, useEffect } from "react";

type FetchState<T> = {
    data: T | null;
    error: Error | null;
    loading: boolean;
};

interface Response<T> {
    message: string;
    error?: string;
    data?: T | null
}

// Overloaded function signatures for better type safety
function useFetch<T>(fetchFunction: () => Promise<T | null>): FetchState<T> & { refetch: () => Promise<void> };
function useFetch<T extends readonly unknown[]>(fetchFunctions: readonly [...{ [K in keyof T]: () => Promise<T[K] | null> }]): FetchState<T> & { refetch: () => Promise<void> };
function useFetch<T>(fetchInput: (() => Promise<T | null>) | readonly (() => Promise<any>)[]): FetchState<T> & { refetch: () => Promise<void> } {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        error: null,
        loading: false,
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, error: null, loading: true }));
        
        try {
            let result: T | null;

            // Check if input is an array of functions
            if (Array.isArray(fetchInput)) {
                // Multiple fetch functions - use Promise.all
                const promises = fetchInput.map(fn => fn());
                const results = await Promise.all(promises);
                
                // Process results - handle Response<T> format if needed
                const processedResults = results.map(res => {
                    if (res && typeof res === 'object' && 'data' in res) {
                        return (res as Response<any>).data;
                    }
                    return res;
                });
                
                result = processedResults as T;
            } else if (typeof fetchInput === 'function') {
                // Single fetch function
                const singleResult = await fetchInput();
                
                // Handle Response<T> format
                if (singleResult && typeof singleResult === 'object' && 'data' in singleResult) {
                    result = (singleResult as unknown as Response<T>).data!;
                } else {
                    result = singleResult;
                }
            } else {
                throw new Error('fetchInput must be a function or an array of functions');
            }

            setState({ data: result, error: null, loading: false });
        } catch (err) {
            setState({ 
                data: null, 
                error: err instanceof Error ? err : new Error('An unknown error occurred'), 
                loading: false 
            });
        }
    }, [fetchInput]);

    // Automatically call fetchData on component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { ...state, refetch: fetchData };
}

export default useFetch;