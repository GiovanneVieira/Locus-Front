import { useQuery, useQueries } from "@tanstack/react-query"
import { fetchPexelsImages } from "@/lib/api"
import type { PexelsPhoto } from "@/lib/types"

export const pexelsKeys = {
  search: (query: string) => ["pexels", "search", query] as const,
}

export function usePexelsImages(query: string | undefined, perPage = 4) {
  return useQuery({
    queryKey: pexelsKeys.search(query ?? ""),
    queryFn: () => fetchPexelsImages(query ?? "", perPage),
    enabled: Boolean(query),
    staleTime: 1000 * 60 * 30,
  })
}

export function usePexelsImagesForTerms(terms: string[], perTerm = 5) {
  const uniqueTerms = Array.from(new Set(terms.filter(Boolean)))
  const queries = useQueries({
    queries: uniqueTerms.map((term) => ({
      queryKey: pexelsKeys.search(term),
      queryFn: () => fetchPexelsImages(term, perTerm),
      enabled: true,
      staleTime: 1000 * 60 * 30,
    })),
  })

  const result: Record<string, PexelsPhoto[]> = {}
  uniqueTerms.forEach((term, i) => {
    result[term] = queries[i].data?.photos ?? []
  })
  terms.forEach((term) => {
    result[term] = result[term] ?? []
  })

  return result
}
