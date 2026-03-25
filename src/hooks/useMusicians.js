import { useState, useEffect, useCallback, useRef } from 'react';
import { musiciansData } from '../mocks/musicians';

const API_BASE = 'http://localhost:5001';

export function useMusicians(filters = {}) {
  const [musicians, setMusicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const abortRef = useRef(null);

  const doFetch = useCallback(async (f) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (f.q) params.set('vibe', f.q);
      if (f.genre && f.genre !== 'All Genres') params.set('genre', f.genre);
      if (f.instrument && f.instrument !== 'All Instruments') params.set('instrument', f.instrument);
      if (f.service && f.service !== 'all') params.set('service', f.service);
      if (f.sortBy) params.set('sortBy', f.sortBy);
      params.set('limit', '50');

      const res = await fetch(`${API_BASE}/api/musicians?${params}`, { signal: controller.signal });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setMusicians(data.musicians || []);
      setUsingMock(false);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setMusicians(musiciansData);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doFetch(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q, filters.genre, filters.instrument, filters.service, filters.sortBy, doFetch]);

  return { musicians, loading, error, usingMock, refetch: doFetch };
}

export function useMusicianById(id) {
  const [musician, setMusician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/musicians/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setMusician(data.musician || data))
      .catch(() => {
        const found = musiciansData.find((m) => String(m.id) === String(id));
        if (found) setMusician(found);
        else setError('Musician not found');
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { musician, loading, error };
}
