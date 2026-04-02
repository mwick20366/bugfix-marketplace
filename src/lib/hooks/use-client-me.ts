"use client"
import { useQuery } from "@tanstack/react-query"
import { Client, retrieveClient } from "@lib/data/client"

export const useClientMe = () => {
  const result = useQuery({
    queryFn: () => retrieveClient().catch(() => null),
    queryKey: ["client-me"],
    staleTime: 0,
  })

  return {
    ...result,
    client: (result.data ?? null) as Client | null,
  }
}