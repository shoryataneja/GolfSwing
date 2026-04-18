'use client'
import { useState, useEffect, useCallback } from 'react'

/**
 * Generic data fetching hook with loading and error state.
 * @param {string} url - API endpoint to fetch
 * @param {RequestInit} [options] - fetch options
 */
export function useFetch(url, options) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, options)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Request failed')
      setData(json.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => { execute() }, [execute])

  return { data, loading, error, refetch: execute }
}
