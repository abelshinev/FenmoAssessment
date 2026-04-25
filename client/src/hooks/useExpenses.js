import { useState, useEffect, useCallback } from 'react';
import { fetchExpenses } from '../api/expenses';

export function useExpenses({ category, sort }) {
  const [expenses, setExpenses] = useState([]);
  const [status, setStatus] = useState('loading'); // Initialize as loading
  const [error, setError]  = useState(null);

  // Pattern: Adjusting state during render to avoid cascading renders in useEffect
  const [prevFilters, setPrevFilters] = useState({ category, sort });
  if (category !== prevFilters.category || sort !== prevFilters.sort) {
    setPrevFilters({ category, sort });
    setStatus('loading');
    setError(null);
  }

  const load = useCallback(async (isManual = false) => {
    if (isManual) {
      setStatus('loading');
      setError(null);
    }
    try {
      const data = await fetchExpenses({ category, sort });
      setExpenses(data);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  }, [category, sort]);

  useEffect(() => {
    let ignore = false;

    const startFetch = async () => {
      try {
        const data = await fetchExpenses({ category, sort });
        if (!ignore) {
          setExpenses(data);
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
          setStatus('failed');
        }
      }
    };

    startFetch();
    return () => { ignore = true; };
  }, [category, sort]);

  return { 
    expenses, 
    status, 
    error, 
    reload: () => load(true) 
  };
}
