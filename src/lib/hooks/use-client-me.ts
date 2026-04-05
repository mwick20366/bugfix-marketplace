"use client"
import { useQuery } from "@tanstack/react-query"
import { ClientData, retrieveClient } from "@lib/data/client"

export const useClientMe = () => {
  const result = useQuery({
    queryFn: () => retrieveClient().catch(() => null),
    queryKey: ["client-me"],
    staleTime: 0,
  })

  return {
    ...result,
    clientData: (result.data ?? null) as ClientData | null,
  }
}