"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useCartCount() {
  const { data, error, isLoading } = useSWR("/api/cart/count", fetcher)

  return {
    count: data?.count || 0,
    isLoading,
    error,
  }
}
