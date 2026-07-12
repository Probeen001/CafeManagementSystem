import { useQuery } from '@tanstack/react-query'
import { reportService } from '../services/reportService'

export function useReportSummary(params) {
  return useQuery({
    queryKey: ['reports', 'summary', params],
    queryFn: () => reportService.getSummary(params).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useRevenueReport(params) {
  return useQuery({
    queryKey: ['reports', 'revenue', params],
    queryFn: () => reportService.getRevenue(params).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useTopItems(params) {
  return useQuery({
    queryKey: ['reports', 'top-items', params],
    queryFn: () => reportService.getTopItems(params).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useOrderStats(params) {
  return useQuery({
    queryKey: ['reports', 'order-stats', params],
    queryFn: () => reportService.getOrderStats(params).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}
