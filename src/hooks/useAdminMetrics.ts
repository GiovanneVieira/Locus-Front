import { useQuery } from "@tanstack/react-query"

import {
  fetchAdminAccessLogs,
  fetchAdminCriticalFailures,
  fetchAdminMetrics,
} from "@/lib/api"
import type { AdminMetricsPageParams, AdminMetricsParams } from "@/lib/types"

export const adminMetricKeys = {
  all: ["admin", "metrics"] as const,
  overview: (params?: AdminMetricsParams) =>
    ["admin", "metrics", "overview", params ?? {}] as const,
  criticalFailures: (params?: AdminMetricsPageParams) =>
    ["admin", "metrics", "critical-failures", params ?? {}] as const,
  accessLogs: (params?: AdminMetricsPageParams) =>
    ["admin", "metrics", "access-logs", params ?? {}] as const,
}

export function useAdminMetrics(params?: AdminMetricsParams) {
  return useQuery({
    queryKey: adminMetricKeys.overview(params),
    queryFn: () => fetchAdminMetrics(params),
    staleTime: 60_000,
  })
}

export function useAdminCriticalFailures(params?: AdminMetricsPageParams) {
  return useQuery({
    queryKey: adminMetricKeys.criticalFailures(params),
    queryFn: () => fetchAdminCriticalFailures(params),
    placeholderData: (previous) => previous,
    staleTime: 30_000,
  })
}

export function useAdminAccessLogs(params?: AdminMetricsPageParams) {
  return useQuery({
    queryKey: adminMetricKeys.accessLogs(params),
    queryFn: () => fetchAdminAccessLogs(params),
    placeholderData: (previous) => previous,
    staleTime: 30_000,
  })
}
