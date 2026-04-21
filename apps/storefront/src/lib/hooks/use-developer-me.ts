"use client"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@lib/config"
import { DeveloperData, retrieveDeveloper } from "@lib/data/developer"

export const useDeveloperMe = () => {
  const result = useQuery({
    queryFn: () => retrieveDeveloper().catch(() => null),
    queryKey: ["developer-me"],
    staleTime: 0,
  })

  return {
    ...result,
    developerData: (result.data ?? null) as DeveloperData | null,
  }
}